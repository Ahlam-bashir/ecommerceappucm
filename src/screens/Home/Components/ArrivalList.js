import React,{useCallback, useState} from 'react'
import {
    View,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    Animated,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    LogBox,
    ActivityIndicator,
   
  } from 'react-native';
  import {CustomHeader, Icon, Loader, Text,InputText} from '../../../components';
  import {DIMENS} from '../../../constants';
import Colors from '../../../utils/Colors';
import FastImage from 'react-native-fast-image';
import { useDispatch,useSelector} from 'react-redux';
import { addToWishlist } from '../../../store/actions/wishlistActions';
import { BASE_URL } from '../../../constants/matcher';
import {decode} from 'html-entities';
import { Alert } from 'react-native';
import WishIcon from './WishlIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../utils/Config';
import { encode } from 'base-64';
import { RNToasty } from 'react-native-toasty';




const ArrivalList =(props)=> {
  const dispatch=useDispatch()
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
 
   
   
      const {item,navigation,user,price,symbol}=props
      
    let imagePath = item.mainImage.replace('~', BASE_URL);
    const convertPrice = item.product.price * price;
    const name =
      item.product.name.length > 20
        ? item.product.name.substring(0, 20) + '...'
        : item.product.name;
    const dp = (convertPrice * item.product.discount) / 100;
    let star=0
    const newPrice = convertPrice - dp;
      item.ratings.map((item,index)=>{
        star+=item.totalStars

      })
      let totalStars=star/item.ratings.length
    //const x= Math.round(convertPrice*100)/100
   // let x = Conversion(item.product.price, price);
  
    const CustomRatingBar = () => {
      return (
        <View style={styles.customRatingBarStyle}>
        
          <View style={{flexDirection:'row',marginTop:8,marginBottom:8}}>
          {maxRating.map((item, index) => {
            return (
              
                
                <Icon
                  key={index}
                  size={16}
                  style={styles.starImageStyle}
                  type='antdesign'
                  name={ item <= totalStars
                    ? 'star'
                    : 'staro'}
                    color={Colors.colors.primary}
                 
                />
                
             
            );
          })}
          </View>
        </View>
      );
    };
    const addtProductToCart = async item => {
  
      // addToCart(item.product.id)
      const productId = item.product.id;
  
      let existingCart = await AsyncStorage.getItem('products').then(value => {
        return JSON.parse(value);
      });
  
      // console.log(item.product)
      var data = {
        userCart: {
          productId: item.product.id,
          sellerId: item.product.sellerId,
          price: item.product.price,
          quantity: 1,
          total: '',
          productName: item.product.name,
          agentId: null,
          variationId: 0,
          deliveryTypeId: null,
          isBuynow: false,
        },
        mainImage: item.mainImage,
      };
      if (user === null) {
        if (existingCart !== null && existingCart.length!==0) {
          console.log(existingCart+'existi');
  
          // We have a cart already, now we have to check if any item in cart is the same as our cartItem; existingCart should be kept as an array
             let flag=0
          existingCart.forEach((product, index) => {
            console.log(product.userCart.productId + '   '+   item.product.id +'insidevfor')
            if (product.userCart.productId == item.product.id ){
            // product.ItemCode == cartItem.ColorCode) {
            // you can modify this condition by your needs
            
                existingCart[index].userCart.quantity += 1
                flag=1
                console.log('added quantity')
                console.log(existingCart[index].userCart.quantity)
           }
            
          });
          if(flag==0) {
            // the item doesn't match any items, therefore we add it to the cart
           
            existingCart.push(data);
            console.log('if block');
            }
        } else {
          //console.log(existingCart)
          // the cart is empty, therefore we put the first item in it
          existingCart = [data];
          console.log('else block..');
        }
  
        AsyncStorage.setItem('products', JSON.stringify(existingCart));
        RNToasty.Success({
          title:'Product added to cart',
          position:'center'
        })
       
      } else {
        console.log('else block');
        addToCart(productId);
      }
    };
    const addToCart = id => {
      console.log('hello' + id);
      //setLoading(true);
      fetch(API_URL+ 'MyCart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + encode(user.email + ':' + user.password),
        },
        body: JSON.stringify({
          productId: id, //Product Id
          quantity: 1,
          agentId: 0,
          variationId: null,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
        
         // setLoading(false);
          //setAlertVisible(true);
          RNToasty.Success({
            title:'Product' + '  ' + responseJson.message + '  ' + 'to Cart',
            position:'center'
          })
         
       /*   Alert.alert(
            //title
            'Success',
            //body
            'Product' + '  ' + responseJson.message + '  ' + 'to Cart',
            [
              {
                text: StringsOfLanguages.ContinueShop,
                onPress: () => {return},
              },
              {
                text: 'Go to Cart',
                onPress: () => navigation.navigate('CartScreenStack'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
            //clicking out side of alert will not cancel
          );*/
          //Showing response message coming from server
          console.log(responseJson);
          
         // setAlertVisible(true)
          
  
       //  alert('Product' + '  ' + responseJson.message + '  ' + 'to Cart');
          /* SweetAlert.showAlertWithOptions({
            title: '',
            subTitle: '',
            confirmButtonTitle: 'OK',
            confirmButtonColor: '#000',
            otherButtonTitle: 'Cancel',
            otherButtonColor: '#dedede',
            style: 'success',
            Icon: 'success',
            cancellable: true
  
          },
          callback => console.log('callback')
          
          ):*/
          // setLoading(false)
        })
        .catch(error => {
          //display error message
         // setLoading(false);
  
          console.warn(error);
        });
    };
    
  
    return (
      <TouchableOpacity
      key
      ={item.product.id}
        onPress={useCallback(() =>
          navigation.navigate('productDetails', {
            id: item.product.id,
          }),[item.product.id])
        }>
        <View
          key={item.id}
          style={{
            shadowColor: '#470000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            elevation: 2,
            marginHorizontal: 5,
            marginVertical: 5,
            width: (DIMENS.common.WINDOW_WIDTH * 45) / 100,
            padding:6,

            backgroundColor: Colors.colors.white,
            borderRadius: 14,
          }}>
      
          <FastImage
          resizeMode={FastImage.resizeMode.contain}
            style={{
              //resizeMode: 'contain',
              height: 200,
            }}
            source={{uri: imagePath,
                cache:FastImage.cacheControl.immutable
            }}
            
          />
        
         
              {user!=null?<WishIcon item={item} user={user}/>
        
       :null}
       <View
       style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
       >
          <View
            style={{
              padding: 6,
             // flexDirection: 'column',
             // alignItems: 'center',
              width: (DIMENS.common.WINDOW_WIDTH * 40) / 100,
            }}>
            <Text
              type="caption"
              style={{fontSize: 14, color: Colors.colors.primary}}>
              {name}
            </Text>
            {item.product.discount > 0 ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  type="caption"
                  style={{
                    fontSize: 12,
                    color: Colors.colors.primary,
                    textDecorationLine: 'line-through',
                  }}>
                  ${convertPrice.toFixed(2)}
                </Text>
                <Text
                  type="caption"
                  style={{
                    fontSize: 12,
                    color: Colors.colors.primary,
                  }}>
                  {symbol + newPrice.toFixed(2)}
                </Text>
              </View>
            ) : (
              <Text
                type="caption"
                style={{
                  fontSize: 12,
                  color: Colors.colors.primary,
                }}>
                {decode(symbol) + convertPrice.toFixed(2)}
              </Text>
            )}
            <CustomRatingBar />
          </View>
        </View>
        <TouchableOpacity style={{
            height: 40,
            width: 40,
            borderRadius: 40 / 2,
            backgroundColor: Colors.colors.primary,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            margin:10,
            
            position:'absolute',
            bottom:2,
            right:2
          
          }}
          onPress={() => addtProductToCart(item)}
          >
          
          <Icon
            name="add-shopping-cart"
            size={20}
            color={Colors.colors.white}
            onPress={() => addtProductToCart(item)}
          />
       </TouchableOpacity>
        
        </View>
      </TouchableOpacity>
    );
 
     

}
export default ArrivalList
const styles =StyleSheet.create({
  bottomNavigationView: {
      backgroundColor: '#fff',
      width: '100%',
    //  height: 250,
      padding:18,
      alignSelf:'center',
      
      justifyContent: 'center',
    //  alignSelf:'center'
      //alignItems: 'center',
    },
    inputContainer: {
      margin: 8,
      borderWidth: 1,
      height: 60,
      borderRadius:4,
      padding:6
  
    },
    customRatingBarStyle: {
      justifyContent: 'center',
     // flexDirection: 'row',
      marginTop: 6,
    },
})
