import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Cấu hình Firebase từ environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Kiểm tra cấu hình Firebase
const requiredConfig = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingConfig = requiredConfig.filter(key => !import.meta.env[key]);

if (missingConfig.length > 0) {
  console.error('❌ Thiếu cấu hình Firebase:', missingConfig);
  console.error('Vui lòng cấu hình các biến môi trường sau trong file .env:');
  missingConfig.forEach(config => console.error(`- ${config}`));
}

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore Database
export const db = getFirestore(app);

// Khởi tạo Cloud Storage
export const storage = getStorage(app);

export default app;
