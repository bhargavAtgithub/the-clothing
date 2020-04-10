import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBG-qsH65hsOn_3neqB6T-yDB3sjOfTjCY",
    authDomain: "crown-db-7d40e.firebaseapp.com",
    databaseURL: "https://crown-db-7d40e.firebaseio.com",
    projectId: "crown-db-7d40e",
    storageBucket: "crown-db-7d40e.appspot.com",
    messagingSenderId: "917596880635",
    appId: "1:917596880635:web:a98f296f64824c3be6ba5e",
    measurementId: "G-PJFP8K15ZL"
  };

  firebase.initializeApp(config);

  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if(!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapshot = userRef.get();
    
    if(!snapshot.exists) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData
        });
      }catch(error){
          console.log('error creating user', error.message);
      }
    }

    return userRef;
  };


  export const addCollectionAndDocuments = async (CollectionKey, objectsToAdd) => {
    const CollectionRef = firestore.collection(CollectionKey);
    
    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
      const newDocRef = CollectionRef.doc();
      batch.set(newDocRef, obj);
    });

    await batch.commit();

  };

  export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map(doc => {
      const { title, items } = doc.data();

      return {
       routeName : encodeURI(title.toLowerCase()),
       id : doc.id,
       title,
       items 
      }
    });
    return transformedCollection.reduce((acc, collection) => {
      acc[collection.title.toLowerCase()] = collection;
      return acc;
    },{});
  }

  export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscirbe = auth.onAuthStateChanged(userAuth => {
        unsubscirbe();
        resolve(userAuth);
      }, reject)
    });
  }

  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

  export const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({prompt:'select_account'});
  export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

  export default firebase;
  