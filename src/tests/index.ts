import _ from "lodash";


const a = {
  a: "ssss",
  b: ['ss', 'ff'],
  f: "ssss"
}

const b = {
  b: ['ff', 'll'],
  f: '"""""'
}


console.log(_.mergeWith({}, a, b, (s, d)=> {

  if (Array.isArray(s)) {
      console.log('>', d)
    return d
  }
  return undefined;
})) 