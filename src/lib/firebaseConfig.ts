import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "web-rtc-91f51"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;