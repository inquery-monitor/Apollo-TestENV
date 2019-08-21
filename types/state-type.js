const { gql } = require('apollo-server');
const pool = require("../db.js");
const EnableMonitoring = require('../enableMonitoring.js')

const stateTypeDefs = gql`

type State {
  name: String
  total_dosage: String!
  total_manufactured: Int
}

type Query {
  state(state: String!): State
}
`;

const stateTypeResolvers = {
  Query: {
    state(parent, args, context, info) {
    // allowing child resolvers to access the arg -- 
    return args.state
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
    },
    county(parent,args){ // giving access state and county to child field nodes  
      return {state: parent, county:args.county}
    }
  }
}


const updatedStateTypeResolvers = new EnableMonitoring(stateTypeResolvers).resolvers
console.log(updatedStateTypeResolvers.Query.state)
console.log(stateTypeResolvers)

module.exports = {
  stateTypeDefs,
  updatedStateTypeResolvers
}

