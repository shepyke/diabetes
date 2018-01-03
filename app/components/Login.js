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

export default class Login extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
                username: '',
                password: '',
        }
    }

    componentWillMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        var value = await AsyncStorage.getItem('user');
        if (value !== null){
            this.props.navigation.navigate('Profile');
        }
    }

    login = () => {
        fetch('http://192.168.0.102:3000/users',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                passwords: this.state.password,
            })
        })

        .then((response) => response.json())
        .then ((res) => {
            if(res.success === true){
                AsyncStorage.setItem('user', res.user);
                this.props.navigation.navigate('Profile');
            }else{
                alert(res.message);
            }
        })
        .done();
    }

    goToRegistration = () => {
        this.props.navigation.navigate('Registration');
    }

    render() {
        return (
            <KeyboardAvoidingView id='login' behavior='padding' style={Styles.wrapper}>
                <View style={Styles.container}>

                    <Text style={Styles.header}>LOGIN</Text>

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Username'
                        onChangeText={ (username) => this.setState( {username }) }
                        underlineColorAndroid='transparent'
                    />

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Password'
                        onChangeText={ (password) => this.setState( {password }) }
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                    />

                    <TouchableOpacity
                        style={Styles.button}
                        onPress={this.login}>
                        <Text>Log in </Text>
                    </TouchableOpacity>

                    <Text style={Styles.bottomtext}>
                        <Text>Forgot your password? </Text>
                        <Text
                            style={Styles.register}
                            onPress={this.goToRegistration}>
                            Reset my password!
                        </Text>
                    </Text>

                    <Text style={Styles.bottomtext}>
                        <Text>Not registered yet? </Text>
                        <Text
                            style={Styles.register}
                            onPress={this.goToRegistration}>
                                Register now!
                        </Text>
                    </Text>

                </View>
            </KeyboardAvoidingView>
        );
    }
}
