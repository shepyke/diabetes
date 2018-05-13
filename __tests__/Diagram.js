import React from 'react';
import 'react-native';
import Diagram from '../app/components/Diagram';

import renderer from 'react-test-renderer';

//Start of testId: diagram-1
it('renders the class correctly', () => {
    const tree = renderer.create(<Diagram />).toJSON();
    expect(tree).toMatchSnapshot();
});
//End of testId: diagram-1

//Start of testId: diagram-2
it('result of generateData should not be empty', () => {
    let DiagramData = renderer.create(<Diagram/>).getInstance();

    let metric = 'sugar';
    let objects = [
        {
            time: '2018-05-11 20:40Z000',
            sugar: '5.6'
        },
        {
            time: '2018-05-11 21:40Z0.00',
            sugar: '2.3'
        }
    ]

    expect(DiagramData.generateData(objects, metric)).not.toBeNull();
});
//End of testId: diagram-2
