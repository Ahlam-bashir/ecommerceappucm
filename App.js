import 'react-native-gesture-handler'
import React from 'react'
import {View,Text, StatusBar} from 'react-native'
import AppNavigator from './src/navigation/AppNavigator'
import Colors from './src/utils/Colors'
import {StripeProvider} from '@stripe/stripe-react-native'
import { STRIPE_PUBLISHABLE_KEY, STRIPE_PUBLISHABLE_KEY_IND } from './src/utils/Config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encode } from 'base-64'
import { useEffect } from 'react'
import {createStore,applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './src/store/rootReducer'
import { useState } from 'react'

const store=createStore(rootReducer,applyMiddleware(thunk))

export const Context = React.createContext({ value:null, setValue: () => {} });
const App = ()=>{
  const [value, setValue] = useState("INR");
  const [code,setCode]=useState("INR")
useEffect(async()=>{
  await AsyncStorage.getItem('currency').then(value=>JSON.parse(value)).then(json => {
    if (json !== null) {
      console.log(json)
      if(json.target_code!=="INR"){}
        setCode(json.target_code);
        setValue(json.target_code)

     
     
     //  setSymbol('&#X' + json.target_data.display_symbol + ';');
    }
  })
  .catch(error => {
    console.log('ghj'+error);
  });;
},[code,value])


  return (
    <Provider store={store}>
    <Context.Provider  value={{value, setValue}}>
    <StripeProvider
    
    publishableKey={(value=='INR')?STRIPE_PUBLISHABLE_KEY_IND:STRIPE_PUBLISHABLE_KEY}>
        
   <AppNavigator/>
   
   </StripeProvider>
   </Context.Provider>
   </Provider>
  
  )

}

export default App

