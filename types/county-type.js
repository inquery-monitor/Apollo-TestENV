const { gql } = require('apollo-server');
const pool = require("../db.js");


const countyTypeDefs = gql`
type County {
  name: String
  total_dosage: Int!
  total_manufactured: Int!
}

extend type State {
  county(county: String!): County!
}
`;

// NOTE: -- THE ONLY COUNTY AVAILABLE TO QUERY IS LOS ANGELES 
const countyTypeResolvers = {
  County: {
    name(parent,args) {
      if (parent.county.toLowerCase() === 'los angeles') return `Los Angeles`
      throw new Error('invalid county name')
    },
    async total_dosage(parent,args) { 
      const dosageQuery = 
       `SELECT SUM(dosage_unit) FROM county_annual 
        WHERE LOWER(buyer_county) = LOWER($1) 
        AND LOWER(buyer_state) = LOWER($2)`;
      const countyDosage = await pool.query(dosageQuery, [parent.county, parent.state]);
      return parseInt(countyDosage.rows[0].sum);
    },
    async total_manufactured(parent,args) {
      const manufacturedQuery =
       `SELECT SUM(dosage_unit::decimal) FROM mastertable
        WHERE dosage_unit ~ E'^\\\\d+.\\\\d+$'
        AND reporter_bus_act = 'MANUFACTURER'
        AND LOWER(buyer_county) = LOWER($1)
        AND LOWER(buyer_state) = LOWER($2)`;
      const countyManufactured = await pool.query(manufacturedQuery, [parent.county, parent.state]);
      return parseInt(countyManufactured.rows[0].sum)
    }
  }
}

module.exports = {
  countyTypeDefs,
  countyTypeResolvers
}