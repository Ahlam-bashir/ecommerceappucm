import React from 'react'
import { FlatList ,StyleSheet,KeyboardAvoidingView} from 'react-native';
import { Modal } from 'react-native';
import {View} from 'react-native'
import Colors from '../../utils/Colors';
import Text from '../Text/text';
import Currency from '../../constants/data/currency.json'
import { TouchableOpacity } from 'react-native';
import Icon from '../Icon/Icon';
import { Platform } from 'react-native';

const CurrenyList =(props)=>{

    return(
        
        <Modal
          visible={props.visible}
          animationType='fade'
          transparent={true}
        >
                 
         <View style={styles.mainContainer}>  
             <View style={styles.pickerContainer}>
             <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',paddingRight:10}}>
                 <Text type='subheading'>Select Currency </Text>
                 <TouchableOpacity style={{padding:10,width:40,height:40,borderRadius:40/2,backgroundColor:Colors.colors.gray200,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'}} onPress={props.onClose}>
                 <Icon name='clear' size={20} color={Colors.colors.gray500} />
                 </TouchableOpacity>              
             </View>
                 <FlatList
                    data={props.item}
                    keyExtractor={(id,index)=>index.toString()}
                    renderItem={({item})=>{  
                    return(
                        <TouchableOpacity onPress={()=>props.onSelect(item)}>
                        <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',minHeight:18,padding:10}}>
                        <Text type='caption'>{item.code}</Text>
                        <Text type='caption'>{item.symbol_native}</Text>
                        </View>
                        </TouchableOpacity>
                        )
                    }}
                 />
        </View>
        </View>   
        <View>
        </View>
       
        </Modal>
    )

}
export default CurrenyList;
const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
        backgroundColor:Colors.colors.transparent,
       

    },
    pickerContainer:{
        width:'100%',
        height:400,
        backgroundColor: Colors.colors.gray100,
        paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop:16
        },
})

    