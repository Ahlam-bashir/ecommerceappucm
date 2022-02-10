import React from 'react';
import {ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native';
import {View, StyleSheet} from 'react-native';
import {CustomHeader, Text, Icon} from '../../components';
import {DIMENS} from '../../constants';
import Colors from '../../utils/Colors';

const PrivacyPolicy = ({navigation}) => {
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
          Privacy Policy
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text type="heading" style={styles.headerText}>
            Privacy Policy
          </Text>
          <Text style={styles.bodyText}>
            Universal Craft Market operates and manages ucraftmarket.com, its
            applications and software’s including its subsidiaries. This
            document informs you of our policies regarding the collection, use
            and disclosure of Personal Information we receive from users across
            our platform. We use your Personal Information only for improving
            the customer service and experience. By using our platform, you
            agree to the collection and use of information in accordance with
            this policy.
          </Text>
          <Text type="heading" style={styles.headerText}>
            Information Collection And Use
          </Text>
          <Text style={styles.bodyText}>
            We may ask you to provide us with certain personally identifiable
            information that can be used to contact or identify you. Personally,
            identifiable information may include, but is not limited to your
            name, age, gender, and location.
          </Text>
          <Text type="heading" style={styles.headerText}>
            Log Data
          </Text>
          <Text style={styles.bodyText}>
            We collect information that your browser sends whenever you visit
            our website and applications. This Log Data may include information
            such as your computer's IP address, browser type, browser version,
            the pages of our website that you visit, the time and date of your
            visit, the time spent on those pages and other similar statistics.
            In addition, we may use third party services such as Google
            Analytics that collect, monitor, and analyse this data.
          </Text>
          <Text type="heading" style={styles.headerText}>
            Cookies
          </Text>
          <Text style={styles.bodyText}>
            HTTP cookies or internet cookies, are small piece of data built
            specifically for Internet web browsers to track, personalize, and
            save information about each user's session. Cookies are sent to your
            browser from a website and stored on your computer's physical
            storage device like hard drive. We use cookies to collect
            information. You can instruct your browser to refuse all cookies or
            to indicate when a cookie is being sent. However, if you do not
            accept cookies, you may not be able to use some portions of our
            Site.
          </Text>
          <Text type="heading" style={styles.headerText}>
            Security
          </Text>
          <Text style={styles.bodyText}>
            The security of your data is of top priority and importance to us.
            Despite all the security measures we have to remember that no method
            of transmission over the Internet, or method of storing data on the
            physical storage device or media is 100% secure. While we strive to
            use commercially acceptable means to protect your data, we cannot
            guarantee it with absolute security.
          </Text>
          <Text type="heading" style={styles.headerText}>
            Changes To This Privacy Policy
          </Text>
          <Text style={styles.bodyText}>
            This Privacy Policy is effective as of 01-01-2020 and will remain in
            effect except with respect to any changes in its provisions in the
            future, which will be in effect immediately after being posted on
            our website. We reserve the right to update or change our Privacy
            Policy at any time and you should check this Privacy Policy
            periodically. Your continued use of the Service after we post any
            modifications to the Privacy Policy on this page will constitute
            your acknowledgment of the modifications and your consent to abide
            and be bound by the modified Privacy Policy. If we make any material
            changes to this Privacy Policy, we will notify you either through
            the email address you have provided us or by placing a prominent
            notice on our website.
          </Text>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
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
    paddingBottom: 60,
    backgroundColor: Colors.colors.white,
    //height:DIMENS.common.WINDOW_HEIGHT
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
