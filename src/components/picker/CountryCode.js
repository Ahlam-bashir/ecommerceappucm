import React from 'react'
import {View,Modal,StyleSheet,FlatList,TouchableOpacity} from 'react-native'


import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import Colors from '../../utils/Colors';
import Text from '../Text/text';
import { InputText } from '..';
const CountryCodeModal = (props) =>{
    console.log(props.onClose)
   
     return(
        <Modal visible={props.visible}
         animationType={'fade'}
         transparent={true}>
            <View style={styles.mainContainer}>
            <View style={styles.pickerContainer}>
            <View style={styles.header}>   
            <TouchableOpacity style={{padding:10}} onPress={props.onClose}>
            <Icon  name='clear' size={20} color={Colors.colors.gray500}        />
            </TouchableOpacity>            
            </View>
           
           
            <FlatList
               contentContainerStyle={{alignItems:'center',top:3}}
               
               data={props.item}
               keyExtractor={(id,index)=>index.toString()}
               renderItem={(itemData)=>{
                  
                   
                return(
                    <TouchableOpacity onPress={()=>props.onSelect(itemData.item)}>                       
                    <View style={{alignItems:'center',borderWidth:0,width:40,height:20,justifyContent:'center',margin:10}}>
                    <Text>{itemData.item.phonecode}</Text>
                    </View>
                    </TouchableOpacity>       
                )
               }}
             />   
        </View>
        </View>
        </Modal>
     )
    



}
export default CountryCodeModal;
const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.colors.transparent,
        marginLeft: 10,
        marginRight: 10,

    },
    pickerContainer:{
        width:'60%',
        height:300,
        backgroundColor: Colors.colors.gray100,
        paddingLeft: 10,
       // borderTopLeftRadius: 30,
       // borderTopRightRadius: 30,
        paddingTop:16
        },
    header:{
        width:'100%',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:6,
        alignSelf:'center'
             //   backgroundColor:colors.colors.primary
    }

})
