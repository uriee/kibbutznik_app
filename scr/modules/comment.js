const createAstraClient = require('./path_to_your_astra_client');

class Comments {
    static async addComment(commentId, parentCommentId, entityId, entityType, userId, commentText) {
        const astraClient = await createAstraClient();
        const query = 'INSERT INTO Comments (comment_id, parent_comment_id, entity_id, entity_type, user_id, comment_text, comment_timestamp, score) VALUES (?, ?, ?, ?, ?, ?, toTimeStamp(now()), ?)';
        const params = [commentId, parentCommentId, entityId, entityType, userId, commentText, 0]; // Initialize score as 0
        await astraClient.execute(query, params);
    }

    static async getComments(entityId, entityType) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Comments WHERE entity_id = ? AND entity_type = ? ORDER BY score DESC';
        const params = [entityId, entityType];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async updateScore(commentId, newScore) {
        const astraClient = await createAstraClient();
        const query = 'UPDATE Comments SET score = ? WHERE comment_id = ?';
        const params = [newScore, commentId];
        await astraClient.execute(query, params);
    }
}

module.exports = Comments;
