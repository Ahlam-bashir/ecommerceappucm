import React from 'react'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native'
import { FlatList ,Image,TouchableOpacity} from 'react-native'
import {View} from 'react-native'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import { CustomHeader,Icon,Loader,Text } from '../../components'
import { DIMENS } from '../../constants'
import Colors from '../../utils/Colors'
import {getWishlist, removeFromWishlist} from '../../store/actions/wishlistActions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import {decode} from 'html-entities';
import { Alert } from 'react-native'
import { encode } from 'base-64'
import { API_URL } from '../../utils/Config'
import StringsOfLanguages from '../../constants/StringOfLanguages'
import { Platform } from 'react-native'

const wishlist=({navigation})=>{
    const [price,setPrice]=useState(1)
    const [symbol, setSymbol] = useState(decode('&#X0024;'));
    const [loading,setLoading]=useState(false)
    const wishlistItems=useSelector(state=>state.wishlist)
    const [user,setUser]=useState(null)
    const dispatch=useDispatch()
    console.log(wishlistItems)
    useEffect(async ()=>{
        await AsyncStorage.getItem('user')
        .then(value => JSON.parse(value))
        .then(response => setUser(response));
        await AsyncStorage.getItem('currency')
        .then(value => JSON.parse(value))
        .then(json => {
          if (json !== null) {
            setPrice(json.conversion_rate);
            console.log(json);
            setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
       
          //  setSymbol('&#X' + json.target_data.display_symbol + ';');
          }
        })
        .catch(error => {
          console.log(error);
        });
    },[])
    useEffect(()=>{
        dispatch(getWishlist())

    },[dispatch])
    const addToCart=(id)=>{
        setLoading(true)
        fetch(API_URL + 'MyCart', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + encode(user.email + ':' + user.password),
            },
            body: JSON.stringify({
              productId: id, //Product Id
              quantity: 1,
              agentId: 0,
              variationId: null,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
            
              setLoading(false);
              //setAlertVisible(true);
             
              alert('Product' + '  ' + responseJson.message + '  ' + 'to Cart',)
              //Showing response message coming from server
              console.log(responseJson);
              
             // setAlertVisible(true)
              
      
           //  alert('Product' + '  ' + responseJson.message + '  ' + 'to Cart');
              /* SweetAlert.showAlertWithOptions({
                title: '',
                subTitle: '',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#000',
                otherButtonTitle: 'Cancel',
                otherButtonColor: '#dedede',
                style: 'success',
                Icon: 'success',
                cancellable: true
      
              },
              callback => console.log('callback')
              
              ):*/
              // setLoading(false)
            })
            .catch(error => {
              //display error message
              setLoading(false);
      
              console.warn(error);
            });
    }
    return(
        <SafeAreaView style={{flex:1,paddingBottom:30}}>
            <CustomHeader  customStyles={styles.header}/>
            <Loader loading={loading}/>
            
        <View> 
            <View style={styles.header2}>
            <Icon
              name="arrowleft"
              color={Colors.colors.white}
              size={25}
              type="antdesign"
              onPress={() => navigation.goBack()}
            />


                <Text type='heading' style={{color:Colors.colors.white,textAlign:'center',width:'90%'}}>{StringsOfLanguages.displayWishlist}</Text>
            </View>
            <View style={{padding:12,marginTop:Platform.OS!='ios'?40:null}}>
                {wishlistItems.length!==0?
                <>
                 <FlatList
                 showsVerticalScrollIndicator={false}
                     contentContainerStyle={{justifyContent:'center',paddingBottom:40}}
                      data={wishlistItems}
                      keyExtractor={(item,index)=>index.toString()}
                      renderItem={({item})=>{
                          
                          
                          return(
                             <TouchableOpacity
                             key={item.wishlist.id}
                              onPress={()=>navigation.navigate('productDetails', {
                              id: item.product.id,
                            })}>
                                <View style={styles.listContainer} >
                                <Image source={{uri:item.mainImage}} 
                                resizeMode='contain'
                                style={{width:120,height:60,}}
                                />
                                <View style={{flexDirection:'column'}}>
                                    <Text type='subheading' style={{width:200}}>{item.product.name}</Text>
                                    <Text>{decode(symbol) + (item.product.price * price).toFixed(2)}</Text>
                                    <View  style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'row'}}>
                                   <TouchableOpacity style={styles.circle}  onPress={()=>addToCart(item.product.id)}>
                                    <Icon 
                                     name="add-shopping-cart"
                                     size={20}
                                     color={Colors.colors.white}
                                     style={{margin:3}}   
                                    />
                                     </TouchableOpacity>
                                   
                                     <TouchableOpacity style={styles.circle}     onPress={()=>dispatch(removeFromWishlist(item.wishlist.id))}
                                 >
                                      <Icon 
                                     name="delete"
                                     size={20}
                                     color={Colors.colors.white}
                                     style={{margin:3}}
                                     />
                                     </TouchableOpacity>
                                   
                                </View>
                                </View>
                                


                            </View>
                            </TouchableOpacity>
                          
                          )
                      }}

                  
                />
                </>
:<View style={{alignItems:'center',justifyContent:'center',height:DIMENS.common.WINDOW_HEIGHT}}>
    <Text type='heading'>Your Wishlist is Empty</Text>
    </View>}
               
            </View>



        </View>
        </SafeAreaView>
    )

}
export default wishlist
const styles=StyleSheet.create({
    header:{
        position:'absolute',
        width:DIMENS.common.WINDOW_WIDTH

    },
    header2:{
        //justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        width:DIMENS.common.WINDOW_WIDTH,
        padding:10
        

    },
    listContainer:{
      width:'100%',
    //  height:140,
      backgroundColor:Colors.colors.white,
    //  margin:6,
      padding:8,
      alignItems:'flex-start',
      flexDirection:'row',
      paddingTop:16,
      marginBottom:10,
      borderRadius:10


    },
    circle:
      {width:40,
        height:40,
        borderRadius:40/2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.colors.primary,
        margin:4
      }
    

})