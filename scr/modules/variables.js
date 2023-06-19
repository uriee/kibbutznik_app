// models/Variables.js
const createAstraClient = require('../path_to_your_file');

class Variables {
    static async findByCommunityId(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Community_Variables WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(variable) {
        const astraClient = await createAstraClient();
        // assuming `variable` is an object with fields: community_id, variable_id, variable_name, variable_value
        const query = 'INSERT INTO Community_Variables (community_id, variable_id, variable_name, variable_value) VALUES (?, ?, ?, ?)';
        const params = [variable.community_id, variable.variable_id, variable.variable_name, variable.variable_value];
        await astraClient.execute(query, params);
    }
}
module.exports = Variables;
