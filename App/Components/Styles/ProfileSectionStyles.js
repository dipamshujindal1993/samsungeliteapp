import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 19,
    },
    profileName: {
        ...Fonts.style.bold_16,
        color: Colors.rgb_363636,
        minWidth: 208,
        textAlign: 'center',
        marginTop: 6,
        paddingLeft: 76,
        paddingRight: 76
    },
    btnEditProfile: {
        width: 77,
        height: 23,
        borderRadius: 11.5,
        backgroundColor: Colors.rgb_4297ff,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -17,
    },
    editProfile: {
        ...Fonts.style.medium_11,
        color: Colors.white,
    },
    profileRepCodeView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
        minWidth: 136
    },
    profileRepCode: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        textAlign: 'center'
    },
    profileRepCodeValue: {
        ...Fonts.style.black_12,
        color: Colors.rgb_4a4a4a,
        textAlign: 'center',
        paddingHorizontal: 3
    },
    profileEmail: {
        marginTop: 3,
        minWidth: 194,
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        textAlign: 'center',
    },
    active:{
        opacity:1
      },
    inActive:{
        opacity:0.5
      }

})
