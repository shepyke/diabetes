import 'react-native';
import React from 'react';
import RegistrationForm from '../app/components/RegistrationForm';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//Start of testId: regist-1
it('renders the normal TextInput component', () => {
    const TextInput = require('TextInput');
    const tree = renderer
        .create(<TextInput value="username" />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
//End of testId: regist-1

//Start of testId: regist-2
it('renders the secure TextInput component for passwords', () => {
    const TextInput = require('TextInput');
    const tree = renderer
        .create(<TextInput secureTextEntry={true} value="passwordnotshown" />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
//End of testId: regist-2

//Start of testId: regist-3
test('Passwords during user registration', () => {
    let user = {username: 'testUser', password: 'testPassword', repassword: 'testpassword'};

    expect(user.password).not.toMatch(user.repassword);
})
//End of testId: regist-3

