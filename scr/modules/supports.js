// models/Support.js
/*
CREATE TABLE IF NOT EXISTS Support (
    user_id uuid,
    proposal_id uuid,
    support int,
    PRIMARY KEY ((user_id), proposal_id)
);
*/
const DBClient = require('../utils/localDB.js');

class Support {
    static async create(user_id, proposal_id, support) {
       const db = DBClient.getInstance();
        // assuming `support` is an object with fields: user_id, proposal_id, support
        const query = 'INSERT INTO Support (user_id, proposal_id, support) VALUES (?, ?, ?)';
        const params = [user_id, proposal_id, support];
        await db.execute(query, params, { hints : ['uuid', 'uuid', 'int']});
    }

    static async delete(userId, proposalId) {
       const db = DBClient.getInstance();
        const query = 'DELETE FROM Support WHERE user_id = ? AND proposal_id = ?';
        const params = [userId, proposalId];
        await db.execute(query, params);
    }

    static async findByProposalIdAndUserId(proposalId, userId) {
        if (!userId && !proposalId) {
            return null;
        }

       const db = DBClient.getInstance();
        let query = 'SELECT * FROM Support WHERE';
        let params = [];
        let conditions = [];

        if (userId) {
            conditions.push('user_id = ?');
            params.push(userId);
        }
        if (proposalId) {
            conditions.push('proposal_id = ?');
            params.push(proposalId);
        }

        query += ' ' + conditions.join(' AND ');

        const result = await db.execute(query, params);
        return result.rows;
    }

    static async countSupport(proposalId) {
        if (!proposalId) {
            return null;
        }
    
       const db = DBClient.getInstance();
        const query = 'SELECT support, COUNT(*) as count FROM Support WHERE proposal_id = ? GROUP BY support';
        const params = [proposalId];
    
        const result = await db.execute(query, params);
    
        let counts = {};
        result.rows.forEach(row => {
            counts[row.support] = row.count;
        });
    
        return counts;
    }    
}

module.exports = Support;

