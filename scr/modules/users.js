// models/Users.js
const createAstraClient = require('../path_to_your_file');

class Users {
    static async findById(id) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Users WHERE user_id = ?';
        const params = [id];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(user) {
        const astraClient = await createAstraClient();
        // assuming `user` is an object with fields: user_id, name, email
        const query = 'INSERT INTO Users (user_id, name, email) VALUES (?, ?, ?)';
        const params = [user.user_id, user.name, user.email];
        await astraClient.execute(query, params);
    }

    static async getMembershipProposals(id) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM User_MembershipProposals WHERE user_id = ?';
        const params = [id];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}
module.exports = Users;