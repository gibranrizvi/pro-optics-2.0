import React from 'react';
import { firestore } from '../firebase/firebase';

const useTickets = () => {
  const [tickets, setTickets] = React.useState(null);

  const ticketsRef = firestore.collection('/tickets/');

  React.useEffect(() => {
    const unsubscribe = getTickets();
    return () => unsubscribe();
  }, []);

  const getTickets = () => {
    return ticketsRef.orderBy('created', 'desc').onSnapshot(handleSnapshot);
  };

  const handleSnapshot = snapshot => {
    const tickets = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });

    setTickets(tickets);
  };

  return tickets;
};

export default useTickets;
