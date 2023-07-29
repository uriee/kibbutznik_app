const { StargateClient } = require("@stargate-oss/stargate-grpc-node-client");

async function createLocalClient() {

    const astra_uri = "{astra-base-url}-{astra-region}.apps.astra.datastax.com:443";
    const bearer_token = "AstraCS:xxxxxxx";

    // Set up the authentication
    // For Astra DB: Enter a bearer token for Astra, downloaded from the Astra DB dashboard
    const bearerToken = new StargateBearerToken(bearer_token);
    const credentials = grpc.credentials.combineChannelCredentials(
    grpc.credentials.createSsl(), bearerToken);

    // Uncomment if you need to check the credentials
    //console.log(credentials);
    // For a connection to a remote Stargate instance like Astra automatically generate on every call to the client:

    // Create the gRPC client
    // For Astra DB: passing the credentials created above
    const stargateClient = new StargateClient(astra_uri, credentials);

    // Create a promisified version of the client, so we don't need to use callbacks
    return promisifiedClient = promisifyStargateClient(stargateClient);
}

module.exports = createLocalClient;

/*

const createLocalClient = require("./path_to_your_file");

async function main() {
    const DBClient = await createLocalClient();

    // Now you can use DBClient to make requests to your Astra DB
}

main().catch(console.error);
*/
