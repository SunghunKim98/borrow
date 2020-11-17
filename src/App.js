import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Challenge from "./components/Challenge";
import Navigation from "./components/Navigation";
import fire from "./firebase";
import Login from "./Login";
import { useEffect } from "react";
import { MdEmail } from "react-icons/md";

const databaseURL = "https://todo-app-67946.firebaseio.com"

const App = () => {
  const [user,setUser]=useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword]=useState("");
  const [emailError,setEmailError]=useState("");
  const [passwordError,setPasswordError]=useState("");
  const [hasAccount,setHasAccount]=useState(false);
  const [inProgress, setProgress] = useState(false);  //추가! inProgress값 이 false

  const clearInputs=()=>{
    setEmail("");
    setPassword("");
  }
  const clearErrors=()=>{
    setEmailError("");
    setPasswordError("");
  }

  const handleLogin=()=>{
    clearErrors();
    fire
    .auth()
    .signInWithEmailAndPassword(email,password)
    .catch(err =>{
      switch(err.code){
        case "auth/invalid-email":
          case "auth/user-disabled":
            case"auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
      }
    });
  };
  
  const handleSignup =()=>{
    clearErrors();
    fire
    .auth()
    .createUserWithEmailAndPassword(email,password)
    .catch(err =>{
      switch(err.code){
        case "auth/email-already-in-use":
          case "auth/invalid-email":

            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
      }
    }).then(()=>{
      if(emailError=="" && passwordError=="") {
        const userData = {
          emial: fire.auth().currentUser.email,
        }
        _post(fire.auth().currentUser, userData);
      }
    });

    
  };

  const _post = (user, userData) => {
    return fetch(`${databaseURL}/${user.uid}.json`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }).then(res => {
      if(res.status != 200) throw new Error(res.statusText);  
      console.log(res);
      return res.json();
    })
  }

  const handleLogout=()=>{
    fire.auth().signOut();
  };
  
  const authListener =()=>{
    fire.auth().onAuthStateChanged(user=>{
      if(user){
        clearInputs();
        setUser(user);
        console.log(user);
      }else{
        setUser("");
      }
    });
  };

  useEffect(()=>{
    authListener();
  },[])

  const onProgress = () => {
    setProgress(prev => !prev);
    console.log(inProgress);
  };

  return (
    <div>
      <BrowserRouter>
      
        <Switch>
         <Route exact path="/" 
          render={()=> (user?(<Home handleLogout={handleLogout} user={fire.auth().currentUser.uid}/>):(<Login 
            email={email} 
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            hasAccount={hasAccount}
            setHasAccount={setHasAccount}
            emailError={emailError}
            passwordError={passwordError}
            />))}/>
           <Route exact path="/Challenge" 
          render={()=> (<Challenge onProgress={onProgress} inProgress={inProgress}/>) }/>
          <Route exact path="/home" render={()=>(user?(<Home handleLogout={handleLogout}/>):(<Login 
            email={email} 
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            hasAccount={hasAccount}
            setHasAccount={setHasAccount}
            emailError={emailError}
            passwordError={passwordError}
            />))}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;