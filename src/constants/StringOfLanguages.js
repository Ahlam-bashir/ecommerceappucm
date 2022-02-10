import LocalizedStrings from 'react-native-localization';
import english from '../constants/translations/en';
import japanese from '../constants/translations/ja-jp';
import arabic from '../constants/translations/ar-sa'

const StringsOfLanguages = new LocalizedStrings({
   
    ar: arabic,
    en: english,
    jp: japanese
  });
  
  export default StringsOfLanguages;