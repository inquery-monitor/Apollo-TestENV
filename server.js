require('dotenv').config();
const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server');
const { stateTypeDefs, updatedStateTypeResolvers } = require('./types/state-type');
const { countyTypeDefs, countyTypeResolvers } = require('./types/county-type')
const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');


const schema = makeExecutableSchema({
  typeDefs:[stateTypeDefs,countyTypeDefs],
  resolvers:merge(updatedStateTypeResolvers,countyTypeResolvers)
})

const server = new ApolloServer({
  schema
});




server.listen().then(({url}) => {
  console.log(`The server is listening on ${url}`)
});