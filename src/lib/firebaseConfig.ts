import firebase from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
  projectId: "web-rtc-91f51"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default db;