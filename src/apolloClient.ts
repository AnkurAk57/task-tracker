import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import authLink from './authLink';

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URL! }); // Replace with your GraphQL endpoint URL

const link = from([authLink, httpLink])
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

export default client;