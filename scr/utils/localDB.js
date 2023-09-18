const cassandra = require('cassandra-driver');

class DBClient {
    constructor() {
        this.client = new cassandra.Client({
            contactPoints: ['127.0.0.1'],  // Update with your local IP if necessary
            localDataCenter: 'datacenter1',  // Update if you have a different datacenter
            keyspace: 'kbz'  // Your keyspace
        });

        this.client.on('error', (err) => {
            console.error('*** Error event emitted: ', err);
          });
          this.client.on('timeout', (err) => {
            console.error('*** Timeout event emitted: ', err);
          });
          this.client.on('end', (err) => {
            console.error('*** End event emitted: ', err);
          });
          this.client.on('ready', (err) => {
            console.error('*** Ready event emitted: ', err);
          });
          this.client.on('reconnect', (err) => {
            console.error('*** Reconnect event emitted: ', err);
          });
          this.client.on('reconnectFailed', (err) => {
            console.error('*** ReconnectFailed event emitted: ', err);
          });
          this.client.on('connection', (err) => {
            console.error('*** Connection event emitted: ', err);
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
            console.log("FREEEEEEEEEEE")
            await this.client.connect();
        }
        console.log("QUERY:",query, params, options);
        return this.client.execute(query, params, options);
        r/*eturn this.client.execute(query, params, options, (err, result) => {
            if (err) {
              console.log('Error:', err);
            } else {
              console.log('Result:', result);
            }
          });
          */
        
    }


        async batch(queries, options) {
            if (!this.client.connected) {
                await this.client.connect();
            }
            return this.client.batch(queries, options);
        }
}


module.exports = DBClient;