import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import {CustomHeader, Loader, Text} from '../../components/index';
import {FlatList} from 'react-native-gesture-handler';
import {Icon} from '../../components';
import Colors from '../../utils/Colors';
import {DIMENS} from '../../constants';
import {API_URL, BASE_URL} from '../../utils/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';
import {SafeAreaView} from 'react-native';
import {decode} from 'html-entities';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../../store/actions/wishlistActions';
import FastImage from 'react-native-fast-image';
import FilterList from '../../components/picker/FilterList';
import StringsOfLanguages from '../../constants/StringOfLanguages';
import { RNToasty } from 'react-native-toasty';
import { useCallback } from 'react';

const ProductScreen = ({navigation, route}) => {
  console.log(route);
  const superCategorId=route.params.s_Id
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [user, setUser] = useState(null);
  const [isListEnd, setIsListEnd] = useState(false);
  const [filterOpen,setFilterOpen]=useState(false)
  const [searchText, setSearchText] = useState('');
  const [arrayholder, setarrayholder] = useState([]);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState(1);
  const [symbol, setSymbol] = useState(decode('&#X0024;'));
  //const [alertVisible,setAlertVisible]=useState(false)
  const [animation, setAnimation] = useState('');
  const [title, setTitle] = useState('');
  const [btntext1, setbtntext1] = useState('');
  const [btntext2, setbtntext2] = useState('');
  const dispatch=useDispatch()
  
  useEffect(() => {
    if (route.params === undefined) {
      getData();
     
    } else  if(route.params.Id){
    
      getCategoryData();
    }
    else{
      getSubCategory()
     
    }
    return ()=>{
      setData([])
      setarrayholder([])

    }

  }, []);
  useEffect(async () => {
   await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => setUser(response));
   await AsyncStorage.getItem('currency')
      .then(value => JSON.parse(value))
      .then(json => {
        if (json !== null) {
          setPrice(json.conversion_rate);
          console.log(json);
          setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
       
         // setSymbol('&#X' + json.target_data.display_symbol + ';');
        }
      })
      .catch(error => {
        console.log(error);
      });
     
  }, []);
  const getData = () => {
    if (route.params === undefined) {
      if (!loading && !isListEnd) {
        setLoading(true);

        fetch(API_URL + 'CategoryProducts?page=' + offset, {
          method: 'GET',
          //Request Type
        })
          .then(response => response.json())

          .then(responseJson => {
            if (responseJson.statusCode === 200) {
              if (responseJson.data.length > 0) {
                //console.log(responseJson)
                setOffset(offset + 1);
                // After the response increasing the offset
                setData([...data, ...responseJson.data]);
                setLoading(false);
              } else {
                setIsListEnd(true);
                setLoading(false);
              }
            }

            //Success
          })

          .catch(error => {
            //Error

            console.error(error);
          });
      }
    } else  if(route.params.Id) {
      getCategoryData();
    }else{
      getSubCategory()
    }
  };
  const getCategoryData = () => {
    console.log(route.params.Id);
    console.log(user+'user')

    if (!loading && !isListEnd) {
      setLoading(true);

      fetch(
        API_URL + 'CategoryProducts/' + route.params.Id + '?page=' + offset,
        {
          method: 'GET',
          //Request Type
        },
      )
        .then(response => response.json())

        .then(responseJson => {
          if (responseJson.statusCode === 200) {
            if (responseJson.data.length > 0) {
              // console.log(responseJson)
              setOffset(offset + 1);
              // After the response increasing the offset
              setData([...data, ...responseJson.data]);
              setarrayholder(responseJson.data);
              setLoading(false);
            } else {
              setIsListEnd(true);
              setLoading(false);
            }
          }

          //Success
        })

        .catch(error => {
          //Error

          console.error(error);
        });
    }
  };
  const getSubCategory = () => {
    console.log(route.params.Id);
    console.log(user+'user')

    if (!loading && !isListEnd) {
      setLoading(true);

      fetch(
        API_URL + 'SubCategoryProduct/' + route.params.subId + '?page=' + offset,
        {
          method: 'GET',
          //Request Type
        },
      )
        .then(response => response.json())

        .then(responseJson => {
          if (responseJson.statusCode === 200) {
            if (responseJson.data.length > 0) {
              // console.log(responseJson)
              setOffset(offset + 1);
              // After the response increasing the offset
              setData([...data, ...responseJson.data]);
              setarrayholder(responseJson.data);
              setLoading(false);
            } else {
              setIsListEnd(true);
              setLoading(false);
            }
          }

          //Success
        })

        .catch(error => {
          //Error

          console.error(error);
        });
    }
  };

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {loading ? <Loader loading={loading} /> : null}
      </View>
    );
  };
  const searchData = text => {
    if (text) {
      setSearchText(text)
      fetch(API_URL + 'SearchProduct?searchQuery=' + text + '&&page=' + 1)
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          setData(responseJson.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setSearchText(text)
     
     
      getCategoryData()

     
      
    }
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
      alert('Product added to cart');
    } else {
      console.log('else block');
      addToCart(productId);
    }
  };
  const addToCart = id => {
    console.log('hello' + id);
    setLoading(true);
    fetch(API_URL + 'MyCart', {
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
      
        setLoading(false);
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
        setLoading(false);

        console.warn(error);
      });
  };
  const addtoWishlist=(item)=>{
    dispatch(addToWishlist(item))
  /*  Alert.alert(
      //title
      'Success',
      //body
      StringsOfLanguages.addedToWishlist,
      
      //clicking out side of alert will not cancel
    );*/
    
    
    


  }
  const filterItems=(key)=>{
    setFilterOpen(false)
    fetch(
      API_URL + "Filter?page="+offset+"&category=&q=&sort="+key+"&limit=",{
        method:"GET"
        
       
        
      },  
        //Request Type
    )
      .then(response => response.json())

      .then(responseJson => {
        console.log(responseJson)
        if(responseJson.statusCode==200){
         
          if(responseJson.data.length!==0){
            setData(responseJson.data);

          }
        }



      })


  }
  const ListEmptyComponent=()=>{
    return(
      
        <View style={{justifyContent:'center',alignItems:'center',height:DIMENS.common.WINDOW_HEIGHT}}>
         <Text type='subheading'>No Products found</Text>
         </View>
     
    )
    
  }
  const renderProducts=useCallback(({item})=>{
    
      const name =
      item.product.name.length > 20
        ? item.product.name.substring(0, 20) + '...'
        : item.product.name;
    let convertPrice = item.product.price * price;
    const dp = (convertPrice * item.product.discount) / 100;
    const newPrice = convertPrice - dp;

    return (
      <View style={styles.productContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('productDetails', {
              id: item.product.id,
            })
          }>
          <FastImage
            source={{uri: item.mainImage.replace('~', BASE_URL),
            cache: FastImage.cacheControl.immutable,
          }
            
          }
            resizeMode={FastImage.resizeMode.contain}
            style={{width: '100%', height: 160, borderRadius: 15}}
            
          />
          {user!=null?
           <TouchableOpacity
           style={{
            height: 40,
            width: 40,
            borderRadius: 40 / 2,
            backgroundColor: Colors.colors.primary,
            alignItems:'center',
            justifyContent:'center',
            alignSelf: 'flex-start',
            position:'absolute'
          }}
          onPress={()=>addtoWishlist(item)}
           >
           <Icon name='hearto' type='antdesign'color={Colors.colors.white} onPress={()=>addtoWishlist(item)}/>
           </TouchableOpacity>
       :null}
          
        </TouchableOpacity>
        <TouchableOpacity style={{
            height: 40,
            width: 40,
            borderRadius: 40 / 2,
            backgroundColor: Colors.colors.primary,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
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
        <View
          style={{
            backgroundColor: Colors.colors.white,
            height: 80,
            padding: 2,
          }}>
          <Text type="body" style={{width: 120, fontSize: 15}}>
            {name}
          </Text>
          {item.product.discount > 0 ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                type="caption"
                style={{
                  fontSize: 14,
                  color: Colors.colors.primary,
                  textDecorationLine: 'line-through',
                  padding: 4,
                }}>
                {decode(symbol) + convertPrice.toFixed(2)}
              </Text>
              <Text
                type="caption"
                style={{
                  fontSize: 14,
                  color: Colors.colors.primary,
                  padding: 4,
                }}>
                {decode(symbol) + newPrice.toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text
              type="caption"
              style={{fontSize: 14, color: Colors.colors.primary}}>
              {decode(symbol) + convertPrice.toFixed(2)}
            </Text>
          )}
        </View>
      </View>

    )
  },[offset])
  return (
    <SafeAreaView style={{flex:1}}> 
    <CustomHeader customStyles={styles.svgCurve} />
    <FilterList
      visible={filterOpen}
      onClose={()=>setFilterOpen(false)}
      onSelect={(key)=>filterItems(key)}
    />
      <View style={styles.main}>   
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 4,}}>
          <Icon
            name="arrowleft"
            color={Colors.colors.white}
            size={30}
            type="antdesign"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.searchItem}>
            <TextInput
              value={searchText}
              style={{padding:8,width:'89%'}}
              placeholder={'Search here'}
              onChangeText={text => searchData(text)}
              placeholderTextColor={Colors.colors.gray500}
              onSubmitEditing={()=>setSearchText('')}
            />
            <Icon name="search" color={Colors.colors.gray500} size={20} />
          </View>
          <Icon
            name="shoppingcart"
            type="antdesign"
            size={28}
            color={Colors.colors.white}
            onPress={() => navigation.navigate('CartScreenStack')}
          />
           <Icon
            name="filter-variant"
            type="materialcommunity"
            size={28}
            color={Colors.colors.white}
            onPress={()=>setFilterOpen(true)}
            style={{marginLeft:2}}
          />
        </View>   
        <View style={{paddingBottom:40}}>
        {loading?<Loader loading={loading}/>:null}
         <FlatList
         contentContainerStyle={{marginTop: 5, justifyContent: 'center'}}
         data={data}
         keyExtractor={(id, index) => index.toString()}
         numColumns={2}
         ListEmptyComponent={ListEmptyComponent}
         ListFooterComponent={renderFooter}
         renderItem={renderProducts}
         onEndReached={getData}
         onEndReachedThreshold={0.5}
       />
          
        
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ProductScreen;
const styles = StyleSheet.create({
  main: {
    //flex: 1,
    width: DIMENS.common.WINDOW_WIDTH,
   // height:DIMENS.common.WINDOW_HEIGHT,
    paddingBottom:80,
   
   // backgroundColor: Colors.colors.gray100,
  },
  searchItem: {
    flexDirection: 'row',
   // height: DIMENS.common.WINDOW_HEIGHT*0.05,
    width: '70%',
    borderRadius: 50 / 2,
    backgroundColor: Colors.colors.white,
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    margin: 8,
  },
  productContainer: {
    marginHorizontal: 6,
    shadowColor: '#eeeeee',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    elevation: 1,
    width: '47%',
    marginBottom: 15,
    backgroundColor: Colors.colors.white,
    borderRadius: 10,
    padding: 2,
   
    
    
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
