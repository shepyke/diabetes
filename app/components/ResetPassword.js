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
    ScrollView
} from 'react-native';
import Styles from "../config/Styles";
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import {NavigationActions} from "react-navigation";
import { Form, TextValidator } from 'react-native-validator-form';

export default class RegistrationForm extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            user: {
                username: '',
                oldPassword: '',
                oldRepassword: '',
                newPassword: '',
                newRepassword: '',
                email: '',
            }
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handleOldPassword = this.handleOldPassword.bind(this);
        this.handleOldRepeatPassword = this.handleOldRepeatPassword.bind(this);
        this.handleNewPassword = this.handleNewPassword.bind(this);
        this.handleNewRepeatPassword = this.handleNewRepeatPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    submit = async() => {
        try {
            fetch('http://192.168.0.117:3000/users/resetPassword',{
            //fetch('https://diabetes-backend.herokuapp.com/users/resetPassword', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user:{
                        username: this.state.user.username,
                        email: this.state.user.email,
                        password: this.state.user.password,
                        repassword: this.state.user.repassword,
                    }
                })
            })
                .then((response) => response.json())
                .then ((res) => {
                    if(res.success === true){
                        alert('You have successfully modified your password, please Log in.');
                        this.resetNavigation('Home');
                    }else{
                        alert(res.message);
                    }
                })
                .done();
        }catch(err){
            console.log(err);
        }

    }

    componentWillMount() {
        Form.addValidationRule('isOldPasswordMatch', (value) => {
            if (value !== this.state.user.oldPassword) {
                return false;
            }
            return true;
        });

        Form.addValidationRule('isNewPasswordMatch', (value) => {
            if (value !== this.state.user.newPassword) {
                return false;
            }
            return true;
        });

        Form.addValidationRule('isNewPasswordMatchWithOld', (value) => {
            if (value == this.state.user.oldPassword) {
                return false;
            }
            return true;
        });

        Form.addValidationRule('minNumberFunc', (value) => {
            if (value.length < 6) {
                return false;
            }
            return true;
        });
    }

    handleEmail(event) {
        const { user } = this.state;
        user.email = event.nativeEvent.text;
        this.setState({ user });
    }

    handleUsername(event) {
        const { user } = this.state;
        user.username = event.nativeEvent.text;
        this.setState({ user });
    }

    handleOldPassword(event) {
        const { user } = this.state;
        user.oldPassword = event.nativeEvent.text;
        this.setState({ user });
    }

    handleOldRepeatPassword(event) {
        const { user } = this.state;
        user.oldRepassword = event.nativeEvent.text;
        this.setState({ user });
    }

    handleNewPassword(event) {
        const { user } = this.state;
        user.newPassword = event.nativeEvent.text;
        this.setState({ user });
    }

    handleNewRepeatPassword(event) {
        const { user } = this.state;
        user.newRepassword = event.nativeEvent.text;
        this.setState({ user });
    }

    handleSubmit() {
        this.refs.form.submit();
    }

    goToLogin = () => {
        this.props.navigation.navigate('Home');
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
        const { user } = this.state;

        return (
            <View style={Styles.wrapper}>
                <KeyboardAvoidingView id='registration' behavior='padding' />
                <View style={Styles.container}>

                    <Text style={Styles.header}>Reset my password</Text>

                    <Form
                        style={[{flex: 0.8, width: '100%'}]}
                        ref="form"
                        onSubmit={this.handleSubmit}
                    >
                        <ScrollView>
                            <TextValidator
                                style={Styles.textInput}
                                name="email"
                                label="email"
                                validators={['required', 'isEmail']}
                                errorMessages={['This field is required', 'Email invalid']}
                                placeholder="Your email address"
                                placeholderTextColor='#718792'
                                type="text"
                                keyboardType="email-address"
                                value={user.email}
                                onChange={this.handleEmail}
                            />

                            <TextValidator
                                style={Styles.textInput}
                                name="username"
                                label="username"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                type="text"
                                placeholder='Username'
                                placeholderTextColor='#718792'
                                value={user.username}
                                onChange={this.handleUsername}
                            />

                            <TextValidator
                                style={Styles.textInput}
                                name="password"
                                placeholder='Password'
                                placeholderTextColor='#718792'
                                label="password"
                                secureTextEntry={true}
                                validators={[
                                    'required',
                                    'minNumberFunc'
                                ]}
                                errorMessages={[
                                    'This field is required',
                                    'Minimum character number: 6'
                                ]}
                                type="text"
                                value={user.password}
                                onChange={this.handleNewPassword}
                            />
                            <TextValidator
                                style={Styles.textInput}
                                placeholder='Re-password'
                                placeholderTextColor='#718792'
                                name="repassword"
                                label="repassword"
                                secureTextEntry={true}
                                validators={[
                                    'isPasswordMatch',
                                    'required',
                                    'minNumberFunc'
                                ]}
                                errorMessages={[
                                    'Password mismatch',
                                    'This field is required',
                                    'Minimum character number: 6'
                                ]}
                                type="text"
                                value={user.repassword}
                                onChange={this.handleRepeatPassword}
                            />
                        </ScrollView>
                        <TouchableOpacity
                            style={[Styles.button, {marginTop: 20}]}
                            onPress={this.handleSubmit}>
                            <Text style={Styles.text}>Reset</Text>
                        </TouchableOpacity>
                    </Form>

                    <Text style={Styles.bottomtext}>
                        <Text>Your password comes to your mind? </Text>
                        <Text
                            style={Styles.register}
                            onPress={this.goToLogin}>
                            Go back to the Login page!
                        </Text>
                    </Text>

                </View>
            </View>
        );
    }
}