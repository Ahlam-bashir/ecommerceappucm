import React from 'react'
import {StyleSheet,TouchableOpacity} from 'react-native'
import getIconType from './helpers/getIconTypes'
import PropTypes from 'prop-types'
import { Text } from '..'
import { DIMENS } from '../../constants'
import Colors from '../../utils/Colors'
//import {colors} from '../../utils/Colors'
export const IconType=[
    'zocial',
    'octicon',
    'material',
    'material-community',
    'ionicon',
    'foundation',
    'evilicon',
    'entypo',
    'font-awesome',
    'font-awesome-5',
    'fontisto',
    'simple-line-icon',
    'feather',
    'antdesign',
    'materialcommunity',
    

]
const propType ={
    name:PropTypes.string,
    type:PropTypes.oneOf(IconType),
    size:PropTypes.number,
    color:PropTypes.string,
    onPress:PropTypes.func,
    disabled:PropTypes.bool,
    style:Text.propTypes.style
};
const defaultProps={
    name:'',
    type:'material',
    onPress:null,
    disabled:false,
    color:null,
    style:{},
    size:DIMENS.common.iconSize
}
const Icon = ({name,type,size,color,onPress,disabled,style})=>{
    const Component = onPress ?TouchableOpacity:React.Fragment
    const IconComponent = getIconType(type)
    return(
        <Component
        {...(onPress && {
            onPress,
            disabled,
          })}
        >
            <IconComponent
            size={size}
            name={name}
            color={
                disabled?Colors.colors.disabledDark:color||Colors.colors.icon
            }
            style={StyleSheet.flatten([styles.iconStyle,style])}
            />
        </Component>

    )
}
const styles=StyleSheet.create({
    iconStyle:{
        backgroundColor:'transparent'
    }
})
Icon.propTypes=propType
Icon.defaultProps=defaultProps
export default Icon
