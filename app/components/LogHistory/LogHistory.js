import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

// Import the transition library
import { createTransition, Fade } from 'react-native-transition';

import WalletLogs from './WalletLogs'
import WellLogs from './WellLogs.js'


// Create Transition component using FlipX transition
const Transition = createTransition(Fade);

export default class Demo extends Component {
  state = {
    page: 'Wallet',
  }

  onSwipe = () => {
    if (this.state.page === 'Wallet') {
      this.setState({
        page: 'Well'
      })
      Transition.show(
        <WellLogs onSwipe={this.onSwipe} />,
      );
    } else {
      this.setState({
        page: 'Wallet'
      })
      Transition.show(
        <WalletLogs onSwipe={this.onSwipe} />,
      );
    }
  }

  render() {
    // Render an initial state
    return (
      <Transition duration={600} onTransitioned={(item) => console.log('Complete', item) }>
        <WalletLogs onSwipe={this.onSwipe} />
      </Transition>
    );
  }
};
