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
    AsyncStorage,
} from 'react-native';
import Styles from "../config/Styles";
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
import Moment from 'moment';

export default class AddMeasurement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diary: {
                userId: '',
                type: '',
                when: '',
                time: '',
                insulin: '',
                sugar: '',
            },
        };
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        let date = Moment().format('YYYY-MM-DD HH:mm');

        this.setState(
            {
                diary:
                    {
                        ...this.state.diary,
                        type: 'breakfast',
                        when: 'before',
                        time: date,
                        userId: value['userId'],
                    },
            }
        );
    }

    showAddModal = () => {
        this.refs.addNewMeasurement.open();
    }

    submit = async() => {
        try {
            fetch('https://diabetes-backend.herokuapp.com/diary/addMeasurement', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diary:{
                        userId: this.state.diary.userId,
                        type: this.state.diary.type,
                        when: this.state.diary.when,
                        time: this.state.diary.time,
                        insulin: this.state.diary.insulin,
                        sugar: this.state.diary.sugar,
                    }
                })
            })
                .then((response) => response.json())
                .then ((res) => {
                    if(res.success === true){
                        this.props.dataTable.getMeasurements();
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
        return (
            <Modal
                ref={"addNewMeasurement"}
                style={Styles.modal}
                position='center'
                backdrop={true}
                onClosed={() => {}}
            >
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                    marginBottom: 10
                }}>New measurement</Text>

                <Picker
                    style={Styles.dropdown2}
                    itemStyle={Styles.dropdown2}
                    selectedValue={this.state.diary.type}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => {
                        const diary = Object.assign({},
                            this.state.diary, {type: itemValue});
                        this.setState({diary: diary});
                    }
                }>
                    <Picker.Item label="breakfast" value="breakfast" />
                    <Picker.Item label="lunch" value="lunch" />
                    <Picker.Item label="dinner" value="dinner" />
                    <Picker.Item label="other" value="other" />
                </Picker>

                <Picker
                    style={Styles.dropdown2}
                    itemStyle={Styles.dropdown2}
                    selectedValue={this.state.diary.when}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => {
                        const diary = Object.assign({},
                            this.state.diary, {when: itemValue});
                        this.setState({diary: diary});
                    }
                    }>
                    <Picker.Item label="before" value="before" />
                    <Picker.Item label="after" value="after" />
                </Picker>

                <DatePicker
                    style={{
                        width: '100%',
                        paddingLeft: 8,
                        marginBottom: 2,
                    }}
                    date={this.state.diary.time}
                    mode="datetime"
                    placeholder="When?"
                    format="YYYY-MM-DD HH:mm"
                    minDate="1900-01-01 00:00"
                    maxDate={Moment().format('YYYY-MM-DD HH:mm')}
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
                            color: '#718792',
                            fontSize: 12,
                        },
                        placeholderText: {
                            color: '#718792',
                            fontSize: 12,
                        },
                    }}
                    onDateChange={(time) => {
                        const diary = Object.assign({},
                            this.state.diary, { time: time });
                        this.setState({ diary: diary});
                    }}
                />

                <TextInput
                    style={Styles.textInput2}
                    placeholder='Insulin'
                    keyboardType = 'numeric'
                    maxLength={3}
                    onChangeText={
                        (insulin) => {
                            const diary = Object.assign({},
                                this.state.diary, { insulin: insulin });
                            this.setState({ diary: diary });
                        }}
                    underlineColorAndroid='transparent'
                    value={this.state.diary.insulin.toString()}
                />

                <TextInput
                    style={Styles.textInput2}
                    placeholder='Sugar'
                    keyboardType = 'numeric'
                    maxLength={3}
                    onChangeText={
                        (sugar) => {
                            const diary = Object.assign({},
                                this.state.diary, { sugar: sugar });
                            this.setState({ diary: diary });
                        }}
                    underlineColorAndroid='transparent'
                    value={this.state.diary.sugar.toString()}
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
                        if (this.state.diary.insulin == ''
                            || this.state.diary.sugar == ''
                            || this.state.diary.time == ''
                            || this.state.diary.type == ''
                            || this.state.diary.when == ''
                        ) {
                            alert("You must fill all fields");
                            return;
                        }

                        this.submit();
                        this.refs.addNewMeasurement.close();
                    }}>
                    Save
                </Button>
            </Modal>
        );
    }
}