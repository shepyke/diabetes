/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    Picker,
    Text,
    TextInput,
    AsyncStorage, Alert,
} from 'react-native';
import Styles from "../config/Styles";
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

export default class AddFood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            food: {
                foodId: '',
                barcode: '',
                calorie: '',
                carbohydrate: '',
                fat: '',
                foodName: '',
                glycemicIndex: '',
                protein:'',
                unit: '',
            },
            userId: '',
        };
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);

        this.setState({
            userId: value['userId'],
        });
    }

    showAddFoodModal = (barcode) => {
        this.setState(
            {
                food: {
                    ...this.state.food,
                    unit: 'g',
                    barcode: barcode.data
                }
            }
        );
        this.refs.addNewFood.open();
    }

    submit = async() => {
        try {
            //fetch('http://192.168.0.117:3000/addFood', {
            fetch('https://diabetes-backend.herokuapp.com/addFood', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.state.userId,
                    food: this.state.food,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success === true) {
                        this.state.food = res.food;
                        alert('You have successfully added a new food:\n'
                            + '\nFood name: ' + res.food.foodName
                            + '\nBarcode: ' + res.food.barcode
                            + '\nGlycemic Index: ' + ((res.food.glycemicIndex != '') ? res.food.glycemicIndex + '%' : 'unknown')
                            + '\nCalorie: ' + ((res.food.calorie != '') ? res.food.calorie + 'kCal' + ' / 100' + res.food.unit : 'unknown')
                            + '\nFat: ' + ((res.food.fat != '') ? res.food.fat + 'g' + ' / 100' + res.food.unit : 'unknown')
                            + '\nCarbohydrate: ' + ((res.food.carbohydrate != '') ? res.food.carbohydrate + 'g' + ' / 100' + res.food.unit : 'unknown')
                            + '\nProtein: ' + ((res.food.protein != '') ? res.food.protein + 'g' + ' / 100' + res.food.unit : 'unknown')
                        );
                    } else {
                        alert(res.message);
                    }
                })
                .done();
        } catch (err) {
            alert("There is a connection issue, please check you are connected to any Network");
            console.log(err);
        }
    }

    render() {
        return (
            <Modal
                ref={"addNewFood"}
                style={[Styles.modal, {height: '80%'}]}
                position='center'
                backdrop={true}
                onClosed={() => {
                    this.props.afterClose();
                }}
            >
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                    marginBottom: 10
                }}>New food details</Text>

                <TextInput
                    style={Styles.textInput2}
                    placeholder='Food name'
                    maxLength={100}
                    value={this.state.food.foodName}
                    onChangeText={
                        (foodName) => {
                            const food = Object.assign({},
                                this.state.food, { foodName: foodName });
                            this.setState({ food: food });
                        }}
                    underlineColorAndroid='transparent'
                />

                <Picker
                    style={Styles.dropdown3}
                    itemStyle={Styles.dropdown3}
                    selectedValue={this.state.food.unit}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => {
                        const food = Object.assign({},
                            this.state.food, {unit: itemValue});
                        this.setState({food: food});
                    }
                    }>
                    <Picker.Item label="100 gramm (unit)" value="g" />
                    <Picker.Item label="100 milliliter (unit)" value="ml" />
                </Picker>

                <TextInput
                    style={[Styles.textInput2, {fontWeight: 'bold'}]}
                    value={this.state.food.barcode}
                    underlineColorAndroid='transparent'
                    editable={false}
                />

                <TextInput
                    style={Styles.textInput2}
                    placeholder='Glycemic Index'
                    keyboardType = 'numeric'
                    maxLength={3}
                    value={this.state.food.glycemicIndex.toString()}
                    onChangeText={
                        (glycemicIndex) => {
                            const food = Object.assign({},
                                this.state.food, { glycemicIndex: glycemicIndex });
                            this.setState({ food: food });
                        }}
                    underlineColorAndroid='transparent'
                />
                <TextInput
                    style={Styles.textInput2}
                    placeholder='Calorie'
                    keyboardType = 'numeric'
                    maxLength={4}
                    value={this.state.food.calorie.toString()}
                    onChangeText={
                        (calorie) => {
                            const food = Object.assign({},
                                this.state.food, { calorie: calorie });
                            this.setState({ food: food });
                        }}
                    underlineColorAndroid='transparent'
                />
                <TextInput
                    style={Styles.textInput2}
                    placeholder='Fat'
                    keyboardType = 'numeric'
                    maxLength={4}
                    value={this.state.food.fat.toString()}
                    onChangeText={
                        (fat) => {
                            const food = Object.assign({},
                                this.state.food, { fat: fat });
                            this.setState({ food: food });
                        }}
                    underlineColorAndroid='transparent'
                />
                <TextInput
                    style={Styles.textInput2}
                    placeholder='Carbohydrate'
                    keyboardType = 'numeric'
                    maxLength={4}
                    value={this.state.food.carbohydrate.toString()}
                    onChangeText={
                        (carbohydrate) => {
                            const food = Object.assign({},
                                this.state.food, { carbohydrate: carbohydrate });
                            this.setState({ food: food });
                        }}
                    underlineColorAndroid='transparent'
                />

                <TextInput
                    style={Styles.textInput2}
                    placeholder='Protein'
                    keyboardType = 'numeric'
                    maxLength={4}
                    value={this.state.food.protein.toString()}
                    onChangeText={
                        (protein) => {
                            const food = Object.assign({},
                                this.state.food, { protein: protein });
                            this.setState({ food: food });
                        }}
                    underlineColorAndroid='transparent'
                />
                <Button
                    style={{ fontSize: 18, color: 'white' }}
                    containerStyle={{
                        padding: 8,
                        marginLeft: 70,
                        marginRight: 70,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: 'mediumseagreen',
                        marginBottom: 10,
                    }}
                    onPress={() => {
                        if (this.state.food.foodName == '') {
                            alert("You must add the name of the Food");
                            return;
                        }else if(this.state.food.unit == ''){
                            alert("You must add the unit of the Food");
                            return;
                        } else if(this.state.food.glycemicIndex == ''
                        || this.state.food.calorie == ''
                        || this.state.food.fat == ''
                        || this.state.food.carbohydrate == ''
                        || this.state.food.protein == ''
                        ){
                            Alert.alert(
                                'Empty fields',
                                'If you do not fill all the fields they will be handle as unknown',
                                [
                                    {text: 'Cancel', onPress: () => {
                                            return
                                        }, style: 'cancel'},
                                    {text: 'Go with it', onPress:() => {
                                            this.submit();
                                            this.refs.addNewFood.close();
                                        }
                                    },
                                ],
                                { cancelable: false }
                            )
                        }else {
                            this.submit();
                            this.refs.addNewFood.close();
                        }
                    }}>
                    Save
                </Button>
            </Modal>
        );
    }
}