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

var gender_props = [
    {label: 'Female    ', value: 'F' },
    {label: 'Male', value: 'M' }
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
                birthDate: '',
                gender: '',
                type: '',
                bloodSugarAVG: '',
            }
        }
    }

    submit = async() => {
       try {
            fetch('http://172.20.10.12:3000/users/registration', {
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
                        birthDate: this.state.user.birthDate,
                        //profileImage: this.state.user.profileImage,
                        gender: this.state.user.gender,
                        type: this.state.user.type,
                        //bloodSugarAVG: this.state.user.bloodSugarAVG,
                        password: this.state.user.password,
                        repassword: this.state.user.repassword,
                    }
                })
            })
            .then((response) => response.json())
            .then ((res) => {
                if(res.success === true){
                    console.log("hopp itt a response: " + res.user);
                    AsyncStorage.setItem('user', JSON.stringify(res.user));
                    this.props.navigation.navigate('Profile');
                    alert('You have successfully registered');
                }else{
                    alert(res.message);
                }
            })
            .done();
        }catch(err){
           console.log(err);
       }

    }

    goToLogin = () => {
        this.props.navigation.navigate('Home');
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
                        initial={'F'}
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
                        style={Styles.birthDate}
                        date={this.state.user.birthDate}
                        mode="date"
                        placeholder="Select your birthday"
                        format="YYYY-MM-DD"
                        minDate="1900-01-01"
                        maxDate={new Date()}
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
                        onDateChange={(birthDate) => {
                            const user = Object.assign({},
                                this.state.user, { birthDate: birthDate });
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
            </View>
        );
    }
}