import React from 'react';
import 'react-native';
import Login from '../app/components/Login';
import { sha256 } from 'react-native-sha256';

import renderer from 'react-test-renderer';

//Start of testId: login-1
it('check all the necessary fields are filled for Login', () => {
    let LoginData = renderer.create(<Login/>).getInstance();

    LoginData.setState({
            user: {
                ...LoginData.state.user,
                username: 'testUser',
                password: 'password',
            },
    });

    (expect(LoginData.state.user.username).toBeDefined() && expect(LoginData.state.user.user.password).toBeDefined());
});
//End of testId: login-1
