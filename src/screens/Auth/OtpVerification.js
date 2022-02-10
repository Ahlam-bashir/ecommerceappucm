import React, {useState, useEffect} from 'react';
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

const OtpVerification = ({navigation, route}) => {
  const userid = route.params.userid;
  console.log(userid);
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
    isValid = isValid && checkField('email', 'incorrectEmail', isNonEmptyString);
    return isValid;
   
  };
  const otpVerify = () => {
    if(!checkvalidation()){
      return
    }
    const datatoSend = {
      userId: userid,
      otp: parseInt(form.email),
    };
    setValues(prevState => ({
      ...prevState,
      loading: true,
    }));
    fetch(API_URL + 'VerifyMobile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(datatoSend),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'Invalid OTP') {
          setValues(prevState => ({
            ...prevState,
            loading: false,
          }));
          if (Platform.OS !== 'ios') {
            ToastAndroid.showWithGravity(
              responseJson.status,
              ToastAndroid.SHORT, //can be SHORT, LONG
              ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
            );
          } else {
            alert(responseJson.status);
          }
        } else {
          setValues(prevState => ({
            ...prevState,
            loading: false,
          }));
          alert(responseJson.status);
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
  const resendOtp = () => {
    setValues(prevState => ({
      ...prevState,
      loading: true,
    }));
    fetch(API_URL + 'ResendOTP?userId=' + userid, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setValues(prevState => ({
          ...prevState,
          loading: false,
        }));
        if (Platform.OS !== 'ios') {
          ToastAndroid.showWithGravity(
            responseJson.status,
            ToastAndroid.SHORT, //can be SHORT, LONG
            ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
          );
        } else {
          alert(responseJson.status);
        }

        //Showing response message coming from server
        console.log(JSON.stringify(responseJson));
      })
      .catch(error => {
        setValues(prevState => ({
          ...prevState,
          loading: false,
        }));
        if (Platform.OS !== 'ios') {
          ToastAndroid.showWithGravity(
            error.toString(),
            ToastAndroid.SHORT, //can be SHORT, LONG
            ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
          );
        } else {
          alert(error.toString());
        }

        //display error message
        console.warn(error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader customStyles={styles.svgCurve} />
      <View style={{flexDirection:'row',width:'100%',padding:8}}>
        <Icon
          name="arrowleft"
          color={Colors.colors.white}
          size={26}
          type="antdesign"
          onPress={() => navigation.goBack()}
        />
        <Text type="subheading" style={{color:Colors.colors.white,textAlign:'center',width:'80%'}}>Otp Verification</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.passwordContainer}>
          <Text type="heading" style={styles.text}>
            Enter Otp to Verify your Mobile number
          </Text>
          <InputText
            main={{flex: 0, top: 12}}
            keyboardType="number-pad"
            maxLength={6}
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
            onBlur={() => checkField('email', 'incorrectEmail', isNonEmptyString)}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              top: 16,
            }}>
            <Text type="body" style={{fontSize: 10}}>
              Didn't Reciever an Otp?{' '}
            </Text>
            <TouchableOpacity onPress={resendOtp}>
              <Text
                type="body"
                style={{fontSize: 10, color: Colors.colors.primary}}>
                Resend Otp
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={otpVerify}>
            <Text
              type="subheading"
              style={{fontSize: 10, color: Colors.colors.white}}>
              Verify Otp
            </Text>
          </TouchableOpacity>
        </View>
        <Loader loading={form.loading} />
      </View>
    </SafeAreaView>
  );
};
export default OtpVerification;
const styles = StyleSheet.create({
  main: {
    flex: 1,

    //  backgroundColor:Colors.colors.white,
  },
  passwordContainer: {
    
    backgroundColor: Colors.colors.white,
    padding: 16,
    marginBottom: 10,
    height: '100%',
  },
  text: {
    paddingVertical: 10,
    paddingBottom: 12,
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
