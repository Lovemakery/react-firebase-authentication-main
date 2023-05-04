import firebase from "firebase/compat/app";
import { getFirestore, collection, addDoc, where, query, getDocs} from "firebase/firestore"
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkgCe8ll-O6hp7LZ-PUwa3PNncIpNPFS4",
  authDomain: "catchcam-1c2b0.firebaseapp.com",
  projectId: "catchcam-1c2b0",
  storageBucket: "catchcam-1c2b0.appspot.com",
  messagingSenderId: "600140552327",
  appId: "1:600140552327:web:15754e899de0f9d7980022",
  measurementId: "G-TSK8QHSGMQ"
};

firebase.initializeApp(firebaseConfig);
const db = getFirestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const auth = firebase.auth();
export default firebase;

export const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(provider);
    const user = res.user;
    const userRef = collection(db, "users");
    const result = await getDocs(query(userRef, where("uid", "==", user.uid)));
    if (result.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    alert(err.message);
  }
};

export const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    alert(err.message);
  }
};

export const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    alert(err.message);
  }
};

// const sendPasswordResetEmail = async (email) => {
//   try {
//     await auth.sendPasswordResetEmail(email);
//     alert("Password reset link sent!");
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };
// const logout = () => {
//   auth.signOut();
// };
export const getImages = async () => {
  try {
    const imagesRef = collection(db, "images");
    const snapshot = await getDocs(imagesRef);
    const images = [];

    snapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        url: doc.data().imageUrl, // Replace "imageUrl" with the field name that contains the image URL or base64 string in your Firestore document
        name: doc.data().imageName,
        place: doc.data().Place, // Replace "imageName" with the field name that contains the image name in your Firestore document
      });
    });

    return images;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
