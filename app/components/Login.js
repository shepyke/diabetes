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

export default class Login extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            user: {
                userId: '',
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                profileImage: '',
                birthDate: '',
                gender: '',
                type: '',
                bloodSugarAVG: '',
            }
        }
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let value = await AsyncStorage.getItem('user');
        if (value !== null){
            this.props.navigation.navigate('Tabs');
        }
    }

    login = () => {
        try{
            fetch('https://diabetes-backend.herokuapp.com/users/login',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.user.username,
                    password: this.state.user.password,
                })
            })

            .then((response) => response.json())
            .then ((res) => {
                if(res.success === true){
                    AsyncStorage.setItem('user', JSON.stringify(res.user));
                    this.props.navigation.navigate('Tabs');
                }else{
                    alert(res.message);
                }
            })
            .done();
        }catch(err){
            console.log(err);
        }
    }

    goToRegistration = () => {
        this.props.navigation.navigate('Registration');
    }

    render() {
        return (
            <View style={Styles.wrapper}>

                <KeyboardAvoidingView id='login' behavior='padding'/>

                    <View style={Styles.container}>

                        <Text style={Styles.header}>LOGIN</Text>

                        <TextInput
                            style={Styles.textInput}
                            placeholder='Username'
                            onChangeText={
                                (username) => {
                                    const user = Object.assign({},
                                        this.state.user, { username: username });
                                    this.setState({ user: user });
                            }}
                            underlineColorAndroid='transparent'
                        />

                        <TextInput
                            style={Styles.textInput}
                            placeholder='Password'
                            onChangeText={
                                (password) => {
                                    const user = Object.assign({},
                                        this.state.user, { password: password });
                                    this.setState({ user: user });
                                }}
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

            </View>
        );
    }
}
