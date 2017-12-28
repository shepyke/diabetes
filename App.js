/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login  from './app/components/Login';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const NavigationApp = StackNavigator({
    Home: {screen: Login},
    }, {
      navigationOptions: {
        header: false,
      }
    }
);

export default class App extends Component<{}> {
  render() {
    return (
/*      <View style={styles.container}>
        <Text style={styles.welcome}>
          Merry Christmas!
        </Text>
        <Text style={styles.instructions}>

        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>*/
      <NavigationApp/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

});


