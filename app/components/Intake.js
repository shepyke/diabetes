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
import Moment from 'moment';
import { Icon } from 'react-native-elements';

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
                    unit: '',
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
        let date = Moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            fetch('https://diabetes-backend.herokuapp.com/intakes/foods')
                .then((response) => response.json())
                .then((res) => {
                    this.state.foods = res.foods;
                    console.log("this.state.foods: " + JSON.stringify(this.state.foods,null,4));

                    this.setState({
                        intake:
                            {
                                ...this.state.intake,
                                userId: value['userId'],
                                foodId: this.state.foods[0].foodId,
                                time: date,
                            },
                        isLoading: false,
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
            fetch('https://diabetes-backend.herokuapp.com/intakes/addIntake', {
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
                    },
                    food: this.state.foods[this.state.intake.foodId-1],
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
                    style={Styles.dropdown}
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

                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={[Styles.textInput,{width: '80%'}]}
                        placeholder='Amount'
                        placeholderTextColor='white'
                        keyboardType = 'numeric'
                        maxLength={6}
                        onChangeText={
                            (amount) => {
                                const intake = Object.assign({},
                                    this.state.intake, { amount: amount });
                                this.setState({ intake: intake });
                            }}
                        underlineColorAndroid='white'
                    />
                    <Text style={[Styles.text,{width: '5%', alignSelf: 'center', fontSize: 16, marginRight: 10}]}>
                        {this.state.foods[this.state.intake.foodId-1].unit}
                    </Text>
                    <Icon
                        type="font-awesome"
                        name="question-circle"
                        size={26}
                        color={'white'}
                        style={{position: 'absolute', right: 5}}
                        onPress={() => alert("Please note, the calculation based on 100" + this.state.foods[this.state.intake.foodId-1].unit)}
                    />
                </View>

                <DatePicker
                    style={Styles.birthDate}
                    date={this.state.intake.time}
                    mode="datetime"
                    placeholder="When?"
                    format="YYYY-MM-DD HH:mm"
                    minDate="1900-01-01 00:00"
                    maxDate={Moment().format('YYYY-MM-DD HH:mm:ss')}
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
