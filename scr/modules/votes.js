const createAstraClient = require('../path_to_your_file');

class Statements {
    static async findByCommunityId(communityId) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Community_Statements WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(statement) {
        const astraClient = await createAstraClient();
        // assuming `statement` is an object with fields: community_id, statement_id, statement_text
        const query = 'INSERT INTO Community_Statements (community_id, statement_id, statement_text) VALUES (?, ?, ?)';
        const params = [statement.community_id, statement.statement_id, statement.statement_text];
        await astraClient.execute(query, params);
    }
}
module.exports = Statements;
