import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'local-session-client',
      email: '',
      emailVerified: true,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Clean helper for undefined values to make Firestore updates bulletproof
export function cleanObjectForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  
  // Handle Date
  if (obj instanceof Date) return obj;
  
  const result: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip chartData and kpis fields to prevent bloated/dirty database objects
      if (key === 'chartData' || key === 'kpis') {
        continue;
      }
      const val = (obj as any)[key];
      if (val !== undefined) {
        if (typeof val === 'object' && val !== null) {
          result[key] = cleanObjectForFirestore(val);
        } else {
          result[key] = val;
        }
      }
    }
  }
  return result as T;
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

export function getFirebaseConfig(): FirebaseConfig | null {
  // 1. Prioritize Vite shared environment variables for design-time setup
  const metaEnv = (import.meta as any).env || {};
  const apiKey = metaEnv.VITE_FIREBASE_API_KEY;
  const authDomain = metaEnv.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = metaEnv.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = metaEnv.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = metaEnv.VITE_FIREBASE_APP_ID;

  if (apiKey && projectId) {
    return {
      apiKey,
      authDomain: authDomain || '',
      projectId,
      storageBucket: storageBucket || '',
      messagingSenderId: messagingSenderId || '',
      appId: appId || ''
    };
  }

  // 2. Fallback to LocalStorage (browser-specific user setup)
  const saved = localStorage.getItem('masonic_firebase_config_v1');
  if (saved) {
    try {
      const config = JSON.parse(saved);
      if (config && config.apiKey && config.projectId) {
        return config as FirebaseConfig;
      }
    } catch (e) {
      console.error('Erro ao ler configuração do Firebase do localStorage', e);
    }
  }

  // 3. Fallback to standard Production Firebase Configuration provided by the user
  return {
    apiKey: "AIzaSyAc01e5RL-KJgxgc8w4-QxoOl_k9ziYy_M",
    authDomain: "masonic-portal.firebaseapp.com",
    projectId: "masonic-portal",
    storageBucket: "masonic-portal.firebasestorage.app",
    messagingSenderId: "228249905021",
    appId: "1:228249905021:web:7a80820181738761310e14"
  };
}

export function saveFirebaseConfig(config: FirebaseConfig | null): boolean {
  if (!config) {
    localStorage.removeItem('masonic_firebase_config_v1');
    firebaseApp = null;
    firestoreDb = null;
    return true;
  }
  try {
    localStorage.setItem('masonic_firebase_config_v1', JSON.stringify(config));
    // Test initialization
    if (getApps().length > 0) {
      // Re-initialize isn't directly supported on the default app, but we can clear or re-initialize a secondary or let the reload take care
    } else {
      initializeApp(config);
    }
    return true;
  } catch (e) {
    console.error('Falha ao validar ou salvar configuração do Firebase', e);
    return false;
  }
}

export function initializeFirebase(): { app: FirebaseApp | null; db: Firestore | null } {
  if (firestoreDb) {
    return { app: firebaseApp, db: firestoreDb };
  }

  const config = getFirebaseConfig();
  if (!config) {
    return { app: null, db: null };
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApps()[0];
    }
    firestoreDb = initializeFirestore(firebaseApp, { ignoreUndefinedProperties: true });
    return { app: firebaseApp, db: firestoreDb };
  } catch (e) {
    console.error('Erro ao conectar ao Firebase Firestore:', e);
    return { app: null, db: null };
  }
}

export function initializeFirebaseAuth(): Auth | null {
  if (firebaseAuth) {
    return firebaseAuth;
  }
  const { app } = initializeFirebase();
  if (!app) {
    return null;
  }
  try {
    firebaseAuth = getAuth(app);
    return firebaseAuth;
  } catch (e) {
    console.error('Erro ao inicializar o Firebase Auth:', e);
    return null;
  }
}
