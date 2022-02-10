import React from 'react'
import { FlatList ,View,StyleSheet} from 'react-native'
import { Text } from '../../../components'
import FastImage from 'react-native-fast-image';
import { BASE_URL } from '../../../utils/Config';
import Colors from '../../../utils/Colors';
import { TouchableOpacity } from 'react-native';


const SearchList=(props)=>{
    const {searchProducts,navigation} =props
    
    return(
        <FlatList
         data={searchProducts}
         contentContainerStyle={{justifyContent:'center',paddingBottom:90}}
         keyExtractor={(item,index)=>index.toString()}
         renderItem={({item})=>{
            let imagePath = item.mainImage.replace('~', BASE_URL);
            const name =
            item.product.name.length > 20
              ? item.product.name.substring(0, 20) + '...'
              : item.product.name;
             return(
                 <View style={styles.main}>
                   <TouchableOpacity style={styles.container} onPress={() =>
                 navigation.navigate('productDetails', {
                 id: item.product.id,
          })}>
                    
                     <FastImage
                     resizeMode={FastImage.resizeMode.contain}
                 style={{
              //resizeMode: 'contain',
                     height: 60,
                     width:80,
                     marginRight:8
                  }}
                    source={{uri: imagePath,
                cache:FastImage.cacheControl.immutable
                  }}
            
          />
               
                     <Text type='subheading'>{name}</Text>
                     
                   
                     </TouchableOpacity>
                 </View>
             )
         }}


        />
    )

}
export default SearchList
const styles=StyleSheet.create({
    main:{
        flex:1,
        margin:8,
       
       

    },
    container:{
        backgroundColor:Colors.colors.gray100,
        borderRadius:8,
        width:'100%',
        padding:8,
        alignItems:'center',

     // alignItems:'flex-start',
     // justifyContent:'space-between',
      flexDirection:'row',
      shadowColor: Colors.colors.black,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            elevation: 2,

      //  flexDirection:'row',

    }

})