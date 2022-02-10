import React from 'react';
import { TextInput as InputComponent ,View,StyleSheet,ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'

import Text from '../Text/text'
import {DIMENS,SPACING} from '../../constants'
import  {isNonEmptyString} from '../../utils'
import Colors from '../../utils/Colors';
const propTypes ={
  /**  container style that wrappers entire text Imput */
  main:ViewPropTypes.style,
  containerStyle:ViewPropTypes.style,
  inputStyle:Text.propTypes.style,
  disabled:PropTypes.bool,
  label:PropTypes.string,
  labelStyle:Text.propTypes.style,
  errorMessage:PropTypes.string,
  placeholderTextColor:PropTypes.string,
  assignRef:PropTypes.func,
  

}
const defaultProps = {
  main:{},
  containerStyle: {},
  inputStyle: {},
  disabled: false,
  label: '',
  labelStyle: {},
  errorMessage: '',
  leftIcon: null,
  rightIcon: null,
  placeholderTextColor: '',
  assignRef: () => {}, 
};
const TextInput=({main,containerStyle,inputStyle,disabled,label,labelStyle,errorMessage,placeholderTextColor,assignRef,...props})=>{
    return(
      <View style={[styles.container,main]}>
      {isNonEmptyString(label) && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
       <View
        style={StyleSheet.flatten([
          styles.inputContainer(disabled),
          containerStyle,
        ])}>
          <InputComponent
          placeholderTextColor={placeholderTextColor || Colors.colors.gray400}
          underlineColorAndroid={Colors.colors.gray500}
          editable={!disabled}
          style={[
             
            styles.input,
            disabled && styles.disabledInput,
            inputStyle,
          ]}
          
          ref={component => assignRef && assignRef(component)}
          {...props}
        />
         {isNonEmptyString(errorMessage) && (
         <Text type='body' style={styles.error}>{errorMessage}</Text>
      )}

        </View>
        </View>   
        
        )
}
TextInput.propTypes = propTypes;

TextInput.defaultProps = defaultProps;
export default TextInput
const styles= StyleSheet.create({
  label:{
    

   
  },
  inputContainer: (disabled) => ({

    //flexDirection: 'row',
    backgroundColor: Colors.colors.surface,
   //  width:'100%',
  //  borderWidth: DIMENS.common.borderWidth,
   // borderRadius: DIMENS.common.borderRadius,
    //alignItems: 'center',
    borderColor: disabled ? Colors.colors.disabledDark : Colors.colors.primary,
    minHeight: DIMENS.common.textInputHeight,
  }),
  input: {
     backgroundColor: 'transparent',
     paddingVertical: SPACING.small,
     paddingHorizontal: SPACING.tiny,
  //  flex: 1,
  },
  disabledInput: {
    color: Colors.colors.disabled,
  },
  error: {
    color:Colors.colors.error,
    marginBottom: SPACING.tiny,
    alignSelf: 'flex-end',
    fontSize:10,

    
  },
  container:{
    flex: 1,


  }

})

