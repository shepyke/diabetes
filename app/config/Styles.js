import { StyleSheet } from 'react-native';
import React, { Component } from 'react';

const Styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#1c313a',
    },
    rowContainer: {
        flex: 0.2,
        flexDirection: 'row',
        backgroundColor: '#1c313a',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1c313a',
    },
    dateAndPlus: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        fontWeight: 'bold',
        borderBottomColor: '#718792',
        borderBottomWidth: 1,
    },
    header2: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        paddingBottom: 10,
        fontWeight: 'bold',
    },
    header3: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        //paddingBottom: 5,
        fontWeight: 'bold',
        padding: 0,
        paddingLeft: 2,
        height: 30,
    },
    footer: {
        flex: .3,
        padding: 20,
        alignSelf: 'stretch',
    },
    welcome: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        paddingBottom: 10,
        fontWeight: 'bold',
        borderBottomColor: '#718792',
        borderBottomWidth: 1,
    },
    backgroundImage: {
        width: undefined,
        height: undefined,
        backgroundColor:'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        borderBottomColor: '#fff',
        backgroundColor: '#718792',
        borderBottomWidth: 2,
    },
    profileImage: {
        height: 150,
        width: 150,
        borderRadius: 150 / 2, //make this a circle
    },
    birthDate: {
        padding: 8,
        paddingLeft: 6,
        marginBottom: 10,
    },
    dateSelector: {
        height: 30,
        left: 2,
        margin: 0,
        marginBottom: 5,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
    textInput: {
        alignSelf: 'stretch',
        padding: 6,
        marginBottom: 6,
        color: '#fff',
    },
    textInput2: {
        alignSelf: 'stretch',
        paddingLeft: 6,
        marginBottom: 2,
        color: '#718792',
        fontSize: 12,
    },
    button: {
        alignSelf: 'stretch',
        backgroundColor: '#718792',
        padding: 20,
        alignItems: 'center',
    },
    bottomtext: {
        color: '#fff',
        fontSize: 12,
        marginTop: 20,
    },
    register: {
        color: '#c2c2c2',
        fontSize: 13,
        fontWeight: 'bold',
    },
    logout: {
        alignSelf: 'stretch',
        backgroundColor: '#DD1A00',
        padding: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    dropdown: {
        color: '#fff',
    },
    dropdown2: {
        color: '#718792',
        height: 30,
        marginBottom: 10,
    },
    modal:{
        justifyContent: 'center',
        shadowRadius: 10,
        height: 400,
    },
    column1: {
        flex: 0.3,
    },
    column2: {
        flex: 0.3,
    },
    column3: {
        flex: 1,
    },
    row: {
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: 'white',
        borderColor: 'blue',
    },
    tableHeaderText: {
        color: '#718792',
        fontWeight: 'bold',
        fontSize: 17,
        flexDirection: 'row',
        justifyContent: 'center',
        lineHeight: 60,
    },
    cell: {
        backgroundColor: '#c2c2c2',
    },
    cellText: {
        color: '#718792',
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 14,
    },
    plusButton: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2 ,
        backgroundColor: 'mediumseagreen',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    }
});

export default Styles;