
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const FIREBASE_ENABLED = Boolean(config.apiKey && config.projectId)
let db: ReturnType<typeof getFirestore> | null = null

if (FIREBASE_ENABLED) {
  const app = getApps().length ? getApps()[0] : initializeApp(config as any)
  db = getFirestore(app)
}

export type ScoreDoc = {
  name: string
  score: number
  timeSec: number
  mode: 'classic' | 'ai'
  createdAt: any
}

export async function saveScore(data: Omit<ScoreDoc, 'createdAt'>){
  if (!FIREBASE_ENABLED || !db) return { ok:false, message:'Firebase chưa cấu hình' }
  try{
    const ref = await addDoc(collection(db, 'scores'), { ...data, createdAt: serverTimestamp() })
    return { ok:true, id: ref.id }
  }catch(e:any){
    return { ok:false, message: String(e.message || e) }
  }
}

export async function fetchTop(limitN=10){
  if (!FIREBASE_ENABLED || !db) return { ok:false, data: [] as ScoreDoc[] }
  try{
    const q = query(collection(db,'scores'), orderBy('score','desc'), orderBy('timeSec','asc'), limit(limitN))
    const snap = await getDocs(q)
    const data = snap.docs.map(d => ({ id:d.id, ...(d.data() as any) })) as any as ScoreDoc[]
    return { ok:true, data }
  }catch(e:any){
    return { ok:false, data: [], message: String(e.message || e) }
  }
}
