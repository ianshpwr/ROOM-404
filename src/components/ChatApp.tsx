
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import IntroScreen from "./IntroScreen";
import AuthForm from "./AuthForm";
import ChatInterface from "./ChatInterface";

// Toast replacement
const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
  console.log(`${type.toUpperCase()}: ${title} - ${description}`);
  // In a real implementation, we would show a toast notification here
  alert(`${title}: ${description}`);
};

const firebaseConfig = {
  apiKey: "AIzaSyAEj5EZT8Cg4PFP13Ok0UwPwgZI60swS6A",
  authDomain: "room-404.firebaseapp.com",
  databaseURL: "https://room-404-default-rtdb.firebaseio.com",
  projectId: "room-404",
  storageBucket: "room-404.firebasestorage.app",
  messagingSenderId: "831384732494",
  appId: "1:831384732494:web:f76bff19137b948226541f",
  measurementId: "G-08R9QM1B5S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function ChatApp() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        timestamp: serverTimestamp(),
        user: user.email,
      });
      setNewMessage("");
    } catch (error: any) {
      showToast("Error sending message", error.message, "error");
    }
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("Error", "Email and password are required", "error");
      return;
    }
    
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        showToast("Account created", "Welcome to ROOM-404", "success");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Logged in", "Access granted", "success");
      }
    } catch (error: any) {
      showToast("Authentication Error", error.message, "error");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        showToast("Logged out", "Session terminated", "success");
      })
      .catch((error: any) => {
        showToast("Error logging out", error.message, "error");
      });
  };

  // If intro not complete, show intro screen
  if (!introComplete) {
    return <IntroScreen onIntroComplete={() => setIntroComplete(true)} />;
  }

  // If user not logged in, show auth form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#000" }}>
        <AuthForm
          isRegister={isRegister}
          setIsRegister={setIsRegister}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuth={handleAuth}
        />
      </div>
    );
  }

  // If user is logged in, show chat interface
  return (
    <ChatInterface
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      sendMessage={sendMessage}
      handleLogout={handleLogout}
      currentUser={user.email}
    />
  );
}
