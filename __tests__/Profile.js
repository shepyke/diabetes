import 'react-native';
import React from 'react';
import Profile from '../app/components/Profile';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//Start of testId: profile-1
it('renders the class correctly', () => {
    const tree = renderer.create(<Profile />).toJSON();
    expect(tree).toMatchSnapshot();
});
//End of testId: profile-1

//Start of testId: profile-2
it('renders the profileImage component', done => {
    const Image = require('Image');
    Image.getSize('https://storage.googleapis.com/diabetes-93dcc.appspot.com/anonym_man.png', (width, height) => {
        const tree = renderer.create(<Image style={{height, width}} />).toJSON();
        expect(tree).toMatchSnapshot();
        done();
    });
});
//End of testId: profile-2
