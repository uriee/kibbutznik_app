// models/Supports.js
const createAstraClient = require('../path_to_your_file');

class Supports {
    static async findByUserId(userId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Support_Records WHERE user_id = ?';
        const params = [userId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(support) {
        const astraClient = await createAstraClient();
        // assuming `support` is an object with fields: user_id, proposal_id, support
        const query = 'INSERT INTO Support_Records (user_id, proposal_id, support) VALUES (?, ?, ?)';
        const params = [support.user_id, support.proposal_id, support.support];
        await astraClient.execute(query, params);
    }
}
module.exports = Supports;
