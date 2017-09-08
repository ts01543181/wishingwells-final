import * as firebase from "firebase"
import { apiKey, authDomain, databaseURL, storageBucket } from '../../config'

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  storageBucket
};

export const firebaseRef = firebase.initializeApp(firebaseConfig);
