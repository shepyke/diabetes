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
    ScrollView,
    YellowBox
} from 'react-native';
import Styles from "../config/Styles";
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { Icon } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class Intake extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            time: '',
            userId: '',
            intake: [],
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
            disableAddButton: false,
            disableSubmitButton: true,
            isLoading: true,
            deleteIndex: '',
            isFocused: false,
        }
        this.intakeIndex = 0;
        this.deletedRowNumber = 0;
        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount(){
        this._loadInitialState().done();
        this._sub = this.props.navigation.addListener('didFocus', () => {
            let date = Moment().format('YYYY-MM-DD HH:mm');

            this.setState({
                isFocused: true,
                time: date,
            });
        });
    }

    componentWillUnmount() {
        this._sub.remove();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        let date = Moment().format('YYYY-MM-DD HH:mm');

        try {
            //fetch('http://172.20.10.4:3000/intakes/foods')
            fetch('https://diabetes-backend.herokuapp.com/intakes/foods')
                .then((response) => response.json())
                .then((res) => {
                    this.state.foods = res.foods;

                    this.setState({
                        time: date,
                        userId: value['userId'],
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

    componentWillReceiveProps(nextProps){
        if(nextProps.navigation.state.params != undefined
            && nextProps.navigation.state.params.intakeId != undefined
            && this.props.navigation.state.params != undefined
            && this.props.navigation.state.params.intakeId != undefined
            && this.props.navigation.state.params.intakeId != nextProps.navigation.state.params.intakeId
        ) {
            const intake = this.state.intake;
            this.setState({
                intake: this.updateOneIntake(intake,
                    nextProps.navigation.state.params.intakeId,
                    "foodId",
                    nextProps.navigation.state.params.foodId),
            });
        }
    }

    submit = async() => {
        try {
            //fetch('http://172.20.10.4:3000/intakes/addIntake', {
            fetch('https://diabetes-backend.herokuapp.com/intakes/addIntake', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    time: this.state.time,
                    userId: this.state.userId,
                    intakes: this.state.intake,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success === true) {
                        console.log("res.intake: " + JSON.stringify(res.intake,null,4));
                        alert('You have successfully added an intake:\n'
                            + '\nAverage Glycemic index: ' + res.intake.avgGI
                            + '\nTotal calorie: ' + res.intake.totalCalorie + ' kCal'
                            + '\nTotal carbohydrate: ' + res.intake.totalCarbohydrate + 'g'
                            + '\nTotal fat: ' + res.intake.totalFat + 'g'
                            + '\nTotal protein: ' + res.intake.totalProtein + 'g'
                        );
                        this.setState({
                            intake: [],
                            disableSubmitButton: true,
                        });
                    } else {
                        alert(res.message);
                    }
                })
                .done();
        } catch (err) {
            console.log(err);
        }
    }

    addMoreIntake = () =>{
        this.animatedValue.setValue(0);

        this.setState({
            disableSubmitButton: false,
        });

        if (this.intakeIndex - this.deletedRowNumber < 10) {
            let newlyAddedIntake = {
                id: this.intakeIndex,
                foodId: this.state.foods[0].foodId,
                amount: '',
            }

            this.setState({disableAddButton: true, intake: [...this.state.intake, newlyAddedIntake]}, () => {
                Animated.timing(
                    this.animatedValue,
                    {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true
                    }
                ).start(() => {
                    this.intakeIndex = this.intakeIndex + 1;
                    this.setState({disableAddButton: false});
                });

            });
        }else{
            alert("You cannot add more than 10 dishes to one time meal");
        }
    }

    updateOneIntake(intakeArray, intakeId, property, newValue){
        intakeArray.find(function (obj) {
            if(obj.id === intakeId){
                obj[property]= newValue;
            }
        })
        return intakeArray;
    }

    render() {
        const animationValue = this.animatedValue.interpolate(
            {
                inputRange: [ 0, 1 ],
                outputRange: [ -59, 0 ]
            }
        );

        let swipeBtns = [
            {
                text: 'Delete',
                backgroundColor: 'red',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => {
                    this.state.intake.splice(this.state.deleteIndex,1);
                    this.setState({
                        intake: this.state.intake,
                    });
                    this.deletedRowNumber = this.deletedRowNumber + 1;
                }
            }
        ];

        let newArray = this.state.intake.map(( intakeItem ) => {
            if(intakeItem.id == this.intakeIndex){
                return(
                    <Animated.View
                        key={intakeItem.id}
                        style={[{ opacity: this.animatedValue,
                            transform: [{ translateY: animationValue }] }]}>
                        <Picker
                            key={intakeItem.id + 100}
                            style={Styles.dropdown}
                            selectedValue={intakeItem.foodId}
                            mode="dropdown"
                            onValueChange={(foodId) => {
                                const intake = this.state.intake;
                                this.setState({
                                    intake: this.updateOneIntake(intake, intakeItem.id, "foodId", foodId),
                                });
                            }}
                        >
                            {this.state.foods.map((item) => {
                                return (<Picker.Item label={item.foodName} value={item.foodId} key={(this.intakeIndex + "_" + item.foodName)}/>)
                            })}
                        </Picker>
                        <View
                            key={intakeItem.id + 200}
                            style={{flexDirection: 'row'}}>
                            <TextInput
                                key={intakeItem.id + 300}
                                style={[Styles.textInput,{width: '80%'}]}
                                placeholder='Amount'
                                placeholderTextColor='white'
                                keyboardType = 'numeric'
                                maxLength={3}
                                onChangeText={(amount) => {
                                    const intake = this.state.intake;
                                    this.setState({
                                        intake: this.updateOneIntake(intake, intakeItem.id, "amount", amount),
                                    });
                                }}
                                underlineColorAndroid='white'
                            />
                            <Text
                                key={intakeItem.id + 400}
                                style={[Styles.text,
                                    {width: '5%', alignSelf: 'center', fontSize: 16, marginRight: 10}
                                ]}>
                                {this.state.foods[intakeItem.foodId-1].unit}
                            </Text>
                            <Icon
                                key={intakeItem.id + 500}
                                type="font-awesome"
                                name="question-circle"
                                size={26}
                                color={'white'}
                                style={{position: 'absolute', right: 5}}
                                onPress={() => alert("Please note, the calculation based on 100"
                                    + this.state.foods[intakeItem.foodId-1].unit + " of "
                                    + this.state.foods[intakeItem.foodId-1].foodName)}
                            />
                            <Icon
                                key={intakeItem.id + 600}
                                type="entypo"
                                name="camera"
                                size={26}
                                color={'white'}
                                style={{position: 'absolute', right: 5}}
                                onPress={() =>
                                    this.props.navigation.navigate('BarcodeScanner', {id: intakeItem.id})}
                            />
                        </View>
                    </Animated.View>
                );
            }else{
                return(
                    <Swipeout
                        key={intakeItem.id + 700}
                        close={!(this.state.deleteIndex === this.state.intake.findIndex(x => x.id === intakeItem.id))}
                        right={swipeBtns}
                        autoClose={true}
                        backgroundColor= 'transparent'
                        sensitivity={100}
                        onOpen={() => {
                            this.setState({
                                deleteIndex: this.state.intake.findIndex(x => x.id === intakeItem.id),
                            });
                        }}
                    >
                        <View key={intakeItem.id + 800}>
                            <Picker
                                key={intakeItem.id + 900}
                                style={Styles.dropdown}
                                selectedValue={intakeItem.foodId}
                                mode="dropdown"
                                onValueChange={(foodId) => {
                                    const intake = this.state.intake;
                                    this.setState({
                                        intake: this.updateOneIntake(intake, intakeItem.id, "foodId", foodId),
                                    });
                                }}
                            >
                                {this.state.foods.map((item) => {
                                    return (<Picker.Item label={item.foodName} value={item.foodId} key={(this.intakeIndex + item.foodName)}/>)
                                })}
                            </Picker>
                            <View
                                key={intakeItem.id + 1000}
                                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextInput
                                    key={intakeItem.id + 1100}
                                    style={[Styles.textInput,{width: '70%'}]}
                                    placeholder='Amount'
                                    placeholderTextColor='white'
                                    keyboardType = 'numeric'
                                    maxLength={3}
                                    onChangeText={(amount) => {
                                        const intake = this.state.intake;
                                        this.setState({
                                            intake: this.updateOneIntake(intake, intakeItem.id, "amount", amount),
                                        });
                                    }}
                                    underlineColorAndroid='white'
                                />
                                <Text
                                    key={intakeItem.id + 1200}
                                    style={[Styles.text,{width: '5%', alignSelf: 'center', fontSize: 16, marginRight: 10}]}>
                                    {this.state.foods[intakeItem.foodId-1].unit}
                                </Text>
                                <Icon
                                    key={intakeItem.id + 1300}
                                    type="font-awesome"
                                    name="question-circle"
                                    size={26}
                                    color={'white'}
                                    style={{position: 'absolute', right: 5}}
                                    onPress={() => alert("Please note, the calculation based on 100"
                                        + this.state.foods[intakeItem.foodId-1].unit + " of "
                                        + this.state.foods[intakeItem.foodId-1].foodName)}
                                />
                                <Icon
                                    key={intakeItem.id + 1400}
                                    type="entypo"
                                    name="camera"
                                    size={26}
                                    color={'white'}
                                    style={{position: 'absolute', right: 5}}
                                    onPress={() =>
                                        this.props.navigation.navigate('BarcodeScanner', {id: intakeItem.id})}
                                />
                            </View>
                        </View>
                    </Swipeout>
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
                        style={[Styles.birthDay, {width: '50%'}]}
                        date={this.state.time}
                        mode="datetime"
                        placeholder="Date"
                        format="YYYY-MM-DD HH:mm"
                        minDate="1900-01-01"
                        maxDate={Moment().format('YYYY-MM-DD HH:mm')}
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
                        disabled = { this.state.disableAddButton}
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
                        disabled = { this.state.disableSubmitButton }
                        onPress={this.submit}>
                        <Text>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>
        );
    }
}