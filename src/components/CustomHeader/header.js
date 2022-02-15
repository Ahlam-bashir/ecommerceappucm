import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../utils/Colors';
export default function header({ customStyles }) {
    return (
      <View style={customStyles}>
        <View style={{ backgroundColor: Colors.appbar.statusBarColor, height: 100}}/>
          
       
      </View>
    );
  }
  