// models/Members.js
const createAstraClient = require('../path_to_your_file');

class Members {
    static async findByUserId(userId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Members WHERE user_id = ?';
        const params = [userId];
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

    static async getProposals(userId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Member_Proposals WHERE user_id = ?';
        const params = [userId];
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
        const query = 'SELECT * FROM Member_VotedProposals WHERE user_id = ?';
        const params = [userId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}
module.exports = Members;
