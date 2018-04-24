/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry, AsyncStorage,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Styles from "../config/Styles";
import { Icon } from 'react-native-elements';
import Moment from "moment/moment";

export default class BarcodeScanner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            camera: {
                type: RNCamera.Constants.Type.back,
                flashMode: RNCamera.Constants.FlashMode.auto,
            },
            showCamera: true,
            foods: [
                {
                    foodId: '',
                    barcode: '',
                    calorie: '',
                    carbohydrate: '',
                    fat: '',
                    foodName: '',
                    glycemicIndex: '',
                    photo: '',
                    protein:'',
                },
            ],
        };
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        let date = Moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            fetch('https://diabetes-backend.herokuapp.com/intakes/foods')
                .then((response) => response.json())
                .then((res) => {
                    this.state.foods = res.foods;
                    //console.log("this.state.foods: " + JSON.stringify(this.state.foods,null,4));
                })
                .catch((error) => {
                    console.error(error);
                });
        }catch(error){
            console.error(error);
        }
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

    findBarcode(foodsObject, barcode) {
        return foodsObject.find((element) => {
            if(element.barcode == barcode){
                return element;
            }
        })
    }

    onBarCodeRead(barcode) {
        //this.setState({showCamera: false});
        alert(JSON.stringify(this.findBarcode(this.state.foods, barcode.data),null,4));
        //this.findBarcode(this.state.foods, barcode.data);
        this.props.navigation.navigate('Intake', this.state.foods);
    }

    render() {
        if(this.state.showCamera) {
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
        }else{
            return (
                <View style={Styles.wrapper}></View>
            );
        }
    }

}