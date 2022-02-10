import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Alert
} from 'react-native';

import {CustomHeader, Icon, Loader, Text, Alert as CustomAlert, InputText} from '../../components';
import Colors from '../../utils/Colors';
import {SliderBox} from 'react-native-image-slider-box';
import ImageViewer from 'react-native-image-zoom-viewer';

import banners from '../Home/Components/banners';
import {DIMENS, TYPOGRAPHY} from '../../constants';

import {API_URL, BASE_URL} from '../../utils/Config';
import {decode} from 'html-entities';
import RenderHTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';
import {SafeAreaView} from 'react-native';
import { Platform } from 'react-native';
import StringsOfLanguages from '../../constants/StringOfLanguages';
import { Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReviewModal from '../../components/picker/ReviewModal';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../../store/actions/wishlistActions';

const ProductDetails = ({navigation, route}) => {
  const dispatch=useDispatch()
  const ProductId = route.params.id;
  console.log(ProductId)
  const {width} = useWindowDimensions();

  const [user, setUser] = useState(null);
  const [price, setPrice] = useState(1);
  const [symbol, setSymbol] = useState(decode('&#X0024;'));
  const [disableDetails, setDisableDetails] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [highligths, setHighlights] = useState(true);
  const [productImages, setproductImages] = useState([]);
  const [similarProducts, setsimilarProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [productRating,setProductRating]=useState([])
  const [reviewVisible,setReviewVisible]=useState(false)
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
 
  const [mainImage, setMainImage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [animation, setAnimation] = useState('');
  const [title, setTitle] = useState('');
  const [btntext1, setbtntext1] = useState('');
  const [btntext2, setbtntext2] = useState('');
  const [ratingsreviews,setratingsreviews]=useState(true)
  const [imageIndex,setImageIndex]=useState(null)
  
  const [zoomerVisible,setZoomerVisible]=useState(false)
  let zommer=[]
  //const entities = new Html5Entities()
  useEffect(async () => {
    await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(async response => setUser(response));
   await AsyncStorage.getItem('currency')
      .then(value => JSON.parse(value))
      .then(json => {
        if (json !== null) {
          setPrice(json.conversion_rate);
          console.log(json);
          setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
        //  setSymbol('&#X' + json.target_data.display_symbol + ';');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  useEffect(async() => {
    setVisible(true);
  await fetch(API_URL + 'Products/' + ProductId, {
      method: 'GET',
      //Request Type
    })
      .then(response => response.json())

      .then(responseJson => {
        console.log(
          'res' + responseJson.data.ProductApiModel.allImages,
        );
        if (responseJson.statusCode === 200) {
          setVisible(false);
          setProductDetails(responseJson.data.ProductApiModel);
          setsimilarProducts(responseJson.data.similarProducts);
          const images = responseJson.data.ProductApiModel.allImages;
          const mainImage = responseJson.data.ProductApiModel.mainImage.replace(
            '~',
            BASE_URL,
          );
          //
          setMainImage(mainImage);
          if (images != null) {
            
            setproductImages([mainImage, ...images]);
            
          } else {
            setproductImages(mainImage);
          }
         
        }
        //Success
      })

      .catch(error => {
        //Error
        setVisible(false);

        console.error(error);
      });
  }, []);
  let images=productImages.map((img)=>{
       return {url:img}
  })
  useEffect(async ()=>{
   await fetch(API_URL + 'ProductRating/' + ProductId, {
      method: 'GET',
      //Request Type
    })
      .then(response => response.json())
      .then(responseJson => { 
        console.log(responseJson.message + "ratings and reviews")
        if (responseJson.statusCode === 0) {
          setVisible(false);
          console.log(responseJson.totalStars+'rattt')
           
             setProductRating(responseJson.data)     
           
        }   
        //Success
      })
      .catch(error => {
        //Error
        setVisible(false);
        console.error(error);
      });
     
  },[ratingsreviews])
  const details = () => {
    if (disableDetails) setDisableDetails(false);
    else if (disableDetails === false) {
      setDisableDetails(true);
    }
  };
  const Highlights = () => {
    if (highligths) setHighlights(false);
    else if (highligths === false) {
      setHighlights(true);
    }
  };
  const ratingreviews = () => {

    if (ratingsreviews) setratingsreviews(false);
    else if (ratingsreviews === false) {
      setratingsreviews(true);
    }
  };
  const addToCart = async () => {
    let existingCart = await AsyncStorage.getItem('products').then(value => {
      return JSON.parse(value);
    });
    const data = {
      userCart: {
        productId: ProductId,
        sellerId: productDetails.product.sellerId,
        price: productDetails.product.price,
        quantity: 1,
        total: '',
        productName: productDetails.product.name,
        agentId: null,
        variationId: 0,
        deliveryTypeId: null,
        isBuynow: false,
      },
      mainImage: mainImage,
    };
    if (user === null) {
      if (existingCart !== null && existingCart.length!==0){
        //console.log(typeof(existingCart))
        let flag=0
        // We have a cart already, now we have to check if any item in cart is the same as our cartItem; existingCart should be kept as an array
        existingCart.forEach((product, index) => {
          if (product.userCart.productId == ProductId ){
            // product.ItemCode == cartItem.ColorCode) {
            // you can modify this condition by your needs
            
                existingCart[index].userCart.quantity += 1
                flag=1
                console.log('added quantity')
                console.log(existingCart[index].userCart.quantity)
           }
            
        });
       if(flag==0){
          // the item doesn't match any items, therefore we add it to the cart
         // console.log(product);
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
      if(Platform.OS=='ios'){
        setAlertVisible(true);
        setTitle(
          'Product added  to Cart',
        );
        setAnimation(
          require('../../assets/images/animations/cartcheckout.json'),
        );
        setbtntext1('View Cart');
      setbtntext2('Continue Shopping');
      }else{
        Alert.alert(
          //title
          'Success',
          //body
          'Product added  to Cart',
          [
            {
              text: 'Continue Shopping',
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
        );
       
      
      }
     
      //alert('Product added to cart');
    } else {
      addCart();
    }
  };
  const addCart = async() => {
    // console.log('hello'+id)
    setVisible(true);
  await  AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(async response => {
        await fetch(API_URL + 'MyCart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' + encode(response.email + ':' + response.password),
          },
          body: JSON.stringify({
            productId: ProductId, //Product Id
            quantity: 1,
            agentId: 0,
            variationId: null,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            //Showing response message coming from server
            console.log(responseJson);
            setVisible(false);
            // alert('Product' + '  ' + responseJson.message + '  ' + 'to Cart');
           
            if(Platform.OS=='ios'){
              setAlertVisible(true);
              setTitle(
                'Product' + '  ' + responseJson.message + '  ' + 'to Cart',
              );
              setAnimation(
                require('../../assets/images/animations/cartcheckout.json'),
              );
               setbtntext1('View Cart');
               setbtntext2('Continue Shopping');
            }else{
              Alert.alert(
                //title
                'Success',
                //body
                'Product' + '  ' + responseJson.message + '  ' + 'to Cart',
                [
                  {
                    text: 'Continue Shopping',
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
              );
             
            
            }
            
            
            // setLoading(false)
          })
          .catch(error => {
            //display error message
            // setLoading(false)
            setVisible(false);
            console.warn(error);
          });
      });
  };
  const buyNow = () => {
    AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response == null) {
          addToCart();
          navigation.navigate('Login Screen', {cart: 'CartScreen'});
        } else {
          addCart();
          navigation.navigate('Payments Screen');
        }
      });
  };
  const addtoWishlist=(item)=>{
    dispatch(addToWishlist(item))
   Alert.alert(
      //title
      'Success',
      //body
      StringsOfLanguages.addedToWishlist,
      
      //clicking out side of alert will not cancel
    );
    
    
    


  }
  const CustomRatingBar = () => {
   
    return (
      <View style={styles.customRatingBarStyle}>
        <Text type='subheading'>Product Rating</Text>
        <View style={{flexDirection:'row',marginTop:8,marginBottom:8}}>
        {maxRating.map((items, key) => {
          return (
            <View   key={items}>   
             {productRating.map((item,key)=>{
                 return (
                   <>
                   <Text>{item.User.firstName}</Text>
                  <Icon
                  size={30}
                  style={styles.starImageStyle}
                  type='antdesign'
                  name={ items <= item.totalStars
                    ? 'star'
                    : 'staro'}
                    color={Colors.colors.success}      
                />
                </>
              
                 )
                
       
    })}
              
              </View>
          );
        })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader customStyles={styles.svgCurve} />
      <ReviewModal
        visible={reviewVisible}
        close={()=>setReviewVisible(!reviewVisible)}
        productId={ProductId}
        user={user}

      />
      
      <CustomAlert
        visible={alertVisible}
        close={() => setAlertVisible(false)}
        title={title}
        animation={animation}
        button1={btntext1}
        button2={btntext2}
        uri={animation}
        btn1Click={() => {
         
          navigation.navigate('CartScreenStack')
          setAlertVisible(false)
        }
         }
        btn2Click={() => {
          navigation.goBack()
          setAlertVisible(false)
        }
         }
      />
        <Modal visible={zoomerVisible} 
  transparent={true} 
  onRequestClose={()=>setZoomerVisible(false)}
  
  

  >
 

    
   <ImageViewer
  
   imageUrls={images}
   index={imageIndex}
   
 // renderIndicator={() => null}
   saveToLocalByLongPress={false}
   onSwipeDown={() => setZoomerVisible(false)}
  //swipeDownThreshold={0.4}
   enableSwipeDown={true}
  enablePreload={true}
  renderHeader={() => (
    <TouchableOpacity style={{padding:4,height:40,alignItems:'center',borderColor: 'white',alignSelf:'center',top:60,}} 
    onPress={()=>setZoomerVisible(false)}
   >
     <Text type='caption' style={{color:Colors.colors.white}}>Swipe down to Close</Text>
    <Icon  name='keyboard-arrow-down' size={20} color={Colors.colors.white}  />
   
  
    </TouchableOpacity>            
   
   )}
  /*renderHeader={(index)=>{
    <TouchableOpacity  key={index} style={{padding:10,height:20,width:40}} onPress={()=>setZoomerVisible(false)}>
    <Icon  name='clear' size={20} color={Colors.colors.white}/>
    </TouchableOpacity>            
   
   
  }}*/
  
  
/>



</Modal>

      <Loader loading={visible} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
        }}>
        <Icon
          name="arrowleft"
          color={Colors.colors.white}
          size={30}
          type="antdesign"
          onPress={() => navigation.goBack()}
        />
        <Text type="subheading" style={{color: Colors.colors.white}}>
          Details
        </Text>
        <Icon
          name="shoppingcart"
          type="antdesign"
          size={30}
          color={Colors.colors.white}
          onPress={() => navigation.navigate('CartScreenStack')}
        />
      </View>
      

      <ScrollView>
        <View style={styles.main}>
          <View>
          {user!=null?
                  <TouchableOpacity
                  style={{
                   height: 50,
                   width: 50,
                   borderRadius: 50 / 2,
                   backgroundColor: Colors.colors.primary,
                   alignItems:'center',
                   justifyContent:'center',
                   alignSelf: 'flex-start',
                   position:'absolute',
                   margin:8,
                   zIndex:1
                //  bottom:-10
                 }}
                 onPress={()=>addtoWishlist(productDetails)}
                  >
                  <Icon name='hearto' type='antdesign'color={Colors.colors.white} size={25}/>
                  </TouchableOpacity>
              :null}
       
            <SliderBox
              images={productImages}
              sliderBoxHeight={450}
              resizeMethod={'resize'}
              resizeMode={'contain'}
             
              onCurrentImagePressed={(index)=>{
                setImageIndex(index)
                setZoomerVisible(true)}}
              dotColor={Colors.colors.primary}
              inactiveDotColor={Colors.colors.gray400}
              
              ImageComponentStyle={{borderRadius: 15, width: '100%'}}
              
              
            />
          
          </View>
        {productDetails!==null?      
         <View
            style={{
              width: '100%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              top: -15,
              borderColor: Colors.colors.black,
              borderLeftWidth: 2,
              borderRightWidth: 2,
              shadowOffset: {width: 1, height: 0},
              shadowRadius: 2,
              shadowOpacity: 0.5,
              shadowColor: Colors.colors.gray100,
            }}>
            <View style={styles.productNameContainer}>
              <Text type="subheading" style={{width: 180}}>
                {productDetails.product.name}
              </Text>
              {productDetails.product.discount > 0 ? (
                <View>
                  
                  <Text
                    type="subheading"
                    style={{textDecorationLine: 'line-through'}}>
                    {decode(symbol) + (productDetails.product.price * price).toFixed(2)}
                  </Text>
                  <Text type="subheading">
                    {' '}
                    {symbol}
                    {(
                      productDetails.product.price * price -
                      (productDetails.product.price * price * productDetails.product.discount) /
                        100
                    ).toFixed(2)}
                  </Text>
                </View>
              ) : (
                <Text type="subheading">
                  {decode(symbol) + (productDetails.product.price * price).toFixed(2)}
                </Text>
              )}
            </View>
            <View style={styles.productNameContainer}>
            <Text type="subheading" >
                Stock Availability
              </Text>
            <Text type="subheading">
                {productDetails.product.stockAvailability}
              </Text>
              </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.colors.gray400,
                top: 10,
              }}
            />
            <View
              style={{
                paddingRight: 8,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 6,
                top: 12,
              }}>
              <Text type="subheading" style={{color: Colors.colors.primary}}>
                Dimensions(L X B X H)
              </Text>
              <Text>{`${productDetails.product.productLength} X ${productDetails.product.productWidth}  X ${productDetails.product.productHeightThickness}`}</Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.colors.gray400,
                marginTop: 24,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                marginTop: 6,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10,
              }}>
              <Text type="subheading" style={{color: Colors.colors.primary}}>
                {StringsOfLanguages.displayHighlights}
              </Text>
              <TouchableOpacity
                onPress={() => Highlights()}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 10,
                  backgroundColor: Colors.colors.gray100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name={highligths ? 'add' : 'remove'}
                  size={20}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
            </View>

            {!highligths ? (
              <View style={{padding: 10}}>
                <RenderHTML
                  contentWidth={width}
                  source={{html: decode(productDetails.product.highlights)}}
                />
              </View>
            ) : null}

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.colors.gray400,
                marginTop: 20,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                marginTop: 6,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10,
              }}>
              <Text type="subheading" style={{color: Colors.colors.primary}}>
                {StringsOfLanguages.displayDescription}
              </Text>
              <TouchableOpacity
                onPress={() => details()}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 10,
                  backgroundColor: Colors.colors.gray100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name={disableDetails ? 'add' : 'remove'}
                  size={20}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
            </View>
            {!disableDetails ? (
              <View style={{alignItems: 'center', padding: 10}}>
                <RenderHTML
                  contentWidth={width}
                  source={{html: decode(productDetails.product.description)}}
                />
              </View>
            ) : null}

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.colors.gray400,
                top: 6,
              }}
            />
             <View
              style={{
                flexDirection: 'row',
                marginTop: 6,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10,
              }}>
              <Text type="subheading" style={{color: Colors.colors.primary}}>
               {StringsOfLanguages.ratingAndReview}
              </Text>
              <TouchableOpacity
                onPress={() => ratingreviews()}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 10,
                  backgroundColor: Colors.colors.gray100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name={ratingsreviews ? 'add' : 'remove'}
                  size={20}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
            </View>

            {!ratingsreviews ? (
             
              
                <View style={{top:0}}>
                  
                

                
                  {productRating?
                  <View style={{width:'95%',margin:8}}>
                    <CustomRatingBar/>
                     </View>      
                :
                <View style={{alignItems:'center',justifyContent:'center',height:40}}>
                <Text type='subheading'>No Ratings yet</Text>
                </View>
                }
                {user!==null?
                    <TouchableOpacity style={{height:40,width:120,backgroundColor:Colors.colors.primary,alignItems:'center',justifyContent:'center',alignSelf:'flex-end',margin:8}} onPress={()=>setReviewVisible(true)}>
                    <Text type='body' style={{color:Colors.colors.white}}>Write a Review</Text>
                    </TouchableOpacity>
                :null}
                
              </View>
            ) : null}

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.colors.gray400,
                marginTop: 20,
              }}
            />


            <View style={{width:'100%'}}>
              <Text
                type="subheading"
                style={{color: Colors.colors.primary, left: 10, top: 8}}>
               Similar Products
              </Text>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{paddingBottom:20,marginTop:16}}
                data={similarProducts}
                keyExtractor={(id, index) => index.toString()}
                renderItem={({item}) => {
                  let name =
                    item.product.name.length > 15
                      ? item.product.name.substring(0, 15) + '...'
                      : item.product.name;
                  let convertPrice = item.product.price * price;
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push('productDetails', {id: item.product.id})
                      }>
                      <View
                        style={{
                          margin: 10,
                          width: 120,
                          height: 180,
                          bottom: 50,
                          top: 5,
                          shadowOffset: {width: 0, height: 1},
                          shadowOpacity: 0.3,
                          shadowRadius: 2,
                          borderRadius: 14,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: Colors.colors.white,
                          elevation: 1,
                        }}>
                        <Image
                          source={{uri: item.mainImage.replace('~', BASE_URL)}}
                          style={{height: 120, width: 120}}
                          resizeMode="contain"
                        />
                        <Text>{name}</Text>
                        <Text type="caption">
                          {decode(symbol) + convertPrice.toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            
            <View>

            </View>
          </View>
   :null}  
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          bottom: 0,
          position: 'absolute',
          backgroundColor: Colors.colors.white,
          width: '100%',
          height: 80,
          marginRight: 20,
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={() => addToCart()}>
          <View
            style={{
              width: 80,
              backgroundColor: Colors.colors.primary,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              marginRight: 12,
            }}>
            <Icon
              name="add-shopping-cart"
              size={20}
              color={Colors.colors.white}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => buyNow()}>
          <View
            style={{
              width: 220,
              backgroundColor: Colors.colors.primary,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
            }}>
            <Text type="caption" style={{color: Colors.colors.white}}>
            {StringsOfLanguages.btnBuyNow}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ProductDetails;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.colors.white,
    paddingBottom: 80,
  },
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: 10,
    padding: 10,
  },
  sizeContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    top: 16,
    left: 10,
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  inputContainer: {
    margin: 8,
    borderWidth: 1,
    height: 80,
    borderRadius:4

  },
  zoomer: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:Colors.colors.transparent,
    marginLeft: 10,
    marginRight: 10,
   // flex: 1,
  // backgroundColor:Colors.colors.warning
   
  },
  customRatingBarStyle: {
    justifyContent: 'center',
   // flexDirection: 'row',
    marginTop: 20,
  },
});
