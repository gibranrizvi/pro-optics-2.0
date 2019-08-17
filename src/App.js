import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { auth, firestore, FirebaseContext } from './firebase/firebase';
import useAuth from './hooks/useAuth';

// Component improts
import Navbar from './components/navbar/Navbar';

// Styles
import './App.css';

const App = () => {
  const currentUser = useAuth();

  console.log(currentUser);

  return (
    <FirebaseContext.Provider value={{ currentUser, auth, firestore }}>
      <div className="App">
        <Navbar />
        <Switch>
          <Route />
          <Route />
          <Route />
          <Route />
        </Switch>
      </div>
    </FirebaseContext.Provider>
  );
};

export default App;
