/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    AsyncStorage, Dimensions,
} from 'react-native';
import Styles from "../config/Styles";
import PureChart from 'react-native-pure-chart';
import { Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

export default class Diagram extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            userId: '',
            fromDate: '',
            toDate: '',
            measurements: {
                time: '',
                insulin: '',
                sugar: '',
            },
            intakes: {
                time: '',
                glycemicIndex: '',
                carbs: '',
                fat: '',
                calorie: '',
                protein: '',
            },
            isLoading: true,
            isFocused: false,
        }
        this.generateData = this.generateData.bind(this);
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        //this._sub = this.props.navigation.addListener('didFocus', this.setFocus());
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        let date = Moment().format('YYYY-MM-DD HH:mm');
        let date7 = Moment(date).subtract(7, 'days').format('YYYY-MM-DD HH:mm');

        this.setState(
            {
                userId: value['userId'],
                fromDate: date7,
                toDate: date,
            }
        );

        this.fetchDataToDraw();

        this._sub = this.props.navigation.addListener('didFocus', () => {
            let date = Moment().format('YYYY-MM-DD HH:mm');
            let date7 = Moment(date).subtract(7, 'days').format('YYYY-MM-DD HH:mm');

            this.setState({
                isFocused: true,
                fromDate: date7,
                toDate: date,
            });
            this.fetchDataToDraw();
        });
    }

    componentWillUnmount() {
        this._sub.remove();
    }

    fetchDataToDraw = async() => {
        try{
            fetch('https://diabetes-backend.herokuapp.com/diagram/getMeasurementData',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.state.userId,
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if(res.success === true){
                        this.state.measurements = res.measurements;
                        this.state.intakes = res.intakes;
                    }else{
                        alert(res.message);
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

    generateData(objects, metric){
        let dataTmp = [];

        let fillUp = function(obj) {
            dataTmp.push(
                {
                    x: Moment((obj.time).slice(0, -5)).format('YYYY-MM-DD HH:mm'),
                    y: obj[metric],
                }
            )
        }

        for (const [key, value] of Object.entries(objects)) {
            fillUp(value);
        }

        return dataTmp;
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={Styles.wrapper}>

                    <Text style={Styles.header}>Loading...</Text>
                </View>
            )
        }

        let measurementsData = [
            {
                seriesName: 'sugar',
                data: (this.generateData(this.state.measurements, 'sugar')),
                color: '#297AB1'
            },
            {
                seriesName: 'insulin',
                data: (this.generateData(this.state.measurements, 'insulin')),
                color: 'yellow'
            },
        ]

        let intakesData = [
            {
                seriesName: 'Carbs',
                data: (this.generateData(this.state.intakes, 'totalCarbs')),
                color: 'yellow'
            },
            {
                seriesName: 'Fat',
                data: (this.generateData(this.state.intakes, 'totalFat')),
                color: 'green'
            },
            {
                seriesName: 'Calorie',
                data: (this.generateData(this.state.intakes, 'totalCalorie')),
                color: 'pink'
            },
            {
                seriesName: 'Protein',
                data: (this.generateData(this.state.intakes, 'totalProtein')),
                color: 'blue'
            }
        ];

        return (
            <View style={Styles.wrapper}>
                <Text style={Styles.header}>DIAGRAM</Text>
                <View style={[Styles.container, {
                    alignItems: 'stretch',
                }]}>
                    <View style={[{position: 'absolute', top: 20, height: 40, flexDirection: 'row', marginBottom: 10}]}>
                        <View style={[{flexDirection: 'row'}]}>
                            <Text style={Styles.header3}>From Date: </Text>
                            <DatePicker
                                style={Styles.dateSelector}
                                date={this.state.fromDate}
                                mode="datetime"
                                placeholder="When?"
                                format="YYYY-MM-DD HH:mm"
                                minDate="1900-01-01 00:00"
                                maxDate={this.state.toDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0,
                                        position: 'absolute',
                                        margin: 0,
                                        padding: 0,
                                        left: 2,
                                    },
                                    dateText: {
                                        color: '#fff',
                                        fontSize: 14,
                                    },
                                    placeholderText: {
                                        color: '#718792',
                                    },
                                }}
                                onDateChange={(fromDate) => {
                                    this.setState({ fromDate: fromDate});
                                    this.fetchDataToDraw();
                                }}
                            />
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                            <Text style={Styles.header3}>To Date: </Text>
                            <DatePicker
                                style={Styles.dateSelector}
                                date={this.state.toDate}
                                mode="datetime"
                                placeholder="When?"
                                format="YYYY-MM-DD HH:mm"
                                minDate={this.state.fromDate}
                                maxDate={Moment().format('YYYY-MM-DD HH:mm')}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0,
                                        position: 'absolute',
                                        margin: 0,
                                        padding: 0,
                                        left: 2,
                                    },
                                    dateText: {
                                        color: '#fff',
                                        fontSize: 14,
                                    },
                                    placeholderText: {
                                        color: '#718792',
                                    },
                                }}
                                onDateChange={(toDate) => {
                                    this.setState({ toDate: toDate});
                                    this.fetchDataToDraw();
                                }}
                            />
                        </View>
                    </View>
                    <Text style={Styles.header2}>
                        Measurements data
                    </Text>
                    {console.log("intakesData: " + JSON.stringify(intakesData,null,4))}
                    <PureChart
                        data={measurementsData}
                        numberOfYAxisGuideLine={5}
                        gap={150}
                        type='line'
                        height={150}
                        customValueRenderer={(index, point) => {
                            if (index % 2 === 0) return null
                            return (
                                <Text style={{textAlign: 'center'}}>{point.y}</Text>
                            )
                        }}
                    />
                    <View style={[{marginTop: 5, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-evenly',}]}>
                        <View style={[{flexDirection: 'row'}]}>
                            <Icon type="font-awesome" name="circle" size={10} color={'#297AB1'} />
                            <Text style={[{color: 'white', marginLeft: 3}]}>Sugar</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                            <Icon type="font-awesome" name="circle" size={10} color={'yellow'} />
                            <Text style={[{color: 'white', marginLeft: 3}]}>Insulin</Text>
                        </View>
                    </View>
                    <Text style={Styles.header2}>
                        Intakes data
                    </Text>
                    <PureChart
                        data={intakesData}
                        numberOfYAxisGuideLine={5}
                        gap={150}
                        height={150}
                        type='bar'
                    />
                    <View style={[{marginTop: 5, flexDirection: 'row', justifyContent: 'space-evenly',}]}>
                        <View style={[{flexDirection: 'row'}]}>
                            <Icon type="font-awesome" name="circle" size={10} color={'yellow'} />
                            <Text style={[{color: 'white', marginLeft: 3}]}>Carbs</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                            <Icon type="font-awesome" name="circle" size={10} color={'green'} />
                            <Text style={[{color: 'white', marginLeft: 3}]}>Fat</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                            <Icon type="font-awesome" name="circle" size={10} color={'pink'} />
                            <Text style={[{color: 'white', marginLeft: 3}]}>Calorie</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                            <Icon type="font-awesome" name="circle" size={10} color={'blue'} />
                            <Text style={[{color: 'white', marginLeft: 3}]}>Protein</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}