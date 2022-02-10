import React from 'react';
import {ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native';
import {View, StyleSheet} from 'react-native';
import {CustomHeader, Text, Icon} from '../../../components';
import {DIMENS} from '../../../constants';
import Colors from '../../../utils/Colors';

const ShippingGuide = ({navigation}) => {
  return (
    <SafeAreaView style={styles.main}>
        <CustomHeader customStyles={styles.customHeader} />
    
    <View style={styles.main}>
      <View style={styles.header}>
        <Icon
          name="arrowleft"
          color={Colors.colors.white}
          size={30}
          type="antdesign"
          onPress={() => navigation.goBack()}
        />

        <Text type="subheading" style={styles.text}>
          Shipping Policy
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text type="heading" style={styles.headerText}>
            Shipping Guide
          </Text>
          <Text style={styles.bodyText}>
            Our company viz. Universal Craft Market operates cross the globe and
            has diverse mode of products listed The company provides primarily
            two modes of shipping i.e. listed as below:{' '}
          </Text>
          <Text type="heading" style={styles.headerText}>
            Normal Delivery:
          </Text>
          <Text style={styles.bodyText}>
            This method makes the use of the local post operators to make sure
            the product is shipped and delivered to the customer in a specific
            period of time. The time can vary between 7 days to 14 days maximum.{' '}
          </Text>
          <Text type="heading" style={styles.headerText}>
            Priority Delivery:
          </Text>
          <Text style={styles.bodyText}>
            This method makes the use of premium courier services wherein the
            product shipping and delivery are expedited and this method provides
            accurate tracking and requires the customer signature at the time of
            package arrival.
          </Text>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default ShippingGuide;
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  customHeader: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
   // marginTop: 50,
    padding: 8,
  },
  text: {
    color: Colors.colors.white,

    width: (DIMENS.common.WINDOW_WIDTH * 8) / 10,
    textAlign: 'center',
  },
  container: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: Colors.colors.white,
    height: DIMENS.common.WINDOW_HEIGHT,
  },
  headerText: {
    color: Colors.colors.primary,
    marginBottom: 14,
    top: 10,
  },
  bodyText: {
    textAlign: 'justify',
  },
});
