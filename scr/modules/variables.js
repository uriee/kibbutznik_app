// models/Variables.js
const createAstraClient = require('../path_to_your_file');

class Variables {
    static async create(variable) {
        const astraClient = await createAstraClient();
        // assuming `variable` is an object with fields: community_id, variable_id, variable_name, variable_value
        const query = 'INSERT INTO Variables (community_id, variable_id, variable_name, variable_value, variable_desc,) VALUES (?, ?, ?, ?)';
        const params = [variable.community_id, variable.variable_id, variable.variable_name, variable.variable_value, variable.variable_desc];
        await astraClient.execute(query, params);
    }

    static async updateById(proposalId, variableId, newValue) {
        const astraClient = await createAstraClient();
        const query = 'UPDATE Variables SET variable_value = ? WHERE variable_id = ? AND proposal_id = ?';
        const params = [newValue, variableId, proposalId];
        await astraClient.execute(query, params);
    }

    static async findById(variableId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Variables WHERE variable_id = ?';
        const params = [variableId];
        const result = await astraClient.execute(query, params);
        return result.rows[0];
    }

    static async initiateCommunityVariables(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Default_Variable_Values';
        const result = await astraClient.execute(query);
        const defaultVariables = result.rows;

        for (let defaultVariable of defaultVariables) {
            await this.create({
                community_id: communityId,
                variable_id: defaultVariable.variable_id,
                variable_name: defaultVariable.variable_name,
                variable_value: defaultVariable.variable_default_value,
                variable_desc: defaultVariable.variable_desc
            });
        }
    }
}

module.exports = Variables;
