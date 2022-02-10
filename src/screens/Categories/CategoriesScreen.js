import React from 'react';
import {useState, useEffect} from 'react';
import { Platform } from 'react-native';
import {SafeAreaView,Image} from 'react-native';
import { UIManager } from 'react-native';
import { ScrollView } from 'react-native';
import { LayoutAnimation } from 'react-native';
import {
  View,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import {CustomHeader, Icon, Text} from '../../components';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';
import {API_URL, BASE_URL} from '../../utils/Config';

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
  const onChange = id=> {
    navigation.navigate('products', {subId: id});
  };
  

  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClickFunction}
        style={styles.header}>
        <Text style={styles.headerText}>{item.categoryName}</Text>
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
        {item.SubCategories.map((item, key) => (
          <TouchableOpacity
            key={key}
            style={styles.content}
            onPress={() => onChange(item.id)}>
            <Text style={styles.text}>{item.subCategoryName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
const CategoriesScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  
  useEffect(async () => {
    await fetch(API_URL + 'Categories', {
      method: 'GET',
      //Request Type
    })
      .then(response => response.json())

      .then(responseJson => {
        console.log('res' + responseJson);
       
          setCategories(responseJson);
       
        //Success
      })

      .catch(error => {
        //Error

        console.error(error);
      });
      categories.push({isExpanded:false})
  }, []);
  
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...categories];

    // If single select is enabled
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );

    setCategories(array);}
  return (
    <SafeAreaView style={styles.main}>
        <CustomHeader customStyles={styles.svgCurve} />
        <Text
          type="heading"
          style={{alignSelf: 'center', color: Colors.colors.white, top: 16}}>
          Categories
        </Text>
      <View style={styles.main}>
      

      

        <View style={{marginTop:20,backgroundColor:Colors.colors.white}}>
        <ScrollView>
              {categories.map((item, key) => (
                <ExpandableComponent
                  key={key}
                  onClickFunction={() => {
                    updateLayout(key);
                  }}
                  item={item}
                  navigation={navigation}
                />
              ))}
            </ScrollView>
       {/*
        <FlatList
            data={categories}
           // numColumns={2}
            contentContainerStyle={{
            //  alignItems: 'center',
             
              //justifyContent: 'space-between',
              top: 20,
            }}
            keyExtractor={(id, index) => index.toString()}
            renderItem={({item}) => {
              let img = item.categoryImage.replace('~', BASE_URL);
              return (
                <TouchableOpacity
                  onPress={() => onItemClick(item)}
                  style={styles.categoryContainer}>
                  <View>
                  <ImageBackground
                      style={styles.image}
                      source={{uri: img}}
                      resizeMode="cover">
                   
                     {/* <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          top: 50,
                          padding:6,
                          width:140,
                          //backgroundColor:Colors.colors.disabledDark,
                          alignSelf:'center'
                        }}:
                        <Text
                          type="heading"
                          style={{color: Colors.colors.white,textAlign:'center'}}>
                          {item.categoryName}
                        </Text>
                        </ImageBackground>
                        
                      </View>
                    
                 
                </TouchableOpacity>
              );
            }}
          />*/}  
        </View>
      </View>
    </SafeAreaView>
  );
};
export default CategoriesScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
 
  },
  searchItem: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    borderRadius: 8,
    backgroundColor: Colors.colors.surface,
    justifyContent: 'space-between',
    padding: 6,
    alignItems: 'center',
  },
  categoryContainer: {
    height: (DIMENS.common.WINDOW_HEIGHT * 1) / 10,
    width: '95%',
   // alignItems: 'center',


    backgroundColor: Colors.colors.white,
    marginBottom: 10,
    borderRadius: 15,
    marginHorizontal: 10,
    shadowOffset:{height:0,width:1},
    shadowColor:Colors.colors.gray200,
    shadowOpacity:3,
    shadowRadius:20,
    marginVertical:8
    
  },
  image: {
    width: '100%',
    height: (DIMENS.common.WINDOW_HEIGHT * 1) / 10,
    borderRadius: 15,
   // resizeMode:'contain'
   
  },
  svgCurve: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
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
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.colors.gray100,
  },
});
