import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Styles from "../config/Styles";
import { Icon } from 'react-native-elements';

export default class BarcodeScanner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            camera: {
                type: RNCamera.Constants.Type.back,
                flashMode: RNCamera.Constants.FlashMode.auto,
            },
            showCamera: true,
        };
    }

    switchType = () => {
        let newType;
        const { back, front } = RNCamera.Constants.Type;

        if (this.state.camera.type === back) {
            newType = front;
        } else if (this.state.camera.type === front) {
            newType = back;
        }

        this.setState({
            camera: {
                ...this.state.camera,
                type: newType,
            },
        });
    };

    switchFlash = () => {
        let newFlashMode;
        const { auto, on, off } = RNCamera.Constants.FlashMode;

        if (this.state.camera.flashMode === auto) {
            newFlashMode = on;
        } else if (this.state.camera.flashMode === on) {
            newFlashMode = off;
        } else if (this.state.camera.flashMode === off) {
            newFlashMode = auto;
        }

        this.setState({
            camera: {
                ...this.state.camera,
                flashMode: newFlashMode,
            },
        });
    };

    get flashIcon() {
        let icon;
        const { auto, on, off } = RNCamera.Constants.FlashMode;

        if (this.state.camera.flashMode === auto) {
            icon =  <Icon name="flash-auto" size={10} color={"white"} />;
        } else if (this.state.camera.flashMode === on) {
            icon = <Icon name="flash-on" size={10} color={"white"} />;
        } else if (this.state.camera.flashMode === off) {
            icon = <Icon name="flash-off" size={10} color={"white"} />;
        }

        return icon;
    }

    onBarCodeRead(e) {
        //this.setState({showCamera: false});
        alert("Barcode Found!",
            "Type: " + e.type + "\nData: " + e.data);
        console.log(
            "Barcode Found!",
            "Type: " + e.type + "\nData: " + e.data
        );
    }

    render() {
        //if(this.state.showCamera) {
            return (
                <View style={Styles.wrapper}>
                    <RNCamera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        onBarCodeRead={this.onBarCodeRead.bind(this)}
                        style={Styles.preview}
                        type={this.state.camera.type}
                        torchMode={this.state.camera.flashMode}
                        defaultTouchToFocus
                        mirrorImage={false}
                    />
                </View>
            );
       /* }else{
            return (
                <View></View>
            );
        }*/
    }

}