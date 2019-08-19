import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import FirebaseContext from '../../firebase/context';

const Navbar = ({ history }) => {
  const { auth, currentUser } = React.useContext(FirebaseContext);

  const authLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
      </li>
      {currentUser &&
      currentUser.role === 'admin' &&
      currentUser.handle !== 'arnelr' ? (
        <li className="nav-item dropdown ml-2">
          <button
            className="btn nav-button nav-link"
            id="navbarDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-v" />
          </button>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbarDropdown"
          >
            <Link to="/technicians" className="dropdown-item">
              View Technicians
            </Link>
            <Link to="/providers" className="dropdown-item">
              View Providers
            </Link>
            <Link to="/admins" className="dropdown-item">
              View Admins
            </Link>
            <div className="dropdown-divider" />
            <Link to="/create-ticket" className="dropdown-item">
              Create New Ticket
            </Link>
            <Link to="/register" className="dropdown-item">
              Create New User
            </Link>
            <Link
              to={`/change-password/${currentUser.role}`}
              className="dropdown-item"
            >
              Change Password
            </Link>
            <div className="dropdown-divider" />
            <button
              className="btn dropdown-item text-right"
              onClick={() => {
                auth.signOut();
                history.push('/login');
              }}
            >
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </li>
      ) : (
        <li className="nav-item">
          <button
            className="btn nav-button nav-link"
            onClick={() => {
              auth.signOut();
              history.push('/login');
            }}
          >
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
        </li>
      )}
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand mb-0 h1" to="/">
          Pro Optics
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mobile-nav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mobile-nav">
          {currentUser && (
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/tickets">
                  Tickets
                </Link>
              </li>
            </ul>
          )}
          {currentUser ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
