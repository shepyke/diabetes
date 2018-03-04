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

export default class Intake extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            intake: {
                userId: '',
                foodId: '',
                amount: '',
                time: '',
            },
            foods: [
                {
                    foodId: '',
                    barcode: '',
                    calorie: '',
                    carbohydrate: '',
                    fat: '',
                    foodName: '',
                    glycemicIndex: '',
                    photo: '',
                    protein:'',
                },
            ],
            isLoading: true,
        }
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        this.setState(
            {intake:
                {
                    userId: value['userId'],
                }
            }
        );
        try {
            fetch('http://172.20.10.4:3000/intakes/foods')
                .then((response) => response.json())
                .then((res) => {
                    this.state.foods = res.foods;
                    console.log("this.state.foods: " + JSON.stringify(this.state.foods,null,4));
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
            fetch('http://172.20.10.4:3000/intakes/addIntake', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    intake:{
                        userId: this.state.intake.userId,
                        foodId: this.state.intake.foodId,
                        amount: this.state.intake.amount,
                        time: this.state.intake.time,
                    }
                })
            })
                .then((response) => response.json())
                .then ((res) => {
                    if(res.success === true){
                        alert('You have successfully added an intake to your diary');
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
                <Text style={Styles.header}>INTAKE</Text>

                <Picker
                    style={Styles.drowdown}
                    selectedValue={this.state.intake.foodId}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => {
                        const intake = Object.assign({},
                            this.state.intake, {foodId: itemValue});
                        this.setState({intake: intake});
                        console.log("intake: " + JSON.stringify(this.state.intake,null,4));
                        }
                    }>
                    {this.state.foods.map((item) => {
                        return (<Picker.Item label={item.foodName} value={item.foodId} key={item.foodId}/>)
                    })}

                </Picker>

                <TextInput
                    style={Styles.textInput}
                    placeholder='Amount'
                    keyboardType = 'numeric'
                    maxLength={6}
                    onChangeText={
                        (amount) => {
                            const intake = Object.assign({},
                                this.state.intake, { amount: amount });
                            this.setState({ intake: intake });
                        }}
                    underlineColorAndroid='transparent'
                />

                <DatePicker
                    style={Styles.birthDay}
                    date={this.state.intake.time}
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
                        const intake = Object.assign({},
                            this.state.intake, { time: time });
                        this.setState({ intake: intake});
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
