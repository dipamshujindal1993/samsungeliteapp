import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 24
    },
    subContainer: {
        flex: 1,
        paddingTop: 52
    },
    headerRight: {
        marginRight: 16
    },
    headerRightText: {
        color: Colors.rgb_d8d8d8,
        ...Fonts.style.bold_14
    },
    headerTitleText: {
        color: Colors.rgb_504e4e,
        lineHeight: 24,
        ...Fonts.style.light_16
    },
    inputStyle: { 
        paddingTop: 20 
    },
    title: {
        borderBottomWidth: 0,
        textAlignVertical: 'top',
        textAlign: 'left',
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.bold_16
    },
    titleText: {
        color: Colors.rgb_504e4e,
        lineHeight: 24,
        ...Fonts.style.bold_16
    },
    message: {
        textAlignVertical: 'top',
        textAlign: 'left',
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_12
    }
})