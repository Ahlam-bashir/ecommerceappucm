import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';
import {decode} from 'html-entities';
import {element} from 'prop-types';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {FlatList} from 'react-native';
import {View, StyleSheet, Image, ScrollView,TouchableOpacity} from 'react-native';
import {CustomHeader, Icon, Loader, Text} from '../../components';
import CancelOrderModal from '../../components/picker/CancelOrderModal';
import ReturnOrderModal from '../../components/picker/RetrunOrderModal';
import {DIMENS} from '../../constants';
import {Conversion} from '../../utils';
import Colors from '../../utils/Colors';
import {API_URL} from '../../utils/Config';
import VerticalStepIndicator from './Components/VerticalStepIndicator';

const OrderDetails = ({navigation, route}) => {
  const id = route.params.id;
  var obj = {
    active:"Placed",
    cancelled:1,
    returned:2,
    refund:3,
    underProcess:4,
    refundInitiated:5,
    refundCompleted:6,
    returnInitiated:7,
    returnCompleted:8,
    shipped:9,
    delivered:"Delivered",
    completed:11,
    returnCancelled:12,
    refundCancelled:13
 }
  console.log(id);
  const [orders, setorders] = useState([]);
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState(1);
  const [symbol, setSymbol] = useState(decode('&#X0024;'));
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderVisible,setOrderVisible]=useState(false)
  const [orderId,setOrderId]=useState('')
  const [productId,setProductId]=useState('')
  const [returnVisible,setReturnVisible]=useState(false)
  const [returnDate,setReturnDate]=useState('')
  const today=new Date().toISOString().slice(0, 10)

  useEffect(async () => {
    await AsyncStorage.getItem('currency')
      .then(txt => JSON.parse(txt))
      .then(json => {
        if (json !== null) {
          setPrice(json.conversion_rate.toFixed(2));
          console.log(json);
          setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
       
         // setSymbol('&#X' + json.target_data.display_symbol + ';');
        }
      });

    orderDetails();
  }, [orderVisible,returnVisible]);

  const orderDetails = async () => {
    setLoading(true);
    await AsyncStorage.getItem('user')
      .then(txt => JSON.parse(txt))
      .then(response => {
        if (response != null) {
          fetch(API_URL + '/MyOrders?orderId=' + id, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },
          })
            .then(response => response.json())
            .then(responseJson => {
              setLoading(false);
              //setOrders(responseJson)
              setorders(responseJson.data.order);
              setItems(responseJson.data.allItems);
              setTracking(responseJson.data.tracking);
              //Showing response message coming from server
             

              //setorders(responseJson.data)
              // setLoading(false)
            })
            .catch(error => {
              setLoading(false);
              //display error message
            });
          //cartDetails()

          //cartDetails()
        }
      });
  };
  const openCancelModel=(orderId,productId)=>{
    setOrderId(orderId)
    setProductId(productId)


    setOrderVisible(true)

  }
  const openReturnModel=(orderId,productId)=>{
    setOrderId(orderId)
    setProductId(productId)
    setReturnVisible(true)

  }
  
  const renderItem=({item})=>{
    let convertPrice = item.OrderItems.Products.price * price;
    return (
      <TouchableOpacity   onPress={() =>
        navigation.navigate('productDetails', {
          id: item.OrderItems.Products.id,
        })
      }>
      <View
        style={{
          width: 180,
          borderRadius: 6,
          backgroundColor: Colors.colors.white,
          margin: 4,
          padding: 8,
        }}>
        <Image
          style={{height: 200, width: 160, borderRadius: 16}}
          resizeMode="contain"
          source={{uri: item.mainImage}}
        />
        <View style={{padding: 4}}>
          <Text type="caption">
            {item.OrderItems.Products.name}
          </Text>
          <Text type="caption">
            Price: {decode(symbol) + Math.round(convertPrice, 2)}
          </Text>
          <Text type="caption">
            Quantity: {item.OrderItems.quantity}
          </Text>
        </View>
        {item.OrderItems.Orders.isPaid==true && item.OrderItems.Orders.status==obj.active?
         <TouchableOpacity 
         onPress={()=>openCancelModel(item.OrderItems.orderId,item.OrderItems.id)} 
         style={styles.checkoutContainer}>
                 <Text type="subheading" style={{color: Colors.colors.error}}>
                   {'Cancel'}
                 </Text>
               </TouchableOpacity> :
               item.OrderItems.Orders.isPaid==true && item.OrderItems.Orders.status==obj.delivered
                        && returnDate<=today
               ?
                <TouchableOpacity 
                onPress={()=>openReturnModel(item.OrderItems.orderId,item.OrderItems.id)} 
                style={styles.checkoutContainer}>
                        <Text type="subheading" style={{color: Colors.colors.error}}>
                          {'Return'}
                        </Text>
                      </TouchableOpacity>:null

        }
       
      </View>
      
      </TouchableOpacity>
    );
 
  }
  

  return (
    <SafeAreaView style={{flex:1}}>
       <CustomHeader customStyles={styles.svgCurve} />
       <CancelOrderModal
        visible={orderVisible}
        close={()=>setOrderVisible(!orderVisible)}
        orderId={orderId}
        itemId={productId}
        
       
       />
        <ReturnOrderModal
        visible={returnVisible}
        close={()=>setReturnVisible(!returnVisible)}
        orderId={orderId}
        itemId={productId}
        
       
       />
       <View style={styles.header}>
            <Icon
              name="arrowleft"
              color={Colors.colors.white}
              size={25}
              type="antdesign"
              onPress={() => navigation.goBack()}
            />
            <Text
              type="heading"
              style={{
                fontSize: 24,
                color: Colors.colors.white,
                width: '90%',
                textAlign: 'center',
              }}>
              Orders Details
            </Text>
          </View>

      <ScrollView>
     
        <View style={styles.main}>
          
          <Loader loading={loading} />
         
          <View style={{marginTop: 6}}>
            <FlatList
              horizontal={true}
              data={items}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(id, index) => index.toString()}
              renderItem={renderItem}
            />
          </View>
          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              //height: (DIMENS.common.WINDOW_HEIGHT * 1) / 2,
              backgroundColor: Colors.colors.white,
              padding: 8,
              borderRadius:6
            }}>
            <View style={styles.details}>
              <Text type="caption">Order No:</Text>
              <Text type="caption">{orders.id}</Text>
            </View>
            <View style={styles.details}>
              <Text type="caption">shippingCharges:</Text>
              <Text type="caption">
                {decode(symbol) + Math.round(orders.shippingCharges * price, 2)}
              </Text>
            </View>
            <View style={styles.details}>
              <Text type="caption">estimated taxes:</Text>
              <Text type="caption">
                {decode(symbol) + Math.round(orders.vat * price, 2)}
              </Text>
            </View>
            <View style={styles.details}>
              <Text type="caption">Sub-Total</Text>
              <Text type="caption">
                {decode(symbol) + Math.round(orders.total * price, 2)}
              </Text>
            </View>
            <View style={styles.details}>
              <Text type="caption">GrandTotal</Text>
              <Text type="caption">
                {decode(symbol)}
                {Math.round(
                  (orders.total + orders.vat + orders.shippingCharges) * price,
                  2,
                )}
              </Text>
            </View>
            {tracking.map(item=>{
              if(item.status=='Delivered'){
                let date=new Date(item.dated)
               
                setReturnDate(date.setDate(date.getDate() + 7))


                   
              }
            })}
            
            <VerticalStepIndicator 
            data={tracking}
            />
          </View>
         
        </View>
      </ScrollView>
      {orders.isPaid && orders.status==obj.active?
       <TouchableOpacity 
       onPress={()=>openCancelModel(orders.id,'')} 
       style={{...styles.checkoutContainer,alignItems:'center',backgroundColor:Colors.colors.primary,alignSelf:'center',width:'90%'}}>
               <Text type="subheading" style={{color: Colors.colors.white}}>
                 {'Cancel'}
               </Text>
             </TouchableOpacity>:orders.isPaid && orders.status==obj.delivered && returnDate<=today?<TouchableOpacity 
       onPress={()=>openReturnModel(orders.id,'')} 
       style={{...styles.checkoutContainer,alignItems:'center',backgroundColor:Colors.colors.primary,alignSelf:'center',width:'90%'}}>
               <Text type="subheading" style={{color: Colors.colors.white}}>
                 {'Return'}
               </Text>
             </TouchableOpacity>:null}
     
    </SafeAreaView>
  );
};
export default OrderDetails;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.colors.transparent,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    padding:8
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  details: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    flexDirection: 'row',
    width: '100%',
  },
  checkoutContainer: {
    bottom: 6,
   
    width: '80%',
    height: 40,
    borderRadius: 12,
    //alignSelf: 'center',
    padding: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
