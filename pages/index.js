import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  /** initializes state */
  state = {
    mines: 5,
    boardSize: 4,
    mineIndeces: [],
  }

  //create a deskboard of assigned size
  createBoard() {
    let squareArr = [];
    for (let i = 0; i < (this.state.boardSize * this.state.boardSize); i++) {
      squareArr.push(
        <Square
          key={i}
        />)
    }
    return squareArr;

  }

  //assign random indeces from the board to mines
  placeMine = () => {
    let mineIndeces = [];
    for (let i = 0; mineIndeces.length < this.state.mines; i++) {
      let index = Math.floor(Math.random() * this.state.boardSize * this.state.boardSize);
      if (mineIndeces.indexOf(index) === -1) {
        mineIndeces.push(index);
      }
    }
    mineIndeces.sort((a, b) => a - b);
    this.setState({ mineIndeces });
  }

  componentDidMount() {
    this.placeMine()
  }

  render() {
    return (
      <Layout title={`Minesweeper (active)`}>
        <Desk boardSize={this.state.boardSize}>
          {this.createBoard()}
          {console.log(this.state)}
        </Desk>
      </Layout>
    )
  }
}