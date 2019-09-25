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
<<<<<<< HEAD
  engine: {
    apiKey: "service:citrusvanilla-8362:Oh2M_mkeGIKXtv5Yvh3ttA"
=======
  formatError: async (err) => {
    // console.log(err)
    const time = Date.now();
    await trackError(err,time);
>>>>>>> a3b632775d27d86abe141960174e2b2fe6180c18
  }
});




server.listen(8081).then(({url}) => {
  console.log(`The server is listening on ${url}`)
});