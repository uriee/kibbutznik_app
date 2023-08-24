// models/Statements.js
/* 
CREATE TABLE IF NOT EXISTS Statements (
    community_id uuid,
    statement_id uuid PRIMARY KEY,
    status int, 
    statement_text text,
);
*/
const DBClient = require('../utils/localDB.js');
const uuid = require('uuid');

class Statements {
    
    static async create(community_id , statement_text, prev_statement_id = null) {
        console.log("community_id , statement_text", community_id , statement_text)
        const db = DBClient.getInstance();
        const statement_id = uuid.v4();
        const query = prev_statement_id ?
            `INSERT INTO Statements (community_id, statement_id, status, statement_text, prev_statement_id) VALUES (${community_id}, ${statement_id}, 1, '${statement_text}', ${prev_statement_id})` :
            `INSERT INTO Statements (community_id, statement_id, status, statement_text) VALUES (${community_id}, ${statement_id}, 1, '${statement_text}')`;
        console.log(query)
        await db.execute(query, { hints : ['uuid', 'uuid', 'int', 'text']});
    }

    static async removeStatement(community_id, statement_id) {
       const db = DBClient.getInstance();
        const query = `UPDATE Statements SET status = 2 WHERE community_id = ${community_id} and statement_id = ${statement_id}`;
        console.log("choooooche",query)
        await db.execute(query);
    }

    static async replaceStatement(community_id, statement_id, statement) {
        await this.removeStatement(community_id, statement_id)
        await this.create(statement)
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
