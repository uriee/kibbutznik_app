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
  static async create(user_id, proposal_id) {
    const db = DBClient.getInstance();
    const checkQuery = 'SELECT * FROM votes WHERE user_id = ? AND proposal_id = ?';
    const checkParams = [user_id, proposal_id];
    const checkResult = await db.execute(checkQuery, checkParams);
    
    if (checkResult.rows.length > 0) {
        throw new Error('Vote row already exists.');
    }
    const supportQuery = `INSERT INTO Votes(user_id, proposal_id) VALUES (${user_id}, ${proposal_id})`;
    try {
        await db.execute(supportQuery);
    } catch (err) {
        console.error('Error executing Support Insert:', err);
        return null;
    }

    const counterQuery = `UPDATE proposal_counters SET proposal_vote = proposal_vote + 1 WHERE proposal_id = ${proposal_id}`;
    try {
        await db.execute(counterQuery);
    } catch (err) {
        console.error('Error executing Vote Update:', err);
        return null;
    }
  }


  static async delete(user_id, proposal_id) {
    const db = DBClient.getInstance();

    const checkQuery = 'SELECT * FROM Votes WHERE user_id = ? AND proposal_id = ?';
    const checkParams = [user_id, proposal_id];
    const checkResult = await db.execute(checkQuery, checkParams);
    
    if (checkResult.rows.length <= 0) {
        throw new Error('Vote row do not exists.');
    }

    const voteQuery = `DELETE FROM Votes where user_id = ${user_id} and proposal_id = ${proposal_id}`;
    try {
        await db.execute(voteQuery);
    } catch (err) {
        console.error('Error executing Vote Delete:', err);
        return null;
    }

    const counterQuery = `UPDATE proposal_counters SET proposal_vote = proposal_vote - 1 WHERE proposal_id = ${proposal_id}`;
    try {
        await db.execute(counterQuery);
    } catch (err) {
        console.error('Error executing Counter Update:', err);
        return null;
    }
  }

  static async find(userId, proposalId) {
    if (!userId && !proposalId) {
        return null;
    }

   const db = DBClient.getInstance();
    let query = 'SELECT * FROM Votes WHERE';
    let params = [];
    let conditions = [];

    if (userId) {
        conditions.push(`user_id = ${userId}`);
    }
    if (proposalId) {
        conditions.push(`proposal_id = ${proposalId}`);
    }

    query += ' ' + conditions.join(' AND ');
    console.log(query)
    const result = await db.execute(query);
    return result.rows;
}

static async get_count(proposalId) {
    if (!proposalId) {
        return null;
    }

   const db = DBClient.getInstance();
    const query = `SELECT proposal_vote FROM proposal_counters WHERE proposal_id = ${proposalId}`;
    console.log(query)
    const result = await db.execute(query);
    return result.rows[0].proposal_vote
} 
    
}

module.exports = Vote;
