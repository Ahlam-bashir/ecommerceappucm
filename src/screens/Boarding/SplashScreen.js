import React from 'react';
import {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text} from '../../components';
import Colors from '../../utils/Colors';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen

      navigation.replace('TabStack');
    }, 3000);
  }, []);
  return (
    <View style={styles.main}>
      <Image
        source={require('../../assets/images/logoWhite.png')}
        style={{width: '50%', resizeMode: 'contain', margin: 30}}
      />
      <View style={{position: 'absolute', bottom: 50}}>
        <Text type="heading" style={{color: Colors.colors.white}}>
          Best Buy For Your Buck
        </Text>
      </View>
    </View>
  );
};
export default SplashScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.colors.primary,
  },
});
