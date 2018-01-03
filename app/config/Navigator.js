/**
 * Diabetes
 * https://github.com/shepyke/diabetes
 * @flow
 */

import {
    StackNavigator
} from 'react-navigation';
import Login  from '../components/Login';
import Profile  from '../components/Profile';
import RegistrationForm  from '../components/RegistrationForm';

const Navigator = StackNavigator({
        Home: {screen: Login},
        Registration: {screen: RegistrationForm},
        Profile: {screen: Profile},
    }, {
        navigationOptions: {
            header: false,
        }
    }
);

export default Navigator;

