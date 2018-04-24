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
    Animated,
    ScrollView
} from 'react-native';
import Styles from "../config/Styles";
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { Icon } from 'react-native-elements';

export default class Intake extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            time: '',
            userId: '',
            intake: [
                {
                    foodId: 1,
                    amount: '',
                }
            ],
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
            disableButton: false,
            isLoading: true,
        }
        this.intakeIndex = 0;
        this.animatedValue = new Animated.Value(0);
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

                    this.setState({
                        time: date,
                        userId: value['userId'],

                        isLoading: false,
                    });
                    console.log("this.state.intake: " + JSON.stringify(this.state.intake,null,4));
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
                    intake: this.state.intake,
                    time: this.state.time,
                    //food: this.state.foods[this.state.intake.foodId-1],
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

    addMoreIntake = () =>{
            //this.animatedValue.setValue(0);
        if (this.intakeIndex < 5) {
            let newlyAddedIntake = {
                foodId: this.state.foods[0].foodId,
                amount: '',
            }

            this.setState({disableButton: true, intake: [...this.state.intake, newlyAddedIntake]}, () => {
                console.log("newlyAddedIntake in function: " + JSON.stringify(newlyAddedIntake,null,4));
                console.log("this.state.intake in function: " + JSON.stringify(this.state.intake,null,4));
                Animated.timing(
                    this.animatedValue,
                    {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true
                    }
                ).start(() => {
                    this.setState({disableButton: false});
                });
                this.intakeIndex += 1;
                console.log("this.intakeIndex in function: " + this.intakeIndex);
            });
        }
    }

    render() {
        const animationValue = this.animatedValue.interpolate(
            {
                inputRange: [ 0, 1 ],
                outputRange: [ -59, 0 ]
            }
        );

        let newArray = this.state.intake.map(( intakeItem, key ) =>{
            console.log( (key) + ". intakeItem: " + JSON.stringify(intakeItem,null,4));
            console.log("key: " + key);
            console.log("this.intakeIndex: " + this.intakeIndex);
            console.log("this.state.intake in function: " + JSON.stringify(this.state.intake,null,4));
            if(( key ) == this.intakeIndex){
                return(
                    <Animated.View key={key} style={[{ opacity: this.animatedValue, transform: [{ translateY: animationValue }] }]}>
                        <Picker
                            key={key}
                            style={Styles.dropdown}
                            selectedValue={intakeItem.foodId}
                            mode="dropdown"
                            onValueChange={(foodId) => {
                                this.setState({
                                    intake:[
                                        ...this.state.intake,
                                        intakeItem = {
                                            ...intakeItem,
                                            foodId: foodId,
                                        },
                                    ]
                                });
                            }}
                        >
                            {this.state.foods.map((item) => {
                                return (<Picker.Item label={item.foodName} value={item.foodId} key={key}/>)
                            })}
                        </Picker>
                        <View key={key} style={{flexDirection: 'row'}}>
                            <TextInput
                                key={key}
                                style={[Styles.textInput,{width: '80%'}]}
                                placeholder='Amount'
                                placeholderTextColor='white'
                                keyboardType = 'numeric'
                                maxLength={6}
                                onChangeText={(amount) => {
                                    this.setState({
                                        intake:[
                                            ...this.state.intake,
                                            intakeItem = {
                                                ...intakeItem,
                                                amount: amount,
                                            },
                                        ]
                                    });
                                }}
                                underlineColorAndroid='white'
                            />
                            <Text
                                key={key}
                                style={[Styles.text,{width: '5%', alignSelf: 'center', fontSize: 16, marginRight: 10}]}>
                                {this.state.foods[intakeItem.foodId-1].unit}
                            </Text>
                            <Icon
                                key={key}
                                type="font-awesome"
                                name="question-circle"
                                size={26}
                                color={'white'}
                                style={{position: 'absolute', right: 5}}
                                onPress={() => alert("Please note, the calculation based on 100"
                                    + this.state.foods[intakeItem.foodId-1].unit + " of "
                                    + this.state.foods[intakeItem.foodId-1].foodName)}
                            />
                        </View>
                    </Animated.View>
                );
            }else{
                return(
                    <View>
                        <Picker
                            key={key}
                            style={Styles.dropdown}
                            selectedValue={intakeItem.foodId}
                            mode="dropdown"
                            onValueChange={(foodId) => {
                                this.setState({
                                    intake:[
                                        ...this.state.intake,
                                        intakeItem = {
                                            ...intakeItem,
                                            foodId: foodId,
                                        },
                                    ]
                                });
                            }}
                        >
                            {this.state.foods.map((item) => {
                                return (<Picker.Item label={item.foodName} value={item.foodId} key={key}/>)
                            })}
                        </Picker>
                        <View key={key} style={{flexDirection: 'row'}}>
                            <TextInput
                                key={key}
                                style={[Styles.textInput,{width: '80%'}]}
                                placeholder='Amount'
                                placeholderTextColor='white'
                                keyboardType = 'numeric'
                                maxLength={6}
                                onChangeText={(amount) => {
                                    this.setState({
                                        intake:[
                                            ...this.state.intake,
                                            intakeItem = {
                                                ...intakeItem,
                                                amount: amount,
                                            },
                                        ]
                                    });
                                }}
                                underlineColorAndroid='white'
                            />
                            <Text
                                key={key}
                                style={[Styles.text,{width: '5%', alignSelf: 'center', fontSize: 16, marginRight: 10}]}>
                                {this.state.foods[intakeItem.foodId-1].unit}
                            </Text>
                            <Icon
                                key={key}
                                type="font-awesome"
                                name="question-circle"
                                size={26}
                                color={'white'}
                                style={{position: 'absolute', right: 5}}
                                onPress={() => alert("Please note, the calculation based on 100"
                                    + this.state.foods[intakeItem.foodId-1].unit + " of "
                                    + this.state.foods[intakeItem.foodId-1].foodName)}
                            />
                        </View>
                    </View>
                );
            }
        });

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
                <View style={Styles.dateAndPlus}>
                    <DatePicker
                        style={Styles.birthDay}
                        date={this.state.time}
                        mode="date"
                        placeholder="Date"
                        format="YYYY-MM-DD"
                        minDate="1900-01-01"
                        maxDate={Moment().format('YYYY-MM-DD')}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={true}
                        customStyles={{
                            dateInput: {
                                borderWidth: 0,
                                marginBottom: 8,
                            },
                            dateText: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 16,
                            },
                            dateIcon:{
                                marginBottom: 8,
                                width: 25,
                                height: 25,
                            },
                        }}
                        onDateChange={(time) => {
                            this.setState({
                                time: time
                            });
                        }}
                    />
                    <TouchableOpacity
                        onPress={this.addMoreIntake}
                        style={Styles.plusButton}
                    >
                        <Text style={[{fontSize: 20, fontWeight: 'bold'}]}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style = {{ flex: 1, padding: 4 }}>
                        {
                            newArray
                        }
                    </View>
                    <TouchableOpacity
                        style={[Styles.button, {marginTop: 10, marginBottom: 10}]}
                        onPress={this.submit}>
                        <Text>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>
        );
    }
}
