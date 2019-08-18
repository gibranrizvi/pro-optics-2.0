import React from 'react';
import Modal from 'react-modal';

const OpenCloseModal = ({ ticket }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const onConfirmClick = (closed, id) => {
    if (!closed) {
      // TODO close ticket
    } else {
      // TODO open ticket
    }
    setModalOpen(false);
  };

  const modalActions = (
    <div>
      <button
        onClick={setModalOpen(false)}
        className="btn btn-secondary mt-4 mr-2"
      >
        Cancel
      </button>
      <button
        onClick={() => onConfirmClick(ticket.closed, ticket._id)}
        className="btn btn-info mt-4 float-right"
      >
        Confirm
      </button>
    </div>
  );

  return (
    <div>
      <button
        onClick={setModalOpen(true)}
        className="btn btn-danger btn-sm btn-block mb-2"
        disabled={
          ticket.status === 'Void' ||
          ticket.status === 'Complete' ||
          ticket.status === 'Complete to activate at a later date' ||
          ticket.status === 'Return to Intelvision'
            ? false
            : true
        }
      >
        {!ticket.closed ? 'Close Ticket' : 'Open Ticket'}
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
            Are you sure you wish to {!ticket.closed ? 'close' : 're-open'} this
            ticket?
            <br />
            {!ticket.closed ? (
              <small>Re-opening the ticket will allow you to modify it</small>
            ) : (
              <small>
                You will not be able to modify the ticket after it has been
                closed
              </small>
            )}
          </p>
          {modalActions}
        </div>
      </Modal>
    </div>
  );
};

export default OpenCloseModal;
