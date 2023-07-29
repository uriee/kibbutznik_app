// models/Users.js 
const DBClient = require('../utils/localDB.js');
const uuid = require('uuid');

class Users {
    static async findById(id) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Users WHERE user_id = ?';
        const params = [id];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async findAll() {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Users';
        const result = await db.execute(query);
        return result.rows;
    }

    static async create(user_name, password, about, wallet_address) {
        const db = DBClient.getInstance();
        const user_id = uuid.v4();
        // assuming `user` is an object with fields: user_id, user_name, password, about, wallet_address
        const query = 'INSERT INTO Users (user_id, user_name, password, about, wallet_address) VALUES (?, ?, ?, ?, ?)';
        const params = [user_id, user_name, password, about, wallet_address];
        await db.execute(query, params, { hints : ['uuid', 'text', 'text', 'text', 'text']});
    }

    static async getMembershipProposals(id) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Membership_Proposals WHERE user_id = ?';
        const params = [id];
        const result = await db.execute(query, params);
        return result.rows;
    }
}

module.exports = Users;