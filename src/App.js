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
import Register from './pages/register/Register';
import CreateTicket from './pages/create-ticket/CreateTicket';
import EditTicket from './pages/edit-ticket/EditTicket';

// Component imports
import TicketList from './components/ticket-list/TicketList';

const App = () => {
  const currentUser = useAuth();

  console.log(currentUser);

  return (
    <FirebaseContext.Provider value={{ currentUser, auth, firestore }}>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={Landing} />
        <div className="container">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route
              exact
              path={['/dashboard', '/tickets']}
              component={TicketList}
            />
            <Route exact path="/create-ticket" component={CreateTicket} />
            <Route
              exact
              path="/edit-ticket/:provider/:id"
              component={EditTicket}
            />
          </Switch>
        </div>
        <Footer />
      </div>
    </FirebaseContext.Provider>
  );
};

export default App;
