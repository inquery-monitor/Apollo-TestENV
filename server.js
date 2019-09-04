require('dotenv').config();
const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server');
const { stateTypeDefs, updatedStateTypeResolvers } = require('./types/state-type');
const { countyTypeDefs, updatedCountyTypeResolvers } = require('./types/county-type')
const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');


const schema = makeExecutableSchema({
  typeDefs:[stateTypeDefs,countyTypeDefs],
  resolvers:merge(updatedStateTypeResolvers,updatedCountyTypeResolvers)
})

const server = new ApolloServer({
  schema,
  engine: {
    apiKey: "service:citrusvanilla-8362:Oh2M_mkeGIKXtv5Yvh3ttA"
  }
});




server.listen(8081).then(({url}) => {
  console.log(`The server is listening on ${url}`)
});