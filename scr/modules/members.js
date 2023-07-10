// models/Members.js
const createAstraClient = require('../path_to_your_file');

class Members {
    static async find(userId, community_id) {
        const astraClient = await createAstraClient();
        let query, params;

        if(community_id) {
            query = 'SELECT * FROM Members WHERE user_id = ? AND community_id = ?';
            params = [userId, community_id];
        } else {
            query = 'SELECT * FROM Members WHERE user_id = ?';
            params = [userId];
        }
        
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
    static async create(member) {
        const astraClient = await createAstraClient();
        // assuming `member` is an object with fields: community_id, user_id, seniority
        const query = 'INSERT INTO Members (community_id, user_id, seniority) VALUES (?, ?, ?)';
        const params = [member.community_id, member.user_id, member.seniority];
        await astraClient.execute(query, params);
    }

    /*  all proposals have a link to memebrs table through the member_id field.
        only in the memrship proposals this fields contains he user_id instead */
    static async getMembershipProposals(userId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Proposals WHERE member_id = ?';
        const params = [userId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getProposals(memberId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Proposals WHERE member_id = ?';
        const params = [memberId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getSupportedProposals(userId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Member_Support WHERE user_id = ?';
        const params = [userId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getVotedProposals(userId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Votes WHERE user_id = ?';
        const params = [userId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async seniorityGTE(community_id, seniority) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Members WHERE community_id = ? AND seniority >= ?';
        const params = [community_id, seniority];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async seniorityLTE(community_id, seniority) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Members WHERE community_id = ? AND seniority <= ?';
        const params = [community_id, seniority];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}
module.exports = Members;
