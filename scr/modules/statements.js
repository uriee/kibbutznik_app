// models/Statements.js
const createAstraClient = require('../path_to_your_file');

class Statements {
    
    static async create(statement) {
        const astraClient = await createAstraClient();
        const query = 'INSERT INTO Statements (community_id, statement_id, status, statement_text) VALUES (?, ?, ?)';
        const params = [statement.community_id, statement.statement_id, statement.status, statement.statement_text];
        await astraClient.execute(query, params);
    }

    static async findByCommunityId(communityId, statementId = null, status = null, statementText = null) {
        const astraClient = await createAstraClient();
        
        let query = 'SELECT * FROM Statements WHERE community_id = ?';
        let params = [communityId];

        if (statementId) {
            query += ' AND statement_id = ?';
            params.push(statementId);
        }

        if (status) {
            query += ' AND status = ?';
            params.push(statementId);
        }

        if (statementText) {
            query += ' AND statement_text LIKE %?%';
            params.push(statementText);
        }

        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async findByTextSubstring(textSubstring) {
        const astraClient = await createAstraClient();
    
        let query = 'SELECT * FROM Statements WHERE AND statement_text LIKE ?';
        let params = ['%' + textSubstring + '%'];  // Add the wildcard '%' before and after the substring
    
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}

module.exports = Statements;
