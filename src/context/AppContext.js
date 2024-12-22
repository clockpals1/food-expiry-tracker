import React, { createContext, useContext, useReducer, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const initialState = {
  products: [],
  cart: [],
  notifications: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const saveToStorage = useCallback(async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }, []);

  const loadFromStorage = useCallback(async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error loading from storage:', error);
      return null;
    }
  }, []);

  const addProduct = useCallback(async (product) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      await saveToStorage('products', [...state.products, product]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.products, saveToStorage]);

  const addToCart = useCallback(async (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    await saveToStorage('cart', [...state.cart, product]);
  }, [state.cart, saveToStorage]);

  const removeFromCart = useCallback(async (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    const updatedCart = state.cart.filter(item => item.id !== productId);
    await saveToStorage('cart', updatedCart);
  }, [state.cart, saveToStorage]);

  const value = {
    ...state,
    dispatch,
    addProduct,
    addToCart,
    removeFromCart,
    saveToStorage,
    loadFromStorage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
