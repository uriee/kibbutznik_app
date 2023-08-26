// models/Proposals.js
const uuid = require('uuid');
const DBClient = require('../utils/localDB.js');
const { create: createMember, throwOut } = require('./members.js');
const { create: createStatement, removeStatement, replaceStatement } = require('./statements.js');
const { updateVariableValue } = require('./variables.js');
const { create: createAction, endAction} = require('./actions.js');


const PROPOSAL_STATUS_ENUM = ['Draft', 'OutThere', 'Canceled', 'OnTheAir', 'Accepted', 'Rejected'];
const PROPOSAL_TYPE_ENUM = ['Membership', 'ThrowOut', 'AddStatement', 'RemoveStatement','ReplaceStatement', 'ChangeVariable',
                            'AddAction', 'EndAction', 'JoinAction', 'Funding', 'Payment', 'payBack', 'Dividend'];
const PROPOSAL_STATUS_LIFECYCLE = ['Draft', 'OutThere', 'OnTheAir', 'Accepted'];

class Proposals {

    static async create(community_id, user_id, proposal_type, proposal_text, val_uuid, val_text) {
        if (!PROPOSAL_STATUS_ENUM.includes(proposal_type=='Membership' ? 'OutThere' : 'Draft')) {
            throw new Error(`Invalid proposal_status: ${proposal_status}`);
        }
        console.log("community_id, user_id, proposal_type, proposal_text, val_uuid, val_text\n",community_id, user_id, proposal_type, proposal_text, val_uuid, val_text)
        if (!PROPOSAL_TYPE_ENUM.includes(proposal_type)) {
            throw new Error(`Invalid proposal_type: ${proposal_type}`);
        }
    
        const proposal_status = proposal_type == 'Membership' ? 'OutThere' : 'Draft';
        const proposal_id = uuid.v4();
        const db = DBClient.getInstance();
    
        let queryColumns = 'INSERT INTO Proposals (community_id, user_id, proposal_id, proposal_text, proposal_status, proposal_type, age, created_at, updated_at';
        let queryValues = 'VALUES (?, ?, ?, ?, ?, ?, ?, totimestamp(now()), totimestamp(now())';
        let params = [community_id, user_id, proposal_id, proposal_text, proposal_status, proposal_type, 0];
        let hints = ['uuid', 'uuid', 'uuid', 'text', 'text', 'text', 'int'];
        
        if (val_uuid) {
            queryColumns += ', val_uuid';
            queryValues += ', ?';
            params.push(val_uuid);
            hints.push('uuid')
        }
    
        if (val_text) {
            queryColumns += ', val_text';
            queryValues += ', ?';
            params.push(val_text);
            hints.push('text')
        }
        
        const query = queryColumns + ') ' + queryValues + ')';
        console.log("Query",query)
        console.log("PPPP",params)
        console.log("HHHH",hints)
        const ret = await db.execute(query, params, { hints : hints });
        console.log("create proposal", ret);
        return proposal_id;
    }
    

    static async delete(proposalId) {
        const db = DBClient.getInstance();
        const query = 'DELETE FROM Proposals WHERE proposal_id = ? and proposal_status = "Draft"';
        const params = [proposalId];
        await db.execute(query, params);
    }

    static async findById(proposalId) {
        const db = DBClient.getInstance();
        console.log("bhdshhjwdhjhj",proposalId)
        const query = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        const params = [proposalId];
        console.log("param",query, params)
        const result = await db.execute(query, params);
        console.log("res",result)
        return result.rows[0];
    }

    static async find(communityId, proposalStatus=null, proposalType=null) {
        console.log("pp",communityId, proposalStatus, proposalType)
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

    static async findByStatus(community_id, proposal_status) {
        console.log("_+_+_+_+",proposal_status)
        if (!PROPOSAL_STATUS_ENUM.includes(proposal_status)) {
            throw new Error(`Invalid proposal_status: ${proposal_status}`);
        }
        console.log("_+_+_+_+",2)
        const db = DBClient.getInstance();
        const query = "SELECT * FROM Proposals WHERE community_id = ? and proposal_status = '?' ALLOW FILTERING";
        const params = [community_id, proposal_status];
        console.log("poipoi", query, params)
        const result = await db.execute(query, params);
        return result.rows;
    }


    static async UpdateStatus(proposalId, direction) {
        const db = DBClient.getInstance();
        console.log("pp",proposalId, this.findById)
        const proposal = await this.findById(proposalId);
        console.log("proposal", proposal)
        if (!proposal) {
            throw new Error(`Proposal with id ${proposalId} not found`);
        }
        console.log("proposal", proposal)
        const currentIndex = PROPOSAL_STATUS_LIFECYCLE.indexOf(proposal.proposal_status);

        if (currentIndex === -1 || currentIndex === PROPOSAL_STATUS_LIFECYCLE.length - 1) {
            throw new Error(`Cannot update proposal with status ${proposal.proposal_status}`);
        }
        console.log("p2",proposal.proposal_status, currentIndex)
        let newStatus;
        if (direction) {
            newStatus = PROPOSAL_STATUS_LIFECYCLE[currentIndex + 1];
        } else {
            newStatus = currentIndex === 2 ? 'Rejected' : 'Canceled';
        }
        console.log("p3",newStatus)
        const query = 'UPDATE Proposals SET proposal_status = ? WHERE proposal_id = ? and community_id = ?';
        const params = [newStatus, proposalId, proposal.community_id];
        await db.execute(query, params);
    }


    static async executeProposal(proposal_id) {
       const db = DBClient.getInstance();
        console.log("zxc", proposal_id)
        // Fetch the proposal
        let query = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        let params = [proposal_id];
        let result = await db.execute(query, params);
        const proposal = result.rows[0];
        let ret = null;
        console.log("zxc", proposal)
        switch(proposal.proposal_type) {
            case 'Membership':
                return await createMember(proposal.community_id, proposal.user_id);
            case 'ThrowOut':
                return await throwOut(proposal.community_id, proposal.val_uuid);
            case 'AddStatement':
                ret = await createStatement(proposal.community_id,proposal.proposal_text);
                if (ret){
                    query = `UPDATE Proposals SET val_uuid = ${ret} WHERE proposal_id = ${proposal_id}`;
                    return await db.execute(query);
                }
                return null;
            case 'RemoveStatement':
                return await removeStatement(proposal.community_id, proposal.val_uuid);
            case 'ReplaceStatement':
                console.log("ppppp321321",proposal)
                return await replaceStatement(proposal.community_id, proposal.val_uuid, proposal.val_text);
            case 'ChangeVariable':
                return await updateVariableValue(proposal.community_id, proposal.proposal_text, proposal.val_text);
            case 'AddAction':
                console.log("\nxxxxxxx\n",createAction)
                ret =  await createAction(proposal.community_id, proposal.val_text);
                if (ret){
                    query = `UPDATE Proposals SET val_uuid = ${ret} WHERE community_id = ${proposal.community_id} and proposal_id = ${proposal_id}`;
                    console.log(ret, query)
                    return await db.execute(query);
                }
                return null;
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
