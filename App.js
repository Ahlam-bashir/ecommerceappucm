import 'react-native-gesture-handler'
import React from 'react'
import {View,Text, StatusBar} from 'react-native'
import AppNavigator from './src/navigation/AppNavigator'
import Colors from './src/utils/Colors'
import {StripeProvider} from '@stripe/stripe-react-native'
import { STRIPE_PUBLISHABLE_KEY } from './src/utils/Config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encode } from 'base-64'
import { useEffect } from 'react'
import {createStore,applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './src/store/rootReducer'

const store=createStore(rootReducer,applyMiddleware(thunk))


const App = ()=>{
useEffect(()=>{
  loggedInUser()
},[])


  return (
    <Provider store={store}>
    
    <StripeProvider
    publishableKey={STRIPE_PUBLISHABLE_KEY}>
        
   <AppNavigator/>
   </StripeProvider>
   </Provider>
  
  )

}
const loggedInUser = async() =>{
   let u = await AsyncStorage.getItem('user').then(value=>JSON.parse(value));
   return u
}
export default App

