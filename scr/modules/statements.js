// models/Statements.js
/* 
CREATE TABLE IF NOT EXISTS Statements (
    community_id uuid,
    statement_id uuid,
    prev_statement_id uuid,
    status int, 
    statement_text text,
    PRIMARY KEY (community_id, statement_id)
);

*/
const DBClient = require('../utils/localDB.js');
const uuid = require('uuid');

class Statements {
    
    static async create(community_id , statement_text, prev_statement_id = null) {
        const db = DBClient.getInstance();
        const statement_id = uuid.v4();
        const query = prev_statement_id ?
            `INSERT INTO Statements (community_id, statement_id, status, statement_text, prev_statement_id) VALUES (${community_id}, ${statement_id}, 1, '${statement_text}', ${prev_statement_id})` :
            `INSERT INTO Statements (community_id, statement_id, status, statement_text) VALUES (${community_id}, ${statement_id}, 1, '${statement_text}')`;
        let statement= await db.execute(query, { hints : ['uuid', 'uuid', 'int', 'text']});
        return statement.id
    }

    static async removeStatement(community_id, statement_id) {
        const db = DBClient.getInstance();
        const query = `UPDATE Statements SET status = 2 WHERE community_id = ${community_id} and statement_id = ${statement_id}`;
        return await db.execute(query);
    }

    static async replaceStatement(community_id, statement_id, statement) {
        let ret = await Statements.removeStatement(community_id, statement_id)
        ret = ret && await Statements.create(community_id, statement, statement_id)
        return ret;
    }

    static async findByCommunityId(communityId, statementId = null, status = null, statementText = null) {
       const db = DBClient.getInstance();
        
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

        const result = await db.execute(query, params);
        return result.rows;
    }

    static async findByTextSubstring(textSubstring) {
       const db = DBClient.getInstance();
    
        let query = 'SELECT * FROM Statements WHERE AND statement_text LIKE ?';
        let params = ['%' + textSubstring + '%'];  // Add the wildcard '%' before and after the substring
    
        const result = await db.execute(query, params);
        return result.rows;
    }
}

module.exports = Statements;
