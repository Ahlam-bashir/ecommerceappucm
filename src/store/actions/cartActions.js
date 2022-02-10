import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';
import {API_URL} from '../../utils/Config';
import {CLEAR_CART, REMOVE_FROM_CART, CART_ITEMS, INC_CART_QUANTITY, DEC_CART_QUANTITY, REMOVE_ALL_FROM_CART} from '../actionTypes';
export const getCartItems = () => {
  return async dispatch => {
    await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response != null) {
          fetch(API_URL + 'MyCart/', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },
            //Request Type
          })
            .then(response => response.json())

            .then(async responseJson => {
              if (responseJson.statusCode === 200) {
                await dispatch({
                  type: CART_ITEMS,
                  cartItems: responseJson.data,
                });
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
        } else {
          // setLoading(true);
          AsyncStorage.getItem('products')
            .then(value => JSON.parse(value))
            .then(async json => {
              // setLoading(false);

              if (json != null) {
                await dispatch({
                  type: CART_ITEMS,
                  cartItems: json,
                });
                //console.log(json)

                //setDisable(false);
                //setRefreshing(false);
              } else {
                // setCartData([]);
                // alert('Cart is Empty');
                //setDisable(true);
                //setRefreshing(false);
              }

              console.log(json);
            });
        }
      });
  };
};
export const removeFromCart = itemId => {
  console.log('action id' + itemId);

  return async dispatch => {
    await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response != null) {
          fetch(API_URL + 'MyCart/' + itemId, {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },
          })
            .then(response => response.json())
            .then(async responseJson => {
              //console.log(responseJson);
              if (responseJson.statusCode === 200) {
                await dispatch({
                  type: REMOVE_FROM_CART,
                  itemId,
                });
              }

              //Showing response message coming from server
              //console.log(responseJson);
            })
            .catch(error => {
              //display error message

              console.warn(error);
            });
        }
      });
  };
};
export const incCart=(cartId,productId,quantity,agentId,variationId)=>{
    
    
  return async dispatch=>{
    await AsyncStorage.getItem('user')
    .then(value => JSON.parse(value))
    .then(response => {
      if (response != null) {
       
        fetch(API_URL + 'MyCart/'+cartId, {
          method:'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Basic ' + encode(response.email + ':' + response.password),
          },
          body: JSON.stringify({
            "id": cartId,
            "productId":productId, //Product Id
            "quantity":quantity,
            "agentId":agentId,
            "variationId":variationId
        }),
        })
          .then(response => response.json())
          .then(async responseJson => {
            console.log(responseJson);
            if (responseJson.statusCode ===200) {
              console.log(responseJson);
              await dispatch({
                type: INC_CART_QUANTITY,
                cartItemId :cartId
              });   
            }
            else if(responseJson.statusCode===201){
              alert(responseJson.message)

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
export const decCart=(cartId,productId,quantity,agentId,variationId)=>{
    
    
  return async dispatch=>{
    await AsyncStorage.getItem('user')
    .then(value => JSON.parse(value))
    .then(response => {
      if (response != null) {
       
        fetch(API_URL + 'MyCart/'+cartId, {
          method:'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Basic ' + encode(response.email + ':' + response.password),
          },
          body: JSON.stringify({
            "id": cartId,
            "productId":productId, //Product Id
            "quantity":quantity,
            "agentId":agentId,
            "variationId":variationId
        }),
        })
          .then(response => response.json())
          .then(async responseJson => {
           
            if (responseJson.statusCode===200) {
               // console.log(item)
               console.log(responseJson);
              await dispatch({
                type: DEC_CART_QUANTITY,
                p_id:cartId
                 
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
export const removeCart=()=>{
    
    
  return async dispatch=>{
    await AsyncStorage.getItem('user')
    .then(value => JSON.parse(value))
    .then(response => {
      if (response != null) {
       
        fetch(API_URL + 'MyCart/?delete=all', {
          method:'DELETE',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Basic ' + encode(response.email + ':' + response.password),
          },
         
        })
          .then(response => response.json())
          .then(async responseJson => {
           
            if (responseJson.statusCode===200) {
               // console.log(item)
               console.log(responseJson);
              await dispatch({
                type:REMOVE_ALL_FROM_CART ,
                  
                 
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













