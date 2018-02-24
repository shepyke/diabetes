/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import Styles from "../config/Styles";
import { LineChart, YAxis, XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

export default class Diagram extends React.PureComponent {

    render() {

        const data = [ 350, -200, 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
        const dates = [ '2018-02-18 20:00', '2018-02-18 20:10', '2018-02-18 20:20', '2018-02-18 20:30',
            '2018-02-18 20:40', '2018-02-18 20:50', '2018-02-18 21:00', '2018-02-18 21:10',
            '2018-02-18 21:20', '2018-02-18 21:30', '2018-02-18 21:40', '2018-02-18 21:50',
            '2018-02-18 22:00', '2018-02-18 22:10', '2018-02-18 22:20', '2018-02-18 22:30',
            '2018-02-18 22:40'
        ]

        const contentInset = { top: 20, bottom: 20 }

        return (
            <View style={Styles.wrapper}>
                <Text style={Styles.header}>DIAGRAM</Text>
                <View style={ { height: 200, flexDirection: 'row' } }>
                    <YAxis
                        data={ data }
                        contentInset={ contentInset }
                        labelStyle={ { color: 'grey' } }
                        formatLabel={ value => `${value}ºC` }
                    />
                    <LineChart
                        style={ { flex: 1, marginLeft: 16 } }
                        data={ data }
                        svg={{
                            stroke: 'rgb(134, 65, 244)',
                        }}
                        shadowSvg={ {
                            stroke: 'rgba(134, 65, 244, 0.2)',
                            strokeWidth: 5,
                        }}
                        contentInset={ contentInset }
                        curve={ shape.curveLinear }
                    />
                </View>
            </View>
        )
    }

}