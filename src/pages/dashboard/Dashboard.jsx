import React from 'react';

import { FirebaseContext } from '../../firebase/firebase';

// Component imports
import DashboardActions from '../../components/dashboard-actions/DashboardActions';
import TicketFeed from '../../components/ticket-item/TicketItem';
import Spinner from '../../components/spinner/Spinner';

const Dashboard = ({ history }) => {
  const { currentUser, firestore } = React.useContext(FirebaseContext);

  const [tickets, setTickets] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showAwaiting, setShowAwaiting] = React.useState(false);
  const [showUnassigned, setShowUnassigned] = React.useState(false);
  const [showPending, setShowPending] = React.useState(false);
  const [showActive, setShowActive] = React.useState(false);
  const [showComplete, setShowComplete] = React.useState(false);

  const ticketsRef = firestore.collection('/tickets/');

  React.useEffect(() => {
    if (!currentUser) {
      history.push('/login');
    }
  }, [currentUser, history]);

  React.useEffect(() => {
    const unsubscribe = getTickets();
    return () => unsubscribe();
  }, []);

  const getTickets = () => {
    setLoading(true);

    return ticketsRef.orderBy('created', 'desc').onSnapshot(handleSnapshot);
  };

  const handleSnapshot = snapshot => {
    const tickets = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });

    setTickets(tickets);
    setLoading(false);
  };

  let dashboardContent;

  if (!tickets || loading) {
    dashboardContent = (
      <div>
        <p className="lead text-center mt-4">
          Fetching tickets, one moment please
        </p>
        <Spinner />
      </div>
    );
  } else {
    const awaiting = tickets.filter(
      ticket =>
        (ticket.status === 'Return to Intelvision' ||
          ticket.status === 'Require survey') &&
        !ticket.closed
    );

    const unassigned = tickets.filter(ticket => ticket.status === 'Unassigned');

    const pending = tickets.filter(ticket => ticket.status === 'Issued');

    const active = tickets.filter(
      ticket =>
        ticket.status === 'On field' ||
        ticket.status === 'Provisioning required by client'
    );

    const complete = tickets.filter(
      ticket =>
        (ticket.status === 'Complete' ||
          ticket.status === 'Complete to activate at a later date') &&
        !ticket.closed
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-12">
            <h1 className="display-4">Dashboard</h1>
            <p className="lead">
              Welcome back <strong>{currentUser && currentUser.name}</strong>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12" />
          {currentUser && <DashboardActions role={currentUser.role} />}
          {dashboardContent}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
