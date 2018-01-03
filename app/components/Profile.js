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
import Navigator from "../config/Navigator";
import Styles from "../config/Styles";

export default class Profile extends Component<{}> {

/*
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    repassword: '',
*/

    render() {
        return (
            <View style={styles.container}>

                <Text style={styles.header}>Welcome +Username+</Text>

            </View>
        );
    }
}
