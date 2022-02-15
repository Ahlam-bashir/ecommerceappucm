import { encode } from 'base-64'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import {View,TouchableOpacity} from 'react-native'
import { useDispatch } from 'react-redux'
import { Icon } from '../../../components'
import { addToWishlist, removeFromWishlist } from '../../../store/actions/wishlistActions'
import Colors from '../../../utils/Colors'
import { API_URL } from '../../../utils/Config'

const WishIcon=(props)=>{
    const [isWishlist,setisWishlist]=useState(false)
    const {item,user}=props
    const [wishlistId,setwishlistId]=useState(null)
    const dispatch=useDispatch()
    const [flag,setflag]=useState(0)
    useEffect(async()=>{

       getWishlistStatus()

    },[dispatch,flag])
    const getWishlistStatus=async()=>{
        await fetch(API_URL+'AlreadyInWishlist?productId='+item.product.id+'&variationId=null', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
              
                Authorization:
                  'Basic ' + encode(user.email + ':' + user.password),
              },
            //Request Type
          })
            .then(response => response.json())
      
            .then(responseJson => {
              console.log(
                'wishlist' + responseJson.data
              );
              if (responseJson.statusCode === 200) {
                  setisWishlist(responseJson.data.IsInWishlist)
                  setwishlistId(responseJson.data.WishlistId)
                
               
              }
              //Success
            })
      
            .catch(error => {
              //Error
             
      
              console.error(error);
            });
       
    }
  const removeWish=(id)=>{
      setflag(1)
    dispatch(removeFromWishlist(id))
    setisWishlist(false)
    getWishlistStatus()
  }
    
    const addtoWishlist=(item)=>{
        setflag(0)
        dispatch(addToWishlist(item))
        setisWishlist(true)
        getWishlistStatus()
     /*   Alert.alert(
          //title
          'Success',
          //body
          'Product' + '  ' + 'added' + '  ' + 'to Wishlist',
          
          //clicking out side of alert will not cancel
        );*/
      }
       
    return(
        <TouchableOpacity
        style={{
         height: 40,
         width: 40,
         borderRadius: 40 / 2,
         backgroundColor: Colors.colors.primary,
         alignItems:'center',
         justifyContent:'center',
         alignSelf: 'flex-start',
         margin:4,
        position:'absolute',
         overflow:'visible'
       }}
       onPress={()=>{!isWishlist?addtoWishlist(item):removeWish(wishlistId)}}
        >
        <Icon name={isWishlist?'heart':'hearto'} type='antdesign'color={Colors.colors.white}/>
        </TouchableOpacity>


    )

}
export default WishIcon