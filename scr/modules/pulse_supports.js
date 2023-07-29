/*
CREATE TABLE IF NOT EXISTS Pulse_Support (
    pulse_id uuid,
    user_id uuid,
    PRIMARY KEY ((pulse_id), user_id)
);
*/
const DBClient = require('../utils/localDB.js');
const Pulse = require('./pulses.js')

class PulseSupport {
    static async create(community_id, user_id) {
        const pulse_id = Pulse.pulseIdByStatus(community_id, 1)
       const db = DBClient.getInstance();
        const query = 'INSERT INTO Pulse_Support (user_id, pulse_id) VALUES (?, ?)';
        const params = [user_id, pulse_id];
        await db.execute(query, params, { hints : ['uuid', 'uuid']});
    }

    static async delete(user_id, proposalId) {
       const db = DBClient.getInstance();
        const pulse_id = Pulse.pulseIdByStatus(community_id, 1)
        const query = 'DELETE FROM Pulse_Support WHERE user_id = ? AND pulse_id = ?';
        const params = [user_id, pulse_id];
        await db.execute(query, params);
    }

    static async findByPulseIdAndUserId(pulseId, userId) {
        if (!userId && !pulseId) {
            return null;
        }

       const db = DBClient.getInstance();
        let query = 'SELECT * FROM Pulse_Support WHERE';
        let params = [];
        let conditions = [];

        if (userId) {
            conditions.push('user_id = ?');
            params.push(userId);
        }
        if (proposalId) {
            conditions.push('pulse_id = ?');
            params.push(proposalId);
        }

        query += ' ' + conditions.join(' AND ');

        const result = await db.execute(query, params);
        return result.rows;
    }

    static async countPulseSupport(community_id) {
        if (!community_id) {
            return null;
        }
    
       const db = DBClient.getInstance();
        const pulse_id = Pulse.pulseIdByStatus(community_id, 1)
        const query = 'SELECT  COUNT(*) as count FROM Support WHERE pulse_id = ?';
        const params = [pulse_id];
    
        const result = await db.execute(query, params);

        return result.rows[0].count;
    }    
}

module.exports = PulseSupport;

