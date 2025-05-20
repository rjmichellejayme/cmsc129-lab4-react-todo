import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCohN5mD5SB-QBi9J2X7_oteXGPWM5WeT4",
    authDomain: "todo-app-react-e2108.firebaseapp.com",
    projectId: "todo-app-react-e2108",
    storageBucket: "todo-app-react-e2108.firebasestorage.app",
    messagingSenderId: "298672024121",
    appId: "1:298672024121:web:88e773f54880ce1fe4bbe8"
};

const app = initializeApp(firebaseConfig);
export default app;
