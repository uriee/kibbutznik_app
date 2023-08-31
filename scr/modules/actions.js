
const DBClient = require('../utils/localDB.js');
const uuid = require('uuid');

class Actions {

    static async create(parent_community_id, name) {
        try {
            const db = DBClient.getInstance();
            // Generate a new UUID for the community_id
            const community_id = uuid.v4();
    
            const batchQueries = [];
    
            // Insert into Communities
            const insertCommunitiesQuery = `INSERT INTO Communities (community_id, parent_community_id, status) VALUES (?, ?, 1)`;
            batchQueries.push({ query: insertCommunitiesQuery, params: [community_id, parent_community_id] });
    
            // Fetch all the default variable values
            const defaultVariableValuesQuery = 'SELECT * FROM Default_Variable_Values';
            const defaultVariableValuesResult = await db.execute(defaultVariableValuesQuery);
    
            // Copy each default variable value to Variables table
            for (let defaultVariableValue of defaultVariableValuesResult.rows) {
                const variable_id = uuid.v4();
                const variablesInsertQuery = 'INSERT INTO Variables (community_id, variable_id, variable_type, variable_value, variable_desc) VALUES (?, ?, ?, ?, ?)';
                const params = [community_id, variable_id, defaultVariableValue.variable_type, defaultVariableValue.variable_default_value, defaultVariableValue.variable_desc];
                batchQueries.push({ query: variablesInsertQuery, params });
            }
    
            // Update the name variable for the given community
            const setNameQuery = 'UPDATE Variables SET variable_value = ? WHERE community_id = ? AND variable_type = ?';
            const setNameParams = [name, community_id, 'Name'];
            batchQueries.push({ query: setNameQuery, params: setNameParams });
    
            await db.batch(batchQueries, { prepare: true });
    
            return community_id;
    
        } catch (error) {
            // Log and handle error
            console.error("Error in createAction: ", error);
            throw error;
        }
    }

   
    static async endAction(communityId) {
        const db = DBClient.getInstance();
        const query = 'UPDATE Communities SET status = 2 WHERE community_id = ?';
        const params = [ communityId ];
        await db.execute(query, params);
    }

}

module.exports = Actions;
