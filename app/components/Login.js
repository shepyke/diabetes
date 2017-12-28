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
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class Login extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
                username: '',
                password: '',
        }
    }

    isUserPreLogged(){
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

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
                <View style={styles.container}>

                    <Text style={styles.header}>LOGIN</Text>

                    <TextInput
                        style={styles.textInput}
                        placeholder='Username'
                        onChangeText={ (username) => this.setState( {username }) }
                        underlineColorAndroid='transparent'
                    />

                    <TextInput
                        style={styles.textInput}
                        placeholder='Password'
                        onChangeText={ (password) => this.setState( {password }) }
                        underlineColorAndroid='transparent'
                    />

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.login}>
                        <Text>Log in </Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    wrapper:{
      flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    },
    textInput: {
        alignSelf: 'stretch',
        padding: 16,
        marginBottom: 20,
        color: '#333333',
    },
    btn: {
        alignSelf: 'stretch',
        backgroundColor: 'darkgreen',
        padding: 20,
        alignItems: 'center',
    },

});
