import React from 'react';

import { FirebaseContext } from '../../firebase/firebase';
import {
  descriptionOptionsHFC,
  descriptionOptionsGPON
} from '../../utils/select-lists';

// Component imports
import DashboardActions from '../../components/dashboard-actions/DashboardActions';
import TicketFeed from '../../components/ticket-feed/TicketFeed';
import Spinner from '../../components/spinner/Spinner';

const Dashboard = ({ history }) => {
  const { currentUser, firestore } = React.useContext(FirebaseContext);

  const [intvTickets, setIntvTickets] = React.useState(null);
  const [airtelTickets, setAirtelTickets] = React.useState(null);
  const [cwsTickets, setCwsTickets] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showAwaiting, setShowAwaiting] = React.useState(false);
  const [showUnassigned, setShowUnassigned] = React.useState(false);
  const [showPending, setShowPending] = React.useState(false);
  const [showActive, setShowActive] = React.useState(false);
  const [showComplete, setShowComplete] = React.useState(false);
  const [viewToggle, setViewToggle] = React.useState(false);
  const [provider, setProvider] = React.useState('intv');

  const intvTicketsRef = firestore.collection(`/providers/intv/tickets/`);
  const airtelTicketsRef = firestore.collection(`/providers/airtel/tickets/`);
  const cwsTicketsRef = firestore.collection(`/providers/cws/tickets/`);

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
    setLoading(true);

    let unsubscribeIntv, unsubscribeAirtel, unsubscribeCws;

    if (provider === 'intv') {
      unsubscribeIntv = intvTicketsRef
        .orderBy('created_at', 'desc')
        .onSnapshot(snapshot => {
          const tickets = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });

          setIntvTickets(tickets);
          setLoading(false);
        });
    } else if (provider === 'airtel') {
      unsubscribeAirtel = airtelTicketsRef
        .orderBy('created_at', 'desc')
        .onSnapshot(snapshot => {
          const tickets = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });

          setAirtelTickets(tickets);
          setLoading(false);
        });
    } else if (provider === 'cws') {
      unsubscribeCws = cwsTicketsRef
        .orderBy('created_at', 'desc')
        .onSnapshot(snapshot => {
          const tickets = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });

          setCwsTickets(tickets);
          setLoading(false);
        });
    }

    return {
      unsubscribeIntv,
      unsubscribeAirtel,
      unsubscribeCws
    };
  };

  const filterTickets = () => {
    let tickets;

    switch (provider) {
      case 'intv':
        tickets = intvTickets;
        break;
      case 'airtel':
        tickets = airtelTickets;
        break;
      case 'cws':
        tickets = cwsTickets;
        break;
      default:
        break;
    }

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

    return { awaiting, unassigned, pending, active, complete };
  };

  let dashboardContent;

  if (
    (provider === 'intv' && !intvTickets) ||
    (provider === 'airtel' && !airtelTickets) ||
    (provider === 'cws' && !cwsTickets)
  ) {
    dashboardContent = (
      <div>
        <p className="lead text-center mt-4">
          Fetching tickets, one moment please
        </p>
        <Spinner />
      </div>
    );
  } else {
    const { awaiting, unassigned, pending, active, complete } = filterTickets();

    dashboardContent = (
      <div>
        <div>
          <h3 className="display-5 text-center mb-4">
            Awaiting Action by Provider ({awaiting.length})
          </h3>
          {awaiting.length > 0 ? (
            <p
              className="lead text-center toggle"
              onClick={() => setShowAwaiting(true)}
            >
              {showAwaiting ? 'Hide' : 'Show'}
            </p>
          ) : (
            <p className="lead text-center">No tickets awaiting action</p>
          )}
          {showAwaiting && (
            <div>
              {viewToggle ? (
                <div>
                  <p className="lead">HFC</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />

                  <p className="lead">GPON</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Migration</p>
                  <TicketFeed
                    tickets={awaiting.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[5].value
                    )}
                    currentUser={currentUser}
                  />
                </div>
              ) : (
                <div>
                  <TicketFeed tickets={awaiting} currentUser={currentUser} />
                </div>
              )}
              <p
                className="lead text-center toggle"
                onClick={() => showAwaiting(false)}
              >
                Hide
              </p>
            </div>
          )}
          <br />
          <hr />
          <h3 className="display-5 text-center mb-4">
            Unassigned Tickets ({unassigned.length})
          </h3>
          {unassigned.length > 0 ? (
            <p
              className="lead text-center toggle"
              onClick={() => setShowUnassigned(true)}
            >
              {showUnassigned ? 'Hide' : 'Show'}
            </p>
          ) : (
            <p className="lead text-center">No tickets to be assigned</p>
          )}
          {showUnassigned && (
            <div>
              {viewToggle ? (
                <div>
                  <p className="lead">HFC</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />

                  <p className="lead">GPON</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Migration</p>
                  <TicketFeed
                    tickets={unassigned.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[5].value
                    )}
                    currentUser={currentUser}
                  />
                </div>
              ) : (
                <div>
                  <TicketFeed tickets={unassigned} currentUser={currentUser} />
                </div>
              )}
              <p
                className="lead text-center toggle"
                onClick={() => setShowUnassigned(false)}
              >
                Hide
              </p>
            </div>
          )}
          <br />
          <hr />
          <h3 className="display-5 text-center mb-4">
            Pending Tickets ({pending.length})
          </h3>
          {pending.length > 0 ? (
            <p
              className="lead text-center toggle"
              onClick={() => setShowPending(true)}
            >
              {showPending ? 'Hide' : 'Show'}
            </p>
          ) : (
            <p className="lead text-center">No pending tickets found</p>
          )}
          {showPending && (
            <div>
              {viewToggle ? (
                <div>
                  <p className="lead">HFC</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />

                  <p className="lead">GPON</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Migration</p>
                  <TicketFeed
                    tickets={pending.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[5].value
                    )}
                    currentUser={currentUser}
                  />
                </div>
              ) : (
                <div>
                  <TicketFeed tickets={pending} currentUser={currentUser} />
                </div>
              )}
              <p
                className="lead text-center toggle"
                onClick={() => setShowPending(false)}
              >
                Hide
              </p>
            </div>
          )}
          <br />
          <hr />
          <h3 className="display-5 text-center mb-4">
            Active Tickets ({active.length})
          </h3>
          {active.length > 0 ? (
            <p
              className="lead text-center toggle"
              onClick={() => setShowActive(true)}
            >
              {showActive ? 'Hide' : 'Show'}
            </p>
          ) : (
            <p className="lead text-center">No active tickets found</p>
          )}
          {showActive && (
            <div>
              {viewToggle ? (
                <div>
                  <p className="lead">HFC</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />

                  <p className="lead">GPON</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Migration</p>
                  <TicketFeed
                    tickets={active.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[5].value
                    )}
                    currentUser={currentUser}
                  />
                </div>
              ) : (
                <div>
                  <TicketFeed tickets={active} currentUser={currentUser} />
                </div>
              )}
              <p
                className="lead text-center toggle"
                onClick={() => setShowActive(false)}
              >
                Hide
              </p>
            </div>
          )}
          <br />
          <hr />
          <h3 className="display-5 text-center mb-4">
            Complete Tickets ({complete.length})
          </h3>
          {complete.length > 0 ? (
            <p
              className="lead text-center toggle"
              onClick={() => setShowComplete(true)}
            >
              {showComplete ? 'Hide' : 'Show'}
            </p>
          ) : (
            <p className="lead text-center">No complete tickets found</p>
          )}
          {showComplete && (
            <div>
              {viewToggle ? (
                <div>
                  <p className="lead">HFC</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsHFC[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />

                  <p className="lead">GPON</p>
                  <p className="text-muted">New Connection</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[0].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Reconnection</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[1].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Relocation</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[2].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Servicing</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[3].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Additional Services</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[4].value
                    )}
                    currentUser={currentUser}
                  />
                  <hr />
                  <p className="text-muted">Migration</p>
                  <TicketFeed
                    tickets={complete.filter(
                      ticket =>
                        ticket.description === descriptionOptionsGPON[5].value
                    )}
                    currentUser={currentUser}
                  />
                </div>
              ) : (
                <div>
                  <TicketFeed tickets={complete} currentUser={currentUser} />
                </div>
              )}
              <p
                className="lead text-center toggle"
                onClick={() => setShowComplete(false)}
              >
                Hide
              </p>
            </div>
          )}
        </div>
      </div>
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
          <div className="col-md-12">
            {currentUser && <DashboardActions role={currentUser.role} />}
            <div>
              {/* TODO {currentUser.role !== 'technician' && (
            <DownloadReportModal tickets={tickets} />
          )} */}
              <button
                onClick={() => setViewToggle(prevState => !prevState)}
                className="btn btn-dark mb-4"
              >
                Toggle View
              </button>
            </div>

            {currentUser && currentUser.role === 'admin' && (
              <div className="btn-group" role="group">
                <button
                  onClick={() => {
                    setProvider('intv');
                  }}
                  className={`btn ${
                    provider === 'intv' ? 'btn-dark' : 'btn-secondary'
                  } mb-4`}
                >
                  Intelvision
                </button>
                <button
                  onClick={() => {
                    setProvider('airtel');
                  }}
                  className={`btn ${
                    provider === 'airtel' ? 'btn-dark' : 'btn-secondary'
                  } mb-4`}
                >
                  Airtel
                </button>
                <button
                  onClick={() => {
                    setProvider('cws');
                  }}
                  className={`btn ${
                    provider === 'cws' ? 'btn-dark' : 'btn-secondary'
                  } mb-4`}
                >
                  Cable &amp; Wireless
                </button>
              </div>
            )}
            <br />
            {dashboardContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
