import React, {useRef, useEffect, useState, useCallback} from 'react';
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
import {CustomHeader, Icon, Loader, Text, InputText} from '../../components';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';
import {SliderBox} from 'react-native-image-slider-box';
import banners from './Components/banners';
import {API_URL, BASE_URL} from '../../utils/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadCurrency} from '../../utils/storage';
import {Conversion, roundTo} from '../../utils/validation';
import {decode} from 'html-entities';
import {useDispatch, useSelector} from 'react-redux';
import getCategories from '../../store/actions/homeActions';
import FastImage from 'react-native-fast-image';
import {addToWishlist} from '../../store/actions/wishlistActions';
import {Alert} from 'react-native';

import StringsOfLanguages from '../../constants/StringOfLanguages';
import ArrivalList from './Components/ArrivalList';
import SearchList from './Components/SearchList';
import { EventEmitter } from 'react-native';
import { Dimensions } from 'react-native';
import { Keyboard } from 'react-native';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const cat = useSelector(state => state.home);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [data, setData] = useState(null);
  const [arrival, setArrival] = useState([]);
  const [price, setPrice] = useState(1);
  const [symbol, setSymbol] = useState(decode('&#X0024;'));
  const [superCategories, setSuperCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [focus,setFocus]=useState(false)
  const [searchText, setSearchText] = useState('');
  const [filteredProducts,setFilteredProducts]=useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setonEndReachedCalledDuringMomentum,
  ] = useState(true);
  

  
  const onItemClick = item => {
    navigation.navigate('products', {Id: item.id, s_Id: item.superCategoryId});
  };
  useEffect(() => {
   
    
    navigation.addListener('focus', async () => {
      await AsyncStorage.getItem('user')
        .then(value => JSON.parse(value))
        .then(response => setUser(response));
      await AsyncStorage.getItem('currency')
        .then(value => JSON.parse(value))
        .then(json => {
          console.log(json + 'jsonnnnnnnn');
          if (json !== null) {
            console.log(json + 'inside');
            setPrice(json.conversion_rate);
            //   console.log(
            //     json.time_last_update_utc + ' ' + json.time_next_update_utc,
            //  );
            setSymbol(String.fromCharCode(parseInt(json.target_data.display_symbol, 16)))
       
           // setSymbol('&#X' + json.target_data.display_symbol + ';');
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }, []);
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    dispatch(getCategories());
    if (cat != undefined) {
      setData(cat);
      //  setSlides(cat.slides);
      //  setData(cat.categories);
    }
    return () => {
      setSlides([]);
      setData([]);
    };
  }, [cat]);
  useEffect(() => {
    getData();
    return () => {setArrival([])
      setFilteredProducts([])

    };
  }, []);
  let slidesArray = [];
  slides !== undefined &&
    slides.forEach(slide => {
      slidesArray.push(slide.replace('~', BASE_URL));
    });

  const searchData = text => {
    console.log(text);
    if (text) {
      fetch(API_URL + 'SearchProduct?searchQuery=' + text + '&&page=' + 1)
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          setFilteredProducts(responseJson.data)
          //setArrival(responseJson.data);
          //setSearchText(text);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setArrival(arrival);
      //setSearchText(text);
    }
  };
  const getData = () => {
    console.log(isListEnd);
    console.log(loading);
    if (!loading && !isListEnd) {
      setLoading(true);

      fetch(API_URL + 'CategoryProducts?page=' + offset, {
        method: 'GET',
        //Request Type
      })
        .then(response => response.json())

        .then(responseJson => {
          if (responseJson.statusCode === 200) {
            setLoading(false);
            setRefreshing(false)
            if (responseJson.data.length > 0) {

                           setOffset(offset + 1);
              // After the response increasing the offset
              setArrival([...arrival, ...responseJson.data]);
              //setFilteredProducts([...arrival,...responseJson.data])
              setLoading(false);
            } else {
              setRefreshing(false)
              setIsListEnd(true);
              setLoading(false);
            }
          }

          //Success
        })

        .catch(error => {
          setRefreshing(false)
          //Error
          setLoading(false);
          console.error(error);
        });
    }
  };
  const ListComponentHeader = ({item}) => {
    let slidesArray = [];
    item !== null &&
      item.slides !== undefined &&
      item.slides.forEach(slide => {
        slidesArray.push(slide.replace('~', BASE_URL));
      });

    return (
      <View>
        <SliderBox
          key={slidesArray.id}
          images={slidesArray}
          sliderBoxHeight={140}
          
          resizeMethod={'resize'}
          resizeMode={'contain'}
          autoplay
          onCurrentImagePressed={index => bannerClick(index)}
          dotColor={Colors.colors.primary}
          inactiveDotColor={Colors.colors.gray400}
          ImageComponentStyle={{marginTop: 0}}
          circleLoop
          dotStyle={{
            width: 18,
            height: 5,

            padding: 0,
            margin: 0,
          }}
        />
        <View style={styles.categoryHeading}>
          <Text type="heading" style={{color: Colors.colors.primary}}>
            {StringsOfLanguages.categories}
          </Text>
          {/**<TouchableOpacity onPress={()=>navigation.navigate('products')} style={{...styles.category,minWidth:40,width:70}}>
  <Text type='body' style={{color:Colors.colors.primary}}>See all</Text>
  </TouchableOpacity> **/}
        </View>
        <View style={styles.categoriescontainer}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={DIMENS.common.WINDOW_WIDTH}
            decelerationRate="fast"
            bounces={false}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false}, //
            )}>
            {item !== null &&
              item.categories !== undefined &&
              item.categories.map(slide => {
                let img = slide.categoryImage.replace('~', BASE_URL);
                let name =
                  slide.categoryName.length > 16
                    ? slide.categoryName.substring(0, 16) + '...'
                    : slide.categoryName;

                return (
                  <TouchableOpacity
                    onPress={() => onItemClick(slide)}
                    style={{alignItems: 'center'}}
                    key={slide.id}>
                    <View style={styles.category}>
                      <FastImage
                        source={{uri: img}}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                          // resizeMode: 'contain',
                          height: 80,
                          width: 80,
                          borderRadius: (80 * 80) / 2,
                        }}
                      />
                    </View>

                    <Text type="caption" style={{color: Colors.colors.primary}}>
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </Animated.ScrollView>
        </View>
        <View style={styles.categoryHeading}>
          <Text type="heading" style={{color: Colors.colors.primary}}>
            {StringsOfLanguages.newArrivals}
          </Text>
        </View>
        <FlatList
          nestedScrollEnabled={true}
          data={arrival}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          keyExtractor={(item, index) => item.product.id}
          initialNumToRender={4}
          onMomentumScrollBegin={() => {
            setonEndReachedCalledDuringMomentum(false);
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            top: 8,
            paddingBottom: 40,
          }}
          numColumns={2}
          renderItem={renderArrival}
          onEndReached={({distanceFromEnd}) => {
            if (!onEndReachedCalledDuringMomentum) {
              getData();
              setonEndReachedCalledDuringMomentum(true);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  };
  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {loading ? <ActivityIndicator
           animating={true}
           color={Colors.colors.primary}
           size={'large'}
        /> : null}
      </View>
    );
  };

  const bannerClick = index => {
    if (index === 0) {
     // navigation.navigate('DiscountsScreen');
     // console.log(index);
    }
  };
  const renderArrival = ({item}) => (
    <ArrivalList
      item={item}
      navigation={navigation}
      user={user}
      price={price}
      symbol={symbol}
    />
  );
const openList=()=>{
  setFocus(true)
  
}
const onRefresh = () => {
  //set isRefreshing to true
  setRefreshing(true);
  getData()
//  cartDetails();
  // and set isRefreshing to false at the end of your callApiMethod()
};
const closeList=()=>{
  Keyboard.dismiss()
  setSearchText('')
  setFocus(false)
}
  return (
    <SafeAreaView
    
    >
      <CustomHeader customStyles={styles.svgCurve} />

      <View style={styles.main}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 6,
            //top:-4
          }}>
          <Image
            source={require('../../assets/images/Icon.png')}
            style={{height: 50, width: 100, borderRadius: 5}}
            resizeMode={'contain'}
          />
          <View style={styles.searchItem}>
            <InputText
                onFocus={openList}
               
                placeholder={'What you want to buy'}
                onChangeText={text => {
                 setFocus(true)
                  setSearchText(text)
                 searchData(text);
              }}
              inputStyle={{color:Colors.colors.black}}
              placeholderTextColor={Colors.colors.gray500}
              underlineColorAndroid={Colors.colors.transparent}
              value={searchText}
             
            />
            {focus==true? <Icon name="close" color={Colors.colors.gray500} size={20}  onPress={closeList}/>:
             <Icon name="search" color={Colors.colors.gray500} size={20} />
            }
           
          </View>
        </View>
        {focus==true?(
           <SearchList
           searchProducts={filteredProducts}
           navigation={navigation}
           />
       
        ):(
           <View style={styles.arrivalContainer}>
          <View
            style={{
              paddingBottom: 160,
              flexGrow: 1,
              backgroundColor: Colors.colors.white,
              padding: 10,
            }}>
            <FlatList
              refreshing={refreshing}
              onRefresh={onRefresh}
              data={[data]}
              renderItem={ListComponentHeader}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      )}

       </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.colors.white,
  },
  searchItem: {
    flexDirection: 'row',
    height: 40,
    width: '70%',
    borderRadius: 50 / 2,
    backgroundColor: Colors.colors.white,

    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: Colors.colors.primary,
    marginTop: 3,
    justifyContent: 'space-between',
  },
  categoriescontainer: {
    marginTop: 16,
    flexDirection: 'row',
  },
  /* category:{
        height:40,
        minWidth:140,
        borderRadius:60/2,
        backgroundColor:Colors.colors.transparent,
        borderWidth: 1,
        justifyContent:'center',
        alignItems:'center',
        margin:4,
        borderColor:Colors.colors.primary,
        paddingLeft:10,
        paddingRight:10
    },*/
  category: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.colors.gray200,
    marginRight: 4,
    shadowColor: '#470000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    elevation: 2,
  },

  arrivalContainer: {
    top: 12,
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  categoryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  footer: {
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height:60
  },
});
