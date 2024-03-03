import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '@resources'
export default StyleSheet.create({  
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },  
    questionText:{
        color: Colors.rgb_464544,
        lineHeight: Fonts.size.s30,
        textAlign: 'center',
        ...Fonts.style.medium_24
    },
    pointText:{
        color: Colors.rgb_4a4a4a,
        textAlign: 'center',
        ...Fonts.style.light_56
    }
})