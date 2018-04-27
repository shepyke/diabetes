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
import RadioForm,
    {
        RadioButton,
        RadioButtonInput,
        RadioButtonLabel
    } from 'react-native-simple-radio-button';
import Moment from 'moment';
import {NavigationActions} from "react-navigation";
import { Form, TextValidator } from 'react-native-validator-form';

let gender_props = [
    {label: 'Female     ', value: 'Female' },
    {label: 'Male', value: 'Male' }
];

let type_props = [
    {label: 'Type 1     ', value: '1' },
    {label: 'Type 2     ', value: '2' },
    {label: 'None', value: '0' }
];

export default class RegistrationForm extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            user: {
                username: '',
                password: '',
                repassword: '',
                firstName: '',
                lastName: '',
                email: '',
                profileImage: '',
                birthDay: '',
                gender: '',
                type: '',
            }
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRepeatPassword = this.handleRepeatPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    submit = async() => {
        try {
            fetch('https://diabetes-backend.herokuapp.com/users/registration', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user:{
                        firstName: this.state.user.firstName,
                        lastName: this.state.user.lastName,
                        username: this.state.user.username,
                        email: this.state.user.email,
                        birthDay: this.state.user.birthDay,
                        profileImage:
                            (this.state.user.gender == 'Female')
                                ? 'https://diabetes-backend.herokuapp.com/uploads/anonym_woman.png'
                                : 'https://diabetes-backend.herokuapp.com/uploads/anonym_man.png',
                        gender: this.state.user.gender,
                        type: this.state.user.type,
                        password: this.state.user.password,
                        repassword: this.state.user.repassword,
                    }
                })
            })
                .then((response) => response.json())
                .then ((res) => {
                    if(res.success === true){
                        this.setState({
                            user: res.user,
                        });
                        AsyncStorage.setItem('user', JSON.stringify(this.state.user));
                        alert('You have successfully registered');
                        this.resetNavigation('Tabs');
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
        Form.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.user.password) {
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

    handlePassword(event) {
        const { user } = this.state;
        user.password = event.nativeEvent.text;
        this.setState({ user });
    }

    handleRepeatPassword(event) {
        const { user } = this.state;
        user.repassword = event.nativeEvent.text;
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

                    <Text style={Styles.header}>Registration</Text>

                    <Form
                        style={[{flex: 0.8, width: '100%'}]}
                        ref="form"
                        onSubmit={this.handleSubmit}
                    >
                        <ScrollView>
                            <View style={[Styles.rowContainer, {justifyContent: 'space-evenly'}]}>
                                <TextInput
                                    style={[Styles.textInput, {width: '45%', textAlign: 'center'}]}
                                    placeholder='First Name'
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#718792'
                                    onPress={(firstName) => {
                                        const user = Object.assign({},
                                            this.state.user, { firstName: firstName });
                                        this.setState({ user: user })
                                    }}
                                />

                                <TextInput
                                    style={[Styles.textInput, {width: '45%', textAlign: 'center'}]}
                                    placeholder='Last name'
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#718792'
                                    onPress={(lastName) => {
                                        const user = Object.assign({},
                                            this.state.user, { lastName: lastName });
                                        this.setState({ user: user })
                                    }}
                                />
                            </View>

                            <DatePicker
                                style={[{alignSelf: 'stretch', marginBottom: 10,
                                        width: '100%', height: 40}]}
                                date={this.state.user.birthDay}
                                mode="date"
                                placeholder="Select your birthday"
                                format="YYYY-MM-DD"
                                minDate="1900-01-01"
                                maxDate={Moment().format('YYYY-MM-DD')}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={true}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0,
                                        alignSelf: 'center',
                                    },
                                    dateText: {
                                        alignSelf: 'center',
                                        fontSize: 16,
                                        color: '#fff',
                                    },
                                    placeholderText: {
                                        alignSelf: 'center',
                                        fontSize: 16,
                                        color: '#718792',
                                    }
                                }}
                                onDateChange={(birthDay) => {
                                    const user = Object.assign({},
                                        this.state.user, { birthDay: birthDay });
                                    this.setState({ user: user });
                                }}
                            />

                            <RadioForm
                                style={[{alignSelf: 'center'}]}
                                radio_props={gender_props}
                                labelColor={'#718792'}
                                initial={'Female'}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={'#718792'}
                                animation={true}
                                onPress={(gender) => {
                                    const user = Object.assign({},
                                        this.state.user, { gender: gender });
                                    this.setState({ user: user })
                                }}
                            />

                            <RadioForm
                                style={[{alignSelf: 'center', marginBottom: 20}]}
                                radio_props={type_props}
                                labelColor={'#718792'}
                                initial={'0'}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={'#718792'}
                                animation={true}
                                onPress={(type) => {
                                    const user = Object.assign({},
                                        this.state.user, { type: type });
                                    this.setState({ user: user })
                                }}
                            />

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
                                onChange={this.handlePassword}
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
                            <Text style={Styles.text}>Sign up</Text>
                        </TouchableOpacity>
                    </Form>

                    <Text style={Styles.bottomtext}>
                        <Text>Already have an account? </Text>
                        <Text
                            style={Styles.register}
                            onPress={this.goToLogin}>
                            Go to the Login page!
                        </Text>
                    </Text>

                </View>
            </View>
        );
    }
}