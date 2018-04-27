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
                birthDate: '',
                gender: '',
                type: '',
                bloodSugarAVG: '',
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
                    <Image
                        style={Styles.profileImage}
                        /*source={{uri: this.state.user.profileImage}}*/
                        source={{uri: 'https://scontent-vie1-1.xx.fbcdn.net/v/t1.0-9/21272370_1799954673352735_6326314071398295511_n.jpg?oh=21445389cab89047568d12a4379f2a2d&oe=5AE4C51A'}}
                    />
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
