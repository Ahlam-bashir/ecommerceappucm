import React, {useState} from 'react';
import {ToastAndroid} from 'react-native';
import {
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {CustomHeader, Icon, Loader, PickerModal, Text} from '../../components';
import TextInput from '../../components/inputText/inputText';
import {DIMENS, TYPOGRAPHY} from '../../constants';
import {isEmailValid, isInvalidCharacters, isMinLength, isNameValid, isNonEmptyString, isPhoneNumberValid, Pincode} from '../../utils';
import Colors from '../../utils/Colors';
import Country from '../../constants/data/country.json';
import {API_URL} from '../../utils/Config';
import {Keyboard} from 'react-native';
import StringsOfLanguages from '../../constants/StringOfLanguages';

import {Picker} from '@react-native-picker/picker';
import CountryCodeModal from '../../components/picker/CountryCode';
import CountryCodeModal2 from '../../components/picker/CountryCode';
import { KeyboardAvoidingView } from 'react-native';
import { useRef } from 'react';

const RegisterScreen = ({navigation}) => {
  const [countryName, setCountryName] = useState('Select Country');
  const [stateName, setStateName] = useState('Select State');
  const [modalVisible, setModalVisible] = useState(false);
  const [visible,setVisible]=useState(false)
  const [visible2,setVisible2]=useState(false)
  const [countries, setCountries] = useState([]);
  const [SearchData, setSearchData] = useState([]);
  const [countryid, setcountryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [stateid, setdstateId] = useState('');
  const [code, setCode] = useState('+91');
  const [code2, setCode2] = useState('+91');
  const [countryCodes, setCountryCodes] = useState([]);

  const [form, setValues] = useState({
    firstName: '',
    incorrectFirstName: false,
    firstNameError:'',
    lastname: '',
    incorrectLastName: false,
    lastNameError:'',
    email: '',
    incorrectEmail: false,
    emailErrormessage:'',
    confirmEmail: '',
    incorrectConfirmEmail: false,
    confirmEmailErrormessage:'',
    phoneNumber: '',
    incorrectPhone: false,
    PhoneError: '',
    mobile: '',
    incorrectMobile: false,
    mobileError:'',
    streetName: '',
    incorrectStreetName: false,
    streetError:'',
    buildingName: '',
    incorrectbuildingName: false,
    buildingerror:'',
    city: '',
    incorrectcity: false,
    cityError:'',
    country: '',
    incorrectCountry: false,
    state: '',
    incorrectState: false,
    subscription: '',
    incorrectSubsciption: false,
    pincode: '',
    incorrectPincode: false,
    pincodeError:'',
    isSelected: false,
  });
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const emailInputRef = useRef();
  const confirmEmailInputRef = useRef();
  const phoneInputRef=useRef()
  const mobileInputRef=useRef()
  const streetInputRef=useRef()
  const buildingInputRef=useRef()
  const cityInputRef=useRef()
  const pincode=useRef()
  

  const checkField = (fieldKey, fieldErrorKey, fieldValidater,error) => {
    var regName = /^[a-zA-Z]{2,40}([a-zA-Z]{2,40})+$/;
       if(!isNonEmptyString(form[fieldKey])){
        setValues(prevState => ({
          ...prevState,
          [fieldErrorKey]: true,
          [error]:'Mandatory field'
        }));
        return false;
        
       }
           switch(fieldValidater)
    {
      case isNonEmptyString:
        
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'Mandatory field'
          }));
          return false;
          
       }
      
        return true;
       

      
      case isNameValid:{
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'please enter valid details'
          }));
          return false;
        }
        return true;
       

      }
      case isMinLength:{
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'Minimum two charcters allowed'
          }));
          return false;
        }
        return true;
      

      }
      case isEmailValid:{
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'please enter valid details'
          }));
          return false;
        }
        return true;
       

      }
      case isInvalidCharacters:{
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'please enter valid details'
          }));
          return false;
        }
        return true;
       

      }
      case isPhoneNumberValid:{
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'please enter valid detailss'
          }));
          return false;
        }
        return true;
        

      }
      case Pincode:{
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'please enter valid detailss'
          }));
          return false;
        }
        return true;
        

      }

    }
    

    /*  if(fieldValidater==isNonEmptyString){
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'Mandatory field'
          }));
          return false;
        }
        return true;
      }else if(fieldValidater==isNameValid){
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'please enter valid details'
          }));
          return false;
        }
        return true;

      }else if(fieldValidater==isEmailValid){
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'please enter valid details'
          }));
          return false;
        }
        return true;

      }else if(fieldValidater==isMinLength){
        if (!fieldValidater(form[fieldKey])) {
          setValues(prevState => ({
            ...prevState,
            [fieldErrorKey]: true,
            [error]:'Minimum two charcters allowed'
          }));
          return false;
        }
        return true;

      }
   */
  };
  const checkvalidation = () => {
    let isValid = true;
    isValid =
      isValid &&
      checkField('firstName', 'incorrectFirstName', isNameValid,'firstNameError');
      isValid =
      isValid &&
      checkField('firstName', 'incorrectFirstName', isNonEmptyString,'firstNameError');
      isValid &&
      checkField('firstName', 'incorrectFirstName', isMinLength,'firstNameError');
    isValid =
      isValid && checkField('lastname', 'incorrectLastName', isNameValid,'lastNameError');
      isValid =
      isValid && checkField('lastname', 'incorrectLastName', isMinLength,'lastNameError');
  
    isValid = isValid && checkField('email', 'incorrectEmail', isEmailValid,'emailErrormessage');
    isValid =
      isValid &&
      checkField('confirmEmail', 'incorrectConfirmEmail', isEmailValid,'emailErrormessage');
    isValid =
      isValid &&
      checkField('phoneNumber', 'incorrectPhone', isPhoneNumberValid,'PhoneError');
    isValid =
      isValid && checkField('mobile', 'incorrectMobile', isPhoneNumberValid,'mobileError');
      isValid =
      isValid &&
      checkField('streetName', 'incorrectStreetName', isMinLength,'streetError');
    isValid =
      isValid &&
      checkField('streetName', 'incorrectStreetName', isInvalidCharacters,'streetError');

    isValid =
      isValid &&
      checkField('buildingName', 'incorrectbuildingName', isInvalidCharacters,'buildingerror');
      isValid =
      isValid &&
      checkField('buildingName', 'incorrectbuildingName', isMinLength,'buildingerror');
  
    isValid = isValid && checkField('city', 'incorrectcity', isInvalidCharacters,'cityError');
    isValid = isValid && checkField('city', 'incorrectcity', isMinLength,'cityError');
  
    //  isValid=isValid  &&   checkField('country','incorrectCountry',isNonEmptyString)
    //  isValid=isValid  &&   checkField('state','incorrectState',isNonEmptyString)
    isValid =
      isValid && checkField('pincode', 'incorrectPincode', Pincode,'pincodeError');

    return isValid;
  };
  const onSignup = () => {
    Keyboard.dismiss();
    if (!checkvalidation()) {
      return;
    }
    if (stateName === 'Select State' || countryName === 'Select Country') {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravity(
          'Country or state field is mandatory',
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
      } else {
        alert('Country or state field is mandatory');
      }

      return;
    }
    if (form.email !== form.confirmEmail) {
      if (Platform.OS !== 'ios') {
       
        ToastAndroid.showWithGravity(
          'email and confirm email doesnt match',
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
      } else {
        alert('email and confirm email doesnt match');
      }
      return;
    }
    const datatoSend = {
      firstName: form.firstName.toString(),
      lastName: form.lastname.toString(),
      email: form.email.toString(),
      confirmEmail: form.confirmEmail.toString(),
      phoneNumber: form.phoneNumber.toString(),
      mobile: form.mobile.toString(),
      streetName: form.streetName.toString(),
      buildingName: form.buildingName.toString(),
      city: form.city.toString(),
      country_id: countryid.toString(),
      state_id: stateid.toString(),
      pincode: form.pincode.toString(),
      roleId: '0',
      acceptTc: form.isSelected,
      subscriptionId: '0',
    };
    setLoading(true);
    fetch(API_URL + 'Register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(datatoSend),
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        console.log(responseJson);
        if (responseJson.status) {
          alert(responseJson.status);

          navigation.replace('OTP', {userid: responseJson.data.id});
        } else if (responseJson.ModelState) {
          Object.entries(responseJson.ModelState).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
            if (Object.entries(value).length !== 0) {
              if (Platform.OS !== 'ios') {
                ToastAndroid.showWithGravity(
                  value.toString() + ' ' + 'at' + ' ' + key,
                  ToastAndroid.SHORT, //can be SHORT, LONG
                  ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                );
              } else {
                alert(value.toString() + ' ' + 'at' + ' ' + key);
              }
            return
              
            }
           
          });
          // alert(responseJson.Message)
          //navigation.replace(NAVIGATION_TO_LOGIN_SCREEN)
        } else {
          alert(responseJson.Message);
        }
        //Showing response message coming from server
        console.log(responseJson);
      })
      .catch(error => {
        setLoading(false);
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

    //console.warn('wait')
  };

  const countryList = () => {
    setModalVisible(true);
    setLoading(false);
    setCountries(Country);
    setSearchData(Country);
    // setLoading(false)
    console.log(countries);
  };
  const countryCode= () => {
     setVisible(true)
    setLoading(false);
   setCountryCodes(Country)
   
    // setLoading(false)
   
  };
  const countryCode2= () => {
    setVisible2(true)
   setLoading(false);
  setCountryCodes(Country)
  
   // setLoading(false)
  
 };
  const stateList = () => {
    if (countryid === '') {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravity(
          'Plz select Country first',
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
      } else {
        alert('Select Country first');
      }

      return;
    }
    setModalVisible(true);
    /// setLoading(true)
    fetch(API_URL + 'State?country=' + countryid, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Showing response message coming from server
        console.log(responseJson);
        setCountries(responseJson);
        setSearchData(responseJson);
        console.log(countries);
        // setLoading(false)
      })
      .catch(error => {
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
  const onChange = item => {
    console.log(item);
    setModalVisible(false);
    if (item.countryName) {
      setCountryName(item.countryName);
      setcountryId(item.id);
      setCountries([])
    } else {
      setStateName(item.stateName);
      //  setcountryId(item.countryId)
      setdstateId(item.id);
    }
  };
  const onChangeCode = item => {
   // console.log(item);
    setVisible(false);
    setCode(item.phonecode)
   
      
      //  setcountryId(item.countryId)
      
   
  };
  const onChangeCode2 = item => {
    console.log(item);
    setVisible2(false);
    setCode2(item.phonecode)
   
      
      //  setcountryId(item.countryId)
      
   
  };
  const Search = text => {
    console.log(text);
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = SearchData.filter(function (item) {
        let itemData = '';
        if (item.countryName) {
          itemData = item.countryName
            ? item.countryName.toUpperCase()
            : ''.toUpperCase();
        } else {
          itemData = item.stateName
            ? item.stateName.toUpperCase()
            : ''.toUpperCase();
        }

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setCountries(newData);
      //setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setCountries(SearchData);
      // setSearch(text);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader customStyles={styles.svgCurve} />
      <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 6}}>
        <Icon
          name="arrowleft"
          color={Colors.colors.white}
          size={30}
          type="antdesign"
          onPress={() => navigation.goBack()}
        />
        <Text type="heading" style={styles.headerText}>
          Register
        </Text>
      </View>
      <ScrollView>
        <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : null}
         keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        

        >
        <View style={styles.main}>
          <Loader loading={loading} />

          <PickerModal
            visible={modalVisible}
            onSelect={item => onChange(item)}
            item={countries}
            onClose={() => setModalVisible(false)}
            Search={text => Search(text)}
          />
          <CountryCodeModal
            visible={visible}
            onSelect={item => onChangeCode(item)}
            item={countryCodes}
            onClose={() => setVisible(false)}
           
          />
            <CountryCodeModal2
            visible={visible2}
            onSelect={item => onChangeCode2(item)}
            item={countryCodes}
            onClose={() => setVisible2(false)}
           
          />
        
          <View style={styles.centerView}>
            <View style={styles.fieldContainer}>
              <TextInput
                label={StringsOfLanguages.displayfirstName}
                labelStyle={{fontSize: 12}}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => lastNameInputRef.current.focus()}
                
                maxLength={24} 
                onChangeText={value =>
                   
                  setValues(prevState => ({
                    ...prevState,
                    firstName: value.trim(),
                    incorrectFirstName: false,
                  }))
                }
                containerStyle={
                  Platform.OS !== 'android'
                    ? {...styles.defaultMargin, marginRight: 6}
                    : null
                }
                errorMessage={
                  form.incorrectFirstName ? form.firstNameError : ''
                }
                onBlur={() =>{
                  checkField('firstName','incorrectFirstName',isNonEmptyString,'firstNameError')
                  checkField('firstName','incorrectFirstName',isMinLength,'firstNameError')
                  checkField('firstName','incorrectFirstName',isNameValid,'firstNameError')  
                }
                }
                underlineColorAndroid={Colors.colors.primary}
              />
              <TextInput
                label={StringsOfLanguages.displaylastName}
                labelStyle={TYPOGRAPHY.caption}
                autoCorrect={false}
                maxLength={24} 
                returnKeyType="next"
                assignRef={component=>{lastNameInputRef.current = component}}
                onSubmitEditing={()=>emailInputRef.current.focus()}
                containerStyle={
                  Platform.OS !== 'android' ? styles.defaultMargin : null
                }
                errorMessage={
                  form.incorrectLastName ? form.lastNameError: ''
                }
                onChangeText={value =>
                  setValues(prevState => ({
                    ...prevState,
                    lastname: value.trim(),
                    incorrectLastName: false,
                  }))
                }
                onBlur={() =>{
                  checkField('lastname', 'incorrectLastName', isNameValid,'lastNameError')
                  checkField('lastname', 'incorrectLastName', isNonEmptyString,'lastNameError')
                  checkField('lastname', 'incorrectLastName', isMinLength,'lastNameError')
                }
                }
                underlineColorAndroid={Colors.colors.primary}
              />
            </View>
            <TextInput
              keyboardType="email-address"
              label={StringsOfLanguages.displayEmail}
              labelStyle={TYPOGRAPHY.caption}
              autoCorrect={false}
              returnKeyType="next"
              assignRef={component=>{emailInputRef.current = component}}
              onSubmitEditing={()=>confirmEmailInputRef.current.focus()}
             
              containerStyle={
                Platform.OS !== 'android' ? styles.defaultMargin : null
              }
              errorMessage={
                form.incorrectEmail ? form.emailErrormessage : ''
              }
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  email: value.trim(),
                  incorrectEmail: false,
                }))
              }
              onBlur={() => checkField('email', 'incorrectEmail', isEmailValid,'emailErrormessage')}
              underlineColorAndroid={Colors.colors.primary}
            />
            <TextInput
              keyboardType="email-address"
              label={StringsOfLanguages.displayConfirmEmail}
              labelStyle={TYPOGRAPHY.caption}
              autoCorrect={false}
              returnKeyType="next"
              assignRef={component=>{confirmEmailInputRef.current = component}}
              onSubmitEditing={()=>phoneInputRef.current.focus()}
            
              containerStyle={
                Platform.OS !== 'android' ? styles.defaultMargin : null
              }
              errorMessage={
                form.incorrectConfirmEmail
                  ? form.confirmEmailErrormessage
                  : ''
              }
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  confirmEmail: value.trim(),
                  incorrectConfirmEmail: false,
                }))
              }
              onBlur={() =>{
                checkField(
                  'confirmEmail',
                  'incorrectConfirmEmail',
                  isEmailValid,
                  'confirmEmailErrormessage'
                )
                if(form.email!==''&& form.email!==form.confirmEmail){
                  setValues(prevState => ({
                    ...prevState,
                    incorrectConfirmEmail: true,
                    confirmEmailErrormessage:'email and confirm email should be same'
                  }));

                }
              }
              }
              underlineColorAndroid={Colors.colors.primary}
            />
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{width: '10%', flexDirection: 'column',alignItems:'center',position:'absolute',zIndex:1,marginStart:3}}>
               
                <TouchableOpacity onPress={countryCode}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 25,
                      justifyContent: 'space-between',
                    }}>
                    <Text>{code}</Text>
                    <Icon
                      name="arrow-drop-down"
                      size={25}
                      color={Colors.colors.gray400}
                    />
                  </View>
                </TouchableOpacity>
               
            
             
      </View>
           
            
              <TextInput
                label={StringsOfLanguages.displayPhoneNumber}
                labelStyle={TYPOGRAPHY.caption}
                autoCorrect={false}
                returnKeyType="done"
                assignRef={component=>{phoneInputRef.current = component}}
                onSubmitEditing={()=>mobileInputRef.current.focus()}
              
                keyboardType="number-pad"
                inputStyle={{paddingLeft:50}}
                maxLength={12} 
                containerStyle={
                  (Platform.OS) !== 'android' ? styles.defaultMargin : {marginTop:5,flex:0}

                
                }
                errorMessage={
                  form.incorrectPhone ? form.PhoneError : ''
                }
                onChangeText={value =>
                  setValues(prevState => ({
                    ...prevState,
                    phoneNumber: value.trim(),
                    incorrectPhone: false,
                  }))
                }
                onBlur={() =>
                  checkField(
                    'phoneNumber',
                    'incorrectPhone',
                    isPhoneNumberValid,
                    'PhoneError' 
                  )
                }
                underlineColorAndroid={Colors.colors.primary}
              />
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{width: '10%', flexDirection: 'column',alignItems:'center',position:'absolute',zIndex:1,marginStart:3}}>
               
                <TouchableOpacity onPress={countryCode2}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 25,
                      justifyContent: 'space-between',
                    }}>
                    <Text>{code2}</Text>
                    <Icon
                      name="arrow-drop-down"
                      size={25}
                      color={Colors.colors.gray400}
                    />
                  </View>
                </TouchableOpacity>
               
            
             
      </View>
      <TextInput
              keyboardType="number-pad"
              label={StringsOfLanguages.displayMobile}
              labelStyle={TYPOGRAPHY.caption}
              autoCorrect={false}
              inputStyle={{paddingLeft:50}}
              maxLength={10} 
              returnKeyType="done"
              assignRef={component=>{mobileInputRef.current = component}}
              onSubmitEditing={()=>streetInputRef.current.focus()}
            
               
              containerStyle={
                Platform.OS !== 'android' ? styles.defaultMargin : null
              }
              errorMessage={
                form.incorrectMobile ? form.mobileError : ''
              }
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  mobile: value.trim(),
                  incorrectMobile: false,
                }))
              }
              onBlur={() =>
                checkField('mobile', 'incorrectMobile', isPhoneNumberValid,'mobileError')
              }
              underlineColorAndroid={Colors.colors.primary}
            />
           

      </View>

            <TextInput
              label={StringsOfLanguages.displaystreetName}
              labelStyle={TYPOGRAPHY.caption}
              maxLength={45}
              returnKeyType="next"
              assignRef={component=>{streetInputRef.current = component}}
              onSubmitEditing={()=>buildingInputRef.current.focus()}
            
              autoCorrect={false}
              containerStyle={
                Platform.OS !== 'android' ? styles.defaultMargin : null
              }
              errorMessage={
                form.incorrectStreetName
                  ? form.streetError
                  : ''
              }
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  streetName: value.trim(),
                  incorrectStreetName: false,
                }))
              }
              onBlur={() =>{
                checkField(
                  'streetName',
                  'incorrectStreetName',
                  isNonEmptyString,
                  'streetError'
                )
                checkField(
                  'streetName',
                  'incorrectStreetName',
                  isInvalidCharacters,
                  'streetError'
                )
                checkField(
                  'streetName',
                  'incorrectStreetName',
                   isMinLength,
                  'streetError'
                )
              }
              }
              underlineColorAndroid={Colors.colors.primary}
            />
            <TextInput
              label={StringsOfLanguages.displayBuildingName}
              labelStyle={TYPOGRAPHY.caption}
              autoCorrect={false}
              returnKeyType="next"
              assignRef={component=>{buildingInputRef.current = component}}
              onSubmitEditing={()=>cityInputRef.current.focus()}
            
              maxLength={45}
              containerStyle={
                Platform.OS !== 'android' ? styles.defaultMargin : null
              }
              errorMessage={
                form.incorrectbuildingName
                  ? form.buildingerror
                  : ''
              }
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  buildingName: value.trim(),
                  incorrectbuildingName: false,
                }))
              }
              onBlur={() =>{
                checkField(
                  'buildingName',
                  'incorrectbuildingName',
                  isInvalidCharacters,
                  'buildingerror'
                )
                checkField(
                  'buildingName',
                  'incorrectbuildingName',
                  isMinLength,
                  'buildingerror'
                )
                }  
              }
              underlineColorAndroid={Colors.colors.primary}
            />
            <TextInput
              label={StringsOfLanguages.displayCity}
              labelStyle={TYPOGRAPHY.caption}
              autoCorrect={false}
              returnKeyType="next"
              assignRef={component=>{cityInputRef.current = component}}
              onSubmitEditing={()=>pincode.current.focus()}
            
              maxLength={45}
              containerStyle={
                Platform.OS !== 'android' ? styles.defaultMargin : null
              }
              errorMessage={
                form.incorrectcity ? form.cityError: ''
              }
              onChangeText={value =>
                setValues(prevState => ({
                  ...prevState,
                  city: value.trim(),
                  incorrectcity: false,
                }))
              }
              onBlur={() =>{
                checkField('city', 'incorrectcity', isNonEmptyString,'cityError')
                checkField('city', 'incorrectcity', isMinLength,'cityError')
                checkField('city', 'incorrectcity', isInvalidCharacters,'cityError')
              }
              }
              underlineColorAndroid={Colors.colors.primary}
            />
            <View style={{flexDirection: 'row'}}>
              <TextInput
                keyboardType="number-pad"
                label="Pincode"
                labelStyle={TYPOGRAPHY.caption}
                autoCorrect={false}
                returnKeyType="done"
                assignRef={component=>{pincode.current = component}}
                onSubmitEditing={()=>Keyboard.dismiss()}
             
                maxLength={6} 
                containerStyle={
                  Platform.OS !== 'android' ? styles.defaultMargin : null
                }
                errorMessage={
                  form.incorrectPincode ? form.pincodeError : ''
                }
                onChangeText={value =>
                  setValues(prevState => ({
                    ...prevState,
                    pincode: value.trim(),
                    incorrectPincode: false,
                  }))
                }
                onBlur={() =>
                  checkField('pincode', 'incorrectPincode', Pincode,'pincodeError')
                }
                underlineColorAndroid={Colors.colors.primary}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '50%', height: 50, flexDirection: 'column'}}>
                <Text type="body">{StringsOfLanguages.displayCountry}</Text>
                <TouchableOpacity onPress={countryList}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 40,
                      justifyContent: 'space-between',
                    }}>
                    <Text>{countryName}</Text>
                    <Icon
                      name="arrow-drop-down"
                      size={25}
                      color={Colors.colors.gray400}
                    />
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    height: 1,
                    backgroundColor: Colors.colors.gray500,
                    marginEnd: 6,
                  }}
                />
              </View>
              <View style={{width: '50%', height: 50, flexDirection: 'column'}}>
                <Text>{StringsOfLanguages.displayState}</Text>
                <TouchableOpacity onPress={stateList}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 40,
                      justifyContent: 'space-between',
                    }}>
                    <Text>{stateName}</Text>
                    <Icon
                      name="arrow-drop-down"
                      size={25}
                      color={Colors.colors.gray400}
                    />
                  </View>
                </TouchableOpacity>
                <View
                  style={{height: 1, backgroundColor: Colors.colors.gray500}}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', top: 22}}>
              <TouchableOpacity
                onPress={() => {
                  if (form.isSelected) {
                    setValues(prevState => ({
                      ...prevState,
                      isSelected: false,
                    }));
                  } else {
                    setValues(prevState => ({
                      ...prevState,
                      isSelected: true,
                    }));
                  }
                }}>
                <Icon
                  name={
                    form.isSelected ? 'check-box' : 'check-box-outline-blank'
                  }
                  size={22}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
              <Text type="body">I/We Accept Terms and Conditions</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={onSignup}>
              <Text
                type="subheading"
                style={{fontSize: 10, color: Colors.colors.white}}>
                {StringsOfLanguages.btnRegister}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default RegisterScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 12,
    paddingBottom: 30,
    backgroundColor: Colors.colors.white,
  },
  fieldContainer: {
    // flex:1,
    // padding:6,
    flexDirection: 'row',
    marginTop: 10,
    // backgroundColor: 'red',
    // alignItems:'flex-start'
  },
  headerText: {
    fontSize: 22,
    alignSelf: 'center',
    padding: 10,
    // marginBottom: 10,
    color: Colors.colors.white,
    width: '90%',
    textAlign: 'center',
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
  button: {
    backgroundColor: Colors.colors.primary,
    alignItems: 'center',
    padding: 10,
    marginTop: 32,
    marginBottom: 12,
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
});
