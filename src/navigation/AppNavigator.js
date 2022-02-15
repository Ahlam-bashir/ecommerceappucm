import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import CartScreen from '../screens/cart/CartScreen';
import {Icon} from '../components';
import Colors from '../utils/Colors';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import ProductScreen from '../screens/Products/ProductsScreen';
import ProductDetails from '../screens/Products/ProductDetails';
import PaymentScreen from '../screens/Payments/PaymentScreen';
import {SafeAreaView, StatusBar} from 'react-native';
import MyAccount from '../screens/Account/MyAccount';
import OrdersScreen from '../screens/Orders/OrdersScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import OrderDetails from '../screens/Orders/OrderDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/Auth/LoginScreen';
import Checkout from '../screens/Checkout/Checkout';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpVerification from '../screens/Auth/OtpVerification';
import SplashScreen from '../screens/Boarding/SplashScreen';
import aboutus from '../screens/Info/aboutus';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import ChangePassword from '../screens/Auth/ChangePassword';
import AddAddress from '../screens/Payments/AddAddress';
import GuaranteePolicy from '../screens/Info/GuaranteePolicy';
import PrivacyPolicy from '../screens/Info/PrivacyPolicy';
import TermsConditions from '../screens/Info/T&C';
import DeliveryGuide from '../screens/Info/PaymentMehods/DeliveryGuide';
import PaymentMethod from '../screens/Info/PaymentMehods/PaymentMethod';
import ShippingGuide from '../screens/Info/PaymentMehods/ShippingGuide';
import wishlist from '../screens/Wishlist/wishlist';
import {useState} from 'react';
import { useSelector } from 'react-redux';
import DiscountsScreen from '../screens/Products/DiscountsScreen';
import PaypalScreen from '../screens/Payments/PaypalScreen';
import MyAddresses from '../screens/Account/Addresses/MyAddresses';
import UpdateAddresss from '../screens/Auth/UpdateAddress';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreenStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Home Page'}}
      />
    </Stack.Navigator>
  );
}
function CartScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{title: 'Home Page'}}
      />
    </Stack.Navigator>
  );
}
function CategoriesScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Categories Screen"
        component={CategoriesScreen}
        options={{title: 'Categories'}}
      />
    </Stack.Navigator>
  );
}
function AccountScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Account Screen"
        component={MyAccount}
        options={{title: 'My Account'}}
      />
    </Stack.Navigator>
  );
}
function InfoScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="About Us"
        component={aboutus}
        options={{title: 'About us'}}
      />
    </Stack.Navigator>
  );
}
function WishScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="wishlist"
        component={wishlist}
        options={{title: 'WishList'}}
      />
    </Stack.Navigator>
  );
}

const TabScreenStack = () => {
  const carts=useSelector(state => state.cart.cartItems.length)
  
  const [user, setUser] = useState('');
  AsyncStorage.getItem('user')
    .then(value => JSON.stringify(value))
    .then(response => {
      console.log('user' + response);
      setUser(response);
    });
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => {
          let iconName;
          const color = focused ? Colors.colors.primary : Colors.colors.gray200;
          if (route.name === 'HomeScreenStack') {
            iconName = 'home';
          } else if (route.name === 'CategoriesScreenStack') {
            iconName = 'bars';
          } else if (route.name === 'CartScreenStack') {
            iconName = 'shoppingcart';
          } else if (route.name === 'AccountScreenStack') {
            iconName = 'user';
          } else if (route.name === 'InfoScreenStack') {
            iconName = 'infocirlceo';
          } 
          return (
            <Icon name={iconName} size={23} color={color} type="antdesign" />
          );
        },
      })}
      barStyle={{
        backgroundColor: Colors.colors.primary,
        height: 50,
        justifyContent: 'center',
      }}
      activeColor={Colors.colors.primary}
      inactiveColor={Colors.colors.gray200}>
      <Tab.Screen
        name="HomeScreenStack"
        component={HomeScreenStack}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {color: Colors.colors.primary},
        }}
      />
      <Tab.Screen
        name="CartScreenStack"
        component={CartScreenStack}
        options={{
          tabBarLabel: 'Cart',
           tabBarBadge:  carts,
        }}
      />
      <Tab.Screen
        name="CategoriesScreenStack"
        component={CategoriesScreenStack}
        options={{
          tabBarLabel: 'Categories',
        }}
      />
      <Tab.Screen
        name="AccountScreenStack"
        component={AccountScreenStack}
        options={{
          tabBarLabel: 'My Account',
        }}
      />
      <Tab.Screen
        name="InfoScreenStack"
        component={InfoScreenStack}
        options={{
          tabBarLabel: 'Info',
        }}
      />
      
    </Tab.Navigator>
  );
};
const AboutScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}></Stack.Navigator>
  );
};

const AppNavigator = () => {
  
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={Colors.appbar.statusBarColor} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={'SplashScreen'}>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            // Hiding header for Splash Screen
            options={{headerShown: false}}
          />
          <Stack.Screen name="TabStack" component={TabScreenStack} />
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
          <Stack.Screen
            name="products"
            component={ProductScreen}
            options={{title: 'Product'}}
          />
          <Stack.Screen
            name="productDetails"
            component={ProductDetails}
            options={{title: 'Product Details'}}
          />
          <Stack.Screen
            name="Payments Screen"
            component={PaymentScreen}
            options={{title: 'Payments'}}
          />
          <Stack.Screen
            name="Order Details"
            component={OrderDetails}
            options={{title: 'OrderDetails'}}
          />
          <Stack.Screen
            name="Login Screen"
            component={LoginScreen}
            options={{title: 'LoginScreen'}}
          />
          <Stack.Screen
            name="Checkout Screen"
            component={Checkout}
            options={{title: 'Checkout Screen'}}
          />
          <Stack.Screen
            name="Register Screen"
            component={RegisterScreen}
            options={{title: 'Register Screen'}}
          />
          <Stack.Screen
            name="OTP"
            component={OtpVerification}
            options={{title: 'OTP Screen'}}
          />
          <Stack.Screen
            name="ForgetPassword Screen"
            component={ForgetPassword}
            options={{title: 'Forget Password'}}
          />
          <Stack.Screen
            name="Change Password"
            component={ChangePassword}
            options={{title: 'Change Password'}}
          />
          <Stack.Screen
            name="Add Address"
            component={AddAddress}
            options={{title: 'Add Address'}}
          />

          <Stack.Screen
            name="Guarantee Policy"
            component={GuaranteePolicy}
            options={{title: 'Guarantee Policy'}}
          />
          <Stack.Screen
            name="Privacy Policy"
            component={PrivacyPolicy}
            options={{title: 'Privacy Policy'}}
          />
          <Stack.Screen
            name="TC"
            component={TermsConditions}
            options={{title: 'Terms and Conditions'}}
          />
          <Stack.Screen
            name="Delivery Guide"
            component={DeliveryGuide}
            options={{title: 'Delivery Guide'}}
          />
          <Stack.Screen
            name="Payment Methods"
            component={PaymentMethod}
            options={{title: 'Payment Methods'}}
          />
          <Stack.Screen
            name="Shipping Guide"
            component={ShippingGuide}
            options={{title: 'Shipping Guide'}}
          />
           <Stack.Screen
            name="Wishlist"
            component={wishlist}
            options={{title: 'My Wishlist'}}
          />
          <Stack.Screen
            name="DiscountsScreen"
            component={DiscountsScreen}
            options={{title: 'Discounts'}}
          />
          <Stack.Screen
            name="PaypalScreen"
            component={PaypalScreen}
            options={{title: 'Paypal payment'}}
          />
          <Stack.Screen
            name="MyAddresses"
            component={MyAddresses}
            options={{title: 'My Addresses'}}
          />
          <Stack.Screen
            name="UpdateAddress"
            component={UpdateAddresss}
            options={{title: 'Update Address'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default AppNavigator;
