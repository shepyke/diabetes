import React from 'react';
import 'react-native';
import AddMeasurement from '../app/components/AddMeasurement';

import renderer from 'react-test-renderer';
import {AsyncStorage} from "react-native";

//Start of testId: addmeasurement-1
it('all fields should be filled', () => {

    let AddMeasurementData = renderer.create(<AddMeasurement/>).getInstance();

    AddMeasurementData.setState({
        diary: {
            ...AddMeasurementData.state.diary,
            userId: '0',
            type: 'breakfast',
            when: 'before',
            time: '2018-05-11 20:20',
            insulin: '10',
            sugar: '5.6'
        },
    });

    function checkProperties (){
        if (AddMeasurementData.state.diary.insulin == ''
            || AddMeasurementData.state.diary.sugar == ''
            || AddMeasurementData.state.diary.time == ''
            || AddMeasurementData.state.diary.type == ''
            || AddMeasurementData.state.diary.when == ''
        ) {
            return false;
        }else {
            return true;
        }
    }

    expect(checkProperties()).toBeTruthy();
});
//End of testId: addmeasurement-1

//Start of testId: addmeasurement-2
it('Numeric field cannot contain string', () => {
    let AddMeasurementData = renderer.create(<AddMeasurement/>).getInstance();

    AsyncStorage.setItem('user', JSON.stringify({userId: 1, userName: 'asda'}));

    let value = {userId: 10};

    AddMeasurementData.setState({
        diary: {
            ...AddMeasurementData.state.diary,
            insulin: 'asdasds',
            userId: value['userId']
        },
    });

    expect(AddMeasurementData.state.diary.insulin).not.toMatch(new RegExp('[0-9]'));
});
//End of testId: addmeasurement-2
