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
import { Col, Row, Grid } from "react-native-easy-grid";

export default class Diary extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            userId: '',
            time: '',
            diary: {
                userId: '',
                insulin: '',
                sugar: '',
                time: '',
                type: '',
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
        let date = new Date().toLocaleString();
        this.setState(
            {
                userId: value['userId'],
                time: date,
                diary:
                    {
                        ...this.state.diary,
                        userId: value['userId'],
                    },
            }
        );
        this.getMeasurements();
    }

    getMeasurements = async() => {
        try{
            fetch('http://172.20.10.4:3000/diary/getDiary',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.state.userId,
                    time: this.state.time,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if(res.success === true){
                        this.state.diary = res.diary;
                    }else{
                        alert(res.message);
                        this.state.diary= {};
                    }
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
                        type: this.state.diary.type,
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
                <Grid>
                    <Row style={{flex: 0.05}}>
                        <Col>
                            <DatePicker
                                style={Styles.birthDay}
                                date={this.state.time}
                                mode="date"
                                placeholder="Date"
                                format="YYYY-MM-DD"
                                minDate="1900-01-01"
                                maxDate={new Date()}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={true}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0,
                                        marginBottom: 22,
                                    },
                                    dateText: {
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 12,
                                    },
                                    dateIcon:{
                                        marginBottom: 22,
                                        width: 20,
                                        height: 20,
                                    },
                                }}
                                onDateChange={(time) => {
                                    this.setState({
                                        time: time,
                                    });
                                    this.getMeasurements();
                                }}
                            />
                        </Col>
                        <Col>
                            <Text style={[Styles.tableHeader,{textAlign: 'center'}]}>
                                Measurements
                            </Text>
                        </Col>
                    </Row>
                    <Row style={Styles.row}>
                        <Col style={Styles.column1}>
                            <Row style={[Styles.row, Styles.breakfast]}>
                                <Text style={Styles.tableHeader}>Breakfast</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.lunch]}>
                                <Text style={Styles.tableHeader}>Lunch</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.dinner]}>
                                <Text style={Styles.tableHeader}>Dinner</Text>
                            </Row>
                        </Col>
                        <Col style={Styles.column2}>
                            <Row style={[Styles.row, Styles.breakfast]}>
                                <Text style={Styles.tableHeader}>Before</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.breakfast]}>
                                <Text style={Styles.tableHeader}>After</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.lunch]}>
                                <Text style={Styles.tableHeader}>Before</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.lunch]}>
                                <Text style={Styles.tableHeader}>After</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.dinner]}>
                                <Text style={Styles.tableHeader}>Before</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.dinner]}>
                                <Text style={Styles.tableHeader}>After</Text>
                            </Row>
                        </Col>
                        <Col style={Styles.column3}>
                            <Row style={[Styles.row, Styles.breakfast]}>
                                {console.log("this.state.diary: itt tortenik a kiírás tutira:" + JSON.stringify(this.state.diary,null,4))}
                                {console.log("this.state.diary.sugar: " + this.state.diary.sugar)}
                                {console.log("this.state.time: " + this.state.time)}
                                <Text style={Styles.text}>Blood sugar: {this.state.diary.sugar}</Text>
                                <Text style={Styles.text}>Insulin: {this.state.diary.insulin}</Text>
                                <Text style={Styles.text}>Time: {this.state.diary.time}</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.breakfast]}>
                                <Text style={Styles.text}>2313123131238921</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.lunch]}>
                                <Text style={Styles.text}>2313123131238921</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.lunch]}>
                                <Text style={Styles.text}>2313123131238921</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.dinner]}>
                                <Text style={Styles.text}>2313123131238921</Text>
                            </Row>
                            <Row style={[Styles.row, Styles.dinner]}>
                                <Text style={Styles.text}>2313123131238921</Text>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{flex: 0.05}}/>
                </Grid>
            </View>

        );
    }
}
