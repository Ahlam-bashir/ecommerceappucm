import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {CustomHeader, Icon, Text,Alert} from '../../components';
import CurrenyList from '../../components/picker/CurrencyList';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';
import Currency from '../../constants/data/currency.json';
import LanguageList from '../../components/picker/languageList';
import StringsOfLanguages from '../../constants/StringOfLanguages';

const MyAccount = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [animation, setAnimation] = useState('');
  const [title, setTitle] = useState('');
  const [btntext1, setbtntext1] = useState('');
  const [btntext2, setbtntext2] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [open,setOpen]=useState(false)
  

  
  useEffect(async () => {
    // console.log(navigation)
    navigation.addListener('focus', async () => {
      await AsyncStorage.getItem('user').then(value => {
        setUser(JSON.parse(value));
    })
   
    });
  }, [user, navigation]);
  const viewScreen = id => {
    console.log(id);

    if (id === 1) {
      if (user !== null) {
        navigation.navigate('OrdersScreen');
      }
    } else if (id === 3) {
      AsyncStorage.removeItem('user');
      navigation.navigate('HomeScreenStack');
    }
  };
  const signOUt = () => {
   
    setAlertVisible(true);
    setTitle(
      'Are u sure?',
    );
    setAnimation(
      require('../../assets/images/animations/60896-line-logout-icon-animations.json'),
    );
    setbtntext1('Yes');
    setbtntext2('No');
    
    
  };
  const CurrencyList = () => {
    setVisible(true);
    setCurrencyData(Currency);
  };
  const onChangeCurrency =async (item) => {
    console.log(item);
    setVisible(false);
    if (item.code !== '') {
     await fetch(
        'https://v6.exchangerate-api.com/v6/ea700af3fe0bdb8f9a17fd5a/enriched/USD/' +
          item.code,
        {},
      )
        .then(response => response.json())
        .then(async responseJson => {
          console.log(responseJson)
          //Showing response message coming from server
          console.log(
            responseJson.time_last_update_utc +
              ' ' +
              responseJson.time_next_update_utc,
          );
        await  AsyncStorage.setItem('currency', JSON.stringify(responseJson));
          // CodePush.restartApp()
          // alert(responseJson.message)
          // setLoading(false)
        })
        .catch(error => {
          //display error message
          // setLoading(false)

          console.warn(error);
        });
    }
  };
  const changeLanguage=()=>{
    setOpen(true)
  }
  return (
    <ScrollView style={{backgroundColor:Colors.colors.white}}>
    <View style={styles.main}>
      <CustomHeader customStyles={styles.svgCurve} />
      <Alert
        visible={alertVisible}
        close={() => setAlertVisible(false)}
        title={title}
        animation={animation}
        button1={btntext1}
        button2={btntext2}
        uri={animation}
        btn1Click={() => {
          setAlertVisible(false)
          AsyncStorage.removeItem('user');
          navigation.navigate('HomeScreenStack')}}
        btn2Click={() =>setAlertVisible(false)}
      />
      <CurrenyList
        visible={visible}
        item={currencyData}
        onClose={() => setVisible(false)}
        onSelect={item => onChangeCurrency(item)}
      />
      <LanguageList
        visible={open}
       // item={currencyData}
        onClose={() => setOpen(false)}
       // onSelect={item => onChangeCurrency(item)}
      />
      
      <View style={styles.text}>
        <Text type="subheading" style={styles.heading}>
          My Account
        </Text>
      </View>
     

      <View style={styles.circleContainer}>
      <View style={{alignItems:'center'}}>
        <Icon
        name='user'
        type='evilicon'
        size={100}
        color={Colors.colors.primary}
        />
        <Text type='heading' style={{color:Colors.colors.primary}}>{user!==null?user.name:null}</Text>
        

      </View>
        {user == null ? (
          <TouchableOpacity onPress={() => navigation.replace('Login Screen')}>
            <View style={styles.list}>
              <Icon
                name={'log-in'}
                size={25}
                color={Colors.colors.primary}
                type='feather'
              />
              <Text type="subheading">SignIn</Text>
              <Icon
                name={'chevron-small-right'}
                size={25}
                color={Colors.colors.primary}
                type="entypo"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={signOUt}>
            <View style={styles.list}>
              <Icon
                name={'log-out'}
                size={25}
                color={Colors.colors.primary}
                type='feather'
              />
              <Text type="subheading">{StringsOfLanguages.SignOut}</Text>
              <Icon
                name={'chevron-small-right'}
                size={25}
                color={Colors.colors.primary}
                type="entypo"
              />
            </View>
          </TouchableOpacity>
        )}
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={CurrencyList}>
            <View style={styles.list}>
              <Icon name={'currency-cny'} size={25} color={Colors.colors.primary} type='materialcommunity'/>
              <Text type="subheading">{StringsOfLanguages.ChangeCurrency}</Text>
              <Icon
                name={'chevron-small-right'}
                size={25}
                color={Colors.colors.primary}
                type="entypo"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={changeLanguage}>
            <View style={styles.list}>
              <Icon name={'language'} size={25} color={Colors.colors.primary} />
              <Text type="subheading">{StringsOfLanguages.ChangeLanguage}</Text>
              <Icon
                name={'chevron-small-right'}
                size={25}
                color={Colors.colors.primary}
                type="entypo"
              />
            </View>
          </TouchableOpacity>
        </View>
        {user !== null ? (
          <>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('OrdersScreen')}>
                <View style={styles.list}>
                  <Icon
                    name={'page-previous-outline'}
                    size={25}
                    type='materialcommunity'
                    color={Colors.colors.primary}
                  />
                  <Text type="subheading">{StringsOfLanguages.myOrders}</Text>
                  <Icon
                    name={'chevron-small-right'}
                    size={25}
                    color={Colors.colors.primary}
                    type="entypo"
                  />
                </View>
              </TouchableOpacity>
            </View>
          {/* 
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Change Password')}>
                <View style={styles.list}>
                  <Icon
                    name={'language'}
                    size={25}
                    color={Colors.colors.primary}
                  />
                  <Text type="subheading">Change Password</Text>
                  <Icon
                    name={'chevron-small-right'}
                    size={25}
                    color={Colors.colors.primary}
                    type="entypo"
                  />
                </View>
              </TouchableOpacity>
            </View>
         
          */}
          
           
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('MyAddresses')}>
                <View style={styles.list}>
                  <Icon
                    name={'relative-scale'}
                    type='materialcommunity'
                    size={25}
                    color={Colors.colors.primary}
                  />
                  <Text type="subheading">My Addresses</Text>
                  <Icon
                    name={'chevron-small-right'}
                    size={25}
                    
                    color={Colors.colors.primary}
                    type="entypo"
                  />
                </View>
              </TouchableOpacity>
            </View>
             
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Wishlist')}>
                <View style={styles.list}>
                  <Icon
                    name={'hearto'}
                    size={25}
                    color={Colors.colors.primary}
                    type='antdesign'
                  />
                  <Text type="subheading">{StringsOfLanguages.MyWishlist}</Text>
                  <Icon
                    name={'chevron-small-right'}
                    size={25}
                    color={Colors.colors.primary}
                    type="entypo"
                  />
                </View>
              </TouchableOpacity>
            </View>
            
            
          </>
        ) : (
          <></>
        )}
      </View>
    </View>
    </ScrollView>
  );
};
export default MyAccount;
const styles = StyleSheet.create({
  main: {
   flex: 1,
    backgroundColor: Colors.colors.white,
    padding: 10,
    width: DIMENS.common.WINDOW_WIDTH,
  },
  circleContainer: {
    alignItems: 'center',

    justifyContent: 'center',
    marginTop: 100,
  },
  circle: {
    height: 200,
    width: 200,
    borderRadius: 200 / 2,
    backgroundColor: Colors.colors.primary,
  },
  list: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 15,
    height: 80,
    backgroundColor: Colors.colors.white,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    elevation: 5,
    padding: 22,
    marginTop: 22,
    width: '90%',
    shadowColor: Colors.colors.gray600,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 40,
  },
  heading: {
    color: Colors.colors.white,
    alignSelf: 'center',
  },
});
