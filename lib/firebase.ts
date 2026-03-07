import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDyIGXtgEVBwXC8_0tQ3CMSQwjgKpd5w_Q",
  authDomain: "cardmaster-934d5.firebaseapp.com",
  projectId: "cardmaster-934d5",
  storageBucket: "cardmaster-934d5.firebasestorage.app",
  messagingSenderId: "454007326893",
  appId: "1:454007326893:web:5715a392beb9e0fa7f1e24",
  measurementId: "G-JL04CEKS85",
};

const app = initializeApp(firebaseConfig);

// Na web usamos getAuth normal; em mobile, initializeAuth com AsyncStorage
let auth: ReturnType<typeof getAuth>;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getReactNativePersistence } = require("firebase/auth");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

export { app, auth, db };
