import React from 'react';
import { ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native';
import { View ,StyleSheet} from 'react-native';
import { CustomHeader,Text ,Icon} from '../../components';
import { DIMENS } from '../../constants';
import Colors from '../../utils/Colors';

const GuaranteePolicy=({navigation})=> {
    return (
        <SafeAreaView  style={styles.main}>
             <CustomHeader customStyles={styles.customHeader}/>
       <View style={styles.main}>
          
           <View style={styles.header}>
           <Icon name='arrowleft' color={Colors.colors.white} size={30} type='antdesign'  onPress={()=>navigation.goBack()}/>
               
               <Text type='subheading' style={styles.text}>Guarantee Policy</Text>
               
           </View>
           <ScrollView style={{flex:1}}>
           <View style={styles.container}>
               <Text type='heading' style={styles.headerText}>Return and Refund Policy</Text>
               <Text style={styles.bodyText}>We are very happy to see you being our customer and would like to thank you for shopping at our website.
                   If you are not completely satisfied with your purchase, we are here to help.
                </Text>
                <Text type='heading' style={styles.headerText}>Returns</Text>
                <Text style={styles.bodyText}>You have 7 calendar days to return an item from the date you received it. The item must be unused and in the same condition that you received it in order for it to be eligible for a return. The item must be in its original packaging. You also need to have the valid receipt or proof of purchase.
                </Text>
                <Text type='heading' style={styles.headerText}>Cancellation</Text>
                <Text style={styles.bodyText}>Once the order has been placed from us, you can cancel it anytime till it's not shipped. If the item is shipped, you can’t cancel the item, you will have to return it back once delivered to you.</Text>
                <Text type='heading' style={styles.headerText}>Refunds</Text>
                <Text style={styles.bodyText}>Once we receive your item, it will be inspected and we will notify you that we have received your returned item. We will notify you on the status of your refund immediately after the inspection. Once your return is approved, we will initiate a refund to your debit/credit card (or the original method of payment). You will receive the full credit within a certain amount of days, depending on your bank, card policies and payment method.</Text>
                <Text type='heading' style={styles.headerText}>Shipping</Text>
                <Text style={styles.bodyText}>You will be responsible for paying for your own shipping costs for returning your item(s). The shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</Text>
               
                
               
                
              
            

           </View>
           </ScrollView>
       </View>
       </SafeAreaView>
    );
}

export default GuaranteePolicy;
const styles=StyleSheet.create({
    main:{
        
        flex:1,
       // bottom:8
        

      
    },
    customHeader:{
        position:'absolute',
        width:DIMENS.common.WINDOW_WIDTH
    },
    header:{
      
        alignItems:'center',
        flexDirection:'row',
        
       
        padding:8
       
        


    },
    text:{
        color:Colors.colors.white,
        
         width:DIMENS.common.WINDOW_WIDTH*8/10,
        textAlign:'center'
    },
    container:{
        padding:20,
        paddingTop:10,
        backgroundColor:Colors.colors.white,
       // height:DIMENS.common.WINDOW_HEIGHT,
        paddingBottom:30



    },
    headerText:{
        color:Colors.colors.primary,
       marginBottom:14,
       top:10
    },
    bodyText:{
       textAlignVertical:'center'
    }
})