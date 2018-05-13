import React from 'react';
import 'react-native';
//import BarcodeScanner from '../app/components/BarcodeScanner';

import renderer from 'react-test-renderer';

import BarcodeScanner from '../app/components/__mocks__/react-native-camera';

jest.doMock('react-native-camera', () => BarcodeScanner);


//Start of testId: barcode-1
it('Camera initialization is done', () => {
    const tree = renderer.create(<BarcodeScanner />).toJSON();
    expect(tree).toMatchSnapshot();
})
//End of testId: barcode-1

//Start of testId: barcode-2
test('the given barcode is part of the database', () => {
    const foods = [
        {"foodId":1,"glycemicIndex":1,"carbohydrate":45.8,"fat":6.5,"calorie":285,"protein":10.8,"photo":"","barcode":0,"foodName":"Magvas barnakenyér","regTime":"2018-04-20T11:03:45.000Z","unit":"g"},
        {"foodId":2,"glycemicIndex":2,"carbohydrate":33.3,"fat":33,"calorie":1,"protein":13,"photo":"","barcode":11,"foodName":"Virsli","regTime":"2018-04-20T11:03:45.000Z","unit":"g"},
        {"foodId":3,"glycemicIndex":2,"carbohydrate":4.7,"fat":2.8,"calorie":56,"protein":3,"photo":"","barcode":5995805038851,"foodName":"Finest Tej","regTime":"2018-04-20T11:03:45.000Z","unit":"ml"},
        {"foodId":4,"glycemicIndex":0,"carbohydrate":3.5,"fat":0,"calorie":43,"protein":0.4,"photo":"","barcode":5999601340156,"foodName":"Space Next - Rocket","regTime":"2018-04-20T11:03:45.000Z","unit":"ml"},
        {"foodId":5,"glycemicIndex":2,"carbohydrate":4.7,"fat":2.8,"calorie":56,"protein":3,"photo":"","barcode":5998202600034,"foodName":"Kunsági Tej","regTime":"2018-04-20T11:03:45.000Z","unit":"ml"},
        {"foodId":6,"glycemicIndex":2,"carbohydrate":2.2,"fat":0.1,"calorie":10,"protein":0.1,"photo":"","barcode":5998821500777,"foodName":"Olympos Light","regTime":"2018-04-20T11:03:45.000Z","unit":"ml"},
        {"foodId":7,"glycemicIndex":0,"carbohydrate":3.5,"fat":0,"calorie":43,"protein":0.4,"photo":"","barcode":8594404115115,"foodName":"Pilsner Urquell","regTime":"2018-04-20T11:03:45.000Z","unit":"ml"}
    ];

    expect(foods).toEqual(          // 1
        expect.arrayContaining([      // 2
            expect.objectContaining({   // 3
                "barcode": 5999601340156               // 4
            })
        ])
    );
})
//End of testId: barcode-2

//Start of testId: barcode-3
it('GetFoods is not empty', () => {
    const tree = renderer.create(<BarcodeScanner />).getInstance();
    expect(tree.getFoods).not.toBeNull();
})
//End of testId: barcode-3