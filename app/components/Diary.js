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
} from 'react-native';
import PropTypes from 'prop-types';
import Styles from "../config/Styles";
import DatePicker from 'react-native-datepicker';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
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
        this.renderCell = this.renderCell.bind(this);
        //this.refreshData = this.refreshData.bind(this);
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

    renderCell(key, record) {
        return this.props.renderCell ? this.props.renderCell(key, record) : record[key] || '';
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

    renderRow(rowData, sectionId, rowId) {
        const cells = [];

        // If the rowData has the function 'isValid', check it to see the object still exists
        if (typeof rowData.isValid === 'function' && !rowData.isValid()) {
            return null; // Don't render if the row's data has been deleted
        }

        this.props.columns.forEach((column, columnIndex, columns) => {
            /*let textStyle;
            switch (column.alignText) {
                case 'left':
                default:
                    textStyle = [defaultStyles.alignTextLeft, text];
                    break;
                case 'center':
                    textStyle = [defaultStyles.alignTextCenter, text];
                    break;
                case 'right':
                    textStyle = [defaultStyles.alignTextRight, text];
                    break;
            }

            let cellStyle = columnIndex !== columns.length - 1 ?
                [this.props.dataTableStyles.cell] :
                [this.props.dataTableStyles.cell, rightMostCell];
            cellStyle.push({ height: this.props.rowHeight });*/

            const renderedCell = this.renderCell(column.key, rowData);

            let cell;
            switch (renderedCell.type) {
                case 'editable':
                    cell = (
                        <EditableCell
                            key={column.key}

                            style={Styles.cell}
                            textStyle={Styles.cellText}
                            width={column.width}
                            returnKeyType={renderedCell.returnKeyType || 'next'}
                            selectTextOnFocus={true}
                            placeholder={renderedCell.placeholder}
                            keyboardType={renderedCell.keyboardType || 'numeric'}
                            onEndEditing={(target, value) => {
                                if (!this.props.onEndEditing) return;
                                this.props.onEndEditing(column.key, target, value);
                                this.refreshData();
                            }}
                            onSubmitEditing={() => this.focusNextField(parseInt(rowId, 10), columnIndex)}
                            target={rowData}
                            value={renderedCell.cellContents}
                            underlineColorAndroid='transparent'
                        />
                    );
                    break;
                case 'text':
                default:
                    cell = (
                        <Cell
                            key={column.key}
                            style={cellStyle}
                            textStyle={textStyle}
                            width={column.width}
                            numberOfLines={renderedCell.lines}
                        >
                            {renderedCell.hasOwnProperty('cellContents') ?
                                renderedCell.cellContents :
                                renderedCell}
                        </Cell>
                    );
            }
            cells.push(cell);
        });

        return (
            <Row>
                {cells}
            </Row>
        );


        /*
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
                                            width={2}
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
                );*/
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
                    <View>
                        <ActionButton buttonColor="rgba(231,76,60,1)">
                            <ActionButton.Item buttonColor='#9b59b6' title="Add" onPress={() => console.log("Add tapped!")}>
                                <Icon name="md-create" style={Styles.actionButtonIcon} />
                            </ActionButton.Item>
                        </ActionButton>
                        <TouchableOpacity
                            onPress={() => console.log("Add tapped!")}>
                            <Text style={[{height: 30},
                                {width: 30},
                                {borderRadius: 30 / 2 },
                                {backgroundColor: 'green'},
                                {paddingLeft: 2},
                            ]}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <DataTable
                    style={Styles.wrapper}
                    listViewStyle={Styles.wrapper}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderHeader={this.renderHeader}
                />
                {this.props.children}
            </View>

        );
    }
}

Diary.propTypes = {
    children: PropTypes.any,
    colors: PropTypes.object,
    columns: PropTypes.array,
    data: PropTypes.any,
    dataTableStyles: PropTypes.object,
    defaultSortDirection: PropTypes.string,
    defaultSortKey: PropTypes.string,
    footerData: PropTypes.object,
    onEndEditing: PropTypes.func,
    onRowPress: PropTypes.func,
    onSelectionChange: PropTypes.func,
    pageStyles: PropTypes.object,
    refreshData: PropTypes.func,
    renderCell: PropTypes.func,
    renderExpansion: PropTypes.func,
    renderTopLeftComponent: PropTypes.func,
    renderTopRightComponent: PropTypes.func,
    renderDataTableFooter: PropTypes.func,
    rowHeight: PropTypes.number,
    searchBarColor: PropTypes.string,
    searchBarPlaceholderText: PropTypes.string,
    searchKey: PropTypes.string,
    selection: PropTypes.array,
    isDataCircular: PropTypes.bool,
    hideSearchBar: PropTypes.bool,
};

Diary.defaultProps = {
    columns: [],
    dataTableStyles: {},
    defaultSortKey: '',
    defaultSortDirection: 'ascending',
    pageStyles: {},
    rowHeight: 45,
    selection: [],
    isDataCircular: false,
    hideSearchBar: false,
};
