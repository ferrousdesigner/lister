import TaskEngine from "./TaskEngine";
import React, { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db, firebase } from "./Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import "firebaseui/dist/firebaseui.css";
const provider = new GoogleAuthProvider();
const auth = getAuth();

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState();
  const [saving, setSaving] = useState();
  useEffect(() => {
    auth.onAuthStateChanged(async function (user) {
      if (user) {
        // User is signed in.
        console.log("User", user);
        const docRef = doc(
          db,
          process.NODE_ENV === "production" ? "tasks" : "tasks_dev",
          user.uid
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let tasks = docSnap.data();
          if (tasks?.length > 0) {
            setTasks(tasks);
          }
        }
        setUser(user);
      } else {
        setUser();
      }
    });
    if (localStorage["lister-tasks"]) {
      setTasks(JSON.parse(localStorage["lister-tasks"]));
    }
  }, []);

  const signin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User", user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const signout = () => {
    auth.signOut();
  };
  const saveToDatabase = async (tasks) => {
    if (!user) return;
    setSaving(true);
    if (tasks) {
      await setDoc(doc(db, process.NODE_ENV === 'production' ? "tasks" : 'tasks_dev', user.uid), {
        tasks: tasks,
      });
    } else {

    }

    setSaving(false);
  };
  return (
    <div>
      <TaskEngine
        user={user}
        saving={saving}
        onSignIn={signin}
        onSignOut={signout}
        onChange={(newTasks) => {
          console.log("Change:", newTasks);
          saveToDatabase(newTasks);
          localStorage.setItem("lister-tasks", JSON.stringify(newTasks));
          setTasks(newTasks);
        }}
        tasks={tasks}
      />
    </div>
  );
}

export default App;
