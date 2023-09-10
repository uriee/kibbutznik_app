/*
CREATE TABLE IF NOT EXISTS Pulse_Support (
    pulse_id uuid,
    user_id uuid,
    PRIMARY KEY ((pulse_id), user_id)
);
*/
const DBClient = require('../utils/localDB.js');
const Pulses = require('./pulses.js');
const Communities = require('./communities.js');

class PulseSupport {
    static async create(community_id, user_id) {
        console.log("Creating")
        const pulse_id = await Pulses.pulseIdByStatus(community_id, 0)
        console.log("pulse_id: " + pulse_id)
        const db = DBClient.getInstance();
        try {
            const query = `INSERT INTO Pulse_Support (pulse_id, user_id) VALUES (${pulse_id}, ${user_id})`;
            await db.execute(query);

            const counterQuery = `UPDATE pulse_counter SET pulse_support = pulse_support + 1 WHERE pulse_id = ${pulse_id}`;
            await db.execute(counterQuery);
            const is_time_4_pulse = await Pulses.time_4_pulse(pulse_id); // replace with Event-Driven Architecture (kafka)
            console.log(is_time_4_pulse);
            if (is_time_4_pulse) {
                await Communities.pulse(community_id)
            }

        } catch (err) {
            console.error("An error occurred:", err);
            return null
        }
        return pulse_id;
    }

    static async delete(community_id, user_id) {
       const db = DBClient.getInstance();
        const pulse_id  = await Pulses.pulseIdByStatus(community_id, 0)
        console.log("pulse_id: " + pulse_id)
        try {
            const query = `DELETE FROM Pulse_Support WHERE pulse_id = ${pulse_id} AND user_id = ${user_id}`;
            await db.execute(query);
            const counterQuery = `UPDATE pulse_counter SET pulse_support = pulse_support - 1 WHERE pulse_id = ${pulse_id}`;
            await db.execute(counterQuery);
        } catch (err) {
            console.error("An error occurred:", err);
            return null
        }
        return pulse_id;
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
            params.push(pulseId);
        }

        query += ' ' + conditions.join(' AND ');

        const result = await db.execute(query, params);
        return result.rows;
    }

    static async get_support(pulseId) {
        if (!pulseId) {
            return null;
        }
    
       const db = DBClient.getInstance();
        const query = `SELECT pulse_support FROM pulse_counter WHERE pulse_id = ${pulseId}`;
        console.log(query)
        const result = await db.execute(query);
        console.log(result.rows[0].pulse_support)
    
        return result.rows[0].pulse_support
    }    
}

module.exports = PulseSupport;

