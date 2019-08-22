import React from 'react';

import { FirebaseContext } from '../../firebase/firebase';

// Component imports
import Dashboard from '../../pages/dashboard/Dashboard';
import Tickets from '../../pages/tickets/Tickets';

const TicketList = ({ history, location }) => {
  const { currentUser, firestore } = React.useContext(FirebaseContext);

  const [tickets, setTickets] = React.useState(null);
  const [intvTickets, setIntvTickets] = React.useState(null);
  const [airtelTickets, setAirtelTickets] = React.useState(null);
  const [cwsTickets, setCwsTickets] = React.useState(null);
  const [provider, setProvider] = React.useState(null);

  const openTicketsRef = firestore
    .collectionGroup('tickets')
    .where('closed', '==', false);

  const isDashboardPage = location.pathname.includes('dashboard');

  React.useEffect(() => {
    if (!currentUser) {
      return history.push('/login');
    }

    const unsubscribe = getTickets();

    const { role, company } = currentUser;
    if (role === 'admin') {
      setProvider('intv');
    } else if (role === 'provider') {
      switch (company) {
        case 'intv':
          setProvider('intv');
          break;
        case 'airtel':
          setProvider('airtel');
          break;
        case 'cws':
          setProvider('cws');
          break;
        default:
          break;
      }
    }

    return () => unsubscribe();
  }, [currentUser, history]);

  React.useEffect(() => {
    if (tickets) {
      setIntvTickets(tickets.filter(ticket => ticket.provider === 'intv'));
      setAirtelTickets(tickets.filter(ticket => ticket.provider === 'airtel'));
      setCwsTickets(tickets.filter(ticket => ticket.provider === 'cws'));
    }
  }, [tickets]);

  const getTickets = () => {
    const unsubscribe = openTicketsRef
      .orderBy('created_at', 'desc')
      .onSnapshot(snapshot => {
        const tickets = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });

        setTickets(tickets);
      });

    return unsubscribe;
  };

  const renderDashboardPage = () => {
    if (provider === 'intv') {
      return (
        <Dashboard
          tickets={intvTickets}
          provider={provider}
          setProvider={provider => setProvider(provider)}
        />
      );
    } else if (provider === 'airtel') {
      return (
        <Dashboard
          tickets={airtelTickets}
          provider={provider}
          setProvider={provider => setProvider(provider)}
        />
      );
    } else if (provider === 'cws') {
      return (
        <Dashboard
          tickets={cwsTickets}
          provider={provider}
          setProvider={provider => setProvider(provider)}
        />
      );
    }
  };

  const renderTicketsPage = () => {
    if (provider === 'intv') {
      return (
        <Tickets
          tickets={intvTickets}
          provider={provider}
          setProvider={provider => setProvider(provider)}
          currentUser={currentUser}
        />
      );
    } else if (provider === 'airtel') {
      return (
        <Tickets
          tickets={airtelTickets}
          provider={provider}
          setProvider={provider => setProvider(provider)}
          currentUser={currentUser}
        />
      );
    } else if (provider === 'cws') {
      return (
        <Tickets
          tickets={cwsTickets}
          provider={provider}
          setProvider={provider => setProvider(provider)}
          currentUser={currentUser}
        />
      );
    }
  };

  return (
    <div className="ticket-list">
      {isDashboardPage ? renderDashboardPage() : renderTicketsPage()}
    </div>
  );
};

export default TicketList;
