import { StyleSheet } from 'react-native';
import React, { Component } from 'react';

const Styles = StyleSheet.create({
    wrapper:{
        flex: 1,
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
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
    textInput: {
        alignSelf: 'stretch',
        padding: 8,
        marginBottom: 10,
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
});

export default Styles;