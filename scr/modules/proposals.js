// models/Proposals.js
/*
CREATE TABLE IF NOT EXISTS Proposals (
    community_id uuid,
    proposal_id uuid,
    proposal_text text,
    proposal_status text,
    propsal_type
    proposal_support int,
    pulse_id uuid, 
    age int
    PRIMARY KEY ((community_id), proposal_id)
);
*/
import createLocalClient from '../utils/astraDB.js';
import { create as createMember, throwOut } from './members.js';
import { create as createStatement, removeStatement, replaceStatement } from './statements.js';
import { updateVariableValue } from './variables.js';
import { create as createAction, endAction, funding, pay } from './communities.js';

import createLocalClient from '../path_to_your_file';


const PROPOSAL_STATUS_ENUM = ['Draft', 'OutThere', 'Canceled', 'OnTheAir', 'Accepted', 'Rejected'];
const PROPOSAL_TYPE_ENUM = ['Membership', 'ThrowOut', 'AddStatement', 'RemoveStatement','replaceStatement', 'ChangeVariable',
                            'AddAction', 'EndAction', 'JoinAction', 'Funding', 'Payment', 'payBack', 'Dividend'];
const PROPOSAL_STATUS_LIFECYCLE = ['Draft', 'OutThere', 'OnTheAir', 'Accepted'];

class Proposals {

    
    static async create(proposal) {
        if (!PROPOSAL_STATUS_ENUM.includes(proposal.proposal_status)) {
            throw new Error(`Invalid proposal_status: ${proposal.proposal_status}`);
        }
        
        if (!PROPOSAL_TYPE_ENUM.includes(proposal.proposal_type)) {
            throw new Error(`Invalid proposal_type: ${proposal.proposal_type}`);
        }

        const astraClient = await createLocalClient();
        const query = 'INSERT INTO Proposals (community_id, proposal_id, proposal_text, proposal_status, proposal_type, proposal_support, age) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [proposal.community_id, proposal.proposal_id, proposal.proposal_text, proposal.proposal_status, proposal.proposal_type, proposal.proposal_support, 0];
        await astraClient.execute(query, params);
    }

    static async delete(proposalId) {
        const astraClient = await createLocalClient();
        const query = 'DELETE FROM Proposals WHERE proposal_id = ? and proposal_status = "Draft"';
        const params = [proposalId];
        await astraClient.execute(query, params);
    }

    static async findById(proposalId) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        const params = [proposalId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async find(communityId, proposalStatus = null, proposalType = null) {
      const astraClient = await createLocalClient();
  
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
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Proposals WHERE pulse_id = ?';
        const params = [pulseId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async findByType(proposalType) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Proposals WHERE proposal_type = ?';
        const params = [proposalType];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }


    static async UpdateStatus(proposalId, direction) {
        const astraClient = await createLocalClient();
        
    
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

    static async countVotes(proposalId) {
        if (!proposalId) {
            return null;
        }
    
        const astraClient = await createLocalClient();
        const query = 'SELECT vote, COUNT(*) as count FROM Votes WHERE proposal_id = ? GROUP BY vote';
        const params = [proposalId];
    
        const result = await astraClient.execute(query, params);
    
        let counts = {};
        result.rows.forEach(row => {
            counts[row.vote] = row.count;
        });
    
        return counts;
    }    


    static async countSupport(proposalId) {
        if (!proposalId) {
            return null;
        }
    
        const astraClient = await createLocalClient();
        const query = 'SELECT support, COUNT(*) as count FROM Support WHERE proposal_tpe = ? GROUP BY support';
        const params = [proposalId];
    
        const result = await astraClient.execute(query, params);
    
        let counts = {};
        result.rows.forEach(row => {
            counts[row.support] = row.count;
        });
    
        return counts;
    } 


    static async executeProposal(proposal_id) {
        const astraClient = await createLocalClient();

        // Fetch the proposal
        const query = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        const params = [proposal_id];
        const result = await astraClient.execute(query, params);
        const proposal = result.rows[0];

        switch(proposal.type) {
            case 'Membership':
                return await createMemeber(proposal.community_id, proposal.val_uuid);
            case 'ThrowOut':
                return await throwOut(proposal.community_id, proposal.val_uuid);
            case 'AddStatement':
                return await createStatement(proposal.community_id,proposal.val_text);
            case 'RemoveStatement':
                return await removeStatement(proposal.community_id, proposal.val_uuid);
            case 'ReplaceStatement':
                return await replaceStatement(proposal.community_id, proposal.val_uuid, proposal.val_text);
            case 'ChangeVariable':
                return await updateVariableValue(proposal.community_id, proposal.val_uuid, proposal.val_text);
            case 'AddAction':
                return await createAction(proposal.val_text, proposal.community_id);
            case 'EndAction':
                return await endAction(proposal.community_id);
            case 'JoinAction':
                return await createMember(proposal.val_uuid, proposal.val_text);
            case 'Funding':
                return await funding(proposal.community_id, proposal.val_uuid, proposal.val_text);
            case 'Payment':
                return await pay(proposal.community_id, proposal.val_text);
            default:
                throw new Error("Invalid proposal type");
        }
    }

}

export default Proposals;
