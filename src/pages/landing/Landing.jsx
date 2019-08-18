import React from 'react';
import { Link } from 'react-router-dom';
import FirebaseContext from '../../firebase/context';

const Landing = ({ history }) => {
  const { currentUser } = React.useContext(FirebaseContext);

  React.useEffect(() => {
    if (currentUser) {
      history.push('/dashboard');
    }
  }, [currentUser, history]);

  return (
    <div className="landing">
      <div className="dark-overlay landing-inner text-light">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-3 mb-4">Pro Optics</h1>
              <p className="lead">Welcome back!</p>
              <hr />
              <Link to="/login" className="btn btn-lg btn-primary btn-landing">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
