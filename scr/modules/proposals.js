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
const DBClient = require('../utils/localDB.js');
const { create: createMember, throwOut } = require('./members.js');
const { create: createStatement, removeStatement, replaceStatement } = require('./statements.js');
const { updateVariableValue } = require('./variables.js');
const { create: createAction, endAction} = require('./communities.js');


const PROPOSAL_STATUS_ENUM = ['Draft', 'OutThere', 'Canceled', 'OnTheAir', 'Accepted', 'Rejected'];
const PROPOSAL_TYPE_ENUM = ['Membership', 'ThrowOut', 'AddStatement', 'RemoveStatement','replaceStatement', 'ChangeVariable',
                            'AddAction', 'EndAction', 'JoinAction', 'Funding', 'Payment', 'payBack', 'Dividend'];
const PROPOSAL_STATUS_LIFECYCLE = ['Draft', 'OutThere', 'OnTheAir', 'Accepted'];

class Proposals {

    static async create(community_id, proposal_type, proposal_text, val_uuid, val_text) {
        if (!PROPOSAL_STATUS_ENUM.includes(proposal_type=='Membership' ? 'OutThere' : 'Draft')) {
            throw new Error(`Invalid proposal_status: ${proposal_status}`);
        }
    
        if (!PROPOSAL_TYPE_ENUM.includes(proposal_type)) {
            throw new Error(`Invalid proposal_type: ${proposal_type}`);
        }
    
        const proposal_status = proposal_type == 'Membership' ? 'OutThere' : 'Draft';
        const proposal_id = uuid.v4();
        const db = DBClient.getInstance();
    
        let queryColumns = 'INSERT INTO Proposals (community_id, proposal_id, proposal_text, proposal_status, proposal_type, proposal_support, age, created_at, updated_at';
        let queryValues = 'VALUES (?, ?, ?, ?, ?, ?, ?';
        let params = [community_id, proposal_id, proposal_text, proposal_status, proposal_type, 0, 0, currentTime, currentTime];
    
        if (val_uuid) {
            queryColumns += ', val_uuid';
            queryValues += ', ?';
            params.push(val_uuid);
        }
    
        if (val_text) {
            queryColumns += ', val_text';
            queryValues += ', ?';
            params.push(val_text);
        }
    
        const query = queryColumns + ') ' + queryValues + ')';
        const hints = ['uuid', 'uuid', 'text', 'text', 'text', 'int', 'int'];
    
        const ret = await db.execute(query, params, { hints });
        console.log("create proposal", ret);
        return ret;
    }
    

    static async delete(proposalId) {
        const db = DBClient.getInstance();
        const query = 'DELETE FROM Proposals WHERE proposal_id = ? and proposal_status = "Draft"';
        const params = [proposalId];
        await db.execute(query, params);
    }

    static async findById(proposalId) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        const params = [proposalId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async find(communityId, proposalStatus = null, proposalType = null) {
     const db = DBClient.getInstance();
  
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
  
      const result = await db.execute(query, params);
      return result.rows;
  }

    static async findProposalsByPulse(pulseId) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Proposals WHERE pulse_id = ?';
        const params = [pulseId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async findByType(proposalType) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Proposals WHERE proposal_type = ?';
        const params = [proposalType];
        const result = await db.execute(query, params);
        return result.rows;
    }


    static async UpdateStatus(proposalId, direction) {
       const db = DBClient.getInstance();
        
    
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
        await db.execute(query, params);
    }

    static async countVotes(proposalId) {
        if (!proposalId) {
            return null;
        }
    
       const db = DBClient.getInstance();
        const query = 'SELECT vote, COUNT(*) as count FROM Votes WHERE proposal_id = ? GROUP BY vote';
        const params = [proposalId];
    
        const result = await db.execute(query, params);
    
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
    
       const db = DBClient.getInstance();
        const query = 'SELECT support, COUNT(*) as count FROM Support WHERE proposal_tpe = ? GROUP BY support';
        const params = [proposalId];
    
        const result = await db.execute(query, params);
    
        let counts = {};
        result.rows.forEach(row => {
            counts[row.support] = row.count;
        });
    
        return counts;
    } 


    static async executeProposal(proposal_id) {
       const db = DBClient.getInstance();

        // Fetch the proposal
        const query = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        const params = [proposal_id];
        const result = await db.execute(query, params);
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
                /*
            case 'Funding':
                return await funding(proposal.community_id, proposal.val_uuid, proposal.val_text);
            case 'Payment':
                return await pay(proposal.community_id, proposal.val_text);
                */
            default:
                throw new Error("Invalid proposal type");
        }
    }

}

module.exports = Proposals;
