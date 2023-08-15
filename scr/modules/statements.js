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
    
    static async create(community_id , statement_text) {
        console.log("community_id , statement_text", community_id , statement_text)
        const db = DBClient.getInstance();
        const statement_id = uuid.v4();
        const query = 'INSERT INTO Statements (community_id, statement_id, status, statement_text) VALUES (?, ?, ?, ?)';
        const params = [community_id, statement_id, 1, statement_text];
        console.log(query, params)
        await db.execute(query, params,{ hints : ['uuid', 'uuid', 'int', 'text']});
    }

    static async removeStatement(statement_id) {
       const db = DBClient.getInstance();
        const query = 'UPDATE Statements SET status = ? WHERE statement_id = ?';
        const params = [2, statement_id]; // 2 is status for removed
        await db.execute(query, params);
    }

    static async replaceStatement(statement_id, statement) {
        await this.removeStatement(statement_id)
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
