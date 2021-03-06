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
import Diary from '../components/Diary';
import Diagram from '../components/Diagram';
import BarcodeScanner from '../components/BarcodeScanner';

export const Tabs = TabNavigator({
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={26} color={tintColor} />
            },
        },
        Intake: {
            screen: Intake,
            navigationOptions: {
                tabBarLabel: 'Intake',
                tabBarIcon: ({ tintColor }) => <Icon name="list" size={26} color={tintColor} />,
            },
        },
        Diary: {
            screen: Diary,
            navigationOptions: {
                tabBarLabel: 'Diary',
                tabBarIcon: ({ tintColor }) => <Icon type="entypo" name="open-book" size={25} color={tintColor} />,
            },
        },
        Diagram: {
            screen: Diagram,
            navigationOptions: {
                tabBarLabel: 'Chart',
                tabBarIcon: ({ tintColor }) => <Icon name="show-chart" size={26} color={tintColor} />,
            },
        },
        BarcodeScanner: {
            screen: BarcodeScanner,
            navigationOptions: {
                tabBarLabel: 'Scan',
                tabBarIcon: ({ tintColor }) => <Icon type="material-community" name="barcode-scan" size={25} color={tintColor} />,
            },
        }
    },
    {
        tabBarPosition: 'bottom',
        animationEnabled: true,
        swipeEnabled: true,
        activeTintColor: '#718792',
        tabBarOptions: {
            style: {
                backgroundColor: '#718792',
            },
            labelStyle: {
                fontSize: 10,
            },
            showIcon:true
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

