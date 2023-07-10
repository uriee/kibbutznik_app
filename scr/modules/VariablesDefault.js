

// models/DefaultVariables.js
const createAstraClient = require('../path_to_your_file');

class DefaultVariables {
    static async insert(variable_name, variable_type, variable_value) {
        const astraClient = await createAstraClient();
        const query = 'INSERT INTO DefaultVariables (variable_id, variable_name, variable_type, variable_default_value, variable_desc,) VALUES (uuid(), ?, ?, ?, ?)';
        const params = [ variable_name, variable_type, variable_value, variable_desc ];
        await astraClient.execute(query, params);
    }

    static async updateDefaultValue(variable_id, variable_value) {
        const astraClient = await createAstraClient();
        const query = 'UPDATE DefaultVariables SET variable_default_value = ? WHERE variable_id = ?';
        const params = [ variable_value, variable_id ];
        await astraClient.execute(query, params);
    }

    static async getByType(variable_type) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM DefaultVariables WHERE variable_type = ?';
        const params = [ variable_type ];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
    
    base = [
        {
            "type" : "PUS",
            "name" : "Pulse Support",
            "value" : 50,
            "desc" : "The precentage of members support nedded to execute a pulse.",
            "proposals" : [ ]
        },
        {
            "type" : "PS",
            "name" : "Proposal Support",
            "value" : 15,
            "desc" : "The precentage of members support nedded to assiged a Proposal to a pulse.",
            "proposals" : [ ]
        },
        {
            "type" : "CV",
            "name" : "Change Variable",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for changing a Variable value.",
            "proposals" : [ ]
        },
        {
            "type" : "ME",
            "name" : "Membership",
            "value" : 50,
            "desc" : "The precentage of members vote nedded to grant Membership to a User.",
            "proposals" : [ ]
        },
        {
            "type" : "EM",
            "name" : "End Membership",
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Revoke Membership to a User.",
            "proposals" : [ ]
        },
        {
            "type" : "NS",
            "name" : "New Statement",
            "value" : 50,
            "desc" : "The precentage of members vote nedded to accept a new Statement.",
            "proposals" : [ ]
        },
        {
            "type" : "CS",
            "name" : "Cancel Statement",
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Cancel Statement.",
            "proposals" : [ ]
        },
        {
            "type" : "NA",
            "name" : "New Action",
            "value" : 50,
            "desc" : "The precentage of members vote nedded to accept a new Action.",
            "proposals" : [ ]
        },
        {
            "type" : "CA",
            "name" : "Cancel Action",
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Cancel Action.",
            "proposals" : [ ]
        },
        {
            "type" : "RS",
            "name" : "Replace Statement",
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Replace Statement.",
            "proposals" : [ ]
        },
        {
            "type" : "CM",
            "name" : "Committee Member",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for assigning a Member to an Action.",
            "proposals" : [ ]
        },
        {
            "type" : "OC",
            "name" : "Out Of Committee",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for throw a Member from an Action.",
            "proposals" : [ ]
        },
        {
            "type" : "MinC",
            "name" : "MinCommittee",
            "value" : 2,
            "desc" : "The Minimun size of an Action Committee.",
            "proposals" : [ ]
        },
        {
            "type" : "MaxAge",
            "name" : "MaxAge",
            "value" : 2,
            "desc" : "The Maximim 'OutThere' Proposal Age (in Pulses).",
            "proposals" : [ ]
        },
        {
            "type" : "Name",
            "name" : "Name",
            "value" : "No Name",
            "desc" : "The Communitty Name.",
            "proposals" : [ ]
        }
    ]
    async PopulateByBase() {
        for (let item of this.base) {
            await this.insert(item.name, item.type, item.value, item.desc);
        }
    }
}

module.exports = DefaultVariables;
