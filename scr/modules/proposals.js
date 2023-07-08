// models/Proposals.js
const createAstraClient = require('../path_to_your_file');

class Proposals {
    static async create(proposal) {
        const astraClient = await createAstraClient();
        const query = 'INSERT INTO Proposals (community_id, proposal_id, proposal_text, proposal_status, proposal_type, proposal_support) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [proposal.community_id, proposal.proposal_id, proposal.proposal_text, proposal.proposal_status, proposal.proposal_type, proposal.proposal_support];
        await astraClient.execute(query, params);
    }

    static async delete(proposalId) {
        const astraClient = await createAstraClient();
        const query = 'DELETE FROM Proposals WHERE proposal_id = ?';
        const params = [proposalId];
        await astraClient.execute(query, params);
    }

    static async findById(proposalId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        const params = [proposalId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async find(communityId, proposalStatus = null, proposalType = null) {
      const astraClient = await createAstraClient();
  
      let query = 'SELECT * FROM Proposals WHERE community_id = ?';
      let params = [communityId];
  
      if (proposalStatus) {
          query += ' AND proposal_status = ?';
          params.push(proposalStatus);
      }
  
      if (proposalType) {
          query += ' AND proposal_type = ?';
          params.push(proposalType);
      }
  
      const result = await astraClient.execute(query, params);
      return result.rows;
  }

  static async findProposalsByPulse(pulseId) {
    const astraClient = await createAstraClient();
    const query = 'SELECT * FROM Proposals WHERE pulse_id = ?';
    const params = [pulseId];
    const result = await astraClient.execute(query, params);
    return result.rows;
}

    static async findByType(proposalType) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Proposals WHERE proposal_type = ?';
        const params = [proposalType];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}

module.exports = Proposals;
