import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ToastAndroid,
  Platform,
} from 'react-native';
import {DIMENS, TYPOGRAPHY} from '../../constants';
import {CustomHeader, Icon, InputText, Loader, Text} from '../../components';
import Colors from '../../utils/Colors';
import {isEmailValid, isNonEmptyString} from '../../utils';
import {API_URL} from '../../utils/Config';
import {SafeAreaView} from 'react-native';
import { RNToasty } from 'react-native-toasty';

const ForgetPassword = ({navigation}) => {
  const [form, setValues] = useState({
    email: '',
    incorrectEmail: false,
    loading: false,
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
  const checkvalidation = () => {
    let isValid = true;
    isValid = isValid && checkField('email', 'incorrectEmail', isEmailValid)
   
    return isValid;
  };

  const resetPassword = () => {
    if(!checkvalidation()){
      return
    }
    const datatoSend = {
      username: form.email.toString(),
    };
    setValues(prevState => ({
      ...prevState,
      loading: true,
    }));
    fetch(API_URL + 'ForgotPassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(datatoSend),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === 'Invalid OTP') {
          setValues(prevState => ({
            ...prevState,
            loading: false,
          }));
        
            RNToasty.Error({
              title:responseJson.status,
              position:'center'
            })
           
         
        } else if(responseJson.status==500) {
          setValues(prevState => ({
            ...prevState,
            loading: false,
          }));
          RNToasty.Error({
            title:responseJson.extra + '  ' + 'to your registered email',
            position:'center',
            
            
          })
          
         
        }else{
          setValues(prevState => ({
            ...prevState,
            loading: false,
          }));
          RNToasty.Success({
            title:responseJson.extra + '  ' + 'to your registered email',
            position:'center',
            
            
          },5000)
          
          navigation.replace('Login Screen');
        }

        //Showing response message coming from server
        console.log(JSON.stringify(responseJson));
      })
      .catch(error => {
        setValues(prevState => ({
          ...prevState,
          loading: false,
        }));
        ToastAndroid.showWithGravity(
          error.toString(),
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );

        //display error message
        console.warn(error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader customStyles={styles.svgCurve} />
      <View></View>

      <View style={styles.main}>
        <View style={styles.passwordContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center',top:-10}}>
            <Icon
              name="arrowleft"
              color={Colors.colors.white}
              size={30}
              type="antdesign"
              onPress={() => navigation.goBack()}
            />

            <Text type="heading" style={styles.text}>
              Reset Password
            </Text>
          </View>
          <InputText
            main={{flex: 0, top: 12}}
            keyboardType="email-address"
            label="Email"
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectEmail ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                email: value.trim(),
                incorrectEmail: false,
              }))
            }
            onBlur={() => checkField('email', 'incorrectEmail', isEmailValid)}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              top: 16,
            }}></View>
          <TouchableOpacity style={styles.button} onPress={resetPassword}>
            <Text
              type="subheading"
              style={{fontSize: 10, color: Colors.colors.white}}>
              Reset Link
            </Text>
          </TouchableOpacity>
        </View>
        <Loader loading={form.loading} />
      </View>
    </SafeAreaView>
  );
};
export default ForgetPassword;
const styles = StyleSheet.create({
  main: {
    flex: 1,

    //  backgroundColor:Colors.colors.white,
  },
  passwordContainer: {
  //  backgroundColor: Colors.colors.white,
    padding: 16,
    marginBottom: 10,
    height: DIMENS.common.WINDOW_HEIGHT,
  },
  text: {
    paddingVertical: 10,
    paddingBottom: 12,
    marginLeft: 16,
    color:Colors.colors.white,
    width:'80%',
    textAlign:'center'
  
  },
  button: {
    backgroundColor: Colors.colors.primary,
    //width:'100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    top: 28,
  },
  defaultMargin: {
    marginTop: 0,
    borderBottomWidth: 1,
    height: 30,
    marginBottom: 12,

    //backgroundColor: 'red',
    //width:'100%'

    // paddingStart: 10,
    // paddingEnd:10,
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
});
