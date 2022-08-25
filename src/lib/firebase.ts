import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCBGENTT-y_S70q58Go531b3XfyqZFdTZU",
    authDomain: "proauto-e3013.firebaseapp.com",
    databaseURL: "https://proauto-e3013-default-rtdb.firebaseio.com",
    projectId: "proauto-e3013",
    storageBucket: "proauto-e3013.appspot.com",
    messagingSenderId: "948723274142",
    appId: "1:948723274142:web:ca2286432b76a59122068f",
    measurementId: "G-KK2T03GNP8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }