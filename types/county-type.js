const { gql } = require('apollo-server');
const pool = require("./goblinsharksdb");


const countyTypeDefs = gql`

type County {
  name: String
  total_dosage: BigInt
  total_manufactured: Int
}

type Query {
  county(county: String!): County
}
`;