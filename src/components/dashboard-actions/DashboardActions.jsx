import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = ({ role }) => {
  let actions;

  if (role === 'admin') {
    actions = (
      <div>
        <div className="btn-group mb-4" role="group">
          <Link to="/create-ticket" className="btn btn-secondary">
            Create New Ticket
          </Link>
          <Link to="/tickets" className="btn btn-dark">
            View All Tickets
          </Link>
        </div>
        <br />
        <div className="btn-group mb-4" role="group">
          <Link to="/register" className="btn btn-secondary">
            Create New User
          </Link>
          <Link to="/technicians" className="btn btn-dark">
            View Technicians
          </Link>
          <Link to="/providers" className="btn btn-secondary">
            View Providers
          </Link>
        </div>
      </div>
    );
  } else if (role === 'provider') {
    actions = (
      <div className="btn-group mb-4" role="group">
        <Link to="/create-ticket" className="btn btn-secondary">
          Create New Ticket
        </Link>
        <Link to="/tickets" className="btn btn-dark">
          View All Tickets
        </Link>
      </div>
    );
  } else {
    actions = <div />;
  }

  return actions;
};

export default DashboardActions;
