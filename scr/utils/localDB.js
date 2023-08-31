const cassandra = require('cassandra-driver');

class DBClient {
    constructor() {
        this.client = new cassandra.Client({
            contactPoints: ['127.0.0.1'],  // Update with your local IP if necessary
            localDataCenter: 'datacenter1',  // Update if you have a different datacenter
            keyspace: 'kbz'  // Your keyspace
        });
        this.client.connect();
    }

    static getInstance() {
        if (!DBClient.instance) {
            DBClient.instance = new DBClient();
        }
        return DBClient.instance;
    }

    async execute(query, params, options) {
        if (!this.client.connected) {
            await this.client.connect();
        }
        return this.client.execute(query, params, options);
    }

    async batch(queries, options) {
        if (!this.client.connected) {
            await this.client.connect();
        }
        return this.client.batch(queries, options);
    }
}


module.exports = DBClient;