const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server');
const { stateTypeDefs, stateTypeResolvers } = require('./types/state-type');

const server = new ApolloServer({
  typeDefs: stateTypeDefs,
  resolvers: stateTypeResolvers
});


server.listen().then(({url}) => {
  console.log(`The server is listening on ${url}`)
});