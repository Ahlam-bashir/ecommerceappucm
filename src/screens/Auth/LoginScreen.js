import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from 'react-native';

import {Alert, CustomHeader, Icon, InputText, Loader, Text} from '../../components';
import {DIMENS, TYPOGRAPHY} from '../../constants';
import {isEmailValid, isNonEmptyString, isPasswordValid} from '../../utils';
import Colors from '../../utils/Colors';
import {API_URL} from '../../utils/Config';
import {encode} from 'base-64';
import {element} from 'prop-types';
import StringsOfLanguages from '../../constants/StringOfLanguages';
import { RNToasty } from 'react-native-toasty';

const LoginScreen = ({navigation, route}) => {
  const [indicator, setIndicator] = useState(false);
  const [flag, setFlag] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [animation, setAnimation] = useState('');
  const [title, setTitle] = useState('');
  const [btntext1, setbtntext1] = useState('');
  const [btntext2, setbtntext2] = useState('');
  const [hidden,setHidden]=useState(true)
  // const params=route.params.login
  // console.log(route.params)
  const [form, setValues] = useState({
    email: '',
    incorrectEmail: false,
    password: '',
    incorrectPassword: false,
  });
  const checkField = (fieldKey, fieldErrorKey, fieldValidater) => {
    if (!fieldValidater(form[fieldKey])) {
      setValues(prevState => ({
        ...prevState,
        [fieldErrorKey]: true,
      }));
      return false;
    }
    return true;
  };
  useEffect(() => {
    console.log(route);
    if (route.params !== undefined) {
      setFlag(1);
    } else {
      setFlag(0);
    }
  }, []);
  const checkvalidation = () => {
    let isValid = true;
    isValid = isValid && checkField('email', 'incorrectEmail', isEmailValid);
    isValid =
      isValid && checkField('password', 'incorrectPassword', isNonEmptyString);
    return isValid;
  };
  const addToCart = async data => {
    console.log('hello' + data);

    await AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response !== null) {
          fetch(API_URL + 'MyCart', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },
            body: JSON.stringify({
              productId: data.userCart.productId, //Product Id
              quantity: data.userCart.quantity,
              agentId: 0,
              variationId: null,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              //Showing response message coming from server
              console.log(responseJson);
              // alert(responseJson.message)
              // setLoading(false)
            })
            .catch(error => {
              //display error message
              // setLoading(false)

              console.warn(error);
            });
        }
      });
  };

  const login =  () => {
    Keyboard.dismiss();
    if (!checkvalidation()) {
      return;
    }
    const datatoSend = {
      email: form.email.toString(),
      password: form.password.toString(),
    };
    setIndicator(true);

    fetch(API_URL + 'UserLogin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datatoSend),
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson.data+'login');
        if (responseJson.message === 'loggedIn') {
          setIndicator(false);
        await  AsyncStorage.setItem('user', JSON.stringify({
            email: form.email.toString(),
            password: form.password.toString(),
            userId:responseJson.data.id,
            name:responseJson.data.firstName +  '  ' +  responseJson.data.lastName

          }));
          //  if(params=='loginScreen'){
        await  AsyncStorage.getItem('products')
            .then(value => JSON.parse(value))
            .then(response => {
              if (response !== null) {
                console.log(response);
                response.map(element => {
                  addToCart(element);
                });
               AsyncStorage.removeItem('products');
              }
            });
          if (flag == 0) {
            
              
              
             
           
          
            RNToasty.Success({
              title:'Logged in Sucessfully',
              position:'bottom'
            })
            
              navigation.replace('TabStack');
            
           
           
            
          } else {
            navigation.replace('Payments Screen');
          }

          //   }else{
          //    navigation.navigate('Payments Screen')
          //   }
        } else {
          setIndicator(false);
            if(Platform.OS=='ios'){
              
              setAlertVisible(true)
              setAnimation(require('../../assets/images/animations/60896-line-logout-icon-animations.json'),
              )
              setTitle(responseJson.Message)
              setbtntext1('Try Again')

            }else{
              setIndicator(false);
              RNToasty.Error({
                title:responseJson.Message,
                position:'bottom'
              })
                  //  alert(responseJson.Message);
            }
         
        
        }
      })
      .catch(error => {
        setIndicator(false);
        console.error(error);
      });
  };
  return (
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
        btn1Click={() => setAlertVisible(false)}
       
        btn2Click={() =>setAlertVisible(false)}
       
      />
      <View style={styles.centerView}>
        <View style={styles.authBox}>
          <Loader loading={indicator} />
          <View style={styles.logoBox}>
            <Image
              style={{resizeMode: 'cover', width: 100, height: 100}}
              source={require('../../assets/images/ucm_logo.jpg')}
            />
          </View>
          <Text type="heading">{StringsOfLanguages.btnLogin}</Text>
          <View  style={{minHeight:'30%'}}>
            <InputText
              main={{flex:0,marginTop:8}}
              keyboardType="email-address"
              label={StringsOfLanguages.displayEmail}
              placeholderTextColor={Colors.colors.gray400}
              
              labelStyle={TYPOGRAPHY.caption}
              autoCorrect={false}
              containerStyle={
                Platform.OS !== 'android'
                  ? styles.inputContainer
                  : {marginTop: 0}
              }
              errorMessage={
                form.incorrectEmail ? 'Invalid Email' : ''
              }
              inputStyle={{color:Colors.colors.black}}
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  email: value.trim(),
                  incorrectEmail: false,
                }))
              }
              onBlur={() => checkField('email', 'incorrectEmail', isEmailValid)}
            />
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
               <InputText
                 main={{flex:1,marginTop:8}}
              label={StringsOfLanguages.displayPassword}
              labelStyle={TYPOGRAPHY.caption}
              autoCorrect={false}
              contextMenuHidden={true}
              secureTextEntry={hidden}
              inputStyle={{color:Colors.colors.black}}
              containerStyle={
                Platform.OS !== 'android'
                  ? styles.inputContainer
                  : {marginTop: 0}
              }
              errorMessage={
                form.incorrectPassword ? 'Password should not be blank' : ''
              }
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  password: value.trim(),
                  incorrectPassword: false,
                }))
              }
              onBlur={() =>
                checkField('password', 'incorrectPassword', isPasswordValid)
              }
            />
            <TouchableOpacity   onPress={()=>hidden?setHidden(false):setHidden(true)}  style={{right:16,position:'absolute'}}  >
            <Icon
            type='feather'
            name={hidden?'eye-off':'eye'}
            color={Colors.colors.primary}
           
            />
            </TouchableOpacity>
            </View>
           

          </View>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 40,
              backgroundColor: Colors.colors.primary,
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={login}>
            <Text
              type="subheading"
              style={{
                color: Colors.colors.white,
                padding: 5,
                alignSelf: 'center',
              }}>
              {StringsOfLanguages.btnLogin}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: 0.5,
                width: '40%',
                backgroundColor: Colors.colors.gray400,
              }}
            />
            <Text
              type="subheading"
              style={{
                alignSelf: 'center',
                color: Colors.colors.gray500,
                fontSize: 12,
              }}>
              OR
            </Text>
            <View
              style={{
                height: 0.5,
                width: '40%',
                backgroundColor: Colors.colors.gray400,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              type="subheading"
              style={{color: Colors.colors.black, fontSize: 10}}>
              Dont have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register Screen')}>
              <Text
                type="subheading"
                style={{
                  color: Colors.colors.primary,
                  fontSize: 10,
                  paddingHorizontal: 2,
                }}>
                {StringsOfLanguages.registerHere}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              type="subheading"
              style={{color: Colors.colors.black, fontSize: 10}}>
              {StringsOfLanguages.forgotPassword}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgetPassword Screen')}>
              <Text
                type="subheading"
                style={{
                  color: Colors.colors.primary,
                  fontSize: 10,
                  paddingHorizontal: 2,
                }}>
                Reset Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default LoginScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.colors.white,
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  bigCircle: {
    width: DIMENS.common.WINDOW_WIDTH * 0.7,
    height: DIMENS.common.WINDOW_HEIGHT * 0.7,
    backgroundColor: Colors.colors.primary,
    position: 'absolute',
    right: DIMENS.common.WINDOW_WIDTH * 0.25,
    top: -50,
    left: -30,
    borderRadius: 1000,
  },
  centerView: {
    width: '100%',
    top: '16%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authBox: {
    width: '80%',
    backgroundColor: Colors.colors.white,
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: Colors.colors.white,
    borderRadius: 1000,
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    top: -50,
    marginBottom: -50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  inputContainer: {
    marginTop: 0,
    borderBottomWidth: 1,
    height: 30,
  },
});
