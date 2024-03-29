/*
CREATE TABLE IF NOT EXISTS Comments (
    comment_id uuid,
    parent_comment_id uuid,
    entity_id uuid,
    entity_type text,
    user_id uuid,
    comment_text text,
    comment_timestamp timestamp,
    score int,
    PRIMARY KEY (comment_id)
);
*/
const DBClient = require('../utils/localDB.js');

class Comments {
    static async addComment(commentId, parentCommentId, entityId, entityType, userId, commentText) {
       const db = DBClient.getInstance();
        const query = 'INSERT INTO Comments (comment_id, parent_comment_id, entity_id, entity_type, user_id, comment_text, comment_timestamp, score) VALUES (?, ?, ?, ?, ?, ?, toTimeStamp(now()), ?)';
        const params = [commentId, parentCommentId, entityId, entityType, userId, commentText, 0]; // Initialize score as 0
        await db.execute(query, params, { hints : ['uuid', 'uuid', 'uuid', 'text', 'uuid', 'text', 'int']});
    }

    static async getComments(entityId, entityType) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Comments WHERE entity_id = ? AND entity_type = ? ORDER BY score DESC';
        const params = [entityId, entityType];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async updateScore(commentId, newScore) {
       const db = DBClient.getInstance();
        const query = 'UPDATE Comments SET score = ? WHERE comment_id = ?';
        const params = [newScore, commentId];
        await db.execute(query, params);
    }


    static async incrementScore(commentId) {
       const db = DBClient.getInstance();
        const query = 'UPDATE Comments SET score = score + 1 WHERE comment_id = ?';
        const params = [commentId];
        await db.execute(query, params);
    }

    static async decrementScore(commentId) {
       const db = DBClient.getInstance();
        const query = 'UPDATE Comments SET score = score - 1 WHERE comment_id = ?';
        const params = [commentId];
        await db.execute(query, params);
    }
}

module.exports = Comments;
