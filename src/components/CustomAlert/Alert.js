import AnimatedLottieView from 'lottie-react-native';
import React,{useRef,useEffect} from 'react';
import { TouchableOpacity } from 'react-native';
import {Modal, StyleSheet, View} from 'react-native';
import Colors from '../../utils/Colors';
import Icon from '../Icon/Icon';
import Text from '../Text/text';

const Alert = (props) => {
    let animationRef=useRef()
    useEffect(() => {
        // To play complete animation
       // animationRef.play();
        // Similary you can use this reset, pause, resume
    
        // To play from a specific startFrame and endFrame
        // animationRef.play(30, 120);
      }, []);
    
   
  return (
    
      <Modal
        visible={props.visible}
        animationType="fade"
        transparent={true}
        onRequestClose={()=>!(props.visible)}
       >
            <View style={styles.container}>
            <View style={styles.alertbox}>
                <View style={{alignSelf:'flex-end'}}>               
                     <Icon name='clear' size={20} color={Colors.colors.gray500}  onPress={props.close}/>
                </View>

                <AnimatedLottieView
                  style={{width:140,height:100,marginTop:10,alignSelf:'center'}}
                  source={props.uri}
                  autoPlay
                  loop
                />
                <Text type='heading' style={{padding:4,marginTop:18}}>{props.title}</Text>
                <View>
                    {props.button1?
                    <TouchableOpacity style={styles.button} onPress={props.btn1Click}>
                    <Text type='caption' style={{color:Colors.colors.white}}>{props.button1}</Text>
                </TouchableOpacity>:null}
                {props.button2?
                <TouchableOpacity style={styles.button} onPress={props.btn2Click}>
                <Text type='caption' style={{color:Colors.colors.white}}>{props.button2}</Text>
            </TouchableOpacity>:null}
                
                
                </View>

            </View>
            </View>
        </Modal>
   
  );
};
export default Alert;
const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
   // backgroundColor:Colors.colors.transparent,
    marginLeft: 10,
    marginRight: 10,
  },
  alertbox:{
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: Colors.colors.gray100, 
    height: 350,
    width: '90%',      
    borderColor: '#fff',
    borderRadius:13,
    padding:12

  },
  button:{width:200,height:40,borderRadius:12,backgroundColor:Colors.colors.primary,alignItems:'center',justifyContent:'center',marginTop:10}
});
