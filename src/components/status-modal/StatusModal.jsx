import React from 'react';
import Modal from 'react-modal';

import FirebaseContext from '../../firebase/context';
import { statusOptions } from '../../utils/select-lists';

// Component imports
import SelectListGroup from '../select-list-group/SelectListGroup';

const StatusModal = ({ ticket }) => {
  const { firestore } = React.useContext(FirebaseContext);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [status, setStatus] = React.useState(false);

  const ticketRef = firestore.doc(`tickets/${ticket.id}`);

  const onSubmit = event => {
    event.preventDefault();

    const newStatus = {};

    newStatus.status = status;

    // TODO updateStatus(ticket._id, newStatus);
    setModalOpen(false);
  };

  const modalContent = (
    <form onSubmit={onSubmit}>
      <p className="text-muted">Current Status: {ticket.status}</p>
      <SelectListGroup
        name="status"
        value={status}
        onChange={event => setStatus(event.target.value)}
        placeholderOption="Select Ticket Status"
        items={
          !ticket.leadsman
            ? [
                { label: 'Unassigned', value: 'Unassigned' },
                { label: 'Void', value: 'Void' }
              ]
            : statusOptions
        }
      />
      <button
        onClick={setModalOpen(false)}
        className="btn btn-secondary mt-4 mr-2"
      >
        Cancel
      </button>
      <input type="submit" className="btn btn-info mt-4 float-right" />
    </form>
  );

  return (
    <div>
      <button
        onClick={setModalOpen(true)}
        className={`btn btn-success btn-sm btn-block mb-2`}
        disabled={ticket.closed}
      >
        Update Status
      </button>
      <Modal
        isOpen={modalOpen}
        onRequestClose={setModalOpen(false)}
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
        contentLabel="Open Close Modal"
      >
        <div className="container">
          <p className="lead text-center">
            Use the form below to update the ticket status
            <br />
            <small className="text-muted">
              Ticket status can only be 'Unassigned' if there are no assigned
              technicians
            </small>
          </p>
          {modalContent}
        </div>
      </Modal>
    </div>
  );
};

export default StatusModal;
