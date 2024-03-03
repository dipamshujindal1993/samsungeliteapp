import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '@resources'
export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    radioOutsideView: {
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: Colors.rgb_363636
    },
    selectedRadioOutSide: {
        opacity: 1
    },
    unselectedRadioOutSide: {
        opacity: 0.3,
        borderColor: Colors.rgb_363636,
    },
    radioInsideView: {
        backgroundColor: Colors.rgb_4297ff,
        alignSelf: 'center',
        height: 18,
        width: 18,
        borderRadius: 9
    },
    optionView: { 
        paddingLeft: 15 
    },
    unselectOptionTxt: {
        color: Colors.rgb_4a4a4a,
        lineHeight: Fonts.size.s18,
        opacity: 0.3,
        ...Fonts.style.regular_14
    },
    selectOptionTxt: {
        lineHeight: Fonts.size.s18,
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_14
    }
})