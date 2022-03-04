import React,{useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from 'base-64';
import { Platform ,TouchableOpacity, StyleSheet,View,KeyboardAvoidingView} from 'react-native';


import { BottomSheet } from 'react-native-btr';
import { InputText } from '..';
import Colors from '../../utils/Colors';
import { API_URL } from '../../utils/Config';
import Icon from '../Icon/Icon';
import Text from '../Text/text';
import { RNToasty } from 'react-native-toasty';
import { FlatList } from 'react-native';

const ReturnOrderModal=(props)=>{
    const {orderId,itemId,close,visible}=props
    
     
  
  const [review,setReview]=useState('')
  const [reason,setReasons]=useState([])
  const [cancelReasonId,setCancelReasonId]=useState(0)
  const [user,setUser]=useState(null)
  useEffect(async()=>{
    await AsyncStorage.getItem('user')
    .then(value => JSON.parse(value))
    .then(response => {
        setUser(response)
        if(orderId!==''||itemId!==''){
            const url=itemId&&orderId?API_URL+'ReturnOrder/'+orderId+'?ItemId='+itemId:
            API_URL + 'ReturnOrder/'+orderId+'?ItemId='
   
        // setVisible(true)
         fetch(url, {
           method: 'GET',
           headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
             Authorization:
               'Basic ' + encode(response.email + ':' + response.password),
           },
     
          
         })
           .then(response => response.json())
           .then(responseJson => {
           //  setVisible(false)
             console.log(responseJson);
             if(responseJson.statusCode==0){
                 setReasons(responseJson.data.ReturnReasons)
   
             }
             
            
             
              
              
             
     
             //Showing response message coming from server
             
           })
           .catch(error => {
             
     
             //display error message
             console.warn(error);
           });
     
     
      
    
   
            

        }
    })
        },[props])
  const cancelOrder=async()=>{
      console.log(itemId+'itemid')
      if(cancelReasonId==0){
          RNToasty.Warn({
              title:'Choose the reason to return the order',
              position:'center'
          },2000)
          return
      }
    const datatoSend=
        {
            "userId":user.userId,
            "orderItemId": itemId!==''?itemId:"0", // "0" if whole order
            "returnReasonId": cancelReasonId,
            "reason": review.toString()
        }
        console.log(datatoSend)
      
  
      
     await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
          const url=itemId==''?API_URL + 'ReturnOrder/'+orderId+'?ItemId=':
          API_URL + 'ReturnOrder/'+orderId+'?ItemId='+itemId
          console.log(url)
        
       // setVisible(true)
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' + encode(response.email + ':' + response.password),
          },
    
          body: JSON.stringify(datatoSend),
        })
          .then(response => response.json())
          .then(responseJson => {
          //  setVisible(false)
            console.log(responseJson);
            if(responseJson.statusCode==200){
                RNToasty.Success({
                    title:responseJson.message
                })
                toggleBottomNavigationView()

            }else if(responseJson.statusCode==404){
                RNToasty.Error({
                    title:responseJson.message,
                    position:'center'
                })
                toggleBottomNavigationView()
            }
             
             
            
    
            //Showing response message coming from server
            
          })
          .catch(error => {
            
    
            //display error message
            console.warn(error);
          });
    
      })
   

  }

  
  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
   
    const toggleBottomNavigationView = () => {
        //Toggling the visibility state of the bottom sheet
        props.close()
      };
     
      
    return(
        <BottomSheet
          
          visible={visible}
          //setting the visibility state of the bottom shee
          onBackButtonPress={toggleBottomNavigationView}
          //Toggling the visibility state
          onBackdropPress={toggleBottomNavigationView}
          //Toggling the visibility state
        >
         
          <KeyboardAvoidingView
           behavior={Platform.OS === "ios" ? "padding" : null}
           keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
          
          >        
              <View style={styles.bottomNavigationView}>
                  <View>
                      <Text type='subheading'>Select the reason for Returning the order</Text>
                  </View>
                  <FlatList
                  data={reason}
                  keyExtractor={(item,index)=>index.toString()}
                  renderItem={({item})=>{
                      return(
                          <View style={{flexDirection:'row',alignItems:'center',padding:4}}>
                           
                              <Icon type='antdesign' name={item.id==cancelReasonId?'checksquare':'checksquareo'} color={Colors.colors.primary} onPress={()=>setCancelReasonId(item.id)}/>

                              <Text type='caption' style={{marginLeft:4}}>{item.reason}</Text>
                              </View>
                      )
                  }}

                  />

             
             
              
           
            <Text type='subheading'>Return description </Text>
            <View style={{width:'100%',flexDirection:'row',marginTop:2}}>
              <InputText
              placeholder="Reason (Optional)"
              inputStyle={{
                color:Colors.colors.black,
                padding:6
               
              }}
              underlineColorAndroid="transparent"    
              autoCorrect={false}
              containerStyle={
               Platform.OS !== 'android'
                  ? styles.inputContainer
                  : {...styles.inputContainer,marginTop:6}
              }
              multiline={true}  
              onChangeText={value =>setReview(value.trim())
                }
              />
            
              
            </View> 
            <TouchableOpacity style={{height:40,width:'100%',backgroundColor:Colors.colors.primary,alignItems:'center',justifyContent:'center',margin:8,borderRadius:8}}
             onPress={()=>cancelOrder()}
             >
            <Text type='caption' style={{color:Colors.colors.white}}>Return</Text>
            </TouchableOpacity>
              </View>
              </KeyboardAvoidingView>

              </BottomSheet>
    )

}
export default ReturnOrderModal
const styles =StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
     //  height: 400,
        padding:18,
        alignSelf:'center',
        
        //justifyContent: 'center',
      //  alignSelf:'center'
       // alignItems: 'center',
      },
      inputContainer: {
        margin: 8,
        borderWidth: 1,
        height: 60,
        borderRadius:4,
        padding:6
    
      },
      customRatingBarStyle: {
        justifyContent: 'center',
       // flexDirection: 'row',
        marginTop: 20,
      },
})