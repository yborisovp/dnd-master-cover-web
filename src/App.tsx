import React from 'react';
import Enemy from "./Cards/Enemy"
import './App.scss';
import EnemyGrid from './grid/EnemyGrid';
import InitiativeList from './initiativeList/InitiativeList';

function App() {
  return (
    <div className="App">
      <InitiativeList/>
      <EnemyGrid/>
    </div>
  );
}

export default App;
