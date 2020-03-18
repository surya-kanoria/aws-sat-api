import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RadioButton from './Radio';

export default class App extends Component {
  state = {
    satellite: null
}

radioChangeHandler = (event) => {

    this.setState({
        satellite: event.target.value
    });
}

  render() {
      return (
        <div>
        <h1>
          Welcome to Satellite imagery
        </h1>
        <div>
          <p> Choose a satellite</p>
          <RadioButton onChange={this.radioChangeHandler} checked={false} value={"Landsat"} label={"Landsat"}/>
        </div>
        </div>
      );
  }
};
