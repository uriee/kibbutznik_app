const { StargateClient } = require("@stargate-oss/stargate-grpc-node-client");

async function createAstraClient(astraBaseUrl, astraRegion, astraToken) {
    // Astra DB configuration
    const astraUri = `${astraBaseUrl}-${astraRegion}.apps.astra.datastax.com:443`;

    // Create the Stargate client
    const client = new StargateClient(astraUri, {
        username: "token",
        password: astraToken
    });

    await client.connect();

    return client;
}

module.exports = createAstraClient;
