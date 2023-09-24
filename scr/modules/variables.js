// models/Variables.js
const DBClient = require('../utils/localDB.js');

class Variables {
    static async create(variable) {
       const db = DBClient.getInstance();
        // assuming `variable` is an object with fields: community_id, variable_id, variable_name, variable_value
        const query = 'INSERT INTO Variables (community_id, variable_id, variable_name, variable_value, variable_desc,) VALUES (?, ?, ?, ?)';
        const params = [variable.community_id, variable.variable_id, variable.variable_name, variable.variable_value, variable.variable_desc];
        await db.execute(query, params);
        return variable.variable_id
    }


    static async findById(variableId) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Variables WHERE variable_id = ?';
        const params = [variableId];
        const result = await db.execute(query, params);
        return result.rows[0];
    }

    static async getVariableValue(communityId, variableType) {
       const db = DBClient.getInstance();
        const query = 'SELECT variable_value FROM Variables WHERE community_id = ? AND variable_type = ?';
        const params = [communityId, variableType];

        const result = await db.execute(query, params);
        if (result.rows.length > 0) {
            return result.rows[0].variable_value;
        } else {
            return null;
        }
    }

    static async updateVariableValue(communityId, variableType, newValue) {
       const db = DBClient.getInstance();
        const query = `UPDATE Variables SET variable_value = '${newValue}' WHERE community_id = ${communityId} AND variable_type = '${variableType}'`;
        const params = [newValue, communityId, variableType];
        console.log(query)
        await db.execute(query);
    }


    static async initializeCommunityVariables(communityId) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Default_Variable_Values';
        const result = await db.execute(query);
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

module.exports = Variables;
