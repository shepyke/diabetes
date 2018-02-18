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

export default class Diagram extends Component<{}> {

    render() {
        return (
            <View style={Styles.wrapper}>
                <Text style={Styles.header}>DIAGRAM</Text>
            </View>
        );
    }
}
