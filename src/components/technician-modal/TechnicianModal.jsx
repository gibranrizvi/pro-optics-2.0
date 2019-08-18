import React from 'react';
import Modal from 'react-modal';

import FirebaseContext from '../../firebase/context';

// Component imports
import Spinner from '../spinner/Spinner';
import SelectListGroup from '../select-list-group/SelectListGroup';

const TechnicianModal = ({ ticket }) => {
  const { firestore } = React.useContext(FirebaseContext);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [technicians, setTechnicians] = React.useState(null);
  const [leadsman, setLeadsman] = React.useState(null);
  const [assistant, setAssistant] = React.useState(null);

  const techniciansRef = firestore
    .collection('/users/')
    .where('role', '==', 'technician');

  React.useEffect(() => {
    getTechnicians();
  }, []);

  const getTechnicians = async () => {
    setLoading(true);

    const snapshot = await techniciansRef.get();
    const technicians = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setTechnicians(technicians);
    setLoading(false);
  };

  const getAvailableTechnicians = () => {
    return technicians.filter(technician => technician.id !== leadsman.id);
  };

  const onSubmit = event => {
    event.preventDefault();

    const assignedTechnicians = {};

    if (leadsman) {
      assignedTechnicians.leadsman = leadsman;
      const leadsman = technicians.find(
        technician => technician._id === leadsman
      );
      assignedTechnicians.leadsmanName = leadsman.name;
      assignedTechnicians.leadsmanHandle = leadsman.handle;
    }

    if (assistant) {
      assignedTechnicians.assistant = assistant;
      const assistant = technicians.find(
        technician => technician._id === assistant
      );
      assignedTechnicians.assistantName = assistant.name;
      assignedTechnicians.assistantHandle = assistant.handle;
    }

    // TODO assignTicket(ticket._id, assignedTechnicians);
    setLeadsman(null);
    setAssistant(null);
    setModalOpen(false);
  };

  let modalContent;

  if (!technicians || loading) {
    modalContent = <Spinner />;
  } else {
    modalContent = (
      <form onSubmit={onSubmit}>
        {ticket.leadsman && (
          <p className="text-muted">Current Leadsman: {ticket.leadsman.name}</p>
        )}
        <SelectListGroup
          name="leadsman"
          value={leadsman.name}
          onChange={event => setLeadsman(event.target.value)}
          placeholderOption="Select a Leadsman"
          items={technicians.map(technician => ({
            label: technician.name,
            value: technician.id
          }))}
        />
        {ticket.assistant && (
          <p className="text-muted">
            Current Assistant: {ticket.assistant.name}
          </p>
        )}
        <SelectListGroup
          name="assistant"
          value={assistant.name}
          onChange={event => setAssistant(event.target.value)}
          placeholderOption="Select an Assistant"
          items={getAvailableTechnicians().map(technician => ({
            label: technician.name,
            value: technician.id
          }))}
          disabled={!leadsman ? true : false}
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
  }

  return (
    <div>
      <button
        onClick={setModalOpen(true)}
        className="btn btn-warning btn-sm btn-block mb-2"
        disabled={ticket.closed}
      >
        Technicians
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
            Use the form below to assign or remove technicians
            <br />
            <small className="text-muted">
              Removing all technicians will change the ticket status to
              'Unassigned'
            </small>
          </p>
          {modalContent}
        </div>
      </Modal>
    </div>
  );
};

export default TechnicianModal;
