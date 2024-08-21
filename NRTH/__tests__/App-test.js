/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
// import Login from '../src/Screens/Login';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Login from '../src/Screens/Login';

it('renders correctly', () => {
  renderer.create(<Login />);
});
