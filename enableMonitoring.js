// const enableTracking = require('./enableTracking.js')
// const mapResolvers = require('./mapResolvers.js')
// const grabFields = require('./grabFields.js')

const stateTypeResolvers = {
  Query: {
    state(parent, args, context, info) {
    // allowing child resolvers to access the arg -- 
    return 'California'
    } 
  },
  State: {
    async name(parent,args) {
     console.log("fuck")
    },
    async total_dosage(parent,args) {
    console.log(21)
    },
  
    async total_manufactured(parent,args) {
      console.log(421312)
    },
    county(parent,args){ // giving access state and county to child field nodes  
      return {state: parent, county:args.county}
    }
  }
}


const mockResolverObject = {
  async name(parent,args) {
   console.log("fuck")
  },
  async total_dosage(parent,args) {
  console.log(21)
  },

  async total_manufactured(parent,args) {
    console.log(421312)
  },
  county(parent,args){ // giving access state and county to child field nodes  
    return {state: parent, county:args.county}
  }
}


class enableMonitoring{
  constructor(resolvers){
    this.resolvers = mapResolvers(resolvers);
  }
}

// enables tracking for each respective GraphQLObjectType
function enableTracking(resolversObject) {
// takes resolvers object of key value pairs
const newResolversObject = {}
const fields = Object.keys(resolversObject);
const resolverFunctions = Object.values(resolversObject);

const updatedResolverFunctions = resolverFunctions.map((resolverFunc,index) => {
  const fieldName = fields[index];
  const currentResolver =  async function(...args) {
  console.log(`Currently tracking the ${fieldName} resolver.`);
  return resolverFunc(...args);
}
  Object.defineProperty(currentResolver,'name', {value:fieldName,writable:true})
  return currentResolver
})

fields.forEach((field,index) => {
  newResolversObject[field] = updatedResolverFunctions[index]
})

return newResolversObject
}


// higher order function that calls upon enableTracking 
function mapResolvers(originalResolversObject) {
const updatedResolvers = {}
const queries = Object.keys(originalResolversObject) // custom query types 
const resolvers = Object.values(originalResolversObject); // object containing a bunch of objects key value pairs of resolvers & field names


queries.forEach((key,index)=>{
  updatedResolvers[key] = enableTracking(resolvers[index]) // should return an object which contains keys of 
})

return updatedResolvers

}


const updated = (enableTracking(mockResolverObject));

// console.log(mapResolvers(stateTypeResolvers).State.name())
// console.log(stateTypeResolvers.Query.state())


module.exports = enableMonitoring