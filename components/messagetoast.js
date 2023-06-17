import React ,{useRef, useState} from "react";
import { useEffect } from 'react';
import { View,Text,StyleSheet,StatusBar, Modal, TouchableOpacity, TextInput,SectionList,FlatList,ImageBackground, Animated} from 'react-native';
//import LottieView from 'lottie-react-native';
import colorsheme from '../setup';



const getRandomMessage=()=>{
    const number=Math.trunc(Math.random()* 1000);
    return 'Random message'+number;

}

const Message =(props)=>{
    const opacity=useRef(new Animated.Value(0)).current;
    useEffect(()=>{
        Animated.sequence([
            Animated.timing(opacity,{
                toValue:1,
                duration:500,
                useNativeDriver:true
            }),
            Animated.delay(2000),
            Animated.timing(opacity,{
                toValue:0,
                duration:500,
                useNativeDriver:true
            }),
        ]).start(()=>props.onHide());

    },[])
    return(
        <Animated.View
            style={{
                opacity,
                transform:[
                    {
                        translateY:opacity.interpolate({
                            inputRange:[0,1],
                            outputRange:[-20,0],
                        })
                    }
                ],
                borderRadius:4,
                shadowColor:'transparent',
                height:50,
                elevation:1,
                alignItems:"center",
                justifyContent:'center',
                zIndex:5  
            }}
        >   
        <View style={{alignItems:'center',justifyContent:'center',backgroundColor:colorsheme.black,padding:7,marginLeft:10,borderRadius:10}}>
            <Text style={[{fontFamily:'reg',fontSize:16,color:colorsheme.white}]}>{props.message}</Text>
        </View>
        </Animated.View>

    )
}

export default Message;