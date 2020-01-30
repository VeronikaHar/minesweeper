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