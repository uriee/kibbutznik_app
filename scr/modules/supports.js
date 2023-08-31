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
        let ret = null
        const checkQuery = 'SELECT * FROM Support WHERE user_id = ? AND proposal_id = ?';
        const checkParams = [user_id, proposal_id];
        const checkResult = await db.execute(checkQuery, checkParams);
        
        if (checkResult.rows.length > 0) {
            throw new Error('Support row already exists.');
        }
        
        const supportQuery = `INSERT INTO Support (user_id, proposal_id, support) VALUES (${user_id}, ${proposal_id}, ${support})`;
        try {
            ret = await db.execute(supportQuery);
        } catch (err) {
            console.error('Error executing Support Insert:', err);
            return null;
        }

        const counterQuery = `UPDATE proposal_counters SET proposal_support = proposal_support + 1 WHERE proposal_id = ${proposal_id}`;
        try {
            await db.execute(counterQuery);
        } catch (err) {
            console.error('Error executing Counter Update:', err);
            return null;
        }
    }    

    static async delete(user_id, proposal_id) {
        const db = DBClient.getInstance();
    
        const checkQuery = 'SELECT * FROM Support WHERE user_id = ? AND proposal_id = ?';
        const checkParams = [user_id, proposal_id];
        const checkResult = await db.execute(checkQuery, checkParams);
        
        if (checkResult.rows.length <= 0) {
            throw new Error('Support row do not exists.');
        }

        const supportQuery = `DELETE FROM Support where user_id = ${user_id} and proposal_id = ${proposal_id}`;
        try {
            await db.execute(supportQuery);
        } catch (err) {
            console.error('Error executing Support Delete:', err);
            return null;
        }
        const counterQuery = `UPDATE proposal_counters SET proposal_support = proposal_support - 1 WHERE proposal_id = ${proposal_id}`;
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
        let query = 'SELECT * FROM Support WHERE';
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
        const query = `SELECT proposal_support FROM proposal_counters WHERE proposal_id = ${proposalId}`;
        console.log(query)
        const result = await db.execute(query);
        console.log(result.rows[0].proposal_support)
    
        return result.rows[0].proposal_support
    }    
}

module.exports = Support;

