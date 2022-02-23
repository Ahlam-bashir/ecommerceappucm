import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import { RNToasty } from 'react-native-toasty'
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import {
  Alert as CustomAlert,
  CustomHeader,
  Icon,
  Loader,
  Text,
} from '../../components';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';
import {API_URL, BASE_URL} from '../../utils/Config';
import {encode} from 'base-64';
import {loggedInUser} from '../../../App';
import {SafeAreaView} from 'react-native';
import {decode} from 'html-entities';

import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import  {decCart, getCartItems,incCart,removeCart,removeFromCart} from '../../store/actions/cartActions';
import {useCallback} from 'react';
import StringsOfLanguages from '../../constants/StringOfLanguages';

const CartScreen = ({navigation}) => {
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [cartLength, setCartLength] = useState(null);
  const [disable, setDisable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [animation, setAnimation] = useState('');
  const [title, setTitle] = useState('');
  const [btntext1, setbtntext1] = useState('');
  const [btntext2, setbtntext2] = useState('');
  const [symbol, setSymbol] = useState(decode('&#X0024;'));
  const dispatch = useDispatch();
  const carts = useSelector(state => state.cart.cartItems);
  const [price, setPrice] = useState(1);
  const [counter,setCounter]=useState(1)
  let sum = 0;
  useEffect(() => {
   navigation.addListener('focus', async () => {
      await AsyncStorage.getItem('currency')
        .then(value => JSON.parse(value))
        .then(json => {
          if (json !== null) {
            setPrice(json.conversion_rate);
           
            setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
       
           // setSymbol('&#X' + json.target_data.display_symbol + ';');
          }
        })
        .catch(error => {
          console.log(error);
        });
       
     
    });
  },[]);

  // const use=loggedInUser()

  useEffect(async () => {
       cartDetails();
    navigation.addListener('focus',async ()=>{
      await cartDetails();

    })
   
    // AsyncStorage.getItem
   

    //return ()=>console.log('unmounting')
  }, [dispatch]);
  const cartDetails = async () => {
          setLoading(true);
          
       dispatch(getCartItems());
          console.log(carts);
          setLoading(false);
          if (carts.length != 0) {
            setLoading(false);
            setCartData(carts);
            setDisable(false);
            setRefreshing(false);
          }
    await AsyncStorage.getItem('user')
      .then(txt => JSON.parse(txt))
      .then(response => {
        setUser(response);
        console.log(response);
        if (response != null) {
          

          /*   fetch(API_URL + 'MyCart/', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },
          })
            .then(response => response.json())
            .then(responseJson => {
              //Showing response message coming from server
              console.log(responseJson);
              setLoading(false);
              if (responseJson.statusCode === 200) {
                if (responseJson.data.length !== 0) {
                  setCartData(responseJson.data);
                  setCartLength(responseJson.data.length);
                  setDisable(false);
                  setRefreshing(false);
                } else {
                  alert('your cart is empty');
                  setDisable(true);
                  setCartData(responseJson.data);
                  setRefreshing(false);
                  //navigation.navigate('Home')
                }
              }
            })
            .catch(error => {
              //display error message
              setLoading(false);
              console.warn(error);
              setRefreshing(false);
            });
          //cartDetails()

          //cartDetails()
        } else {
          setLoading(true);
          AsyncStorage.getItem('products')
            .then(value => JSON.parse(value))
            .then(json => {
              setLoading(false);

              if (json != null && json.length !== 0) {
                //console.log(json)
                console.log(typeof json);
                setCartData(json);

                setDisable(false);
                setRefreshing(false);
              } else {
                setCartData([]);
                alert('Cart is Empty');

                setDisable(true);
                setRefreshing(false);
              }

              console.log(json);
            });*/
        }
      });

    //  AsyncStorage.getItem('user').then(value=>{
    //   setUser(JSON.parse(value))
    // })
  };

  const removeFrommCart =async item => {
    if (user === null) {
      let products = [];
    await  AsyncStorage.getItem('products').then(value => {
        let filterarray = JSON.parse(value);
        console.log(filterarray);
         products= filterarray.filter(product=>product.userCart.productId!==item.productId)
      });
      await  AsyncStorage.setItem('products',JSON.stringify(products))
      cartDetails()
      //setCartData(products)
    } else {
      removeSingleCart(item);
    }
  };
  const removeSingleCart = async item => {
    console.log(item.id +'itemmm');
   // setLoading(true)
    Alert.alert(
      //title
      'Delete',
      //body
      'Are you sure you want to remove item from cart',
      [
        {
          text: 'NO',
          onPress: () => {
           // setLoading(false)
            return},
        },
        {
          text: 'Yes',
          onPress:() =>{
           // setLoading(false)
           dispatch(removeFromCart(item.id))
          
      
      
          
       // await dispatch(getCartItems());
           
      /* 
         if (Platform.OS == 'ios') {
              setAlertVisible(true);
              setAnimation(
                require('../../assets/images/animations/47296-cart-addremove-icon.json'),
              );
              setTitle('Cart item removed sucessfully');
            } else {
              alert('Cart item removed sucessfully');
            }*/
           
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  
   
  };
  const checkout = () => {
    console.log('hello');
    //const user =    AsyncStorage.getItem('user').then(value=>{return JSON.parse(value)}).then(response=>{console.log(response)})
    console.log('user' + user);
    if (user !== null) {
      navigation.navigate('Payments Screen');
    } else {
      navigation.navigate('Login Screen', {cart: 'cartScreen'});
    }
  };
  const onRefresh = () => {
    //set isRefreshing to true
    setRefreshing(true);
    cartDetails();
    // and set isRefreshing to false at the end of your callApiMethod()
  };
  const incrementCart=async(cart)=>{
    console.log()
    if(user!==null){
      if(cart.quantity<=10){
        cart.quantity+=1
        console.log(counter)
         dispatch(incCart(cart.id,cart.productId,cart.quantity,0,null))
       
      }else{
        alert('maximum 10 products can be added')
        
      }
    }else{
      let existingCart = await AsyncStorage.getItem('products').then(value => {
        return JSON.parse(value);
      });
      const index=  findIndex(existingCart,cart.productId)
      console.log("index"+index)
      if(index>=0){
        if(existingCart[index].userCart.quantity<10){
          existingCart[index].userCart.quantity+=1
        }else{
          RNToasty.Info({
            title:'maximum 10 products can be added',
            position:'center',
            //fontFamily:'Arial'
            
          })
          
          
          
        }
       
       

      }
     await AsyncStorage.setItem('products', JSON.stringify(existingCart));
     cartDetails()
      
      

    }
    


  }
  const findIndex = (cartList, id) => {
    const index = cartList.findIndex((cart) => {
        console.log(cart.userCart.productId   + ' gjhgbj '+ id )
      return cart.userCart.productId === id;
    });
    return index;
  };
  const decrementCart=async (cart)=>{
    setCounter((prev)=>(prev>1)?prev-1:prev)
    if(user!==null){
      if(cart.quantity>1){
        cart.quantity-=1
        dispatch(decCart(cart.id,cart.productId,cart.quantity,0,null))
      }
     else{
     
           removeSingleCart(cart)
          
    }

     
   
  

    }else{
      let existingCart = await AsyncStorage.getItem('products').then(value => {
        return JSON.parse(value);
      });
      const index=  findIndex(existingCart,cart.productId)
      console.log("index"+index)
      if(index>=0){
        if(existingCart[index].userCart.quantity>1) {
          existingCart[index].userCart.quantity-=1
        } else{
          Alert.alert(
            //title
            'Delete',
            //body
            'Are you sure you want to remove item from cart',
            [
              {
                text: 'NO',
                onPress: () => {return},
              },
              {
                text: 'Yes',
                onPress: () => removeFrommCart(cart),
                style: 'cancel',
              },
            ],
            {cancelable: false},
            //clicking out side of alert will not cancel
          );
        }
       

      }
     await AsyncStorage.setItem('products', JSON.stringify(existingCart));
     cartDetails()
      
      
    }
    
    
    
  }
  const renderCartItem=({item})=>{
    let convertPrice = item.userCart.price * price;
    sum = sum + convertPrice;

    return  (
      <TouchableOpacity onPress={()=>navigation.navigate('productDetails', {
        id: item.userCart.productId,
      })}>
      <View style={styles.outerContainer}>
        
          <Icon
            name="minuscircleo"
            type="antdesign"
            size={24}
            color={Colors.colors.gray400}
            onPress={() => removeFrommCart(item.userCart)}
          />
        
        <Image
          source={{uri: item.mainImage}}
          resizeMode="cover"
          style={{height: 100, width: 120, margin: 10}}
        />
        <View style={{flexDirection: 'column'}}>
          <Text type="caption" style={{width: 80}}>
            {item.userCart.productName}
          </Text>

          <Text>{decode(symbol) + convertPrice.toFixed(2)}</Text>
          <Icon  name='clear' size={16} color={Colors.colors.gray500}        />
          <Text>Qyt: {item.userCart.quantity}</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>decrementCart(item.userCart)}>
        <View style={styles.quantityContainer}>
          <Icon name='minus' type='antdesign' size={10}/>
        </View>
        </TouchableOpacity>
        <Text>{item.userCart.quantity}</Text>
        <TouchableOpacity onPress={()=>incrementCart(item.userCart)}>
        <View style={styles.quantityContainer}>
          <Icon name='plus' type='antdesign'  size={10}/>
        </View>
        </TouchableOpacity>
        </View>
      </View>
      </TouchableOpacity>
    ) 

  }
  const ListEmptyComponent=()=>{
    return(
      <View style={{justifyContent:'center',alignItems:'center',minHeight:'100%'}}>
      <Text type='heading'>Your Cart is Empty</Text>
      </View>
    )
  }
  const removeAllCart=()=>{
    Alert.alert(
      //title
      'Remove',
      //body
      'Are you sure you want to all  items from cart',
      [
        {
          text: 'NO',
          onPress: () => {return},
        },
        {
          text: 'Yes',
          onPress: () => dispatch(removeCart()),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );

  }
  const ListHeaderComponent=()=>{
    return(
      <TouchableOpacity 
      onPress={()=> dispatch(removeCart())}
      
      style={{width:'100%',alignItems:'flex-end',top:0,padding:6,justifyContent:'center', marginTop:Platform.OS=='android'?28:0}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Icon name='close'  color={Colors.colors.white} size={16}/>
        <Text type='caption' style={{color:Colors.colors.white,fontWeight:'600'}} >Remove all</Text>
        </View>
        <View style={{height:1,width:75,backgroundColor:Colors.colors.white}}/>
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView style={styles.main}>
      <CustomHeader customStyles={styles.svgCurve} />
      <CustomAlert
        visible={alertVisible}
        close={() => setAlertVisible(false)}
        title={title}
        animation={animation}
        button1={btntext1}
        button2={btntext2}
        uri={animation}
        btn1Click={() => navigation.navigate('CartScreenStack')}
        btn2Click={() => navigation.goBack()}
      />

      <View style={styles.main}>
        <Text
          type="heading"
          style={{alignSelf: 'center', color: Colors.colors.white, top: 16}}>
          {' '}
          Your Cart
        </Text>
        {carts.length!==0?<ListHeaderComponent/>:null}
    
        {loading? <Loader loading={loading} />:null}
          <FlatList
          data={carts}
         // ListHeaderComponent={carts.length!==0? ListHeaderComponent:null}
          contentContainerStyle={{marginTop: 12,paddingBottom:28,backgroundColor:Colors.colors.transparent}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(id, index) => index.toString()}
          onRefresh={onRefresh}
          ListEmptyComponent={ListEmptyComponent}
          refreshing={refreshing}
          renderItem={renderCartItem}
      
        />
        
      

       
       
        {carts.length!=0 ? (
          
           
            <TouchableOpacity onPress={checkout} style={styles.checkoutContainer}>
              <Text type="subheading" style={{color: Colors.colors.white}}>
                {StringsOfLanguages.Checkout}
              </Text>
            </TouchableOpacity>
         
        ) : <View>
        {/**<Text type='subheading'>${total}</Text>**/}
        
         
      
      </View>}
      </View>
    </SafeAreaView>
  );
};
export default CartScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor:Colors.colors.white,
  },
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    marginStart:6,
    
    backgroundColor: Colors.colors.gray100,
    elevation: 2,
    borderRadius: 15,
    top: 8,
   // height: (DIMENS.common.WINDOW_HEIGHT * 1) / 4,
  },
  checkoutContainer: {
    bottom: 6,
    backgroundColor: Colors.colors.primary,
    width: '90%',
    height: 50,
    borderRadius: 12,
    alignSelf: 'center',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  quantityContainer:{
    height:20,
    width:20,
    borderRadius:4,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Colors.colors.gray200,
    margin:4
  }

});
