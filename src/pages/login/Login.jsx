import React from 'react';
import {
  FirebaseContext,
  createUserProfileDocument
} from '../../firebase/firebase';
import TextFieldGroup from '../../components/text-field-group/TextFieldGroup';

const Login = ({ history }) => {
  const { currentUser, auth } = React.useContext(FirebaseContext);

  const [usernameOrEmail, setUsernameOrEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (currentUser) {
      history.push('/dashboard');
    }
  }, [currentUser, history]);

  const onSubmit = async event => {
    event.preventDefault();

    let email;

    // Form validation
    if (!usernameOrEmail) {
      return setErrors({
        ...errors,
        usernameOrEmail: 'Username or email is required'
      });
    } else if (!password) {
      return setErrors({
        ...errors,
        usernameOrEmail: '',
        password: 'Password is required'
      });
    }

    setErrors({});

    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(usernameOrEmail)) {
      email = usernameOrEmail;
    } else {
      email = usernameOrEmail + '@pro-optics.com';
    }

    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);

      return createUserProfileDocument({ uid: user.uid });
    } catch (error) {
      console.log(error);
      return setErrors({
        general: 'Incorrect log in details'
      });
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">Sign in to your account</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 m-auto">
            <form noValidate onSubmit={onSubmit}>
              <TextFieldGroup
                placeholder="Username or Email"
                name="usernameOrEmail"
                value={usernameOrEmail}
                onChange={event => setUsernameOrEmail(event.target.value)}
                error={errors.usernameOrEmail || errors.general}
                errorMessage={errors.usernameOrEmail}
                autoFocus={true}
              />
              <TextFieldGroup
                placeholder="Password"
                name="password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                error={errors.password || errors.general}
                errorMessage={errors.password || errors.general}
              />
              <input type="submit" className="btn btn-primary btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
