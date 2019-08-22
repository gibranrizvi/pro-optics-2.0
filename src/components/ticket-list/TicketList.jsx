import React from 'react';

import { FirebaseContext } from '../../firebase/firebase';

// Component imports
import Dashboard from '../../pages/dashboard/Dashboard';

const TicketList = ({ history, location }) => {
  const { currentUser, firestore } = React.useContext(FirebaseContext);

  const [intvTickets, setIntvTickets] = React.useState(null);
  const [airtelTickets, setAirtelTickets] = React.useState(null);
  const [cwsTickets, setCwsTickets] = React.useState(null);
  const [provider, setProvider] = React.useState('intv');

  const intvTicketsRef = firestore.collection(`/providers/intv/tickets/`);
  const airtelTicketsRef = firestore.collection(`/providers/airtel/tickets/`);
  const cwsTicketsRef = firestore.collection(`/providers/cws/tickets/`);

  const isDashboardPage = location.pathname.includes('dashboard');

  React.useEffect(() => {
    if (!currentUser) {
      return history.push('/login');
    }

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
  }, [currentUser, history]);

  React.useEffect(() => {
    console.log(provider);

    if (
      (provider === 'intv' && !intvTickets) ||
      (provider === 'airtel' && !airtelTickets) ||
      (provider === 'cws' && !cwsTickets)
    ) {
      const {
        unsubscribeIntv,
        unsubscribeAirtel,
        unsubscribeCws
      } = getTickets();

      return () => {
        unsubscribeIntv && unsubscribeIntv();
        unsubscribeAirtel && unsubscribeAirtel();
        unsubscribeCws && unsubscribeCws();
      };
    }
  }, [provider]);

  const getTickets = () => {
    let unsubscribeIntv, unsubscribeAirtel, unsubscribeCws;

    if (provider === 'intv') {
      unsubscribeIntv = intvTicketsRef
        .orderBy('created_at', 'desc')
        .onSnapshot(snapshot => {
          const tickets = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });

          setIntvTickets(tickets);
        });
    } else if (provider === 'airtel') {
      unsubscribeAirtel = airtelTicketsRef
        .orderBy('created_at', 'desc')
        .onSnapshot(snapshot => {
          const tickets = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });

          setAirtelTickets(tickets);
        });
    } else if (provider === 'cws') {
      unsubscribeCws = cwsTicketsRef
        .orderBy('created_at', 'desc')
        .onSnapshot(snapshot => {
          const tickets = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });

          setCwsTickets(tickets);
        });
    }

    return {
      unsubscribeIntv,
      unsubscribeAirtel,
      unsubscribeCws
    };
  };

  const renderDashboard = () => {
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

  return isDashboardPage ? (
    <div className="ticket-list">{renderDashboard()}</div>
  ) : (
    <div>Tickets</div>
  );
};

export default TicketList;
