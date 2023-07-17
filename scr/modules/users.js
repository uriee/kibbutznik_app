// models/Users.js 
const createLocalClient = require('../utils/localDB.js');
const uuid = require('uuid');

class Users {
    static async findById(id) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Users WHERE user_id = ?';
        const params = [id];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async findAll() {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Users';
        const result = await astraClient.execute(query);
        return result.rows;
    }

    static async create(user) {
        const localClient = await createLocalClient();
        // assuming `user` is an object with fields: user_id, user_name, password, about, wallet_address
        const query = 'INSERT INTO Users (user_id, user_name, password, about, wallet_address) VALUES (?, ?, ?, ?, ?)';
        const params = [user.user_id, user.user_name, user.password, user.about, user.wallet_address];
        await localClient.execute(query, params);
    }

    static async getMembershipProposals(id) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Membership_Proposals WHERE user_id = ?';
        const params = [id];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}

module.exports = Users;