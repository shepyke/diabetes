/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';

const constants = constants = {
    Aspect: {},
    BarCodeType: {},
    Type: {},
    CaptureMode: {},
    CaptureTarget: {},
    CaptureQuality: {},
    Orientation: {},
    FlashMode: {},
    TorchMode: {}
};

class BarcodeScanner extends Component<{}> {
    static constants = constants;

    constructor(props){
        super(props);
    }

    findBarcode(foods, barcode){
        console.log("meghívóódott");
        return true;
    }

    render() {
       return null;
    }

}

BarcodeScanner.constants = constants;

export default BarcodeScanner;
