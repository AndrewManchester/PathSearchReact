import React, { useState,  Component } from 'react';

import {Container, Header, Button, Grid, Form, Checkbox, Dropdown } from 'semantic-ui-react'

import arrayClone from './arrayclone'
import { useMachine } from '@xstate/react';
import { Machine} from 'xstate';
import './App.css'
import  { pathFind } from './path11';
import  { lookUp } from './tables';

const blocked = "BLOCKED"
const start = "START"
const end = "END"
const clear = "CLEAR"
const path = 'PATH'

const checkBoxLookUp = { [start]:    'SETSTART',
                         [end]:      'SETEND',
                         [blocked]:  'SETBLOCKED'
                       }

function GridContainer(props) {
  
   function gridContainerStyle(cols, size) {
     //alert(`this is the ${cols}`)
     var z = {
        display: "grid",
        gridTemplateColumns: "repeat(" + cols + ", " + size + "px)",
        backgroundColor: "primary",
     }
     return z
   }

  const setClass = (value) => {
     switch (value)  {
       case blocked:  return "grid-item set-red"
      case start:  return "grid-item set-blue"
      case end:  return "grid-item set-black"
      case clear:  return "grid-item set-green"
      //case isBlocked:  return "grid-item set-red"
      default: return "grid-item set-yellow"
    }
  }
  

 const boxLayOut = () => { 
    //Use {aCol} to help debug. Shows the contents of the cells 
    var index = 0 //for key
    return props.grid.map((aRow, row) => aRow.map((aCol, col) => 
          <div onClick={() => { props.message(row, col)}} 
               className={setClass(aCol)}
               key={index++}
          >
          </div>
        ))
  }

  return (  <div style={gridContainerStyle(props.cols, props.boxSize)}>
                  {boxLayOut()}   
            </div>
        )
        
}


const DropdownExampleSearchSelectionTwo = (props) => {
  return (
  <Dropdown placeholder='Set Search Direction' 
       search selection 
       defaultValue={props.defaultValue}
       options={props.options}
       headers={props.headers}
       onChange={props.change}/>)
}

class CheckboxExampleRadioGroup extends Component {
  constructor(props) {
    super(props)
    this.state = { value: this.props.initial}
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleChange = (e, { value }) => {
    this.setState({ value })
    this.props.send({ type: checkBoxLookUp[value]})
  }

  render() {
    return (
      <Form>
          <Checkbox
            className='check'
            radio
            label='Set Start'
            name='checkboxRadioGroup'
            value={start}
            checked={this.state.value === start}
            onChange={this.handleChange}
          />
          <Checkbox
            className='check'
            radio
            label='Set End'
            name='checkboxRadioGroup'
            value={end}
            checked={this.state.value === end}
            onChange={this.handleChange}
          />
         <Checkbox
            className='check'
            radio
            label='Blocked'
            name='checkboxRadioGroup'
            value={blocked}
            checked={this.state.value === blocked}
            onChange={this.handleChange}
          />

      </Form>
    )
  }
}

function Lister(props) {
  
    let lineCount = props.lineCount
    let filler = props.filler
    let last = props.toList.length -1
    return <div className="path"
              onMouseOver={ () => props.mOver(props.toList, path)}
              onMouseOut={ () => props.mOut(props.toList, clear)}
          >
          { props.toList.map((item,i) => {
               if ( (i+1) % lineCount === 0) {
                 return ( i === last) ? <React.Fragment key={i}>{item}.<br/></React.Fragment> :
                  <React.Fragment key={i}>{item}{filler}<br/></React.Fragment> 
                   
               }
              else { 
                return ( i === last) ?  <React.Fragment key={i}>{item}.</React.Fragment> :
                  <React.Fragment key={i}>{item}{filler}</React.Fragment> 
              }
            })
          }
         </div>
  
}
   


function App()  {
  
      const boxSize = 40; //this is width, the height is defined css grid-item
      //As grid size increases user response falls
      const cols =  10 //67;
      const rows = 10 //35;
      const checkBoxOpeningValue = blocked
      const directionOpeningValue = 0
      const buttonContents = "Find Path"
      
      const buttonMachine = Machine({
      id: 'buttons',
      initial: 'normal',
      states: {
        normal: { 
        on: { 
          
               STOPSTARTPRESS:  { actions: ['findThePath'] },
               SELECTCELL:      { actions: ['cellHandler', 'resetPathsFound'] },
               SETSTART:        { actions: ['setStart',    'resetPathsFound'] },
               SETEND:          { actions: ['setEnd',      'resetPathsFound']},
               SETBLOCKED:      { actions: ['setBlocked',  'resetPathsFound']},
               CHANGESEARCH:    { actions: ['resetPathsFound']},
          }
      },
    }
});
 
   const headers = [{ text: "Normal",    diagonalSearch: false} ,
                    { text: "Diagonal",  diagonalSearch: true}]  
   const makeOptions = headers.map((aKey,index) => { 
             return { key: index, text: aKey.text, value: index}} )  

     const isEndLocation = (row, col) =>  (row === stopLoc.row && col === stopLoc.col)
     const isStartLocation = (row, col) => (row === startLoc.row && col === startLoc.col)
     
     const initialGrid = (theStart, theEnd) => {
         var temp = Array(rows).fill().map(() => Array(cols).fill(clear))
         temp[theStart.row][theStart.col] = start
         temp[theEnd.row][theEnd.col] = end
         //console.log(temp)
         return temp 
      }
      //Could have used boolean to fill the array but using 1s and 0s works better with 
      //the actual logic of the game. Can easily sum 1s and 0s 
 

      const [clickState,    setClickState] = useState(checkBoxOpeningValue)
      const [startLoc,      setStartLoc] =   useState({row: 0, col: 0})
      const [stopLoc,       setStopLoc] =   useState({row: rows-1, col: cols-1})
      const [gridFull, setGridFull]  = useState(initialGrid(startLoc, stopLoc))
      const [otherPaths, setOtherPaths] = useState([])  
      const [theSolution, setTheSolution] = useState([])  
      const [pathFound, setPathFound] = useState(false)
      const [diagonalSearch, setDiagonalSearch] = useState(false)
      const [defaultText,  setDefaultText] = useState(" ")
       
     const [current, send] = useMachine(buttonMachine, { 
     actions: {
       
          resetPathsFound: () => { setOtherPaths([])
                                   setTheSolution([])
                                   setPathFound(false)
                                   setDefaultText("   ")
                                 },
          setB:   () => { },
          cellHandler:   
            (context, event) => { 
              const {row, col} = event.data
              let gridCopy = arrayClone(gridFull)
              switch(clickState) {
                case start:
                  if (isEndLocation(row,col)) {break}
                  gridCopy[startLoc.row][startLoc.col] = clear
                  gridCopy[row][col] = start
                  setStartLoc({row: row, col: col})
                  setGridFull(gridCopy)
                  break;
                case end:
                  if (isStartLocation(row,col)) {break}
                  gridCopy[stopLoc.row][stopLoc.col] = clear
                  gridCopy[row][col] = end
                  setStopLoc({row: row, col: col})
                  setGridFull(gridCopy)

                  break;
                case blocked:
                  if (isEndLocation(row,col)) {break}
                  if (isStartLocation(row,col)) {break}
                  gridCopy[row][col] = (gridCopy[row][col] ===  
                   clear) ? blocked : clear
                  setGridFull(gridCopy)
                  break;
                default:
                  // code block
               }

            },
         setStart:    () =>  { setClickState(start) },
         setBlocked:  () =>  { setClickState(blocked) },
         setEnd:      () =>  { setClickState(end)  },
         findThePath: () =>  { const [found, theSolution, otherPaths] = pathFind(
                                     startLoc.col, startLoc.row, 
                                     stopLoc.col,   stopLoc.row, 
                                     rows, cols, findBlocked(),
                                     diagonalSearch) 
                              setTheSolution(theSolution)
                              setOtherPaths(otherPaths) 
                              setPathFound(found) 
                              setDefaultText("No paths found")     
                            }
      }
      
    }); 


const findBlocked = () => {
  let blockedCells = []
  gridFull.map( (aRow, row) => aRow.map( (aCol, col) => {
        if (aCol === blocked) {
           blockedCells.push([col,row])
        }
        
  }))
  return blockedCells
}  
 
  
const boxItemClick = (theRow, theCol) => {
    send('SELECTCELL', {data: { row: theRow, col: theCol}});
   }   

  const stopStartClick = () => {
    send('STOPSTARTPRESS');
  }
    
  const listMouseOver = (path, aValue) => {
        let gridCopy = arrayClone(gridFull)
        let presentRow = startLoc.row
        let presentCol = startLoc.col
        path.map( aDirection => { const {row, col} = lookUp[aDirection]
                                 presentRow = presentRow + row
                                 presentCol= presentCol + col
                                 gridCopy[presentRow][presentCol] = aValue
                                })
        gridCopy[stopLoc.row][stopLoc.col] = end
        setGridFull(gridCopy)
  }
  
  const dropDownOnChange =(event, data) => {
      setDiagonalSearch(data.headers[data.value].diagonalSearch)
      send('CHANGESEARCH');
  }

    //Has to JSX here
    return (
      <Container style={{margin: 10}}>
        <Header as="h1">Path Search</Header>
          <div> 
           <Button 
              onClick={stopStartClick} content={buttonContents}
           />
           <DropdownExampleSearchSelectionTwo 
               change={dropDownOnChange}
               defaultValue={directionOpeningValue}
               headers={headers}
               options={makeOptions}/>
         </div> 
         <div className="check">
        <CheckboxExampleRadioGroup 
              send={send} 
              initial={checkBoxOpeningValue}
        />
       </div>
      <Grid columns={2}>
          <Grid.Row>
           <Grid.Column>
              <GridContainer 
                message={boxItemClick} 
                boxSize={boxSize}
                rows={rows}
                cols={cols}
                grid={gridFull} 
              />

            </Grid.Column>
             <Grid.Column>
              <Header as="h3">Paths Found (Move mouse over paths)</Header>
              { pathFound ? <Lister 
                          toList={theSolution}
                          lineCount={6}
                          filler=',     '
                          mOver={listMouseOver}
                          mOut={listMouseOver}
                          /> : defaultText
              }
              <Header as="h3">Paths still open</Header>
              {otherPaths.map(aPath => 
                        <Lister 
                          toList={aPath.pathTaken}
                          lineCount={6}
                          filler=',     '
                          mOver={listMouseOver}
                          mOut={listMouseOver}
                          />
                      
                 )
               }
            </Grid.Column>
          </Grid.Row>
     </Grid>
    </Container>
    )

  
}


export default App;
