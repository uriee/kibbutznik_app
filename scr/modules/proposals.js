const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ 
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'kibbutznik'
});

const Proposals = {};

// Method to get proposal by id
Proposals.findById = function(id) {
  const query = 'SELECT * FROM proposals WHERE proposal_id = ?';
  return client.execute(query, [ id ], { prepare: true });
}

// Method to get all proposals
Proposals.findAll = function() {
  const query = 'SELECT * FROM proposals';
  return client.execute(query, [], { prepare: true });
}

// Method to create a new proposal
Proposals.create = function(proposal) {
  const query = 'INSERT INTO proposals (proposal_id, community_id, creator_id, title, description, status, support, end_time, creation_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  return client.execute(query, [ proposal.proposal_id, proposal.community_id, proposal.creator_id, proposal.title, proposal.description, proposal.status, proposal.support, proposal.end_time, proposal.creation_time ], { prepare: true });
}

// Method to update a proposal's status
Proposals.updateStatus = function(proposal_id, status) {
  const query = 'UPDATE proposals SET status = ? WHERE proposal_id = ?';
  return client.execute(query, [ status, proposal_id ], { prepare: true });
}

// Method to delete a proposal
Proposals.delete = function(proposal_id) {
  const query = 'DELETE FROM proposals WHERE proposal_id = ?';
  return client.execute(query, [ proposal_id ], { prepare: true });
}

module.exports = Proposals;
