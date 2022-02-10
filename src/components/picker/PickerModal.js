import React from 'react'
import {View,Modal,StyleSheet,FlatList,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native'


import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import Colors from '../../utils/Colors';
import Text from '../Text/text';
import { InputText } from '..';
const PickerModal = (props) =>{
    console.log(props.onClose)
   
     return(
        <Modal visible={props.visible}
         animationType={'fade'}
         transparent={true}>
          
            <View style={styles.mainContainer}>
            <KeyboardAvoidingView
           behavior={Platform.OS === "ios" ? "padding" : null}
           keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
          
          >
            <View style={styles.pickerContainer}>
            <View style={styles.header}>   
            <View style={{width:60,height:2,backgroundColor:Colors.colors.gray500,left:120}}/>
            <TouchableOpacity style={{padding:10}} onPress={props.onClose}>
            <Icon  name='clear' size={20} color={Colors.colors.gray500}        />
            </TouchableOpacity>            
            </View>
             
            <View style={{width:'90%',height:40,borderRadius:10,backgroundColor:Colors.colors.gray100,alignSelf:'center',padding:2}}>
                <InputText
                placeholder={'Search'}
                onChangeText={text =>props.Search(text)}
                placeholderTextColor={Colors.colors.gray500}
                containerStyle={{height:40,padding:6,borderRadius:8}}
                underlineColorAndroid={Colors.colors.transparent}
                inputStyle={{color:Colors.colors.black,padding:8}}
                  
                />
            </View>
          
            <FlatList
               contentContainerStyle={{alignItems:'center',top:6}}
               numColumns={2}
               data={props.item}
               keyExtractor={(id,index)=>index.toString()}
               renderItem={(itemData)=>{
                   
                return(
                    <TouchableOpacity onPress={()=>props.onSelect(itemData.item)}>                       
                    <View style={{alignItems:'center',borderWidth:1,width:120,height:40,justifyContent:'center',margin:10}}>
                    <Text>{itemData.item.countryName || itemData.item.stateName}</Text>
                    </View>
                    </TouchableOpacity>       
                )
               }}
             /> 
             
     
        </View>
       
      </KeyboardAvoidingView>
        </View>
       
        
        </Modal>
     )
    



}
export default PickerModal;
const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
       // alignItems:'center',
        justifyContent:'flex-end',
        backgroundColor:Colors.colors.transparent,
        marginLeft: 10,
        marginRight: 10,

    },
    pickerContainer:{
        width:'100%',
        height:500,
        backgroundColor: Colors.colors.gray100,
        paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop:16
        },
    header:{
        width:'100%',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:24,
        alignSelf:'center'
             //   backgroundColor:colors.colors.primary
    }

})
