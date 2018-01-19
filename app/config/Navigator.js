/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';
import { Icon } from 'react-native-elements';
import Login  from '../components/Login';
import Profile  from '../components/Profile';
import RegistrationForm  from '../components/RegistrationForm';
import Intake from '../components/Intake';
import Diagram from '../components/Diagram';

export const Tabs = TabNavigator({
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={30} color={tintColor} />
            },
        },
        Intake: {
            screen: Intake,
            navigationOptions: {
                tabBarLabel: 'Intake',
                tabBarIcon: ({ tintColor }) => <Icon name="list" size={30} color={tintColor} />,
            },
        },
        Diagram: {
            screen: Diagram,
            navigationOptions: {
                tabBarLabel: 'Diagram',
                tabBarIcon: ({ tintColor }) => <Icon name="graph" size={30} color={tintColor} />,
            },
        },
    },
    {
        tabBarPosition: 'bottom',
        animationEnabled: true,
        activeTintColor: '#718792',
        tabBarOptions: {
            style: {
                backgroundColor: '#718792',
            },
        },
    }
);

export const Root = StackNavigator({
        Home: {screen: Login},
        Registration: {screen: RegistrationForm},
        Tabs: {screen: Tabs},
    }, {
        navigationOptions: {
            header: false,
        }
    }
);

