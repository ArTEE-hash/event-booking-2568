
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addBooking = async (seatId, userInfo) => {
  try {
    await addDoc(collection(db, 'bookings'), {
      seatId,
      ...userInfo,
      bookedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', e);
  }
};

export const getAllBookings = async () => {
  const querySnapshot = await getDocs(collection(db, 'bookings'));
  const results = {};
  querySnapshot.forEach(doc => {
    results[doc.data().seatId] = doc.data();
  });
  return results;
};

export const cancelBooking = async (seatId) => {
  const querySnapshot = await getDocs(collection(db, 'bookings'));
  const found = querySnapshot.docs.find(doc => doc.data().seatId === seatId);
  if (found) {
    await deleteDoc(doc(db, 'bookings', found.id));
  }
};

export { db };
