

// models/DefaultVariables.js
import createAstraClient from '../utils/astraDB.js';

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
    ['Membership', 'ThrowOut', 'AddStatement', 'RemoveStatement','replaceStatement', 'ChangeVariable',
                            'AddAction', 'EndAction', 'JoinAction', 'Funding', 'Payment', 'payBack', 'Dividend']
    base = [
        {
            "type" : "PulseSupport",
            "value" : 50,
            "desc" : "The precentage of members support nedded to execute a pulse.",
        },
        {
            "type" : "ProposalSupport",
            "value" : 15,
            "desc" : "The precentage of members support nedded to assiged a Proposal to a pulse.",
        },
        {
            "type" : "ChangeVariable",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for changing a Variable value.",
        },
        {
            "type" : "ME",
            "type" : "Membership",
            "value" : 50,
            "desc" : "The precentage of members vote nedded to grant Membership to a User.",
        },
        {
            "type" : 'ThrowOut',
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Revoke Membership to a User.",
        },
        {
            "type" : "AddStatement",
            "value" : 50,
            "desc" : "The precentage of members vote nedded to accept a new Statement.",
        },
        {
            "type" : "RemoveStatement",
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Cancel Statement.",
        },
        {
            "type" : "AddAction",
            "value" : 50,
            "desc" : "The precentage of members vote nedded to accept a new Action.",
        },
        {
            "type" : "EndAction",
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Cancel Action.",
        },
        {
            "type" : "ReplaceStatement",
            "value" : 60,
            "desc" : "The precentage of members vote nedded to Replace Statement.",
        },
        {
            "type" : "JoinAction",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for assigning a Member to an Action.",
        },
        {
            "type" : "Funding",
            "value" : 50,
            "desc" : "The precentage of members vote nedded to Fund an Action.",
        },
        {
            "type" : "Payment",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for making a Payment.",
        },
        {
            "type" : "payBack",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for decide on an action payBack.",
        },
        {
            "type" : "Dividend",
            "value" : 50,
            "desc" : "The precentage of members vote nedded for decide to give Dividend to members.",
        },
        {
            "type" : "MinCommittee",
            "value" : 2,
            "desc" : "The Minimun size of an Action Committee.",
        },
        {
            "type" : "MaxAge",
            "value" : 3,
            "desc" : "The Maximim 'OutThere' Proposal Age (in Pulses).",
        },
        {
            "type" : "Name",
            "value" : "No Name",
            "desc" : "The Communitty Name.",
        },
        {
            "type" : "RestictPayments",
            "value" : True,
            "desc" : "Only allow payments from a community that has no actions",
        }
    ]
    async PopulateByBase() {
        for (let item of this.base) {
            await this.insert(item.name, item.type, item.value, item.desc);
        }
    }
}

module.exports = DefaultVariables;
