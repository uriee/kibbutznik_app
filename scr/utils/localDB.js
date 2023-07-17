const cassandra = require('cassandra-driver');

async function createLocalClient() {
    const client = new cassandra.Client({
        contactPoints: ['127.0.0.1'],  // Update with your local IP if necessary
        localDataCenter: 'datacenter1',  // Update if you have a different datacenter
        keyspace: 'kbz'  // Your keyspace
    });

    try {
        await client.connect();
        console.log("Connected to local Cassandra DB successfully!");
    } catch (err) {
        console.error("Failed to connect to local Cassandra DB:", err);
    }
    
    return client;
}

module.exports = createLocalClient;