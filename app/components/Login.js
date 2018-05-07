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
    NetInfo,
} from 'react-native';
import Styles from "../config/Styles";
import { NavigationActions } from 'react-navigation';
import { sha256 } from 'react-native-sha256';


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
                birthDay: '',
                gender: '',
                type: '',
            },
            isConnected: false
        }
        if(typeof global.self === "undefined")
        {
            global.self = global;
        }
    }

    componentDidMount(){
        NetInfo.getConnectionInfo().then(this.handleConnectivityChange);
        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
        this._loadInitialState().done();
    }

    handleConnectivityChange = async (status) => {
        const { type } = status;
        let probablyHasInternet;
        try {
            const googleRequest = await fetch('https://www.google.com', {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            });
            probablyHasInternet = googleRequest.status === 200;
            this.setState({
                isConnected: probablyHasInternet
            })
        } catch (e) {
            probablyHasInternet = false;
            alert('It seems you are offline, please connect to a network');
            this.setState({
                isConnected: probablyHasInternet
            });
        }

        console.log(`@@ isConnected: ${probablyHasInternet}`);

    }

    _loadInitialState = async() => {
        let value = await AsyncStorage.getItem('user');
        if (value !== null){
            this.resetNavigation('Tabs');
        }
    }

    login = async() => {
        if (this.state.isConnected){
            try{
                await fetch('https://diabetes-backend.herokuapp.com/users/login',{
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
                        this.setState({
                            user: res.user,
                        });
                        AsyncStorage.setItem('user', JSON.stringify(this.state.user));
                        this.resetNavigation('Tabs');
                    }else{
                        alert(res.message);
                    }
                })
                .done();
            }catch(err){
                console.log(err);
            }
        }else{
            alert('It seems you are offline, please connect to a network');
        }
    }

    goToRegistration = () => {
        this.props.navigation.navigate('Registration');
    }

    resetNavigation(targetRoute) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
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
                                    var securePswd;
                                    sha256(password).then( hash => {
                                        securePswd = hash;
                                        const user = Object.assign({},
                                            this.state.user, { password: securePswd });
                                        this.setState({ user: user });
                                    });
                                }}
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                        />

                        <TouchableOpacity
                            style={Styles.button}
                            onPress={this.login}>
                            <View>
                                <Text>Log in </Text>
                            </View>
                        </TouchableOpacity>

                        {/*<Text style={Styles.bottomtext}>*/}
                            {/*<Text>Forgot your password? </Text>*/}
                            {/*<Text*/}
                                {/*style={Styles.register}*/}
                                {/*onPress={this.goToRegistration}>*/}
                                {/*Reset my password!*/}
                            {/*</Text>*/}
                        {/*</Text>*/}

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
