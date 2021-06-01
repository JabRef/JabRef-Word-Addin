import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://jabref-online.herokuapp.com",
  cache: new InMemoryCache(),
});
export default client;
