import React from 'react';
import {ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native';
import {View, StyleSheet} from 'react-native';
import {CustomHeader, Text, Icon} from '../../../components';
import {DIMENS} from '../../../constants';
import Colors from '../../../utils/Colors';

const PaymentMethods = ({navigation}) => {
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
          Payment Methods
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text type="heading" style={styles.headerText}>
            Accepted Payment Methods
          </Text>
          <Text style={styles.bodyText}>
            At Universal Craft Market we accept varieties of payment methods
            such as credit and debit cards, COD (cash on delivery) and digital
            payment methods (such as Google Pay, Apple Pay, PayPal). In credit
            cards we accept - Visa, Mastercard, Discover, American Express,
            Diners Club, and JCB. Note In some circumstances, you might be
            limited to use Visa and Mastercard credit cards. In such cases, the
            checkout process will make it clear and will let you add the default
            payment method.
          </Text>
          <Text type="heading" style={styles.headerText}>
            Secure Payment
          </Text>
          <Text style={styles.bodyText}>
            All payments made to us are secure and follow SSL and PCI DSS
            compliance. Using Visa/Mastercard/PayPal SSL: All of our
            transactions are secured with SSL protocol. Using SSL helps to
            encrypt the data and information so that the card details and all
            other sensitive data is protected.
            {'\n\n\n'}
            PCI: The Payment Card Industry Data Security Standards (PCI DSS)
            provide guidelines for merchants that tell them what needs to be
            done in order to secure sensitive data in payment processing.
            {'\n\n\n'}
            Note: We never store or save any card information on our website.
          </Text>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default PaymentMethods;
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
    //marginTop: 50,
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
