const BigInt = require("apollo-type-bigint");
const { gql } = require('apollo-server');
const pool = require("./goblinsharksdb");
const { find } = require('lodash');

const fakeStates = [
  {
    abr: "CA",
    total_dosage: 1000,
    total_manufactured: 120
  }
]

const stateTypeDefs = gql`
scalar BigInt

type State {
  name: String
  total_dosage: BigInt
  total_manufactured: Int
  # county: County
}

type Query {
  state(abr: String!): State
}
`;

const stateTypeResolvers = {
  Query: {
    state(parent, args, context, info) {
 
    
    return args.abr

    } 
  },
  State: {
    async name(parent,args) {
      const stateNameQuery = 
      `SELECT EXISTS(
      SELECT 1 FROM buyer_annual
      WHERE buyer_state = $1
      )`;
      const result = await pool.query(stateNameQuery,[parent])
      if (result.rows[0].exists){
        return parent
      } else {
        return 'invalid state name'
      }
      // return // todo: get name
    },
    async total_dosage(parent,args) {
      const dosageQuery = 
      `SELECT SUM(dosage_unit) FROM county_annual 
      WHERE buyer_state = $1`;
      const stateDosage = await pool.query(dosageQuery, [parent])
      return stateDosage.rows[0].sum
    },

    async total_manufactured(parent,args) {
      const manufacturedQuery =
      `SELECT SUM(dosage_unit::decimal) FROM mastertable 
      WHERE dosage_unit ~ E'^\\\\d+.\\\\d+$'
      AND reporter_bus_act = 'MANUFACTURER' 
      AND buyer_state = $1`;
      const stateManufactured = await pool.query(manufacturedQuery, [parent]);  
    
      return parseInt(stateManufactured.rows[0].sum);
    }
  }
}

module.exports = {
  stateTypeDefs,
  stateTypeResolvers
}

