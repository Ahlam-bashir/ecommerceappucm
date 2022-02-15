import React,{useState} from 'react'
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




const ArrivalList=(props)=>{
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
  
    return (
      <TouchableOpacity
      key
      ={item.product.id}
        onPress={() =>
          navigation.navigate('productDetails', {
            id: item.product.id,
          })
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
            style={{
              padding: 6,
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: (DIMENS.common.WINDOW_WIDTH * 45) / 100,
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
