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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';

const ChangePassword = ({navigation}) => {
  const [form, setValues] = useState({
    oldPassword: '',
    incorrectoldPassword: false,
    loading: false,
    newPassword: '',
    incorrectPassword: false,
    confirmPassword: '',
    incorrectConfirmPassword: false,
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
    isValid =
      isValid &&
      checkField('oldPassword', 'incorrectoldPassword', isNonEmptyString);
    isValid =
      isValid &&
      checkField('newPassword', 'incorrectPassword', isNonEmptyString);
    isValid =
      isValid &&
      checkField(
        'confirmPassword',
        'incorrectConfirmPassword',
        isNonEmptyString,
      );
    return isValid;
  };
  const changePassword = async () => {
    if (!checkvalidation) {
      return;
    }
    if (form.oldPassword == form.newPassword) {
      alert('your old password matches your new password');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert('new password and confirm password doesnot match');
      return;
    }
   setValues(prevState => ({
      ...prevState,
      loading: true,
    }));
    const datatoSend = {
      "oldPassword": form.oldPassword,
      "newPassword": form.newPassword,
      "confirmPassword": form.confirmPassword,
    };
  //  console.log(
  //    form.oldPassword + '  ' + form.newPassword + ' ' + form.confirmPassword,
   // );
    await AsyncStorage.getItem('user')
      .then(txt => JSON.parse(txt))
      .then(response => {
        console.log(response.password)
        fetch(API_URL + 'ChangePassword', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization:
              'Basic ' + encode(response.email + ':' + response.password),
          },

          body: JSON.stringify(datatoSend),
        })
          .then(response => response.json())
          .then(responseJson => {
            setValues(prevState => ({
              ...prevState ,          
              loading: false,
            }));
            console.log(JSON.stringify(datatoSend)+ ' inside api method')
            console.log(responseJson);
            alert(responseJson.status);

            //Showing response message coming from server
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
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader customStyles={styles.svgCurve} />
      <View></View>

      <View style={styles.main}>
        <View style={styles.passwordContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="arrowleft"
              color={Colors.colors.black}
              size={30}
              type="antdesign"
              onPress={() => navigation.goBack()}
            />

            <Text type="heading" style={styles.text}>
              Change Password
            </Text>
          </View>
          <InputText
            main={{flex: 0, top: 12}}
            keyboardType="email-address"
            label="Old Password"
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectoldPassword ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                oldPassword: value.trim(),
                incorrectoldPassword: false,
              }))
            }
            onBlur={() =>
              checkField(
                'oldPassword',
                'incorrectoldPassword',
                isNonEmptyString,
              )
            }
          />
          <InputText
            main={{flex: 0, top: 12}}
            keyboardType="email-address"
            label="New Password"
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectPassword ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                newPassword: value.trim(),
                incorrectPassword: false,
              }))
            }
            onBlur={() =>
              checkField('newPassword', 'incorrectPassword', isNonEmptyString)
            }
          />
          <InputText
            main={{flex: 0, top: 12}}
            keyboardType="default"
            label="Confirm Password"
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={
              form.incorrectConfirmPassword ? 'Mandatory Field' : ''
            }
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                confirmPassword: value.trim(),
                incorrectConfirmPassword: false,
              }))
            }
            onBlur={() =>
              checkField(
                'confirmPassword',
                'incorrectConfirmPassword',
                isNonEmptyString,
              )
            }
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              top: 16,
            }}></View>
          <TouchableOpacity
            style={styles.checkoutContainer}
            onPress={changePassword}>
            <Text
              type="subheading"
              style={{fontSize: 10, color: Colors.colors.white}}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
        <Loader loading={form.loading} />
      </View>
    </SafeAreaView>
  );
};
export default ChangePassword;
const styles = StyleSheet.create({
  main: {
    flex: 1,

    //  backgroundColor:Colors.colors.white,
  },
  passwordContainer: {
    backgroundColor: Colors.colors.white,
    padding: 16,
    marginBottom: 10,
    height: DIMENS.common.WINDOW_HEIGHT,
  },
  text: {
    paddingVertical: 10,
    paddingBottom: 12,
    marginLeft: 16,
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
  checkoutContainer: {
    backgroundColor: Colors.colors.primary,
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignSelf: 'center',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
