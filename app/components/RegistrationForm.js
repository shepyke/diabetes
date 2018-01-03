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

export default class RegistrationForm extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            repassword: '',
        }
    }

    submit = () => {
        alert('siker');
    }

    goToLogin = () => {
        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <KeyboardAvoidingView id='registration' behavior='padding' style={Styles.wrapper}>
                <View style={Styles.container}>

                    <Text style={Styles.header}>Registration</Text>

                    <TextInput
                        style={Styles.textInput}
                        placeholder='First Name'
                        onChangeText={ (firstName) => this.setState( {firstName }) }
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#718792'
                    />

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Last name'
                        onChangeText={ (lastName) => this.setState( {lastName }) }
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#718792'
                    />

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Email'
                        onChangeText={ (email) => this.setState( { email }) }
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#718792'
                    />

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Username'
                        onChangeText={ (username) => this.setState( {username }) }
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#718792'
                    />

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Password'
                        placeholderTextColor='#718792'
                        onChangeText={ (password) => this.setState( {password }) }
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                    />

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Password again'
                        placeholderTextColor='#718792'
                        onChangeText={ (repassword) => this.setState( {repassword }) }
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                    />

                    <TouchableOpacity
                        style={Styles.button}
                        onPress={this.submit}>
                        <Text style={Styles.text}>Sign up</Text>
                    </TouchableOpacity>

                    <Text style={Styles.bottomtext}>
                        <Text>Already have account? </Text>
                        <Text
                            style={Styles.register}
                            onPress={this.goToLogin}>
                            Go to the Login page!
                        </Text>
                    </Text>

                </View>
            </KeyboardAvoidingView>
        );
    }
}