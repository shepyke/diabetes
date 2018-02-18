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
            this.setState(
                {user:
                    {
                        userId: value['userId'],
                        username: value['username'],
                        email: value['email'],
                        firstName: value['firstName'],
                        lastName: value['lastName'],
                        birthDay: value['birthDay'],
                        profileImage: 'https://scontent-vie1-1.xx.fbcdn.net/v/t1.0-9/21272370_1799954673352735_6326314071398295511_n.jpg?oh=21445389cab89047568d12a4379f2a2d&oe=5AE4C51A',
                        //value['profile_image'],
                        gender: value['gender'],
                        type: value['type'],
                        bloodSugarAVG: value['sugarAVG'],
                    }
                }
            );
        }
        this.setState({
            isLoading: false
        });
    }

    logout = () => {
        try{
            AsyncStorage.removeItem('user');
            const value = AsyncStorage.getItem('user');
            if (value !== null){
                this.setState({user: value});
                this.props.navigation.navigate('Home');
                alert('You have successfully logged out.');
            }
        }catch(err){
            console.log(err);
        }
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

                <ImageBackground
                     style={Styles.backgroundImage}

                     source={{uri: 'https://iphonekozosseg.hu/wp-content/uploads/2014/11/abstract-fly-white-line-pattern-9-ipad-wallpaper.jpg'}}>
                    <Image
                        style={Styles.profileImage}
                        /*source={{uri: this.state.user.profileImage}}*/
                        source={{uri: 'https://scontent-vie1-1.xx.fbcdn.net/v/t1.0-9/21272370_1799954673352735_6326314071398295511_n.jpg?oh=21445389cab89047568d12a4379f2a2d&oe=5AE4C51A'}}
                    />
                </ImageBackground>

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
                    <Text style={Styles.text}>Average blood sugar: {this.state.user.sugarAVG}</Text>
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
