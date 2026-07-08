import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCbkwSpZUpXWhzhkhM3B8cnzhJc31PgkMU",
  authDomain: "blog-application-7b3d0.firebaseapp.com",
  projectId: "blog-application-7b3d0",
  storageBucket: "blog-application-7b3d0.appspot.com",
  messagingSenderId: "850103326248",
  appId: "1:850103326248:web:b8d7a787dedb930219871d",
  measurementId: "G-6BYE7FJSJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Google Auth
const provider = new GoogleAuthProvider();
const Auth = getAuth();

export const authwithGoogle = async() => {
    let user = null;

    await signInWithPopup(Auth, provider).then((result)=>{
        user = result.user;
    }).catch((err) => {
        console.log(err);
    })

    return user;
}