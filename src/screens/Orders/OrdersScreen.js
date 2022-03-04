import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {CustomHeader, Icon, Loader, Text} from '../../components';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';
import {API_URL} from '../../utils/Config';
import Moment from 'moment';
import {decode} from 'html-entities';
import {Conversion} from '../../utils';

const OrdersScreen = ({navigation}) => {
  const [orders, setOrders] = useState([]);

  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(1);
  const [symbol, setSymbol] = useState(decode('&#X0024;'));
  useEffect(()=>{
    navigation.addListener('focus', async () => {
      orderDetails()
    })
    return setOrders([])
  },[navigation])
  useEffect(async () => {
  
    await AsyncStorage.getItem('currency')
      .then(txt => JSON.parse(txt))
      .then(json => {
        console.log(json + 'jsonnnnnnnn');
        if (json !== null) {
          console.log(json + 'inside if');
          setPrice(json.conversion_rate.toFixed(2));
          console.log(json);
          setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
       
          //setSymbol('&#X' + json.target_data.display_symbol + ';');
        }
      });

    orderDetails();
    return setOrders([])
  }, []);
  const orderDetails = async () => {
    await AsyncStorage.getItem('user')
      .then(txt => JSON.parse(txt))
      .then(response => {
        console.log('inside');
        if (response != null) {
          if (!loading && !isListEnd) {
            setLoading(true);
            fetch(API_URL + 'MyOrders?page=' + offset, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization:
                  'Basic ' + encode(response.email + ':' + response.password),
              },
            })
              .then(response => response.json())
              .then(responseJson => {
                if (responseJson.length > 0) {
                  setOrders([...orders, ...responseJson]);
                  setOffset(offset + 1);
                  //Showing response message coming from server

                  setLoading(false);
                } else {
                  setIsListEnd(true);
                  setLoading(false);
                }
              })
              .catch(error => {
                //display error message
              });
          }

          //cartDetails()

          //cartDetails()
        }
      });
  };
  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {loading ? <Loader loading={loading} /> : null}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.main}>
      <CustomHeader customStyles={styles.svgCurve} />
      <View style={{padding: 16}}>
        
        <View style={styles.header}>
          <Icon
            name="arrowleft"
            color={Colors.colors.white}
            size={25}
            type="antdesign"
            onPress={() => navigation.navigate('AccountScreenStack')}
          />
          <Text
            type="heading"
            style={{
              fontSize: 22,
              color: Colors.colors.white,
              width: '90%',
              textAlign: 'center',
            }}>
            My Orders
          </Text>
        </View>
        <View style={{marginTop: 16}}></View>
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={orderDetails}
          onEndReachedThreshold={0.5}
          keyExtractor={(id, index) => index.toString()}
          renderItem={({item}) => {
            console.log(item);

            const bill = item.total + item.shippingCharges + item.vat;
            const totalBill = bill * price;

            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Order Details', {id: item.id})
                }>
                <View style={styles.orderContainer}>
                  <View style={{padding: 6}}>
                    <View style={{flexDirection: 'row',width: '75%',
                    justifyContent:'space-between'
                  }}>
                      <Text type="subheading" >
                        {Moment(item.dated).format('DD-MM-YYYY')}
                      </Text>
                      <Text
                        type="subheading"
                        style={{textAlign:'right'}}
                        >
                        {item.isPaid ? 'Paid' : 'Unpaid'}
                      </Text>
                    </View>
                    <Text type="caption">Order No {item.id}</Text>
                    <Text type="caption">Item: {item.Item}</Text>
                    <Text type="caption">
                      Bill {decode(symbol) + Math.round(totalBill, 2)}
                    </Text>
                    <View
                      style={{
                        marginTop: 16,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width:'75%'
                      
                      }}>
                      <Text
                        type="subheading"
                        style={{color: Colors.colors.primary}}>
                        {item.status}
                      </Text>
                      <Text
                        type="caption"
                        style={{color: Colors.colors.warning,textAlign:'right'}}>
                        View
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default OrdersScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.colors.transparent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
   // height: (DIMENS.common.WINDOW_HEIGHT * 1) / 5,
    borderRadius: 15,
    backgroundColor: Colors.colors.white,
    padding: 8,

    flexDirection: 'row',
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
