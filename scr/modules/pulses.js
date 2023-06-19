// models/Pulses.js
const createAstraClient = require('../path_to_your_file');

class Pulses {
    static async findByCommunityId(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Community_Pulses WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(pulse) {
        const astraClient = await createAstraClient();
        // assuming `pulse` is an object with fields: community_id, pulse_id, pulse_timestamp
        const query = 'INSERT INTO Community_Pulses (community_id, pulse_id, pulse_timestamp) VALUES (?, ?, ?)';
        const params = [pulse.community_id, pulse.pulse_id, pulse.pulse_timestamp];
        await astraClient.execute(query, params);
    }
}
module.exports = Pulses;
