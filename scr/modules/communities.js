const { transfer, getBalance } = require('../utils/transfer.js'); 
const createAstraClient = require('../path_to_your_file');



class Communities {
    static async findById(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Communities WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(parent_community_id, name) {
        const astraClient = await createAstraClient();

        // Generate a new UUID for the community_id
        const community_id = uuid.v4();
        
        const query = 'INSERT INTO Communities (community_id, parent_community_id, status) VALUES (?, ?, ?)';
        const params = [community_id, parent_community_id, 1];
        await astraClient.execute(query, params);

        await copyVariables(community_id);

        await setName(community_id, name);

        return community_id;
    }

    static async endAction(communityId) {
        const astraClient = await createAstraClient();
        const query = 'UPDATE Communities SET status = 2 WHERE community_id = ?';
        const params = [ communityId ];
        await astraClient.execute(query, params);
    }

    
    static async getParentsTree(communityId) {
        let community = await this.findById(communityId);
        let parentsTree = [];

        while (community.parent_community_id != 0) {
            community = await this.findById(community.parent_community_id);
            parentsTree.push(community);
        }

        return parentsTree;
    }

    static async getChildrenTree(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Communities WHERE parent_community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);

        const children = result.rows;
        for (let child of children) {
            child.children = await this.getChildrenTree(child.community_id);
        }

        return children;
    }

    static async isParentOf(parentCommunityId, childCommunityId) {
        let community = await this.findById(childCommunityId);

        while (community.parent_community_id != 0) {
            if (community.parent_community_id === parentCommunityId) return true;
            community = await this.findById(community.parent_community_id);
        }

        return false;
    }

    static async isChildOf(childCommunityId, parentCommunityId) {
        return await this.isParentOf(parentCommunityId, childCommunityId);
    }

    static async getVariables(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Variables WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getStatements(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Statements WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getMembers(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Members WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getProposals(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Proposals WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async setName(community_id, new_name) {
        if (!community_id || !new_name) {
            return null;
        }
    
        const astraClient = await createAstraClient();
    
        // Update the name variable for the given community
        const setNameQuery = 'UPDATE Variables SET variable_value = ? WHERE community_id = ? AND variable_type = ?';
        const params = [new_name, community_id, 'Name'];
        await astraClient.execute(setNameQuery, params);
    
        return 'Name successfully updated!';
    }

    static async copyVariables(community_id) {
        if (!community_id) {
            return null;
        }
    
        const astraClient = await createAstraClient();
    
        // Fetch all the default variable values
        const defaultVariableValuesQuery = 'SELECT * FROM Default_Variable_Values';
        const defaultVariableValuesResult = await astraClient.execute(defaultVariableValuesQuery);
    
        // Copy each default variable value to Variables table
        for (let defaultVariableValue of defaultVariableValuesResult.rows) {
            const variablesInsertQuery = 'INSERT INTO Variables (community_id, variable_id, variable_type, variable_value, variable_desc) VALUES (?, ?, ?, ?, ?)';
            const params = [community_id, defaultVariableValue.variable_id, defaultVariableValue.variable_type, defaultVariableValue.variable_default_value, defaultVariableValue.variable_desc];
            await astraClient.execute(variablesInsertQuery, params);
        }
    
        return 'Variables successfully copied!';
    }
    
    static async funding(from_community_id, to_community_id, amount) {
        const astraClient = await createAstraClient();
        
        // Fetch wallet addresses for both communities
        const from_query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const from_params = [from_community_id];
        const from_result = await astraClient.execute(from_query, from_params);
        const from_wallet_address = from_result.rows[0].wallet_address;

        const to_query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const to_params = [to_community_id];
        const to_result = await astraClient.execute(to_query, to_params);
        const to_wallet_address = to_result.rows[0].wallet_address;

        // Transfer funds from from_wallet_address to to_wallet_address
        const transferResult = await transfer(from_wallet_address, to_wallet_address, amount);

        return transferResult;
    }

    static async getCommunityBalance(community_id) {
        const astraClient = await createAstraClient();
        
        // Fetch wallet address for the community
        const query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const params = [community_id];
        const result = await astraClient.execute(query, params);
        const wallet_address = result.rows[0].wallet_address;

        // Get the balance of the community's wallet
        const balance = await getBalance(wallet_address);

        return balance;
    }

    static async pay(community_id, to_wallet_address, amount) {
        const astraClient = await createAstraClient();
        
        // Fetch wallet private key for the community
        const query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const params = [community_id];
        const result = await astraClient.execute(query, params);
        const fromPrivateKey = result.rows[0].wallet_address;

        // Transfer funds from the community's wallet to the recipient's wallet
        const transferResult = await transfer(fromPrivateKey, to_wallet_address, amount);

        return transferResult;
    }
}
module.exports = Communities;
