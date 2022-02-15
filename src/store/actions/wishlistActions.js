import AsyncStorage from "@react-native-async-storage/async-storage";
import { encode } from "base-64";
import { RNToasty } from "react-native-toasty";
import { API_URL } from "../../utils/Config";
import { ADD_TO_WISHLIST, GET_WISHLIST, REMOVE_FROM_CART, REMOVE_FROM_WISHLIST } from "../actionTypes";

export const getWishlist=()=>{
    return async (dispatch)=>{
        await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response != null) {
            fetch(API_URL + 'Wishlist', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization:
                      'Basic ' + encode(response.email + ':' + response.password),
                  },
                //Request Type
              })
                .then(response => response.json())
          
                .then(responseJson => {
                  
          
                  if (responseJson.statusCode === 0) {
                      dispatch({
                          type:GET_WISHLIST,
                          responseJson
    
                      })    
                    //setSlides(responseJson.data.slides);
                    //setData(responseJson.data.categories);
                    // setArrival(responseJson.data.Products)
                    //setSuperCategories(responseJson.data.superCategories);
                  }
                  //Success
                })
                .catch(error => {
                  //Error
          
                  console.error(error);
                });
    
        }})
        
    }


}
export const removeFromWishlist=(itemId)=>{
    
    
    return async dispatch=>{
      await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response != null) {
         
          fetch(API_URL + 'Wishlist/' + itemId, {
            method:'DELETE',
            headers: {
              'Content-type': 'application/json',
              Authorization: 'Basic ' + encode(response.email + ':' + response.password),
            },
          })
            .then(response => response.json())
            .then(async responseJson => {
              console.log(responseJson);
              if (responseJson.statusCode === 0) {
                await dispatch({
                  type: REMOVE_FROM_WISHLIST,
                   itemId
                });
  
                
                  
      
               
              }
      
              //Showing response message coming from server
              //console.log(responseJson);
            })
            .catch(error => {
              //display error message
      
              console.warn(error);
            });
          }})
  
  
    }
  }
  export const addToWishlist=(item,id)=>{
    
    
    return async dispatch=>{
      await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response != null) {
         
          fetch(API_URL + 'Wishlist', {
            method:'POST',
            headers: {
              'Content-type': 'application/json',
              Authorization: 'Basic ' + encode(response.email + ':' + response.password),
            },
            body: JSON.stringify({
                "userId": response.userId,
                "productId":item.product.id,
                "variationId":null
              }),
          })
            .then(response => response.json())
            .then(async responseJson => {
              console.log(responseJson);
              if (responseJson.statusCode === 0 && responseJson.message=="added") {
                 RNToasty.Success({
                   title:'Product' + '  ' + responseJson.message + '  ' + 'to Wishlist',
                   position:'center'
                   

                 })
                  
                await dispatch({
                  type: ADD_TO_WISHLIST,
                   item
                });
  
                
                  
      
               
              }else{
                RNToasty.Success({
                  title:responseJson.message
                  

                })
              }
      
              //Showing response message coming from server
              //console.log(responseJson);
            })
            .catch(error => {
              //display error message
      
              console.warn(error);
            });
          }})
  
  
    }
  }
  
  