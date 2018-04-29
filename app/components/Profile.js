/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    AsyncStorage,
    Image,
    Alert,
    NativeModules,
} from 'react-native';
import Styles from "../config/Styles";
import Moment from 'moment';
import {NavigationActions} from "react-navigation";
import { Icon } from 'react-native-elements';

let ImagePicker = NativeModules.ImageCropPicker;


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
                image: 0,
            });
        }
    }

    logout = async() => {
        try{
            Alert.alert(
                'Log out',
                'Are you sure you want to log out?',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Yes', onPress: () => {
                        AsyncStorage.removeItem('user');
                        const value = AsyncStorage.getItem('user');
                        if (value !== null){
                            this.setState({user: value});
                            this.resetNavigation('Home');
                            alert('You have successfully logged out.');
                        }
                    }},
                ],
                { cancelable: false }
            )
        }catch(err){
            console.log(err);
        }
    }

    uploadPhoto(photo){
        const image = {
            uri: photo.path,
            type: photo.mime,
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
            .then((response) => response.json())
            .then ((res) => {
                if(res.success === true){
                    this.setState({
                       user: {
                           ...this.state.user,
                           profileImage: res.imageURL,
                       }
                    });
                    alert(res.message);
                }else{
                    alert(res.message);
                }
            })
            .done();
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

    pickSingleWithCamera(cropping) {
        ImagePicker.openCamera({
            cropping: cropping,
            width: 200,
            height: 200,
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.uploadPhoto(image);
            this.setState({
                image: this.state.image + 1,
            });
        }).catch(e => alert(e));
    }

    pickSingleBase64(cropit) {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: cropit,
            includeBase64: true,
            includeExif: true,
        }).then(image => {
            this.uploadPhoto(image);
            this.setState({
                image: this.state.image + 1,
            });
        }).catch(e => alert(e));
    }

    pickSingle(cropit, circular=false) {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.uploadPhoto(image);
            this.setState({
                image: this.state.image + 1,
            });
        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
    }

    renderImage(profileImage) {
        return <Image style={Styles.profileImage} source={profileImage} />
    }

    selectType(){
        Alert.alert(
            'New profile photo',
            'Are you sure you want to log out?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'From Gallery', onPress: () => {
                        this.pickSingleBase64(false);
                    }},
                {text: 'Use camera', onPress: () => {
                        this.pickSingleWithCamera(false);
                    }},
            ],
            { cancelable: false }
        )
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
                        {this.state.user.profileImage ? this.renderImage(this.state.user.profileImage) : null}
                    </View>
                    <View style={{marginTop: 10}}>
                        <Icon
                            type="material"
                            name="add-a-photo"
                            size={30}
                            color={'white'}
                            onPress={() => {this.selectType()}}
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
