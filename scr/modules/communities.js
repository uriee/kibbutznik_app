const createAstraClient = require('../path_to_your_file');

class Communities {
    static async findById(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Communities WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(community) {
        const astraClient = await createAstraClient();
        const query = 'INSERT INTO Communities (community_id, parent_community_id, name, status) VALUES (?, ?, ?, ?)';
        const params = [community.community_id, community.parent_community_id, community.name, community.status];
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
}
module.exports = Communities;
