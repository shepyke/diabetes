/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    Alert, NetInfo,
    View
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Styles from "../config/Styles";

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
                    unit: '',
                },
            ],
            intakeId: (this.props.navigation.state.params != undefined) ? this.props.navigation.state.params.id : -1,
            viaIntake: (this.props.navigation.state.params != undefined) ? this.props.navigation.state.params.viaIntake : false,
            isConnected: false,
        };
    }

    componentDidMount(){
        NetInfo.getConnectionInfo().then(this.handleConnectivityChange);
        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
        this._loadInitialState().done();
    }

    handleConnectivityChange = async (status) => {
        const { type } = status;
        let probablyHasInternet;
        try {
            const googleRequest = await fetch('https://www.google.com', {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            });
            probablyHasInternet = googleRequest.status === 200;
            this.setState({
                isConnected: probablyHasInternet
            })
        } catch (e) {
            probablyHasInternet = false;
            this.setState({
                isConnected: probablyHasInternet
            });
        }

        console.log(`@@ isConnected: ${probablyHasInternet}`);

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.navigation.state.params != undefined){
            if(nextProps.navigation.state.params.viaIntake != undefined) {
                this.setState({
                    intakeId: nextProps.navigation.state.params.id,
                    viaIntake: nextProps.navigation.state.params.viaIntake,
                });
            }
        }
    }

    _loadInitialState = async() => {
        if(this.state.isConnected) {
            try {
                await fetch('https://diabetes-backend.herokuapp.com/intakes/foods')
                    .then((response) => response.json())
                    .then((res) => {
                        this.state.foods = res.foods;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (error) {
                console.error(error);
            }
        }else{
            alert('It seems you are offline, please connect to a network');
        }

        this._sub = this.props.navigation.addListener('didFocus', () => {
            this.setState({
                showCamera: true,
            });
        });
    }

    componentWillUnmount() {
        this._sub.remove();
    }

    findBarcode(foodsObject, barcode) {
        return foodsObject.find((element) => {
            if(element.barcode == barcode){
                return element;
            }else{
                return undefined;
            }
        })
    }

    onBarCodeRead(barcode) {
        let food = this.findBarcode(this.state.foods, barcode.data);
        if(food != undefined){
            this.setState({
                showCamera: false,
            });
            if(this.state.viaIntake) {
                this.props.navigation.navigate('Intake', {foodId: food.foodId, newElement: false, intakeId: this.state.intakeId});
            }else{
                this.props.navigation.navigate('Intake', {foodId: food.foodId, newElement: true})
            }
            this.setState({
                viaIntake: false,
            });
        }else{
            this.setState({
                showCamera: false,
            });
            Alert.alert(
                'Sorry',
                'not found any food with this barcode',
                [
                    {text: 'Ok', onPress: () => {
                            console.log('Cancel Pressed');
                            this.setState({
                               showCamera: true,
                            });
                    }, style: 'cancel'},
                ],
                { cancelable: false }
            )
        }
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