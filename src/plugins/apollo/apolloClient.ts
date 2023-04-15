import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri:
    process.env?.API_HOST_URL ||
    'https://mango-pebble-0224c3803-dev.westeurope.1.azurestaticapps.net',
  cache: new InMemoryCache(),
});
export default client;
