/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    Picker,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import Styles from "../config/Styles";
import DatePicker from 'react-native-datepicker';

export default class Diary extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            diary: {
                userId: '',
                insulin: '',
                sugar: '',
                time: '',
            },
            isLoading: true,
        }
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        let date = new Date();
        this.setState(
            {diary:
                    {
                        userId: value['userId'],
                        time: date,
                    }
            }
        );
        try{
            fetch('http://172.20.10.4:3000/diary/getDiary',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.state.diary.userId,
                    time: this.state.diary.time,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    console.log("res.diary: " + res.diary);
                    this.state.diary = res.diary;
                    console.log("this.state.diary: " + JSON.stringify(this.state.diary,null,4));
                    this.setState({
                        isLoading: false
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }catch(error){
            console.error(error);
        }
    }

    submit = async() => {
        try {
            fetch('http://172.20.10.4:3000/diary/addMeasurement', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diary:{
                        userId: this.state.diary.userId,
                        insulin: this.state.diary.insulin,
                        sugar: this.state.diary.sugar,
                        time: this.state.diary.time,
                    }
                })
            })
                .then((response) => response.json())
                .then ((res) => {
                    if(res.success === true){
                        alert('You have successfully added a new measurement');
                    }else{
                        alert(res.message);
                    }
                })
                .done();
        }catch(err){
            console.log(err);
        }

    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={Styles.wrapper}>

                    <Text style={Styles.header}>Loading...</Text>
                </View>
            )
        }
        return (
            <View style={Styles.wrapper}>
                <Text style={Styles.header}>DIARY</Text>

                <TextInput
                    style={Styles.textInput}
                    placeholder='Insulin'
                    keyboardType = 'numeric'
                    maxLength={6}
                    onChangeText={
                        (insulin) => {
                            const diary = Object.assign({},
                                this.state.diary, { insulin: insulin });
                            this.setState({ diary: diary });
                        }}
                    underlineColorAndroid='transparent'
                />

                <TextInput
                    style={Styles.textInput}
                    placeholder='Sugar'
                    keyboardType = 'numeric'
                    maxLength={6}
                    onChangeText={
                        (sugar) => {
                            const diary = Object.assign({},
                                this.state.diary, { sugar: sugar });
                            this.setState({ diary: diary });
                        }}
                    underlineColorAndroid='transparent'
                />

                <DatePicker
                    style={Styles.birthDay}
                    date={this.state.diary.time}
                    mode="datetime"
                    placeholder="When?"
                    format="YYYY-MM-DD HH:MM"
                    minDate="1900-01-01 00:00"
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
                    onDateChange={(time) => {
                        const diary = Object.assign({},
                            this.state.diary, { time: time });
                        this.setState({ diary: diary});
                    }}
                />

                <TouchableOpacity
                    style={Styles.button}
                    onPress={this.submit}>
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
