import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.API_HOST,
  cache: new InMemoryCache(),
});
export default client;
