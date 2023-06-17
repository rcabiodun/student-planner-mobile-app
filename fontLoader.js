import * as Font from 'expo-font';

const custom_fonts={
    'bold':require('./assets/fonts/Montserrat-Bold.ttf'),
    'medium':require('./assets/fonts/Montserrat-Medium.ttf'),
    'reg':require('./assets/fonts/Montserrat-Regular.ttf'),
  }
export default async function _loadMyFonts(){
    await Font.loadAsync(custom_fonts);

    console.log("Loaded")
  }