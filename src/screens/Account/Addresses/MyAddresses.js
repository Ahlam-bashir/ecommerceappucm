import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from 'base-64';
import React, {useState} from 'react';
import { useEffect } from 'react';
import { FlatList } from 'react-native';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ToastAndroid,
  Platform,
  SafeAreaView
} from 'react-native';
import { CustomHeader, Icon, Loader, Text } from '../../../components';
import { DIMENS } from '../../../constants';
import Colors from '../../../utils/Colors';
import { API_URL } from '../../../utils/Config';

const MyAddresses=({navigation})=>{
    const [addresses,setAddresses]=useState([])
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        getAddresses()
        navigation.addListener('focus', async () => {
            getAddresses()
        })
        
        return ()=>setAddresses([])
     
    },[])
    const getAddresses=async()=>{
        await AsyncStorage.getItem('user')
        .then(txt => JSON.parse(txt))
        .then(async response => {
            setLoading(true)
          await  fetch(
                API_URL + 'Address',
                {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    Authorization:
                      'Basic ' + encode(response.email + ':' + response.password),
                  },
                  //Request Type
                },
                
              )
                .then(response => response.json())
        
                .then(responseJson => {
                    setLoading(false)
                  if (responseJson.statusCode === 0) {
                      setAddresses(responseJson.data)
    
                   
        
                  //Success
                }
                else{
                    alert('Something went wrong')
                }
            })
        
                .catch(error => {
                    alert('Something went wrong')
                  //Error
        
                  console.error(error);
                });
    

        })

       

    }
    return(
        <SafeAreaView style={{flex: 1}}>
        <CustomHeader customStyles={styles.svgCurve} />
        <View style={{flexDirection: 'row', alignItems: 'center',width:'100%',padding:4}}>
              <Icon
                name="arrowleft"
                color={Colors.colors.white}
                size={30}
                type="antdesign"
                style={{padding:4}}
                onPress={() => navigation.goBack()}
              />
  
              <Text type="heading" style={styles.text}>
                My Addresses
              </Text>
            </View>
            <Loader loading={loading}/> 
           
       
  
        <View style={styles.main}>
       
          <View style={styles.passwordContainer}>
            <FlatList
              data={addresses}
              contentContainerStyle={{marginTop:4,paddingBottom:42}}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item,index)=>index.toString()}
              renderItem={(({item})=>{
                  return(
                      <View style={styles.listItem}>
                          <Text type='subheading' style={{color:Colors.colors.primary,paddingTop:4,paddingBottom:4}}>{item.addressLine1 +'  ' +  item.addressLine2} </Text>
                         
                          <Text type='caption' style={{paddingTop:2,paddingBottom:2}}> {item.city}</Text>
                          <Text type='caption' style={{paddingTop:2,paddingBottom:2}}>{item.pincode}</Text>
                          <Text type='caption' style={{paddingTop:2,paddingBottom:2}}>{item.mobile}</Text>
                          <Text type='caption' style={{paddingTop:2,paddingBottom:2}}>{item.Country.countryName}</Text>
                          <Text type='caption' style={{paddingTop:2,paddingBottom:2}}>{item.States.stateName}</Text>
                          <View style={{flexDirection:'row',alignItems:'flex-end',alignSelf:'flex-end'}}>
                              <TouchableOpacity onPress={()=>navigation.navigate('UpdateAddress',{id:item.id})} style={{padding:8}}>
                              <Icon name={'edit'} size={20} color={Colors.colors.primary}/>
                              </TouchableOpacity>
                              {/*
                               <TouchableOpacity style={{padding:6}}>
                              <Icon name={'delete'} size={20} color={Colors.colors.primary}/>
                              </TouchableOpacity>

                               */}
                             

                          </View>

                          </View>
                  )
              })}
            />
            </View>
            </View>
            </SafeAreaView>
    )
}
export default MyAddresses
const styles = StyleSheet.create({
    main: {
      flex: 1,
      paddingBottom:40
  
      //  backgroundColor:Colors.colors.white,
    },
    passwordContainer: {
      backgroundColor: Colors.colors.white,
      padding: 16,
      marginBottom: 24,
      height: DIMENS.common.WINDOW_HEIGHT,
      paddingTop:8,
      paddingBottom:30
     
    },
    text: {
      paddingVertical: 10,
      paddingBottom: 12,
      marginLeft: 16,
      color:Colors.colors.white,
      textAlign:'center',
      alignSelf:'center',
      width:'80%'
    },
    svgCurve: {
        position: 'absolute',
        width: DIMENS.common.WINDOW_WIDTH,
      },
      listItem:{
          width:'100%',
          padding:16,
          backgroundColor:Colors.colors.gray100,
          borderRadius:15,
          marginBottom:12

      }
})