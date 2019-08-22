import React from 'react';

import FirebaseContext from '../../firebase/context';

// Component imports
import TextFieldGroup from '../../components/text-field-group/TextFieldGroup';
import SelectListGroup from '../../components/select-list-group/SelectListGroup';
import {
  createUserProfileDocument,
  createNewUser
} from '../../firebase/firebase';

const Register = ({ history }) => {
  const { currentUser } = React.useContext(FirebaseContext);

  const [values, setValues] = React.useState({
    name: '',
    handle: '',
    role: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = React.useState({});

  const {
    name,
    handle,
    role,
    company,
    email,
    password,
    confirmPassword
  } = values;

  React.useEffect(() => {
    if (currentUser) {
      const { role, handle } = currentUser;
      if (role !== 'admin' || handle === 'arnelr') {
        history.push('/dashboard');
      }
    } else {
      history.push('/login');
    }
  }, [currentUser, history]);

  const onSubmit = async event => {
    event.preventDefault();

    // Validation
    if (!name) {
      return setErrors({ ...errors, email: '', name: 'Name is required' });
    } else if (!handle) {
      return setErrors({ ...errors, name: '', handle: 'Username is required' });
    } else if (!role) {
      return setErrors({ ...errors, handle: '', role: 'Please select a role' });
    } else if (!company) {
      return setErrors({
        ...errors,
        role: '',
        company: 'Please select a company'
      });
    } else if (!password) {
      return setErrors({
        ...errors,
        company: '',
        password: 'Password is required'
      });
    } else if (!confirmPassword) {
      return setErrors({
        ...errors,
        password: '',
        confirmPassword: 'Please confirm password'
      });
    } else if (password !== confirmPassword) {
      return setErrors({
        ...errors,
        password: '',
        confirmPassword: 'Passwords do not match'
      });
    } else if (
      email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      return setErrors({ email: 'Email is invalid' });
    }

    setErrors({});

    const formattedCompany = company.toLowerCase().replace(' ', '-');
    const formattedEmail = email ? email : handle + '@pro-optics.com';

    try {
      const user = await createNewUser(formattedEmail, password);

      const { uid, email } = user;

      const userData = {
        uid,
        name,
        handle: handle.toLowerCase(),
        role: role.toLowerCase(),
        company: formattedCompany,
        email,
        created_by: currentUser
      };

      await createUserProfileDocument(userData);

      if (role === 'admin') {
        return history.push('/admins');
      } else if (role === 'provider') {
        return history.push('/providers');
      } else if (role === 'technicians') {
        return history.push('/technicians');
      }
    } catch (error) {
      console.log(error);
      return setErrors({
        email: 'Email is already in use'
      });
    }
  };

  // Select options for role
  const roleItems = [
    { label: 'Technician', value: 'technician' },
    { label: 'Provider', value: 'provider' },
    { label: 'Admin', value: 'admin' }
  ];

  // Select options for company
  const companyItems = [
    { label: 'Intelvision', value: 'intv' },
    { label: 'Airtel', value: 'airtel' },
    { label: 'Cable & Wireless', value: 'cws' },
    { label: 'Pro Optics', value: 'pro-optics' }
  ];

  return (
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <button
              onClick={() => history.goBack()}
              className="btn btn-light mb-3 float-left"
            >
              Go Back
            </button>
          </div>
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Register</h1>
            <p className="lead text-center">Create a new user</p>
            <small className="d-block pb-3 text-center">
              * indicates required fields
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 m-auto">
            <form noValidate onSubmit={onSubmit}>
              <TextFieldGroup
                placeholder="Name *"
                name="name"
                value={name}
                onChange={event =>
                  setValues({ ...values, name: event.target.value })
                }
                label={name !== '' && 'Name:'}
                error={errors.name}
                errorMessage={errors.name}
                autoFocus={true}
              />
              <TextFieldGroup
                placeholder="Username *"
                name="handle"
                value={handle}
                onChange={event =>
                  setValues({ ...values, handle: event.target.value })
                }
                info="Use lowercase and no spaces"
                label={handle !== '' && 'Handle:'}
                error={errors.handle}
                errorMessage={errors.handle}
              />
              <SelectListGroup
                name="role"
                value={role}
                onChange={event =>
                  setValues({ ...values, role: event.target.value })
                }
                placeholderOption="Select Role *"
                items={roleItems}
                fieldLabel={role !== '' && 'Role:'}
                error={errors.role}
                errorMessage={errors.role}
              />
              <SelectListGroup
                name="company"
                value={company}
                onChange={event =>
                  setValues({ ...values, company: event.target.value })
                }
                placeholderOption="Select Company *"
                items={companyItems}
                fieldLabel={company !== '' && 'Company:'}
                error={errors.company}
                errorMessage={errors.company}
              />
              <TextFieldGroup
                placeholder="Email"
                name="email"
                type="email"
                value={email}
                onChange={event =>
                  setValues({ ...values, email: event.target.value })
                }
                label={email !== '' && 'Email:'}
                error={errors.email}
                errorMessage={errors.email}
              />
              <TextFieldGroup
                placeholder="Password *"
                name="password"
                type="password"
                value={password}
                onChange={event =>
                  setValues({ ...values, password: event.target.value })
                }
                label={password !== '' && 'Password:'}
                error={errors.password}
                errorMessage={errors.password}
              />
              <TextFieldGroup
                placeholder="Confirm Password *"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={event =>
                  setValues({ ...values, confirmPassword: event.target.value })
                }
                label={confirmPassword !== '' && 'Confirm Password:'}
                error={errors.confirmPassword}
                errorMessage={errors.confirmPassword}
              />
              <input type="submit" className="btn btn-primary btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
