// データの保存先。Firebase 設定があればクラウド（2人で同期）、なければ端末内（お試しモード）。
import { firebaseConfig } from './config.js';

const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export async function createStore() {
  if (firebaseConfig && firebaseConfig.apiKey) return createCloudStore(firebaseConfig);
  return createLocalStore();
}

// ---------- お試しモード（localStorage） ----------
function createLocalStore() {
  const KEY = 'travel-app-local-v1';
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || { trips: {}, items: {} }; }
    catch { return { trips: {}, items: {} }; }
  };
  let data = load();
  const listeners = new Set();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { console.warn(e); }
    listeners.forEach((fn) => fn());
  };
  window.addEventListener('storage', (e) => { if (e.key === KEY) { data = load(); listeners.forEach((fn) => fn()); } });
  const sub = (fn) => { listeners.add(fn); fn(); return () => listeners.delete(fn); };
  const user = { email: 'local', name: 'この端末' };
  const now = () => new Date().toISOString();

  return {
    mode: 'local',
    onAuth(cb) { cb(user); return () => {}; },
    async signIn() {}, async signOut() {},
    watchTrips(cb) {
      return sub(() => cb(Object.entries(data.trips).map(([id, t]) => ({ id, ...t }))));
    },
    watchItems(tripId, cb) {
      return sub(() => cb(Object.entries(data.items[tripId] || {}).map(([id, it]) => ({ id, ...it }))));
    },
    async addTrip(t) { const id = uid(); data.trips[id] = { ...t, createdAt: now() }; save(); return id; },
    async updateTrip(id, patch) { data.trips[id] = { ...data.trips[id], ...patch }; save(); },
    async deleteTrip(id) { delete data.trips[id]; delete data.items[id]; save(); },
    async addItem(tripId, it) {
      const id = uid(); (data.items[tripId] ||= {})[id] = { ...it, updatedAt: now(), updatedBy: user.email }; save(); return id;
    },
    async addItems(tripId, list) {
      const bucket = (data.items[tripId] ||= {});
      list.forEach((it) => { bucket[uid()] = { ...it, updatedAt: now(), updatedBy: user.email }; });
      save();
    },
    async updateItem(tripId, id, patch) {
      const bucket = (data.items[tripId] ||= {});
      bucket[id] = { ...bucket[id], ...patch, updatedAt: now(), updatedBy: user.email }; save();
    },
    async deleteItem(tripId, id) { delete (data.items[tripId] || {})[id]; save(); },
  };
}

// ---------- クラウド（Firebase：Googleログイン＋Firestore） ----------
async function createCloudStore(cfg) {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(FB + 'firebase-app.js'), import(FB + 'firebase-auth.js'), import(FB + 'firebase-firestore.js'),
  ]);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  let db;
  try {
    // オフラインでも直前のデータを見られるよう端末にキャッシュ
    db = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) });
  } catch { db = F.getFirestore(app); }
  let user = null;
  const email = () => (user?.email || '').toLowerCase();
  const stamp = () => ({ updatedAt: F.serverTimestamp(), updatedBy: email() });
  const tripsCol = F.collection(db, 'trips');
  const itemsCol = (tripId) => F.collection(db, 'trips', tripId, 'items');
  const plain = (d) => {
    const v = d.data();
    if (v.updatedAt?.toDate) v.updatedAt = v.updatedAt.toDate().toISOString();
    if (v.createdAt?.toDate) v.createdAt = v.createdAt.toDate().toISOString();
    return { id: d.id, ...v };
  };

  // リダイレクトでログインした場合の結果を受け取る
  A.getRedirectResult(auth).catch((e) => console.warn(e));

  return {
    mode: 'cloud',
    onAuth(cb) {
      return A.onAuthStateChanged(auth, (u) => {
        user = u;
        cb(u ? { email: u.email.toLowerCase(), name: u.displayName || u.email } : null);
      });
    },
    async signIn() {
      const provider = new A.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try { await A.signInWithPopup(auth, provider); }
      catch (e) {
        if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code)) {
          await A.signInWithRedirect(auth, provider);
        } else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') throw e;
      }
    },
    async signOut() { await A.signOut(auth); },
    watchTrips(cb, onError) {
      const q = F.query(tripsCol, F.where('members', 'array-contains', email()));
      return F.onSnapshot(q, (s) => cb(s.docs.map(plain)), onError);
    },
    watchItems(tripId, cb, onError) {
      return F.onSnapshot(itemsCol(tripId), (s) => cb(s.docs.map(plain)), onError);
    },
    async addTrip(t) {
      const members = [...new Set([email(), ...(t.members || [])].map((m) => m.toLowerCase()))];
      const ref = await F.addDoc(tripsCol, { ...t, members, createdAt: F.serverTimestamp() });
      return ref.id;
    },
    async updateTrip(id, patch) { await F.updateDoc(F.doc(db, 'trips', id), patch); },
    async deleteTrip(id) {
      const snap = await F.getDocs(itemsCol(id));
      for (let i = 0; i < snap.docs.length; i += 400) {
        const b = F.writeBatch(db);
        snap.docs.slice(i, i + 400).forEach((d) => b.delete(d.ref));
        await b.commit();
      }
      await F.deleteDoc(F.doc(db, 'trips', id));
    },
    async addItem(tripId, it) { const ref = await F.addDoc(itemsCol(tripId), { ...it, ...stamp() }); return ref.id; },
    async addItems(tripId, list) {
      for (let i = 0; i < list.length; i += 400) {
        const b = F.writeBatch(db);
        list.slice(i, i + 400).forEach((it) => b.set(F.doc(itemsCol(tripId)), { ...it, ...stamp() }));
        await b.commit();
      }
    },
    async updateItem(tripId, id, patch) { await F.updateDoc(F.doc(db, 'trips', tripId, 'items', id), { ...patch, ...stamp() }); },
    async deleteItem(tripId, id) { await F.deleteDoc(F.doc(db, 'trips', tripId, 'items', id)); },
  };
}
