require('dotenv').config();
const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server');
const { stateTypeDefs, updatedStateTypeResolvers } = require('./types/state-type');
const { countyTypeDefs, updatedCountyTypeResolvers } = require('./types/county-type')
const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const { trackError } = require('goblin-ql')


const schema = makeExecutableSchema({
  typeDefs:[stateTypeDefs,countyTypeDefs],
  resolvers:merge(updatedStateTypeResolvers,updatedCountyTypeResolvers)
})

const server = new ApolloServer({
  schema,
  formatError: async (err) => {
    // console.log(err)
    const time = Date.now();
    await trackError(err,time);
  }
});




server.listen().then(({url}) => {
  console.log(`The server is listening on ${url}`)
});