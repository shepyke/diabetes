/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage,
    Image,
    ImageBackground,
} from 'react-native';
import Styles from "../config/Styles";
import Moment from 'moment';
import {NavigationActions} from "react-navigation";
import { Icon } from 'react-native-elements';
import PhotoUpload from 'react-native-photo-upload';


export default class Profile extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            user: {
                userId: '',
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                profileImage: '',
                birthDay: '',
                gender: '',
                type: '',
            },
            isLoading: true,
        }
    }

    componentDidMount(){
        this._loadInitialState().done();
    }

    _loadInitialState = async() => {
        let val = await AsyncStorage.getItem('user');
        let value = JSON.parse(val);
        if( value !== null ){
            this.setState({
                user:{
                    userId: value['userId'],
                    username: value['username'],
                    email: value['email'],
                    firstName: value['firstName'],
                    lastName: value['lastName'],
                    birthDay: Moment(value['dob']).format('YYYY-MM-DD'),
                    gender: value['gender'],
                    type: value['type'],
                    profileImage: value['profileImage'],
                },
                isLoading: false,
            });
        }
    }

    logout = () => {
        try{
            AsyncStorage.removeItem('user');
            const value = AsyncStorage.getItem('user');
            if (value !== null){
                this.setState({user: value});
                this.resetNavigation('Home');
                alert('You have successfully logged out.');
            }
        }catch(err){
            console.log(err);
        }
    }

    uploadPhoto(photo){
        const image = {
            uri: photo.uri,
            type: 'image/jpeg',
            name: this.state.user.userId + '-' + Date.now() + '.jpg'
        }

        const data = new FormData();

        data.append('avatar', image);

        try {
            fetch('https://diabetes-backend.herokuapp.com/profile', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            })
                .then(res => {
                    return
                });
        } catch (err) {
            console.error(err);
            return
        }
    }

    resetNavigation(targetRoute) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
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

                <View style={Styles.backgroundImage}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <PhotoUpload
                            onCancel = {(result) => {
                                // console.log("Cancelled");
                                // if(result){
                                //     console.log("onPhotoSelect.result: " + JSON.stringify(result,null,4));
                                // }
                            }}
                            onStart = {(result) => {
                                // console.log("onStart");
                                // if(result){
                                //     console.log("onStart.result: " + JSON.stringify(result,null,4));
                                // }
                            }}
                            onPhotoSelect = {(result) => {
                                // console.log("onPhotoSelect");
                                // if(result){
                                //     console.log("onPhotoSelect.result: " + JSON.stringify(result,null,4));
                                // }
                            }}
                            onResponse = {(result) => {
                                //console.log("onResponse");
                                if(result.uri){
                                    //console.log("onResponse.result: " + JSON.stringify(result,null,4));
                                    this.uploadPhoto(result);
                                }
                            }}
                            onRender = {(result) => {
                                console.log("onRender");
                                // if(result){
                                //     console.log("onRender.result: " + JSON.stringify(result,null,4));
                                // }
                            }}
                            onError = {(result) =>{
                                    console.log("onError");
                                    if(result){
                                        console.log("onError.result: " + JSON.stringify(result,null,4));
                                        this.props.navigate('Profile');
                                    }
                                }
                            }
                        >
                            <Image
                                style={Styles.profileImage}
                                source={{uri: this.state.user.profileImage}}
                            />
                        </PhotoUpload>
                    </View>
                    <View style={{marginTop: 10}}>
                        <Icon
                            type="material"
                            name="add-a-photo"
                            size={30}
                            color={'white'}
                            onPress={() => {alert("Please click on your profile photo to change that.")}}
                        />
                    </View>

                </View>

                <View style={[Styles.container, {flex: .2}]}>
                    <Text style={Styles.welcome}>Welcome {this.state.user.username}</Text>
                </View>

                <View style={Styles.container}>
                    <Text style={Styles.text}>First name: {this.state.user.firstName}</Text>
                    <Text style={Styles.text}>Last name: {this.state.user.lastName}</Text>
                    <Text style={Styles.text}>Username: {this.state.user.username}</Text>
                    <Text style={Styles.text}>Email: {this.state.user.email}</Text>
                    <Text style={Styles.text}>Date of birth: {this.state.user.birthDay}</Text>
                    <Text style={Styles.text}>Gender: {this.state.user.gender}</Text>
                    <Text style={Styles.text}>Diabetes type: {this.state.user.type}</Text>
                </View>

                <View style={Styles.footer}>
                    <TouchableOpacity
                        style={Styles.logout}
                        onPress={this.logout}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
