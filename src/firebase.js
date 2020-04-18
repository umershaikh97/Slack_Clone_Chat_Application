import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: REACT_APP_apiKey,
    authDomain: REACT_APP_authDomain,
    databaseURL: REACT_APP_databaseURL,
    projectId: REACT_APP_projectId,
    storageBucket: REACT_APP_storageBucket,
    messagingSenderId: REACT_APP_apiKey_messagingSenderId,
    appId: REACT_APP_appId,
    measurementId: REACT_APP_measurementId
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;