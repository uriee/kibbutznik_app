// models/Pulses.js
const DBClient = require('../utils/localDB.js');
const uuid = require('uuid');

const PULSE_STATUS_LIFECYCLE = ['Next', 'Active', 'Done'];

class Pulses {
    static async findByCommunityId(communityId) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Pulses WHERE community_id = ?';
        const params = [communityId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async pulseIdByStatus(communityId, pulseStatus) {
       const db = DBClient.getInstance();
    
        // Fetch the community's active pulse
        const pulseQuery = `SELECT pulse_id FROM Pulses WHERE community_id = ${communityId} AND pulse_status = ${pulseStatus}`;
        console.log("pulseQuery", pulseQuery);
        const activePulse = await db.execute(pulseQuery);
    
        if (!activePulse.rows.length) {
            return null;  // Or some error message
        }
    
        const pulse_id = activePulse.rows[0].pulse_id;
        return pulse_id
    }

    static async create(communityId) {
        console.log("pulse", communityId);
        const db = DBClient.getInstance();
        const pulse_id = uuid.v4();
        const checkQuery = `SELECT * FROM Pulses WHERE community_id = ${communityId} AND pulse_status = 0`;
        console.log("checkQuery", checkQuery);
        const existingPulse = await db.execute(checkQuery);
        if (existingPulse.rows.length > 0) {
            throw new Error('A pulse with status 0 already exists in this community.');
        }

        const insertQuery = 'INSERT INTO Pulses (community_id, pulse_id, updated_at, pulse_status) VALUES (?, ?, totimestamp(now()), 0)';
        const params = [communityId, pulse_id];
        console.log("params", params);
        await db.execute(insertQuery, params, { hints : ['uuid', 'uuid', 'timestamp', 'text']});

        return pulse_id
    }

    static async IncrementStatus(pulse_id) {
       const db = DBClient.getInstance();
        // assuming pulse_status gets incremented by 1 and updated_at gets the current timestamp
        const query = 'UPDATE Pulses SET pulse_status = pulse_status + 1, updated_at = ? WHERE pulse_id = ?';
        const params = [new Date(), pulse_id];
        await db.execute(query, params);
    }
    
    static async findActive() {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Pulses WHERE pulse_status = ?';
        const params = [1];
        const result = await db.execute(query, params);
        return result.rows;
    }

}
module.exports = Pulses;
