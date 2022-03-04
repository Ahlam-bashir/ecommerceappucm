import {useStripe} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
  Modal
} from 'react-native';
import {CustomHeader, Icon, Loader, Text,  Alert as CustomAlert } from '../../components';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';
import {API_URL, BASE_URL} from '../../utils/Config';
import OrderSteps from './Components/OrderSteps';
import {encode} from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from 'react-native';
import {decode} from 'html-entities';
import {Conversion} from '../../utils';
import axios from 'axios';
import { Platform } from 'react-native';
import StringsOfLanguages from '../../constants/StringOfLanguages';
import WebView from 'react-native-webview';
import { ActivityIndicator } from 'react-native';
import { RNToasty } from 'react-native-toasty';

const PaymentScreen = ({navigation}) => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [disable, setDisable] = useState(false);
  const [Index, setIndex] = useState(1);
  const [index2, setIndex2] = useState(0);
  const [fromState, setfromState] = useState(0);
  const [toState, setToState] = useState(0);
  const [dummyArray, setDummyArray] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [address, setaddresses] = useState([]);
  const [clientsecret, setclientSecret] = useState(null);
  const [ids, setIds] = useState([]);
  const [payment, setPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [payNow,setpayNow]=useState(true)
  const [user, setUser] = useState(null);
  const [addressId, setaddressId] = useState('');
  const [userCarts, setUserCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState([]);
  const [deliveryRate, setDeliveryRate] = useState(0);
  const [totalDelivery, setTotalDelivery] = useState(0);
  const [price, setPrice] = useState(1);
  const [symbol, setSymbol] = useState(decode('&#X0024;'));
  const [code, setCode] = useState('USD');
  const [paymentid, setPaymentId] = useState('');
  const [visible, setVisible] = useState(true);
  const [itemIds, setItemIds] = useState([]);
  const [price2, setPrice2] = useState(0);
  const [standard, setStandart] = useState(0);
  const [flag, setFlag] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [animation, setAnimation] = useState('');
  const [title, setTitle] = useState('');
  const [btntext1, setbtntext1] = useState('');
  const [btntext2, setbtntext2] = useState('');
  const [paypal,setPaypal]=useState(false)
  const [payModal,setPayModal]=useState(false)
  const [paypalcre,setpaypalval]=useState({
        accessToken: null,
        approvalUrl: null,
        paymentId: null

  })
  let del_charges = 0;
  let sum = 0;
  let totalWeight = 0;
  let total = 0;
  let grandTotal = 0;
  let _toState = 0;
  let payTotal=0
  let payPalGrandTotal=0

  useEffect(() => {
    // initializePaymentSheet();
    fetchPaymentSheetParams();
    //addOrder()
  }, [orderId]);

  useEffect(async () => {
    getAddresses()
    navigation.addListener('focus', async () => {
      getAddresses()
  })
  
  return ()=>setAddresses([])


  
  }, []);
  const getAddresses=async()=>{
    await AsyncStorage.getItem('user')
    .then(value => JSON.parse(value))
    .then(response => {
      if (response !== null) {
        setUser(response);
       
        fetch(API_URL + 'ConfirmOrder?addressId=' + addressId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization:
              'Basic ' + encode(response.email + ':' + response.password),
          },

          //Request Type
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.statusCode === 200) {
              setaddresses(responseJson.data.userAddresses);
              setDummyArray(responseJson.data.userCarts);

              //  setUserCarts(responseJson.data.userCarts)
              setDisable(true);
            }
            //Success
          })

          .catch(error => {
            //Error

            console.error(error);
          });
      }
    });
  }
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => setUser(response));
    AsyncStorage.getItem('currency')
      .then(value => JSON.parse(value))
      .then(json => {
        if (json !== null) {
          setPrice(json.conversion_rate);
          console.log(json);
          setCode(json.target_code);
          setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
       
         // setSymbol('&#X' + json.target_data.display_symbol + ';');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log('del' + del_charges + 'uddd' + addressId);

    addOrder(del_charges, addressId);
  }, [disable, addressId]);

  useEffect(() => {
    if (clientsecret) {
      initializePaymentSheet();
    }
  }, [clientsecret]);
useEffect(async()=>{
  let currency = '100'
        currency.replace(" USD", "")
        if(payTotal==0 || del_charges==0 || tax==0){
          return
        }
        const tax=Math.round(payTotal*0.05,2)
           payPalGrandTotal =   payTotal+del_charges+tax
        const dataDetail = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "total": payPalGrandTotal,
                    "currency": "USD",
                    "details": {
                        "subtotal": payPalGrandTotal,
                        "tax": '0',
                        "shipping": "0",
                        "handling_fee": "0",
                        "shipping_discount": "0",
                        "insurance": "0"
                    }
                }

            }],
            "redirect_urls": {
                "return_url": "https://example.com",
                "cancel_url": "https://example.com"
            }
        }
        const formData = new URLSearchParams();
        formData.append('grant_type','client_credentials')
        await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic QVE1WHBzX1hIb2lJdi02Mi05V19UOGk1NkJRQVFFUjd5S1h5LU8zZ01FT2J5bTl5LVFIOG1acnpKQmgtZFF1MnNiNXUzeG53OURVc3JjX3o6RU1nQVJMWGpGRFZkVGhzaXlHVVFUMlV5N1hZV3h6UTZEN2lWdG83Mjc5MkR1TlVTWXU1RnFPTE41cFlNYVNidGhtcU9yYzFQWC1xRkluYXU='
       },
          body: formData.toString()
        })
          .then(response =>response.json())
          .then(responseJson => {
            // console.log(responseJson.access_token)
           

             setpaypalval(prev=>({
               accessToken:responseJson.access_token
             }))
             fetch('https://api.sandbox.paypal.com/v1/payments/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${responseJson.access_token}`
       },
          body: JSON.stringify(dataDetail),
        })
          .then(response =>response.json())
          .then(responseJson => {
             console.log(responseJson)
             const { id, links } = responseJson
             const approvalUrl = links.find(data => data.rel == "approval_url")

             setpaypalval(prev=>({
              paymentId: id,
              approvalUrl: approvalUrl.href
             }))
            //Showing response message coming from server
            //console.log(responseJson);
          })
          .catch(error => {
            //display error message
  
            console.warn(error);
          });
  
            //Showing response message coming from server
            //console.log(responseJson);
          }).catch(error => {
            //display error message
  
            console.warn(error);
          });
  
        
   
     
           
       
           
         
             


              

},[paypal])
  const fetchPaymentSheetParams = async () => {
    console.log('patment shet');
    setLoading(true);

    console.log(grandTotal+ 'fetchpraams' +total + sum + orderId) ;
    if (orderId === null || total == 0 || sum == 0) {
     
      setLoading(false);
      return;
    }
    if (user !== null) {
      let Total = Math.round(total + grandTotal + sum, 2);
      let extension=code=="INR"?"IN":""
      console.log(code    +  extension);
      await fetch(API_URL + 'Pay', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Basic ' + encode(user.email + ':' + user.password),
        },
        body: JSON.stringify({
          orderId: orderId,
          coupon: '',
          amount: Total,
          currency: code.toString(),
          isBuyNow: false,
          StripeLink:extension
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('sec' + responseJson);
          setLoading(false);

          setclientSecret(responseJson.client_secret);
          setPaymentId(responseJson.id);

          //Showing response message coming from server
          //console.log(responseJson);
        })
        .catch(error => {
          //display error message

          console.warn(error);
        });
    }
  };
  const initializePaymentSheet = async () => {
    if (!clientsecret) {
      return;
    }

    const {error} = await initPaymentSheet({
      paymentIntentClientSecret: clientsecret,
    });
    console.log('sucess');
    if (!error) {
      //setLoading(true);
      console.log(error);
    }
  };

  const openPaymentSheet = async () => {
    console.log(clientsecret+'clientsecret');

    if (!clientsecret) {
      alert('select your delivery method and address');
      return;
    }
    if (!visible) {
      alert('select payment method');
      return;
    }
    if(!payNow){
      alert('Please accept terms and conditions');
      return
    }
    const {error} = await presentPaymentSheet({clientsecret});

    if (error) {
      
      console.log(error.localizedMessage+"error")
     // Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      //removeCart()
      PlaceOrder();
      // Alert.alert('Success', 'processg...');
    }
  };
  const isChecked = itemId => {
    const isThere = ids.includes(itemId);
    return isThere;
  };

  const onClickAddress = id => {
    const newIds = [...ids, id];
    if (isChecked(id)) {
      setIds(newIds.filter(id => id !== id));
    } else {
      setIds(newIds);
      console.log('idi' + id);
      setaddressId(id);
      addOrder(id);
      console.log('else blockkkk');
      setDisable(false);
    }
  };
  const PlaceOrder = async () => {
    if (orderId == null && paymentid == '') {
      return;
    }
    if (user !== null) {
      setLoading(true);
      await fetch(API_URL + 'PlaceOrder', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Basic ' + encode(user.email + ':' + user.password),
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentId: paymentid,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          setLoading(false);
          console.log(responseJson + '  ' + '  Plce Ordre');
          if (responseJson.statusCode === 200) {
            if(Platform.OS=='ios'){
              setAlertVisible(true);
              setTitle(
               
                responseJson.message,
              );
              setAnimation(
                require('../../assets/images/animations/84125-payment-successfully-in-green-colore.json'),
              );
              setbtntext1('Go to Orders');
              setbtntext2('Ok');
           
            }else{
                Alert.alert(
              //title
              'Success',
              //body
              responseJson.message,
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
                {
                  text: 'Go to Orders',
                  onPress: () => navigation.replace('OrdersScreen'),
                  style: 'cancel',
                },
              ],
              {cancelable: false},
              //clicking out side of alert will not cancel
            );
            }

           
          }
          //Showing response message coming from server
          //console.log(responseJson);
        })
        .catch(error => {
          setLoading(false);
          //display error message
          console.warn(error);
        });
    }
  };
  const removeCart = async () => {
    if (user !== null) {
      await fetch(API_URL + 'MyCart/?delete=all', {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Basic ' + encode(user.email + ':' + user.password),
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.statusCode === 200) {
            alert(responseJson.message);
          }
          //Showing response message coming from server
          //console.log(responseJson);
        })
        .catch(error => {
          //display error message
          console.warn(error);
        });
    }
  };
  const getDeliveryCharges = async (id, toStateId, itemId) => {
    let sum2 = 0;
    for (element of userCarts) {
      let weight = element.Products.weight * element.quantity;
      let fromStateId = element.Products.fromStateId;
      await fetch(
        API_URL +
          'DeliveryCharges?weight=' +
          weight +
          '&fromStateId=' +
          fromStateId +
          '&toStateId=' +
          toStateId +
          '&deliveryId=' +
          id,
      )
        .then(response => response.json())
        .then(async responseJson => {
          console.log(responseJson);
          sum2 += await responseJson.data;
        })
        .catch(error => {
          console.log(error);
        });
      totalWeight += weight;
    }

    if (sum2 !== 0) {
      setDeliveryRate(sum2 * price);
      sum = sum2;
      await addOrder(sum2, itemId);
    }
    console.log('Delivery charges ' + sum2);
  };

  const addOrder = async (sum2, address) => {
    console.log(sum2 + 'delivery charges');
    if (user !== null) {
      if (address !== 0 && sum2 !== 0) {
        setLoading(true);
        await fetch(API_URL + 'AddOrder', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Basic ' + encode(user.email + ':' + user.password),
          },
          body: JSON.stringify({
            address: address,
            couponCode: '', //optional
            deliveryCharges: sum2,
            paymentMethod: 'stripe',
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log(responseJson +'order');
            setLoading(false);
            if (responseJson.statusCode === 200) {
              setOrderId(responseJson.data.id);
            }
            //Showing response message coming from server
            //console.log(responseJson);
          })
          .catch(error => {
            //display error message
            console.warn(error);
          });
      }
    }
  };

  async function update_delivery_charges(items, dtype) {
    setLoading(true);
    await fetch(API_URL + 'ConfirmOrder?addressId=', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Basic ' + encode(user.email + ':' + user.password),
      },
      body: JSON.stringify({
        itemIds: items,
        deliveryTypeId: dtype,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        setLoading(false);

        //Showing response message coming from server
        //console.log(responseJson);
      })
      .catch(error => {
        //display error message
        console.warn(error);
      });
  }
  const changeAddress = async addressId => {
    await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(async response => {
        if (response !== null) {
          setUser(response);
          await fetch(API_URL + 'ConfirmOrder?addressId=' + addressId, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },

            //Request Type
          })
            .then(response => response.json())
            .then(async responseJson => {
              if (responseJson.statusCode === 200) {
                setaddresses(responseJson.data.userAddresses);
                setDummyArray(responseJson.data.userCarts);
                setaddressId(addressId);
                // setDisable(false)

                // await addOrder(del_charges,addressId)
                //  setUserCarts(responseJson.data.userCarts)
              }
              //Success
            })

            .catch(error => {
              //Error

              console.error(error);
            });
        }
      });
  };
 const  _onNavigationStateChange = (webViewState) => {

    if (webViewState.url.includes('https://example.com/')) {

        setpaypalval(prev=>({
          approvalUrl:null
        }))
        setPaypal(false)
        setPayModal(false)
        setVisible(true)
        const newUrl=webViewState.url.split('&')
        const payment_Id=newUrl[0].split('=')
          console.log(payment_Id[1]) 
        const PaymentId=payment_Id[1]
        const PayerId=newUrl[2]
        console.log(PayerId)
       

       // const { PayerID, paymentId } = webViewState.url

        axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${PaymentId}/execute`, { payer_id: PayerId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${paypalcre.accessToken}`
                }
            }
        )
            .then(response => {
                console.log(response)

            }).catch(err => {
                console.log({ ...err })
            })

    }
}
  return (
    <SafeAreaView style={{flex:1}}>
       <CustomHeader customStyles={styles.svgCurve} />
       <CustomAlert
        visible={alertVisible}
        close={() => setAlertVisible(false)}
        title={title}
        animation={animation}
        button1={btntext1}
        button2={btntext2}
        uri={animation}
        btn1Click={() => navigation.replace('OrdersScreen')}
        btn2Click={() => navigation.navigate('Home')}
      />
       <Modal
      visible={payModal}
      
      >
      <View style={{ flex: 1 }}>
                  {
                     paypalcre.approvalUrl ? <WebView
                          style={{ height: 400, width: 300 }}
                          source={{ uri: paypalcre.approvalUrl }}
                          onNavigationStateChange={_onNavigationStateChange}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          startInLoadingState={false}
                          style={{ marginTop: 20 }}
                      /> : <ActivityIndicator />
                  }
              </View>
              </Modal>

      
        <View style={styles.main}>
          <Loader loading={loading} />
         
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
                color: Colors.colors.white,
                width: '80%',
                textAlign: 'center',
              }}>
              Checkout
            </Text>
          </View>
          <ScrollView 
          showsVerticalScrollIndicator={false}
          style={{flex: 0,marginTop:36}}>

          <View
            style={{
              ...styles.header,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 25,
            }}>
            <Text type="heading" style={{color: Colors.colors.black}}>
              Deliver To
            </Text>
           
             <TouchableOpacity
            onPress={() => navigation.navigate('MyAddresses')}>
             <Text
               type="caption"
               style={{color: Colors.colors.primary, width: 100}}>
               Add/Manage
             </Text>
           </TouchableOpacity>
           
            
          </View>

          <View>
            <FlatList
              contentContainerStyle={{marginTop: 6}}
              showsHorizontalScrollIndicator={false}
              horizontal
              data={address}
              keyExtractor={(id, index) => index.toString()}
              renderItem={({item}) => {
                if (item.isDefault == true && flag == false) {
                  console.log('default' + item.stateId);
                  setToState(item.stateId);
                  setIndex2(item.id);
                  setaddressId(item.id);
                  setFlag(true);
                }
                return (
                  <View style={styles.addressContainer}>
                    <Text>{item.addressLine1}</Text>
                    <Text>{item.addressLine2}</Text>
                    <Text>{item.city}</Text>
                    <Text>{item.States.stateName}</Text>
                    <TouchableOpacity
                      onPress={async () => {
                        setToState(item.stateId);
                        //setaddressId(item.id)
                        changeAddress(item.id);

                        setIndex2(item.id);

                        //  await getDeliveryCharges(1,item.stateId,item.id)
                      }}>
                      <Icon
                        type="font-awesome"
                        name={index2 == item.id ? 'circle' : 'circle-thin'}
                        size={15}
                        color={Colors.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          <View>
            <View
              style={{
                ...styles.header,
                marginTop:16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text type="heading">Delivery Method</Text>
            </View>
          </View>
          <View>
            {dummyArray.map(element => {
              let fromState = 0;
              let weight = 0;
              let index_No = 0;

              return (
                <View
                  style={{
                    backgroundColor: Colors.colors.white,
                   // height: (DIMENS.common.WINDOW_HEIGHT * 1) / 4,
                    marginTop: 6,
                    padding:4,
                    paddingBottom:16,
                    borderRadius:15
                    
                  }}>
                  {element.userCarts.map((data, index) => {
                    console.log(data)
                    let conversionPrice = data.price * price * data.quantity;
                    payTotal+=data.price*data.quantity
                    total += conversionPrice;
                    fromState = data.Products.fromStateId;
                    weight = data.Products.weight * data.quantity;
                    console.log(conversionPrice);
                    return (
                      <View key={index}>
                        <View
                          key={data.id}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            //height: 60,
                            backgroundColor: Colors.colors.white,
                            marginBottom: 8,
                            alignItems: 'center',
                            padding: 8,
                            borderRadius:15
                          }}>
                          <Text style={{width: 200}}>{data.Products.name}</Text>
                          <Text> Qty: {data.quantity}</Text>
                          <Text>
                            {decode(symbol) + conversionPrice.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 7,
                      paddingRight: 7,
                     }}>
                    {element.DeliveryTypes.map((data, index) => {
                      let conversionPrice = data.price * price;
                      if (Index == data.id) {
                        sum += conversionPrice;
                        del_charges += data.price;
                      }
                      return (
                        <View style={{width: '40%'}} key={index}>
                          <View
                            style={{
                              flexDirection: 'row',
                              paddingLeft: 6,
                              flexWrap: 'wrap',
                             
                            }}>
                            <Image
                              source={{uri: data.image.replace('~', BASE_URL)}}
                              resizeMode="contain"
                              style={{width: 40, height: 40}}
                            />
                            <View style={{paddingRight: 6}}>
                              <TouchableOpacity
                                onPress={() => {
                                  setIndex(prev => data.id);

                                  update_delivery_charges(
                                    element.itemIds,
                                    data.id,
                                  );

                                  setDisable(false);
                                }}>
                                <Icon
                                  type="font-awesome"
                                  name={
                                    Index == data.id ? 'circle' : 'circle-thin'
                                  }
                                  size={15}
                                  color={Colors.colors.primary}
                                />
                              </TouchableOpacity>
                            </View>
                            <View>
                              <Text style={{fontWeight: 'bold'}}>
                                {data.deliveryName}
                              </Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {decode(symbol)}
                                {(data.price * price).toFixed(2)}
                              </Text>
                            </View>
                          </View>
                          <Text
                            type="body"
                            style={{fontSize: 10, width: '100%'}}>
                            {data.description}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 25,
                marginBottom: 2,
                alignItems: 'center',
                padding: 2,
                marginTop: 6,
              }}>
              <Text>SubTotal:</Text>

              <Text>
                {decode(symbol)}
                {total.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 25,
                marginBottom: 8,
                alignItems: 'center',
                padding: 2,
                marginTop: 6,
              }}>
              <Text>Estimated taxes:</Text>

              <Text>
                {decode(symbol)}
                {(grandTotal = Math.round(total * 0.05, 2))}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 25,
                marginBottom: 8,
                alignItems: 'center',
                padding: 2,
                marginTop: 6,
              }}>
              <Text>DeliveryCharges:</Text>

              <Text>
                {decode(symbol)}
                {sum.toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 25,
                marginBottom: 8,
                alignItems: 'center',
                padding: 2,
                marginTop: 6,
              }}>
              <Text>Order Total:</Text>

              <Text>
                {decode(symbol) + Math.round(total + sum + grandTotal, 2)}
              </Text>
            </View>
          </View>
          <View style={{top: 16}}>
            <Text type="heading">Payment Method</Text>
            <View
              style={{
                height: 60,
                width: '100%',
                backgroundColor: Colors.colors.white,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
                padding: 6,
                marginBottom:18,
                borderRadius:15
               // bottom:8
              }}>
              <Text>Credit/Debit/ATM Card</Text>
              <TouchableOpacity
                onPress={() => {
                  if (visible) {
                    setVisible(false);
                  } else {
                    setVisible(true);
                    setPaypal(false)
                  }
                }}>
                <Icon
                  type="font-awesome"
                  name={visible ? 'circle' : 'circle-thin'}
                  size={20}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
            </View>
            {/*
                 <View
              style={{
                height: 60,
                width: '100%',
                backgroundColor: Colors.colors.white,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
                padding: 6,
                marginBottom:18,
                borderRadius:15
             
               // bottom:8
              }}>
              <Text>Pay with Paypal</Text>
              <TouchableOpacity
                onPress={() => {
                  if (paypal) {
                    setPaypal(false);
                  } else {
                    setPaypal(true);
                    setVisible(false)
                  }
                }}>
                <Icon
                  type="font-awesome"
                  name={paypal ? 'circle' : 'circle-thin'}
                  size={20}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
            </View>
          
       
             */}
          </View>
          <View style={{flexDirection: 'row', top: 16,paddingLeft:6,paddingRight:24,width:'100%'}}>
              <TouchableOpacity
                onPress={() => {
                  payNow?setpayNow(false):setpayNow(true)
                 
                 
                }}>
                <Icon
                  name={
                    payNow? 'check-box' : 'check-box-outline-blank'
                  }
                  size={22}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
            
              <Text type="body" style={{textAlign:'justify'}}>{StringsOfLanguages.paymentNotify}</Text>
            </View>
           
          </ScrollView>
        </View>
     
     {visible?
     <TouchableOpacity onPress={openPaymentSheet}  style={styles.checkoutContainer}>
     <Text type="subheading" style={{color: Colors.colors.white}}>
       Confirm ({decode(symbol) + Math.round(total + sum + grandTotal, 2)}){' '}
     </Text>
   </TouchableOpacity>:paypal?
   <TouchableOpacity  style={styles.checkoutContainer} onPress={()=>paypalcre.approvalUrl? setPayModal(true):setPayModal(false)}>
   <Text type="subheading" style={{color: Colors.colors.white}}>
     Confirm ({decode(symbol) + Math.round(payTotal+del_charges+payTotal*0.05, 2)}){' '}
   </Text>
 </TouchableOpacity>
  :null }
        
      
    </SafeAreaView>
  );
};
export default PaymentScreen;
const styles = StyleSheet.create({
  main: {
    flex:1,
    padding: 16,
    backgroundColor: Colors.colors.transparent,
    paddingBottom: DIMENS.common.WINDOW_HEIGHT*0.08,
    //height:
  },
  header: {
    top: -10,
    flexDirection: 'row',
  },
  stepsContainer: {
    marginTop: 20,
    backgroundColor: Colors.colors.white,
    height: 80,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addressContainer: {
    
    backgroundColor: Colors.colors.white,
    padding: 10,
    marginLeft: 8,
    borderRadius: 15,
    width: 200,
  },
  /*  checkoutContainer:
        {

            position:'absolute',  
            alignItems:'center',
            justifyContent:'space-between',
            backgroundColor:Colors.colors.gray100,
          
            height:60,
            borderRadius:10,
            alignSelf:'center',
            flexDirection:'row',
            padding:10,
            bottom:0,
            left:4,
            right:4,
           
            borderWidth:1,
            borderColor:Colors.colors.primary,      
        },*/
  checkoutContainer: {
    bottom: 5,
    backgroundColor: Colors.colors.primary,
    width: '90%',
    height: 50,
    borderRadius: 12,
    alignSelf: 'center',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
});
