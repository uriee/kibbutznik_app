
const DBClient = require('../utils/localDB.js');
const uuid = require('uuid');

class Actions {

    static async create(parent_community_id, name) {
        const db = DBClient.getInstance();
        // Generate a new UUID for the community_id
        const community_id = uuid.v4();
        const query = `INSERT INTO Communities (community_id, parent_community_id, status) VALUES (${community_id}, ${parent_community_id}, 1)`;
        console.log(query)
        await db.execute(query, { hints : ['uuid','uuid', 'int']});
        await Actions.copyVariables(community_id);
        await Actions.setName(community_id, name);
        return community_id;
    }

    static async endAction(communityId) {
        const db = DBClient.getInstance();
        const query = 'UPDATE Communities SET status = 2 WHERE community_id = ?';
        const params = [ communityId ];
        await db.execute(query, params);
    }

    static async setName(community_id, new_name) {
        if (!community_id || !new_name) {
            return null;
        }
    
        const db = DBClient.getInstance();
    
        // Update the name variable for the given community
        const setNameQuery = 'UPDATE Variables SET variable_value = ? WHERE community_id = ? AND variable_type = ?';
        const params = [new_name, community_id, 'Name'];
        await db.execute(setNameQuery, params);
    
        return 'Name successfully updated!';
    }

    static async copyVariables(community_id) {
        if (!community_id) {
            return null;
        }
    
        const db = DBClient.getInstance();
        // Fetch all the default variable values
        const defaultVariableValuesQuery = 'SELECT * FROM Default_Variable_Values';
        const defaultVariableValuesResult = await db.execute(defaultVariableValuesQuery);

        // Copy each default variable value to Variables table
        for (let defaultVariableValue of defaultVariableValuesResult.rows) {
            const variable_id = uuid.v4();
            const variablesInsertQuery = 'INSERT INTO Variables (community_id, variable_id, variable_type, variable_value, variable_desc) VALUES (?, ?, ?, ?, ?)';
            const params = [community_id, variable_id, defaultVariableValue.variable_type, defaultVariableValue.variable_default_value, defaultVariableValue.variable_desc];
            await db.execute(variablesInsertQuery, params);
        }
    
        return 'Variables successfully copied!';
    }

}

module.exports = Actions;
