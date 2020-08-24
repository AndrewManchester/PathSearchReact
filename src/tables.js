var horVerOffsets = [{
  direction: "North",
  xOffset: 0,
  yOffset: -1
}, {
  direction: "East",
  xOffset: +1,
  yOffset: 0
}, {
  direction: "South",
  xOffset: 0,
  yOffset: 1
}, {
  direction: "West",
  xOffset: -1,
  yOffset: 0
}]

var diagOffsets = [ {
  direction: "North East",
  xOffset: +1,
  yOffset: -1
},  {
  direction: "South East",
  xOffset: +1,
  yOffset: +1
},  {
  direction: "South West",
  xOffset: -1,
  yOffset: +1
}, {
  direction: "North West",
  xOffset: -1,
  yOffset: -1
  
}]

const lookUp  = [...horVerOffsets, ...diagOffsets].reduce( (accum, value) => 
{ return {...accum ,
  ...{[value.direction]: 
  {row: value.yOffset, col: value.xOffset}  }}}, {});
  
//Create this 
//{
//  North: { row: -1, col: 0 },
//  East: { row: 0, col: 1 },
//  South: { row: 1, col: 0 },
//  West: { row: 0, col: -1 },
//  'North East': { row: -1, col: 1 },
//  'South East': { row: 1, col: 1 },
//  'South West': { row: 1, col: -1 },
//  'North West': { row: -1, col: -1 }
//}


export{ lookUp, horVerOffsets, diagOffsets }
