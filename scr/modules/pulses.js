// models/Pulses.js
const createAstraClient = require('../path_to_your_file');

const PULSE_STATUS_LIFECYCLE = ['Next', 'Active', 'Done'];

class Pulses {
    static async findByCommunityId(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Pulses WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async findByCommunityIdAndStatus(communityId, pulseStatus = null) {
        const astraClient = await createAstraClient();
    
        let query = 'SELECT * FROM Pulses WHERE community_id = ?';
        let params = [communityId];
    
        if (pulseStatus) {
            query += ' AND pulse_status = ?';
            params.push(pulseStatus);
        }
    
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(pulse) {
        const astraClient = await createAstraClient();
        // assuming `pulse` is an object with fields: community_id, pulse_id
        const query = 'INSERT INTO Pulses (community_id, pulse_id, updated_at, pulse_status) VALUES (?, ?, ?, ?)';
        const params = [pulse.community_id, pulse.pulse_id, new Date(), 0];
        await astraClient.execute(query, params);
    }

    static async IncrementStatus(pulse_id) {
        const astraClient = await createAstraClient();
        // assuming pulse_status gets incremented by 1 and updated_at gets the current timestamp
        const query = 'UPDATE Pulses SET pulse_status = pulse_status + 1, updated_at = ? WHERE pulse_id = ?';
        const params = [new Date(), pulse_id];
        await astraClient.execute(query, params);
    }
    static async findActive() {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Pulses WHERE pulse_status = ?';
        const params = [1];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    /*
    When Pulse in run:
    */
}
module.exports = Pulses;
