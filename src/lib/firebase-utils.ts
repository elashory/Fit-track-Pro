import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, Timestamp, deleteDoc } from 'firebase/firestore';

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
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, auth: any) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getUserProfile = async (uid: string, auth: any) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`, auth);
  }
};

export const createUserProfile = async (user: any, auth: any) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      level: 1,
      xp: 0,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`, auth);
  }
};

export const updateUserProfile = async (uid: string, data: any, auth: any) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`, auth);
  }
};

export const saveDailyLog = async (logData: any, auth: any) => {
  try {
    const logId = `${logData.uid}_${logData.date}`;
    const logRef = doc(db, 'logs', logId);
    
    // Check if exists to update XP
    const docSnap = await getDoc(logRef);
    const isNew = !docSnap.exists();
    
    await setDoc(logRef, {
      ...logData,
      createdAt: isNew ? Timestamp.now() : docSnap.data().createdAt
    }, { merge: true });

    if (isNew) {
      // Add XP
      const userRef = doc(db, 'users', logData.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        let newXp = (userData.xp || 0) + 50;
        let newLevel = userData.level || 1;
        if (newXp >= newLevel * 100) {
          newLevel += 1;
          newXp = 0;
        }
        await setDoc(userRef, { xp: newXp, level: newLevel }, { merge: true });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `logs`, auth);
  }
};

export const getDailyLog = async (uid: string, date: string, auth: any) => {
  try {
    const logId = `${uid}_${date}`;
    const logRef = doc(db, 'logs', logId);
    const docSnap = await getDoc(logRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `logs`, auth);
  }
};

export const deleteDailyLog = async (uid: string, date: string, auth: any) => {
  try {
    const logId = `${uid}_${date}`;
    const logRef = doc(db, 'logs', logId);
    await deleteDoc(logRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `logs`, auth);
  }
};

export const getUserLogs = async (uid: string, auth: any) => {
  try {
    const q = query(collection(db, 'logs'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `logs`, auth);
  }
};

export const saveWorkoutSet = async (data: any, auth: any) => {
  try {
    const logRef = doc(collection(db, 'workout_logs'));
    await setDoc(logRef, {
      ...data,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `workout_logs`, auth);
  }
};

export const getWorkoutLogs = async (uid: string, auth: any) => {
  try {
    const q = query(collection(db, 'workout_logs'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `workout_logs`, auth);
  }
};
