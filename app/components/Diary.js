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
import {
    EditableCell,
    Cell,
    DataTable,
    Header,
    HeaderCell,
    Row,
} from 'react-native-data-table';
import { ListView } from 'realm/react-native';

export default class Diary extends Component<{}> {
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            userId: '',
            time: '',
            diary: {
                userId: '',
                type: '',
                when: '',
                time: '',
                insulin: '',
                sugar: '',
            },
            dataSource: dataSource,
            isLoading: true,
        }
        this.renderHeader = this.renderHeader.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        let date = new Date();
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
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.state.diary),
                        });
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

    renderHeader() {
        return (
            <Header style={{backgroundColor: 'white'}}>
                <HeaderCell
                     key={0}
                     style={Styles.tableHeader}
                     textStyle={Styles.tableHeaderText}
                     width={2}
                     text={"Type"}
                 />
                <HeaderCell
                    key={1}
                    style={Styles.tableHeader}
                    textStyle={Styles.tableHeaderText}
                    width={1}
                    text={"When"}
                />
                 <HeaderCell
                     key={2}
                     style={Styles.tableHeader}
                     textStyle={Styles.tableHeaderText}
                     width={3}
                     text={"Time"}
                 />
                 <HeaderCell
                     key={3}
                     style={Styles.tableHeader}
                     textStyle={Styles.tableHeaderText}
                     width={1}
                     text={"Insulin"}
                 />
                <HeaderCell
                    key={4}
                    style={Styles.tableHeader}
                    textStyle={Styles.tableHeaderText}
                    width={1}
                    text={"Sugar"}
                />
            </Header>
        );
    }

    renderRow(item) {
        const cells = [];
        if (this.state.diary && this.state.diary.length > 0) {
            const firstObject = this.state.diary[0];
            for (const [key] of Object.entries(firstObject)) {
                if(key != 'measurementId' && key != 'userId') {
                    let itemString = item[key]
                        && ((typeof item[key] === 'string')
                            || (typeof item[key] === 'number')
                            || (typeof item[key].getMonth === 'function'))
                        && String(item[key]);
                    if (!itemString && item[key] && item[key].length) itemString = item[key].length;
                    if (typeof item[key] === 'boolean') itemString = item[key] ? 'True' : 'False';
                    if (!itemString && item[key] && item[key].id) itemString = item[key].id;
                    switch(key) {
                        case 'type':
                            cells.push(
                                <Cell
                                    key={key}
                                    style={Styles.cell}
                                    textStyle={Styles.cellText}
                                    width={2}
                                >
                                    {itemString}
                                </Cell>
                            );
                            break;
                        case 'time':
                            itemString = itemString.slice(11,19);
                            cells.push(
                                <Cell
                                    key={key}
                                    style={Styles.cell}
                                    textStyle={Styles.cellText}
                                    width={3}
                                >
                                    {itemString}
                                </Cell>
                            );
                            break;
                        default:
                            cells.push(
                                <EditableCell
                                    key={key}
                                    style={Styles.cell}
                                    textStyle={Styles.cellText}
                                    width={1}
                                    //returnKeyType={renderedCell.returnKeyType || 'next'}
                                    selectTextOnFocus={true}
                                    placeholder={itemString}
                                    //keyboardType={renderedCell.keyboardType || 'numeric'}
                                    onEndEditing={(target, value) => {
                                        if (!this.props.onEndEditing) return;
                                        this.props.onEndEditing(key, target, value);
                                        //this.refreshData();
                                    }}
                                    //onSubmitEditing={() => this.focusNextField(parseInt(rowId, 10), columnIndex)}
                                    target={itemString}
                                    value={itemString}
                                    underlineColorAndroid='transparent'
                                />
                            );
                    }
                }
            }
        }
        return (
            <Row>
                {cells}
            </Row>
        );
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
                <View>
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
                    <TouchableOpacity
                        style={Styles.logout}
                        onPress={this.logout}>
                        <Text>+</Text>
                    </TouchableOpacity>
                </View>
                <DataTable
                    style={Styles.wrapper}
                    listViewStyle={Styles.wrapper}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderHeader={this.renderHeader}
                />
            </View>

        );
    }
}
