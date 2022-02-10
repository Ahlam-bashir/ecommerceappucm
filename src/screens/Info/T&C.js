import React from 'react';
import {ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native';
import {View, StyleSheet} from 'react-native';
import {CustomHeader, Text, Icon} from '../../components';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';

const TermsConditions = ({navigation}) => {
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
          Terms and Condtions
        </Text>
      </View>
      <ScrollView  style={{flex:1}}>
        <View style={styles.container}>
          <Text type="heading" style={styles.headerText}>
            Terms and Conditions
          </Text>
          <Text style={styles.bodyText}>
            The website is incorporated by Brisbold FZ LLC
            {'\n\n\n'}
            This page (together with the documents referred to on it) explains
            the terms and conditions on which we supply any of the products and
            services listed on our online store to you. Please read these terms
            and conditions carefully and make sure that you understand them,
            before ordering any Products or Services. You should understand that
            by ordering any of our Products or Services, you agree to be bound
            by these terms and conditions.
            {'\n\n'}
            You should print a copy of these terms and conditions for future
            reference.
          </Text>
          <Text type="heading" style={styles.headerText}>
            How the contract is formed between you and us
          </Text>
          <Text style={styles.bodyText}>
            1: After placing an order, you will receive online notification from
            us acknowledging that we have received your order. Please note that
            this does not mean that your order has been accepted. Your order
            constitutes an offer to us to buy a Product or Service. All orders
            are subject to acceptance by us. The contract between us will only
            be formed when you receive the Products and/or Services (as
            applicable).
            {'\n\n'}
            2: In the case of Products, the Contract will relate only to those
            Products which you receive. A contract for any other Products which
            may have been part of your order will be formed when you receive
            those other Products.
            {'\n\n'}
            3: In the case of Products, the Contract will relate only to those
            Products which you receive. A contract for any other Products which
            may have been part of your order will be formed when you receive
            those other Products.
          </Text>
          <Text type="heading" style={styles.headerText}>
            Your status
          </Text>
          <Text style={styles.bodyText}>
            By placing an order through our site, you warrant that: 
            {'\n\n'}
           1:  You are legally capable of entering into binding contracts 
           {'\n\n'}
           2:You are at least 16 years old and 
           {'\n\n'}
           3:that you are not resident in a country where making
            a payment to our site, in line with these terms and conditions would
            breach any laws in that country.
          </Text>
          <Text type="heading" style={styles.headerText}>
          Delivery of Products
          </Text>
          <Text style={styles.bodyText}>
          In the case of Products, your order will be fulfilled/made ready for receipt (as applicable) within a reasonable time of the date indicated at the time of ordering, unless there are exceptional circumstances.
        
          </Text>
         
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default TermsConditions;
const styles = StyleSheet.create({
  main: {
    flex: 1,
  //  height:DIMENS.common.WINDOW_HEIGHT,
   // paddingBottom:16
   
  },
  customHeader: {
    position: 'absolute',
    width: DIMENS.common.WINDOW_WIDTH,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
   
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
   // height: DIMENS.common.WINDOW_HEIGHT+100,
    //paddingBottom:30
  },
  headerText: {
    color: Colors.colors.primary,
    marginBottom: 14,
    top: 10,
  },
  bodyText: {
    textAlignVertical: 'center',
    textAlign:'justify'
  },
});
