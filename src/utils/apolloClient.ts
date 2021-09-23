import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.API_HOST_URL || "https://jabref-dev.azurewebsites.net/api",
  cache: new InMemoryCache(),
  credentials: "include",
});
export default client;
