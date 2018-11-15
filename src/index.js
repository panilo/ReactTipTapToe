import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Game from './Game';
import './game.css';

ReactDOM.render(
  <Header />,
  document.getElementById('root')
);

ReactDOM.render(
  <Game />,
  document.getElementById('container') 
);