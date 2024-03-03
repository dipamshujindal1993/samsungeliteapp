import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1
    },
    headerRight: {
        flexDirection: 'row',
        marginRight: 17
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        backgroundColor: Colors.rgb_4297ff,
        borderRadius: 16,
        marginHorizontal: 7,
    },
    countCard: {
        height: 74,
        borderRadius: 12,
        backgroundColor: Colors.rgb_f9f9f9,
        marginHorizontal: 16,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: Colors.rgb_eaeaea,
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flex: 1,
    },
    count: {
        textAlign: 'center',
        ...Fonts.style.black_22,
        color: Colors.rgb_4297ff,
    },
    countTitle: {
        textAlign: 'center',
        marginTop: 5,
        ...Fonts.style.medium_12,
        color: Colors.rgb_4a4a4a,
    },
    separator: {
        width: 1,
        height: 22,
        backgroundColor: Colors.rgba_97979773,
    },
    active:{
        opacity:1
      },
    inActive:{
        opacity:0.5
      }
})