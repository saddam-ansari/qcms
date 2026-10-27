import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authReducer from '../redux/authSlice';

describe('App Component', () => {
  test('renders without crashing', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(document.body).toBeInTheDocument();
  });
});
