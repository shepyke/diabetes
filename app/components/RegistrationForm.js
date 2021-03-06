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
import DatePicker from 'react-native-datepicker';
import RadioForm,
{
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';
import Moment from 'moment';
import {NavigationActions} from "react-navigation";

let gender_props = [
    {label: 'Female    ', value: 'Female' },
    {label: 'Male', value: 'Male' }
];

let type_props = [
    {label: 'Type 1    ', value: '1' },
    {label: 'Type 2', value: '2' }
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
    }

    submit = async() => {
        if(this.state.user.password === this.state.user.repassword){
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
                                    ? 'https://storage.googleapis.com/diabetes-93dcc.appspot.com/anonym_woman.png'
                                    : 'https://storage.googleapis.com/diabetes-93dcc.appspot.com/anonym_man.png',
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
        }else{
            alert('The re-password is mismatching');
        }

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
        return (
            <View style={Styles.wrapper}>
                <KeyboardAvoidingView id='registration' behavior='padding' />
                <View style={Styles.container}>

                    <Text style={Styles.header}>Registration</Text>

                    <View style={Styles.rowContainer}>

                        <TextInput
                            style={[Styles.textInput, {width: '45%'}]}
                            placeholder='First Name'
                            onChangeText={
                                (firstName) => {
                                    const user = Object.assign({},
                                        this.state.user, { firstName: firstName });
                                    this.setState({ user: user });
                                }}
                            underlineColorAndroid='transparent'
                            placeholderTextColor='#718792'
                        />

                        <TextInput
                            style={[Styles.textInput, {width: '45%', marginLeft: '7%'}]}
                            placeholder='Last name'
                            onChangeText={
                                (lastName) => {
                                    const user = Object.assign({},
                                        this.state.user, { lastName: lastName });
                                    this.setState({ user: user });
                                }}
                            underlineColorAndroid='transparent'
                            placeholderTextColor='#718792'
                        />
                    </View>

                    <RadioForm
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
                        radio_props={type_props}
                        labelColor={'#718792'}
                        initial={'1'}
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

                    <TextInput
                        style={Styles.textInput}
                        placeholder='Email'
                        onChangeText={
                            (email) => {
                                const user = Object.assign({},
                                    this.state.user, { email: email });
                                this.setState({ user: user });
                            }}
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#718792'
                    />

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
                        placeholderTextColor='#718792'
                    />

                    <DatePicker
                        style={Styles.birthDay}
                        date={this.state.user.birthDay}
                        mode="date"
                        placeholder="Select your birthday"
                        format="YYYY-MM-DD"
                        minDate="1900-01-01"
                        maxDate={Moment().format('YYYY-MM-DD')}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        customStyles={{
                            dateInput: {
                                borderWidth: 0,
                                position: 'absolute',
                                marginLeft: 0,
                                left: 0,
                            },
                            dateText: {
                                color: '#fff',
                            },
                            placeholderText: {
                                color: '#718792',
                            },
                        }}
                        onDateChange={(birthDay) => {
                            const user = Object.assign({},
                                this.state.user, { birthDay: birthDay });
                            this.setState({ user: user });
                        }}
                    />
                    <View style={Styles.rowContainer}>
                        <TextInput
                            style={[Styles.textInput, {width: '45%'}]}
                            placeholder='Password'
                            placeholderTextColor='#718792'
                            onChangeText={
                                (password) => {
                                    const user = Object.assign({},
                                        this.state.user, { password: password });
                                    this.setState({ user: user });
                                }}
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                        />

                        <TextInput
                            style={[Styles.textInput, {width: '45%', marginLeft: '7%'}]}
                            placeholder='Password again'
                            placeholderTextColor='#718792'
                            onChangeText={
                                (repassword) => {
                                    const user = Object.assign({},
                                        this.state.user, { repassword: repassword });
                                    this.setState({ user: user });
                                }}
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity
                        style={Styles.button}
                        onPress={this.submit}>
                        <View>
                            <Text style={Styles.text}>Sign up</Text>
                        </View>
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
            </View>
        );
    }
}