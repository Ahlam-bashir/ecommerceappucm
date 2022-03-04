import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  StyleSheet,
  View,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native';

import {Image} from 'react-native';
import {SocialIcon} from 'react-native-elements';

import {CustomHeader, Icon, Text} from '../../components';
import {DIMENS} from '../../constants';
import StringsOfLanguages from '../../constants/StringOfLanguages';
import Colors from '../../utils/Colors';

// Import required components
const ExpandableComponent = ({item, onClickFunction, navigation}) => {
  
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);
  const onChange = (id, val) => {
    console.log(id);
    switch (id) {
      case 1: {
        navigation.navigate('Guarantee Policy');
        break;
      }
      case 2: {
        navigation.navigate('Privacy Policy');
        break;
      }
      case 3: {
        navigation.navigate('TC');
        break;
      }
      case 4: {
        navigation.navigate('Payment Methods');
        break;
      }
      case 5: {
        navigation.navigate('Shipping Guide');
        break;
      }
    }
  };

  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClickFunction}
        style={styles.header}>
        <Text style={styles.headerText}>{item.category_name}</Text>
        <Icon
          name={'chevron-small-down'}
          size={25}
          color={Colors.colors.primary}
          type="entypo"
        />
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}>
        {/*Content under the header of the Expandable List Item*/}
        {item.subcategory.map((item, key) => (
          <TouchableOpacity
            key={key}
            style={styles.content}
            onPress={() => onChange(item.id, item.val)}>
            <Text type='caption' style={{padding:6}}>{item.val}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const aboutus = ({navigation}) => {
  const [listDataSource, setListDataSource] = useState(CONTENT);
  const [multiSelect, setMultiSelect] = useState(false);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];

    // If single select is enabled
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );

    setListDataSource(array);
  };
  return (
    <SafeAreaView style={{flex:1}}>
      <CustomHeader customStyles={styles.svgCurve} />
      <View style={styles.text}>
          <Text type="subheading" style={styles.heading}>
            About Us
          </Text>
        </View>
    
    
      <View style={styles.main}>
     
     
     

        
        <ScrollView contentContainerStyle={{paddingBottom: 100, flexGrow: 1}}>
          <View style={styles.container}>
            <ScrollView>
              {listDataSource.map((item, key) => (
                <ExpandableComponent
                  key={item.category_name}
                  onClickFunction={() => {
                    updateLayout(key);
                  }}
                  item={item}
                  navigation={navigation}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            bottom: 30,
          }}>
          <Text type="subheading" style={{color: Colors.colors.primary}}>
            Follow us at
          </Text>
          <View style={styles.socialContainer}>
            <SocialIcon
              type="facebook"
              onPress={() => {
                Linking.openURL('https://www.facebook.com/Universal-Craft-Market-100930541843453')
              }}
            />
            <SocialIcon
              type="instagram"
              onPress={() => {
                Linking.openURL('https://www.instagram.com/universalcraftmarket/')
              
              }}
            />
            <SocialIcon
              type="linkedin"
              onPress={() => {
                Linking.openURL('https://www.linkedin.com/company/universal-craft-market/')
              
              }}
            />
          </View>
          <View style={styles.socialContainer}>
            <SocialIcon
              type="pinterest"
              onPress={() => {
                Linking.openURL('https://www.pinterest.com/ucraftmarket/')
              
              }}
            />
            <SocialIcon
              type="youtube"
              onPress={() => {
                Linking.openURL('https://www.youtube.com/channel/UCjNuGbZ-fbP9gyHfW3os41g')
              
              }}
            />
            <SocialIcon
              type="twitter"
              onPress={() => {
                Linking.openURL('https://twitter.com/UniversalCraf10')
              
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default aboutus;
const styles = StyleSheet.create({
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  main: {
    height: DIMENS.common.WINDOW_HEIGHT - 160,
    width: DIMENS.common.WINDOW_WIDTH,
    marginTop:24
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
   // top: 20,
  },
  heading: {
    color: Colors.colors.white,
    alignSelf: 'center',
  },
  textInfo: {
    alignItems: 'center',
    backgroundColor: Colors.colors.white,
    margin: 10,
    borderRadius: 10,
    padding: 16,
    // height:DIMENS.common.WINDOW_HEIGHT,
    top: 50,
  },
  container: {
    flex: 1,
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: Colors.colors.white,
    padding: 20,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DIMENS.common.WINDOW_WIDTH - 60,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  socialContainer: {
    flexDirection: 'row',
  },
});
const CONTENT = [
  {
    isExpanded: false,
    category_name: StringsOfLanguages.ourCompany,
    subcategory: [
      {id: 1, val: "guarantee and return policy"},
      {id: 2, val: "Privacy Policy"},

      {id: 3, val: "Terms and Conditions"},
    ],
  },
  {
    isExpanded: false,
    category_name: StringsOfLanguages.shippingNPayment,
    subcategory: [
      {id: 4, val: StringsOfLanguages.paymentMethods},
      {id: 5, val: StringsOfLanguages.shippingGuide},
      //{id: 6, val: 'Delivery Guide'},
    ],
  },
 /* {
    isExpanded: false,
    category_name: 'Item 3',
    subcategory: [
      {id: 7, val: 'Sub Cat 7'},
      {id: 9, val: 'Sub Cat 9'},
    ],
  },*/
];
