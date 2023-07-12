// models/Proposals.js
/*
CREATE TABLE IF NOT EXISTS Proposals (
    community_id uuid,
    proposal_id uuid,
    proposal_text text,
    proposal_status text,
    propsal_type
    proposal_support int,
    pulse_id uuid
    PRIMARY KEY ((community_id), proposal_id)
);
*/
const createAstraClient = require('../path_to_your_file');


const PROPOSAL_STATUS_ENUM = ['Draft', 'OutThere', 'Assigned', 'Canceled', 'OnTheAir', 'Accepted', 'Rejected'];
const PROPOSAL_TYPE_ENUM = ['Membership', 'ThrowOut', 'AddStatement', 'RemoveStatement', 'replaceStatement', 'ChangeVariable', 'AddAction', 'EndAction', 'JoinAction', 'Funding'];
const PROPOSAL_STATUS_LIFECYCLE = ['Draft', 'OutThere', 'Assigned', 'Accepted'];

class Proposals {

    
    static async create(proposal) {
        if (!PROPOSAL_STATUS_ENUM.includes(proposal.proposal_status)) {
            throw new Error(`Invalid proposal_status: ${proposal.proposal_status}`);
        }
        
        if (!PROPOSAL_TYPE_ENUM.includes(proposal.proposal_type)) {
            throw new Error(`Invalid proposal_type: ${proposal.proposal_type}`);
        }

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


    static async UpdateStatus(proposalId, direction) {
        const astraClient = await createAstraClient();
        
    
        const proposal = await this.findById(proposalId);
        if (!proposal || proposal.length === 0) {
            throw new Error(`Proposal with id ${proposalId} not found`);
        }

        const currentIndex = PROPOSAL_STATUS_LIFECYCLE.indexOf(proposal[0].proposal_status);

        if (currentIndex === -1 || currentIndex === PROPOSAL_STATUS_LIFECYCLE.length - 1) {
            throw new Error(`Cannot update proposal with status ${proposal[0].proposal_status}`);
        }

        let newStatus;
        if (direction) {
            newStatus = PROPOSAL_STATUS_LIFECYCLE[currentIndex + 1];
        } else {
            newStatus = currentIndex === 2 ? 'Rejected' : 'Canceled';
        }

        const query = 'UPDATE Proposals SET proposal_status = ? WHERE proposal_id = ?';
        const params = [newStatus, proposalId];
        await astraClient.execute(query, params);
    }

    static async AssignedToPulse(proposalId) {
        const astraClient = await createAstraClient();

        const proposal = await this.findById(proposalId);
        if (!proposal || proposal.length === 0) {
            throw new Error(`Proposal with id ${proposalId} not found`);
        }


        const activePulse = await Pulses.findActive();  
        if (!activePulse || activePulse.length === 0) {
            throw new Error(`No active pulse found`);
        }

        const query = 'UPDATE Proposals SET pulse_id = ? WHERE proposal_id = ?';
        const params = [activePulse[0].pulse_id, proposalId];
        await astraClient.execute(query, params);

        await this.UpdateStatus(proposalId, true);
    }

}

module.exports = Proposals;
