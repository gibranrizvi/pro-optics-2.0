import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import FirebaseContext from '../../firebase/context';
import OpenCloseModal from '../open-close-modal/OpenCloseModal';

const TicketItem = ({ ticket }) => {
  const { currentUser } = React.useContext(FirebaseContext);

  const [showAll, setShowAll] = React.useState(false);

  const {
    _id,
    closed,
    closedAt,
    createdAt,
    signedOff,
    signedOffAt,
    ticketType,
    description,
    status
  } = ticket;

  const onDownloadTicketClick = () => {
    // TODO
  };

  return (
    <div className={`card card-body ${closed && 'bg-dark'} pb-0 mb-3`}>
      <div className="row">
        <div className="col-lg-2">
          <Link
            to={`/ticket/${_id}`}
            className="btn btn-primary btn-sm btn-block mb-2"
          >
            INTV {_id}
          </Link>
          <p className="text-muted text-center">
            <strong>{!closed ? 'OPEN' : 'CLOSED'}</strong>
          </p>
          {showAll && (
            <p className="text-muted text-center">
              {closed && (
                <small>
                  Date Closed:{' '}
                  <strong>{format(closedAt, 'Do MMM YYYY')}</strong>
                  <br />
                </small>
              )}
              <small>
                Date Created:{' '}
                <strong>{format(createdAt, 'Do MMM YYYY')}</strong>
                <br />
              </small>
              {signedOff && (
                <small>
                  Signed off at:{' '}
                  <strong>{format(signedOffAt, 'Do MMM YYYY')}</strong>
                  <br />
                </small>
              )}
              {(status === 'Complete' ||
                status === 'Complete to activate at a later date') && (
                <button
                  onClick={onDownloadTicketClick}
                  className="btn btn-secondary btn-sm btn-block mt-2"
                >
                  Download Ticket
                </button>
              )}
            </p>
          )}
        </div>
        <div className="col-lg-4">
          {showAll ? (
            <p className="text-muted">
              Type: <strong>{ticketType}</strong>
              <br />
              Description: <strong>{description}</strong>
              <br />
              Status: <strong>{status}</strong>
              <br />
              {currentUser.role === 'admin' ? (
                <span className="text-muted">
                  {ticket.leadsman ? (
                    <span>
                      Leadsman:{' '}
                      <Link to={`/technician/${ticket.leadsmanHandle}`}>
                        <strong>{ticket.leadsmanName}</strong>
                      </Link>
                    </span>
                  ) : (
                    <span>
                      {ticket.leadsmanName && (
                        <span>
                          Leadsman: <strong>{ticket.leadsmanName}</strong>
                        </span>
                      )}
                    </span>
                  )}
                  <br />
                  {ticket.assistant ? (
                    <span>
                      Assistant:{' '}
                      <Link to={`/technician/${ticket.assistantHandle}`}>
                        <strong>{ticket.assistantName}</strong>
                      </Link>
                    </span>
                  ) : (
                    <span>
                      {ticket.assistantName && (
                        <span>
                          Assistant: <strong>{ticket.assistantName}</strong>
                        </span>
                      )}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-muted">
                  {ticket.leadsmanName && (
                    <span>
                      Leadsman: <strong>{ticket.leadsmanName}</strong>
                    </span>
                  )}
                  <br />
                  {ticket.assistantName && (
                    <span>
                      Assistant: <strong>{ticket.assistantName}</strong>
                    </span>
                  )}
                </span>
              )}
            </p>
          ) : (
            <p className="text-muted">
              Type: <strong>{ticket.ticketType}</strong>
              <br />
              Description: <strong>{ticket.description}</strong>
              <br />
              Status: <strong>{ticket.status}</strong>
            </p>
          )}
        </div>
        <div className="col-lg-4">
          {showAll ? (
            <p className="text-muted">
              Account ID: <strong>{ticket.endUserInfo.id}</strong>
              <br />
              Customer Name: <strong>{ticket.endUserInfo.name}</strong>
              <br />
              NIN: <strong>{ticket.endUserInfo.nin}</strong>
              <br />
              Address: <strong>{ticket.endUserInfo.address}</strong>
              <br />
              Parcel Number: <strong>{ticket.endUserInfo.parcelNumber}</strong>
              <br />
              Telephone:{' '}
              <strong>
                {ticket.endUserInfo.telephone1}
                {ticket.endUserInfo.telephone2 &&
                  `/${ticket.endUserInfo.telephone2}`}
                {ticket.endUserInfo.telephone3 &&
                  `/${ticket.endUserInfo.telephone3}`}
              </strong>
              <br />
              Email:{' '}
              <strong>
                {ticket.endUserInfo.email ? ticket.endUserInfo.email : '-'}
              </strong>
            </p>
          ) : (
            <p className="text-muted">
              Account ID: <strong>{ticket.endUserInfo.id}</strong>
              <br />
              Customer Name: <strong>{ticket.endUserInfo.name}</strong>
              <br />
              Address: <strong>{ticket.endUserInfo.address}</strong>
            </p>
          )}
        </div>
        <div className="col-lg-2">
          {showAll && (
            <div>
              {currentUser.role === 'admin' && (
                <TechnicianModal ticket={ticket} />
              )}
              {currentUser.role !== 'provider' && (
                <StatusModal ticket={ticket} />
              )}
              {currentUser.role !== 'technician' && (
                <Link
                  to={`/edit-ticket/${ticket._id}`}
                  className="btn btn-info btn-sm btn-block mb-2"
                >
                  Edit Ticket
                </Link>
              )}
              {currentUser.role === 'provider' &&
                (ticket.status === 'Return to Intelvision' ||
                  ticket.status === 'Require survey') && (
                  <button
                    onClick={() =>
                      // TODO
                      //updateStatus(ticket._id, { status: 'Issued' })
                      console.log('Update status to issued')
                    }
                    className="btn btn-success btn-sm btn-block mb-2"
                  >
                    Issue Ticket
                  </button>
                )}
              {currentUser.role === 'admin' && (
                <OpenCloseModal ticket={ticket} />
              )}
            </div>
          )}
          {showAll ? (
            <p
              onClick={() => setShowAll(prevState => !prevState)}
              className="text-muted text-center toggle"
            >
              Show Less
            </p>
          ) : (
            <p
              onClick={() => setShowAll(prevState => !prevState)}
              className="text-muted text-center toggle"
            >
              Show More
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketItem;
