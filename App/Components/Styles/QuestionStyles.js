import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      marginBottom: 48
    },
    questionTitle: {
        ...Fonts.style.medium_29,
        lineHeight: 36,
        color: Colors.rgb_4a4a4a,
        marginTop: 27
    },
    questionText: {
        ...Fonts.style.light_16,
        lineHeight: 24,
        color: Colors.rgb_464544,
        marginTop: 30,
    },
})