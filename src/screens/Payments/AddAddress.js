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
import {
  CustomHeader,
  Icon,
  InputText,
  Loader,
  Text,
  PickerModal,
} from '../../components';
import Colors from '../../utils/Colors';
import {isEmailValid, isNonEmptyString} from '../../utils';
import {API_URL} from '../../utils/Config';
import {SafeAreaView} from 'react-native';
import Country from '../../constants/data/country.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';

const AddAddress = ({navigation}) => {
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
      checkField('addressLine1', 'incorrectaddressLine1', isNonEmptyString);

    isValid =
      isValid &&
      checkField('addressLine2', 'incorrectaddressLine2', isNonEmptyString);
    isValid =
      isValid &&
      checkField('addressLine2', 'incorrectaddressLine2', isNonEmptyString);
    isValid =
      isValid && checkField('landmark', 'incorrectLandmark', isNonEmptyString);
    isValid = isValid && checkField('city', 'incorrectCity', isNonEmptyString);
    isValid =
      isValid && checkField('pincode', 'incorrectPincode', isNonEmptyString);
    isValid = isValid && checkField('mobile', 'incorrectMobile', isNonEmptyString);

    return isValid;
  };
  const AddAddress = () => {
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
          fetch(API_URL + 'Address', {
            method: 'POST',
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
              isDefault: false,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {

              setValues(prevState => ({
                ...prevState,
                  loading: false,
                
              }))
              if(responseJson.message=="added"){
                alert("address added sucessfully")
                
                

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
  

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader customStyles={styles.svgCurve} />
      <PickerModal
        visible={modalVisible}
        onSelect={item => onChange(item)}
        item={countries}
        onClose={() => setModalVisible(false)}
        Search={text => Search(text)}
      />

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
              Add Address
            </Text>
          </View>
          <InputText
            main={{flex: 0, top: 16}}
            keyboardType="email-address"
            label="Address Line 1"
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
                isNonEmptyString,
              )
            }
          />
          <InputText
            main={{flex: 0, top: 16}}
            inputStyle={{color:Colors.colors.black}}
            keyboardType="email-address"
            label="Address Line 2"
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
                isNonEmptyString,
              )
            }
          />
          <InputText
            main={{flex: 0, top: 16}}
            keyboardType="default"
            label="Landmark"
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
              checkField('landmark', 'incorrectLandmark', isNonEmptyString)
            }
          />
          <InputText
            main={{flex: 0, top: 16}}
            keyboardType="email-address"
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
            onBlur={() => checkField('city', 'incorrectCity', isNonEmptyString)}
          />
          <InputText
            main={{flex: 0, top: 16}}
            keyboardType="number-pad"
            label="Pincode"
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
              checkField('pincode', 'incorrectPincode', isNonEmptyString)
            }
          />
          <InputText
            main={{flex: 0, top: 16}}
            keyboardType="number-pad"
            inputStyle={{color:Colors.colors.black}}
            label="Mobile"
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
            onBlur={() => checkField('mobile', 'incorrectMobile', isNonEmptyString)}
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

          <TouchableOpacity
            style={styles.checkoutContainer}
            onPress={() => AddAddress()}>
            <Text
              type="subheading"
              style={{fontSize: 10, color: Colors.colors.white}}>
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
        <Loader loading={form.loading} />
      </View>
    </SafeAreaView>
  );
};
export default AddAddress;
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
