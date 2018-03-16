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
    header: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        paddingBottom: 10,
        fontWeight: 'bold',
        borderBottomColor: '#718792',
        borderBottomWidth: 1,
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
        width: '100%',
        padding: 8,
        marginBottom: 10,
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
    button: {
        alignSelf: 'stretch',
        backgroundColor: '#718792',
        padding: 20,
        alignItems: 'center',
    },
    bottomtext: {
        color: '#fff',
        fontSize: 8,
        marginTop: 20,
    },
    register: {
        color: '#c2c2c2',
        fontSize: 8,
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
    drowdown: {
        color: '#fff',
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
    breakfast: {
        backgroundColor: '#ff02FF',
    },
    lunch: {
        backgroundColor: '#00FF00',
    },
    dinner: {
        backgroundColor: '#0000FF',
    },
    tableHeader: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default Styles;