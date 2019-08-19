import React from 'react';

import TicketItem from '../ticket-item/TicketItem';

const TicketFeed = ({ tickets }) => {
  const content = tickets.map(ticket => (
    <TicketItem key={ticket._id} ticket={ticket} />
  ));

  return (
    <div className="tickets">
      <div className="container">
        <div className="row">
          <div className="col-md-12">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default TicketFeed;
