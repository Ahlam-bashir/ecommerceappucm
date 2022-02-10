import AsyncStorage from '@react-native-async-storage/async-storage'
import {isNonEmptyString} from './primitiveChecks'
const SELLER_KEY ='currency'
const saveValue = async (key,value)=>{
    try{
        if(isNonEmptyString(value))
        {
            await AsyncStorage.setItem(key,value)
        }else{
            await AsyncStorage.removeItem(key)
        }
        return true
    }catch(e){
        return false
    }
};
export const loadValue = async key =>{
    try{
      const value=  await AsyncStorage.getItem(key)
       return value
    }catch(e){
        return null
    }
}
export  const saveCurrency = async user =>{
    saveValue(SELLER_KEY,user)
}
export const loadCurrency= async() =>{
          loadValue(SELLER_KEY)
}