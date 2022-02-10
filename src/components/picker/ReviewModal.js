import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from 'base-64';
import React,{useState} from 'react'
import { KeyboardAvoidingView } from 'react-native';
import { Platform ,TouchableOpacity} from 'react-native';
import { StyleSheet } from 'react-native';
import {View} from 'react-native'
import { BottomSheet } from 'react-native-btr';
import { InputText } from '..';
import Colors from '../../utils/Colors';
import { API_URL } from '../../utils/Config';
import Icon from '../Icon/Icon';
import Text from '../Text/text';

const ReviewModal=(props)=>{
  const [defaultRating, setDefaultRating] = useState(1);
  const [review,setReview]=useState('')
  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
    const {visible,productId,user }=props
    const toggleBottomNavigationView = () => {
        //Toggling the visibility state of the bottom sheet
        props.close()
      };
      const postReview=async()=>{
        const datatoSend={
          "productId" : productId,
          "userId": user.userId,
          "reviewTitle": "Title is here",
          "reviewDescription": review.toString()
    
        }
       await AsyncStorage.getItem('user')
        .then(value => JSON.parse(value))
        .then(response => {
         // setVisible(true)
          fetch(API_URL + 'Review', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + encode(response.email + ':' + response.password),
            },
      
            body: JSON.stringify(datatoSend),
          })
            .then(response => response.json())
            .then(responseJson => {
            //  setVisible(false)
              console.log(responseJson);
              if (responseJson.ModelState) {
                Object.entries(responseJson.ModelState).forEach(([key, value]) => {
                  console.log(`${key}: ${value}`);
                  if (Object.entries(value).length !== 0) {
                  
                      alert(
                        value.toString() + ' ' + 'at' + ' ' + key,
                        //can be TOP, BOTTON, CENTER
                      );
                   
                
                    }})}
                    else{
                      alert(responseJson.Message);
                    }
                      
             
              
               
               
              
      
              //Showing response message coming from server
              
            })
            .catch(error => {
              
      
              //display error message
              console.warn(error);
            });
      
        })
       
      }
      
      const CustomRatingBar = () => {
        return (
          <View style={styles.customRatingBarStyle}>
            <Text type='subheading'>Rate this Product</Text>
            <View style={{flexDirection:'row',marginTop:8,marginBottom:8}}>
            {maxRating.map((item, key) => {
              return (
                <TouchableOpacity
                  
                  activeOpacity={0.6}
                  key={item}
                  onPress={() => setDefaultRating(item)}>
                  
                  <Icon
                    size={30}
                    style={styles.starImageStyle}
                    type='antdesign'
                    name={ item <= defaultRating
                      ? 'star'
                      : 'staro'}
                      color={Colors.colors.success}
                   
                  />
                  
                </TouchableOpacity>
              );
            })}
            </View>
          </View>
        );
      };
    return(
        <BottomSheet
          visible={visible}
          //setting the visibility state of the bottom shee
          onBackButtonPress={toggleBottomNavigationView}
          //Toggling the visibility state
          onBackdropPress={toggleBottomNavigationView}
          //Toggling the visibility state
        >
          {/*Bottom Sheet inner View*/}
          <KeyboardAvoidingView
           behavior={Platform.OS === "ios" ? "padding" : null}
           keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
          
          >        
              <View style={styles.bottomNavigationView}>
              <Text type='heading'> Review and Ratings</Text>
              <CustomRatingBar/>
              
           
            <Text type='heading'>Review Product </Text>
            <View style={{width:'100%',flexDirection:'row',marginTop:8}}>
              <InputText
              placeholder="Write a Review"
              inputStyle={{
                color:Colors.colors.black,
                padding:6
               
              }}
              underlineColorAndroid="transparent"    
              autoCorrect={false}
              containerStyle={
               Platform.OS !== 'android'
                  ? styles.inputContainer
                  : {...styles.inputContainer,marginTop:6}
              }
              multiline={true}  
              onChangeText={value =>setReview(value.trim())
                }
              />
              <TouchableOpacity style={{height:40,width:120,backgroundColor:Colors.colors.primary,alignItems:'center',justifyContent:'center',margin:8,borderRadius:8}} onPress={()=>postReview()}>
              <Text type='caption' style={{color:Colors.colors.white}}>Add Review</Text>
              </TouchableOpacity>
              
            </View> 
              </View>
              </KeyboardAvoidingView>

              </BottomSheet>
    )

}
export default ReviewModal
const styles =StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
      //  height: 250,
        padding:18,
        alignSelf:'center',
        
        justifyContent: 'center',
      //  alignSelf:'center'
        //alignItems: 'center',
      },
      inputContainer: {
        margin: 8,
        borderWidth: 1,
        height: 60,
        borderRadius:4,
        padding:6
    
      },
      customRatingBarStyle: {
        justifyContent: 'center',
       // flexDirection: 'row',
        marginTop: 20,
      },
})