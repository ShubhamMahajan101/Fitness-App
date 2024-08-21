
// // import React from 'react';
// // import { render, fireEvent } from '@testing-library/react-native';
// // import AsyncStorage from '@react-native-community/async-storage';
// // import Login from '../src/Screens/Login';
// // import { Dimensions } from 'react-native';
// // // import Toast from '../src/Provider/Messageconsolevalidationprovider/messageProvider';
// // // Mock AsyncStorage methods before running tests

// // jest.mock('react-native', () => ({
// //   Alert: jest.fn(),
// //   ToastAndroid: {
// //     SHORT: jest.fn(),
// //     LONG: jest.fn(),
// //   },
// //   // Platform: {
// //   //   OS: 'android', // Change to 'ios' if needed
// //   // },
// // }));

// // // Mocking react-native-simple-toast
// // jest.mock('react-native-simple-toast', () => ({
// //   show: jest.fn(),
// //   // other methods you use from this library
// // }));


// // jest.mock('react-native', () => {
// //   const ActualReactNative = jest.requireActual('react-native');
// //   return {
// //     ...ActualReactNative,
// //     Dimensions: {
// //       get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
// //     },
// //   };
// // });

// // jest.mock('@react-native-community/async-storage', () => ({
// //   __esModule: true,
// //   default: {
// //     setItem: jest.fn(),
// //     getItem: jest.fn(),
// //     removeItem: jest.fn(),
// //   },
// // }));

// // describe('<Login />', () => {
// //   beforeEach(() => {
// //     // Clear any previous mock implementation or calls to AsyncStorage methods
// //     AsyncStorage.setItem.mockClear();
// //     AsyncStorage.getItem.mockClear();
// //     AsyncStorage.removeItem.mockClear();
// //   });

// //   test('should render the Login screen', () => {
// //     const { getByText, getByPlaceholderText } = render(<Login />);

// //     // Check if certain elements are present on the screen
// //     const emailInput = getByPlaceholderText('Enter Email');
// //     const passwordInput = getByPlaceholderText('Enter Password');
// //     const loginButton = getByText('Log In');

// //     expect(emailInput).toBeTruthy();
// //     expect(passwordInput).toBeTruthy();
// //     expect(loginButton).toBeTruthy();
// //   });

// //   test('should update state when inputs change', () => {
// //     const { getByPlaceholderText } = render(<Login />);
// //     const emailInput = getByPlaceholderText('Enter Email');
// //     const passwordInput = getByPlaceholderText('Enter Password');

// //     fireEvent.changeText(emailInput, 'test@example.com');
// //     fireEvent.changeText(passwordInput, 'password123');

// //     expect(emailInput.props.value).toBe('test@example.com');
// //     expect(passwordInput.props.value).toBe('password123');
// //   });

// //   // You can write more tests for login validation, API calls, etc.
// // });


// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import AsyncStorage from '@react-native-community/async-storage';
// import Login from '../src/Screens/Login';

// jest.mock('react-native', () => {
//   const ActualReactNative = jest.requireActual('react-native');
//   // return {
//   //   ...ActualReactNative,
//   //   Alert: jest.fn(),
//   //   ToastAndroid: {
//   //     SHORT: jest.fn(),
//   //     LONG: jest.fn(),
//   //   },
//   //   Dimensions: {
//   //     get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
//   //   },
//   // };
// });

// jest.mock('react-native-simple-toast', () => ({
//   show: jest.fn(),
//   // other methods you use from this library
// }));

// jest.mock('@react-native-community/async-storage', () => ({
//   __esModule: true,
//   default: {
//     setItem: jest.fn(),
//     getItem: jest.fn(),
//     removeItem: jest.fn(),
//   },
// }));

// jest.mock('react-native', () => ({
//   Platform: {
//     OS: 'ios', // or 'android', depending on your testing scenario
//   },
// }));

// jest.mock('react-native', () => ({
//   Dimensions: {
//     get: jest.fn().mockReturnValue({ width: 1920, height: 1080 }), // Adjust values as needed
//   },
// }));


// describe('<Login />', () => {
//   beforeEach(() => {
//     // Clear any previous mock implementation or calls to AsyncStorage methods
//     AsyncStorage.setItem.mockClear();
//     AsyncStorage.getItem.mockClear();
//     AsyncStorage.removeItem.mockClear();
//   });

//   test('should render the Login screen', () => {
//     const { getByText, getByPlaceholderText } = render(<Login />);

//     // Check if certain elements are present on the screen
//     const emailInput = getByPlaceholderText('Enter Email');
//     const passwordInput = getByPlaceholderText('Enter Password');
//     const loginButton = getByText('Log In');

//     expect(emailInput).toBeTruthy();
//     expect(passwordInput).toBeTruthy();
//     expect(loginButton).toBeTruthy();
//   });

//   test('should update state when inputs change', () => {
//     const { getByPlaceholderText } = render(<Login />);
//     const emailInput = getByPlaceholderText('Enter Email');
//     const passwordInput = getByPlaceholderText('Enter Password');

//     fireEvent.changeText(emailInput, 'test@example.com');
//     fireEvent.changeText(passwordInput, 'password123');

//     expect(emailInput.props.value).toBe('test@example.com');
//     expect(passwordInput.props.value).toBe('password123');
//   });

//   // You can write more tests for login validation, API calls, etc.
// });



// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import AsyncStorage from '@react-native-community/async-storage';
// import Login from '../src/Screens/Login';
// const { Alert, ToastAndroid, Platform } = require('react-native');
// const Toast = require('react-native-simple-toast');
// // Mock AsyncStorage methods before running tests
// jest.mock('@react-native-community/async-storage', () => ({
//   setItem: jest.fn(),
//   getItem: jest.fn(),
//   removeItem: jest.fn(),
// }));


// describe('<Login />', () => {
//   beforeEach(() => {
//     // Clear any previous mock implementation or calls to AsyncStorage methods
//     AsyncStorage.setItem.mockClear();
//     AsyncStorage.getItem.mockClear();
//     AsyncStorage.removeItem.mockClear();
//   });

//   test('should render the Login screen', () => {
//     const { getByPlaceholderText, getByText } = render(<Login />);

//     // Check if certain elements are present on the screen
//     const emailInput = getByPlaceholderText('Enter Email');
//     const passwordInput = getByPlaceholderText('Enter Password');
//     const loginButton = getByText('Log In');

//     expect(emailInput).toBeTruthy();
//     expect(passwordInput).toBeTruthy();
//     expect(loginButton).toBeTruthy();
//   });

//   test('should update state when inputs change', () => {
//     const { getByPlaceholderText } = render(<Login />);
//     const emailInput = getByPlaceholderText('Enter Email');
//     const passwordInput = getByPlaceholderText('Enter Password');

//     fireEvent.changeText(emailInput, 'test@example.com');
//     fireEvent.changeText(passwordInput, 'password123');

//     expect(emailInput.props.value).toBe('test@example.com');
//     expect(passwordInput.props.value).toBe('password123');
//   });

//   // You can write more tests for login validation, API calls, etc.
// });
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
// import Login from './Login'; // Path to your Login component file
import Login from '../src/Screens/Login';

jest.mock('@react-native-community/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
describe('Login Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);

    // Check if important text elements are present in the component
    expect(getByText('Log In')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('handles user input correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    // Simulate user typing in the email and password fields
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Ensure the input values have changed
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  // Add more test cases for user interactions and validations here
});

