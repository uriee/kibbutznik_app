// models/Vote.js
/*
CREATE TABLE IF NOT EXISTS Votes (
    user_id uuid,
    community_id uuid,
    proposal_id uuid,
    vote int,
    PRIMARY KEY ((user_id), proposal_id)
);
*/
const DBClient = require('../utils/localDB.js');

class Vote {
    static async create(user_id,proposal_id,) {
        const db = DBClient.getInstance();

        const queries = [
            {
              query: 'INSERT INTO uservotes(user_id, proposal_id) VALUES (?, ?)',
              params: [user_id, proposal_id]
            },
            {
              query: 'update proposal_counters set proposal_vote = proposal_vote + 1 where proposal_id = ?;',
              params: [proposal_id]
            }
          ];
          
        ret = await db.batch(queries, { prepare: true })
        .then(result => console.log('Vote Insert Batch executed successfully', result))
        .catch(err => console.error('Error executing Vote Insert Batch', err));
        return ret;
    }

    static async delete(user_id,proposal_id,) {
        const db = DBClient.getInstance();

        const queries = [
            {
              query: 'DELETE FROM uservotes where user_id = ? and proposal_id = ?',
              params: [user_id, proposal_id]
            },
            {
              query: 'update proposal_counters set proposal_vote = proposal_vote - 1 where proposal_id = ?;',
              params: [proposal_id]
            }
          ];
          
        ret = await db.batch(queries, { prepare: true })
        .then(result => console.log('Vote Delete Batch executed successfully', result))
        .catch(err => console.error('Error executing Vote Delete Batch', err));
        return ret
    }

    static async delete(proposalId) {
       const db = DBClient.getInstance();
        const query = 'DELETE FROM Votes WHERE AND proposal_id = ?';
        const params = [proposalId];
        await db.execute(query, params);
    }

    static async getVotes(userId, communityId, proposalId) {
        if (!userId && !communityId && !proposalId) {
            return null;
        }

       const db = DBClient.getInstance();
        let query = 'SELECT * FROM Votes WHERE';
        let params = [];
        let conditions = [];

        if (userId) {
            conditions.push('user_id = ?');
            params.push(userId);
        }
        if (communityId) {
            conditions.push('community_id = ?');
            params.push(communityId);
        }
        if (proposalId) {
            conditions.push('proposal_id = ?');
            params.push(proposalId);
        }

        query += ' ' + conditions.join(' AND ');

        const result = await db.execute(query, params);
        return result.rows;
    }
    
}

module.exports = Vote;
