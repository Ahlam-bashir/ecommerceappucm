import React from 'react'
import { FlatList ,StyleSheet} from 'react-native';
import { Modal } from 'react-native';
import {View} from 'react-native'
import Colors from '../../utils/Colors';
import Text from '../Text/text';
import Currency from '../../constants/data/currency.json'
import { TouchableOpacity } from 'react-native';
import Icon from '../Icon/Icon';
import { useState } from 'react';
import StringsOfLanguages from '../../constants/StringOfLanguages';

const FilterList =(props)=>{
    const [index,setIndex]=useState()
    const data=[
        {
            id:0,
            language:'Ascending Price',
            isChecked:false,
            shortForm:"ASC"
            
        },
        {
            id:1,
            language:'Descending Price',
            isChecked:false,
            shortForm:"DESC"
            
        },
        {
            id:2,
            language:'Ascending Name',
            isChecked:false,
            shortForm:"ASCP"
           
        },
        {
            id:3,
            language:'Descending Name',
            isChecked:false,
            shortForm:"DESCP"
           
        },

    ]
   const filter = (Key) => {
       props.onSelect(Key)
      
        }
    return(
        <Modal
          visible={props.visible}
          animationType='fade'
          transparent={true}
        >
         <View style={styles.mainContainer}>  
             <View style={styles.pickerContainer}>
             <View style={{alignItems:'center',flexDirection:'row',width:'100%'}}>
                 <Text type='subheading' style={{width:'85%',textAlign:'center'}}>Order Items By </Text>
                 <TouchableOpacity style={{alignItems:'center',justifyContent:'center',alignSelf:'flex-end'}} onPress={props.onClose}>
                 <Icon name='clear' size={20} color={Colors.colors.black} />
                 </TouchableOpacity>              
             </View>
                 <FlatList
                    data={data}
                    contentContainerStyle={{top:12}}
                    keyExtractor={(id,index)=>index.toString()}
                    renderItem={({item})=>{  
                    return(
                        <TouchableOpacity 
                       
                        onPress={()=>{setIndex(item.id)
                        filter(item.shortForm)

                        }}
                       >
                        <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:10}}>
                        <Text type='caption'>{item.language}</Text>
                        <Icon
                                  type="font-awesome"
                                  name={
                                     (index==item.id)? 'circle' : 'circle-thin'
                                  }
                                  size={15}
                                  color={Colors.colors.primary}
                                />
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
export default FilterList;
const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
        backgroundColor:Colors.colors.transparent,
        
       

    },
    pickerContainer:{
        width:'100%',
        height:250,
        backgroundColor: Colors.colors.gray100,
        paddingLeft: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop:16
        },
})

    