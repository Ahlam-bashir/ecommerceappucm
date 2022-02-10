import AsyncStorage from '@react-native-async-storage/async-storage'
import { encode } from 'base-64'
import React,{useState} from 'react'
import { useEffect } from 'react'
import { TouchableOpacity,StyleSheet ,View} from 'react-native'
import { Keyboard } from 'react-native'
import { Platform } from 'react-native'
import {SafeAreaView} from 'react-native'
import { CustomHeader, Icon, InputText, Loader, PickerModal, Text } from '../../components'
import { DIMENS, TYPOGRAPHY } from '../../constants'
import { isInvalidCharacters, isNonEmptyString, isPhoneNumberValid, Pincode } from '../../utils'
import Colors from '../../utils/Colors'
import { API_URL } from '../../utils/Config'
import Country from '../../constants/data/country.json'

const UpdateAddresss=({navigation,route})=>{
  const id=route.params.id
  const [countryName, setCountryName] = useState('Select Country');
  const [stateName, setStateName] = useState('Select State');
  const [modalVisible, setModalVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryid, setcountryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [stateid, setdstateId] = useState('');
  const [SearchData, setSearchData] = useState([]);
  const [form, setValues] = useState({
    addressLine1: '',
    incorrectaddressLine1: false,
    loading: false,
    addressLine2: '',
    incorrectaddressLine2: false,
    landmark: '',
    incorrectLandmark: false,
    city: '',
    incorrectCity: false,
    pincode: '',
    incorrectPincode: false,
    mobile: '',
    incorrectMobile: false,
    isDefault:false
  });
  useEffect(async()=>{
    await AsyncStorage.getItem('user')
    .then(txt => JSON.parse(txt))
    .then(async response => {
      await  fetch(
            API_URL + 'Address/'+id,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization:
                  'Basic ' + encode(response.email + ':' + response.password),
              },
              //Request Type
            },
            
          )
            .then(response => response.json())
    
            .then(responseJson => {
              if (responseJson.statusCode === 0) {
                setValues(prevState => ({
                  ...prevState,
                  addressLine1: responseJson.data.addressLine1,
                  addressLine2:responseJson.data.addressLine2,
                  landmark:responseJson.data.landmark,
                  city:responseJson.data.city,
                  pincode:responseJson.data.pincode,
                  mobile:responseJson.data.mobile,
                  isDefault:responseJson.data.isDefault
                  

                }))
                setCountryName(responseJson.data.Country.countryName)
                setStateName(responseJson.data.States.stateName)
                setcountryId(responseJson.data.countryId)
                setdstateId(responseJson.data.stateId)

                 

               
    
              //Success
            }})
    
            .catch(error => {
              //Error
    
              console.error(error);
            });


    })

   


  },[id])
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
  const countryList = () => {
    setModalVisible(true);
    setLoading(false);
    setCountries(Country);
    setSearchData(Country)
    // setLoading(false)
    console.log(countries);
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
        setSearchData(responseJson)
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
  const checkValidation = () => {
    let isValid = true;
    isValid =
      isValid &&
      checkField('addressLine1', 'incorrectaddressLine1', isInvalidCharacters);

    isValid =
      isValid &&
      checkField('addressLine2', 'incorrectaddressLine2', isInvalidCharacters);
    isValid =
      isValid &&
      checkField('addressLine2', 'incorrectaddressLine2', isInvalidCharacters);
    isValid =
      isValid && checkField('landmark', 'incorrectLandmark', isNonEmptyString);
    isValid = isValid && checkField('city', 'incorrectCity', isInvalidCharacters);
    isValid =
      isValid && checkField('pincode', 'incorrectPincode', Pincode);
    isValid = isValid && checkField('mobile', 'incorrectMobile', isPhoneNumberValid);

    return isValid;
  };
  const UpdateAddress = () => {
    Keyboard.dismiss();
    if (!checkValidation()) {
      return;
    }
    setValues(prevState => ({
      ...prevState,
        loading: true,
      
    }))
    AsyncStorage.getItem('user')
      .then(value => JSON.parse(value))
      .then(response => {
        if (response != null) {
          fetch(API_URL + 'Address/'+id, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },
            body: JSON.stringify({
              userId: response.userId,
              addressLine1: form.addressLine1.toString(),
              addressLine2: form.addressLine2.toString(),
              landmark: form.landmark.toString(),
              city: form.city.toString(),
              state_id: stateid,
              country_id: countryid,
              pincode: form.pincode.toString(),
              mobile: form.mobile.toString(),
              isDefault: form.isDefault,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {

              setValues(prevState => ({
                ...prevState,
                  loading: false,
                
              }))
              if(responseJson.statusCode==0){
                alert(responseJson.message)
                
                

              }
              else{
                alert('something went wrong')
              }
              
              // setLoading(false);
              //setAlertVisible(true);

              //Showing response message coming from server
              console.log(responseJson);
            })
            .catch(error => {
              //display error message
              // setLoading(false);
               alert('something went wrong')
              console.warn(error);
            });
        }
      });
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
  

    return(
        <SafeAreaView style={{flex:1}}>
           <CustomHeader customStyles={styles.svgCurve} />
            <View>
           
            <View style={{flexDirection: 'row', alignItems: 'center',width:'100%',padding:4}}>
              <Icon
                name="arrowleft"
                color={Colors.colors.white}
                size={30}
                type="antdesign"
                style={{padding:4}}
                onPress={() => navigation.goBack()}
              />
  
              <Text type="heading" style={styles.text}>
                Update Address
              </Text>
            </View>
           
       
      <PickerModal
        visible={modalVisible}
        onSelect={item => onChange(item)}
        item={countries}
        onClose={() => setModalVisible(false)}
        Search={text => Search(text)}
      />

      <View style={styles.main}>
        <View style={styles.passwordContainer}>
         
          <InputText
            value={form.addressLine1}
            main={{flex: 0, top: 16}}
            keyboardType="email-address"
            label="Address Line 1"
            maxLength={64}
            inputStyle={{color:Colors.colors.black}}
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectaddressLine1 ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                addressLine1: value.trim(),
                incorrectaddressLine1: false,
              }))
            }
            onBlur={() =>
              checkField(
                'addressLine1',
                'incorrectaddressLine1',
                isInvalidCharacters,
              )
            }
          />
          <InputText
           value={form.addressLine2}
            main={{flex: 0, top: 16}}
            inputStyle={{color:Colors.colors.black}}
            keyboardType="email-address"
            label="Address Line 2"
            maxLength={64}
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectaddressLine2 ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                addressLine2: value.trim(),
                incorrectaddressLine2: false,
              }))
            }
            onBlur={() =>
              checkField(
                'addressLine2',
                'incorrectaddressLine2',
                isInvalidCharacters,
              )
            }
          />
          <InputText
          value={form.landmark}
            main={{flex: 0, top: 16}}
            keyboardType="default"
            label="Landmark"
            maxLength={64}
            inputStyle={{color:Colors.colors.black}}
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectLandmark ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                landmark: value.trim(),
                incorrectLandmark: false,
              }))
            }
            onBlur={() =>
              checkField('landmark', 'incorrectLandmark', isInvalidCharacters)
            }
          />
          <InputText
          value={form.city}
            main={{flex: 0, top: 16}}
            keyboardType="email-address"
            maxLength={64}
            inputStyle={{color:Colors.colors.black}}
            label="City"
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectCity ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                city: value.trim(),
                incorrectCity: false,
              }))
            }
            onBlur={() => checkField('city', 'incorrectCity', isInvalidCharacters)}
          />
          <InputText
          value={form.pincode}
            main={{flex: 0, top: 16}}
            keyboardType="number-pad"
            label="Pincode"
            maxLength={6}
            inputStyle={{color:Colors.colors.black}}
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectPincode ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                pincode: value.trim(),
                incorrectPincode: false,
              }))
            }
            onBlur={() =>
              checkField('pincode', 'incorrectPincode', Pincode)
            }
          />
          <InputText
          value={form.mobile}
            main={{flex: 0, top: 16}}
            keyboardType="number-pad"
            inputStyle={{color:Colors.colors.black}}
            label="Mobile"
            maxLength={10}
            labelStyle={TYPOGRAPHY.caption}
            autoCorrect={false}
            containerStyle={
              Platform.OS !== 'android' ? styles.defaultMargin : null
            }
            errorMessage={form.incorrectMobile ? 'Mandatory Field' : ''}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                mobile: value.trim(),
                incorrectMobile: false,
              }))
            }
            onBlur={() => checkField('mobile', 'incorrectMobile', isPhoneNumberValid)}
          />
          <View style={{flexDirection: 'row', top: 16, marginBottom: 18}}>
            <View style={{width: '50%', height: 50, flexDirection: 'column'}}>
              <Text type="body">Country</Text>
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
                  backgroundColor: Colors.colors.primary,
                  marginEnd: 6,
                }}
              />
            </View>
            <View style={{width: '50%', height: 50, flexDirection: 'column'}}>
              <Text>State</Text>
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
                style={{height: 1, backgroundColor: Colors.colors.primary}}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', top: 22,marginBottom:10,alignItems:'center'}}>
              <TouchableOpacity
              style={{margin:4}}
                onPress={() => {
                  if (form.isDefault) {
                    setValues(prevState => ({
                      ...prevState,
                      isDefault: false,
                    }));
                  } else {
                    setValues(prevState => ({
                      ...prevState,
                      isDefault: true,
                    }));
                  }
                }}>
                <Icon
                  name={
                    form.isDefault ? 'check-box' : 'check-box-outline-blank'
                  }
                  size={22}
                  color={Colors.colors.primary}
                />
              </TouchableOpacity>
              <Text type="body">Set as default Address</Text>
            </View>
        

          <TouchableOpacity
            style={styles.checkoutContainer}
            onPress={() => UpdateAddress()}
            >
            <Text
              type="subheading"
              style={{fontSize: 10, color: Colors.colors.white}}>
              Update Address
            </Text>
          </TouchableOpacity>
           
        </View>
        <Loader loading={form.loading} />
      </View>
    

            </View>
        </SafeAreaView>
    )

}
export default UpdateAddresss
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
      color:Colors.colors.white,
      textAlign:'center',
      alignSelf:'center',
      width:'80%'
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
    top: 20,
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
