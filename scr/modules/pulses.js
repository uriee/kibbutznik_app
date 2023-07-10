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
        // assuming `pulse` is an object with fields: community_id, pulse_id, pulse_timestamp
        const query = 'INSERT INTO Pulses (community_id, pulse_id, pulse_timestamp, pulse_status) VALUES (?, ?, ?)';
        const params = [pulse.community_id, pulse.pulse_id, pulse.pulse_timestamp, 'Next'];
        await astraClient.execute(query, params);
    }

    static async findActive() {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Pulses WHERE pulse_status = ?';
        const params = ['Active'];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async IncrementStatus(pulse) {
        const astraClient = await createAstraClient();

        const currentIndex = PULSE_STATUS_LIFECYCLE.indexOf(pulse.pulse_status);
        if (currentIndex === -1 || currentIndex === PULSE_STATUS_LIFECYCLE.length - 1) {
            throw new Error(`Cannot increment status for pulse with status ${pulse.pulse_status}`);
        }

        const newStatus = PULSE_STATUS_LIFECYCLE[currentIndex + 1];
        const query = 'UPDATE Pulses SET pulse_status = ? WHERE pulse_id = ?';
        const params = [newStatus, pulse.pulse_id];
        await astraClient.execute(query, params);
    }

    /*
    When Pulse in run:
    */
}
module.exports = Pulses;
