import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.API_HOST_URL || "https://jabref-online.herokuapp.com",
  cache: new InMemoryCache(),
});
export default client;
