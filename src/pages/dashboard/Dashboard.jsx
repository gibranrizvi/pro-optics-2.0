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
  const [tickets, setTickets] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showAwaiting, setShowAwaiting] = React.useState(false);
  const [showUnassigned, setShowUnassigned] = React.useState(false);
  const [showPending, setShowPending] = React.useState(false);
  const [showActive, setShowActive] = React.useState(false);
  const [showComplete, setShowComplete] = React.useState(false);
  const [viewToggle, setViewToggle] = React.useState(false);
  const [provider, setProvider] = React.useState('airtel');

  const intvTicketsRef = firestore.collection(`/providers/intv/tickets/`);
  const airtelTicketsRef = firestore.collection(`/providers/airtel/tickets/`);
  const cwsTicketsRef = firestore.collection(`/providers/cws/tickets/`);
  const ticketsRef = firestore.collection(`/providers/airtel/tickets/`);

  React.useEffect(() => {
    if (!currentUser) {
      history.push('/login');
    } else {
      const unsubscribe = getTickets();
      return () => unsubscribe();
    }
  }, [currentUser, history]);

  const getTickets = () => {
    setLoading(true);

    if (currentUser.role === 'admin') {
      return (
        ticketsRef
          .orderBy('created_at', 'desc')
          // .where('closed', '==', true)
          .onSnapshot(handleSnapshot)
      );
    } else if (currentUser.role === 'provider') {
      return (
        ticketsRef
          .orderBy('created_at', 'desc')
          // .where('provider', '==', `${currentUser.company}`)
          .onSnapshot(handleSnapshot)
      );
    }
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

    dashboardContent = (
      <div>
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

        {currentUser.role === 'admin' && (
          <div className="btn-group" role="group">
            <button
              onClick={() => setProvider('intv')}
              className={`btn ${
                provider === 'intv' ? 'btn-dark' : 'btn-secondary'
              } mb-4`}
            >
              Intelvision
            </button>
            <button
              onClick={() => setProvider('airtel')}
              className={`btn ${
                provider === 'airtel' ? 'btn-dark' : 'btn-secondary'
              } mb-4`}
            >
              Airtel
            </button>
            <button
              onClick={() => setProvider('cws')}
              className={`btn ${
                provider === 'cws' ? 'btn-dark' : 'btn-secondary'
              } mb-4`}
            >
              Cable &amp; Wireless
            </button>
          </div>
        )}
        <br />

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

            {dashboardContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
