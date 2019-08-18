import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { auth, firestore, FirebaseContext } from './firebase/firebase';
import useAuth from './hooks/useAuth';

// Component improts
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

// Styles
import './App.css';

// Page imports
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Register from './pages/register/Register';

const App = () => {
  const currentUser = useAuth();

  console.log(currentUser);

  return (
    <FirebaseContext.Provider value={{ currentUser, auth, firestore }}>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
        <Footer />
      </div>
    </FirebaseContext.Provider>
  );
};

export default App;
