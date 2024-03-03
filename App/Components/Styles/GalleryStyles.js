import { StyleSheet, Dimensions } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
const { width } = Dimensions.get("screen")

export default StyleSheet.create({
    containder: { 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: 246 
    },
    toolbar: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        height: 50, 
        paddingHorizontal: 20, 
        backgroundColor: Colors.rgb_fafafa 
    },
    imageContainer: {
        width: width / 3,
        height: 121,
        paddingRight: 3,
        paddingBottom: 3
    },
    oversizeTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: Colors.rgba_000000CF,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 10.5,
        width: 63,
        height: 21,
        marginLeft: 7,
        marginTop: 9,
        alignItems: 'center',
        justifyContent:'center'
    },
    oversizeText: {
        ...Fonts.style.medium_10,
        color: Colors.white,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    selectBox: {
        position: "absolute", 
        top: 8, 
        left: 8,
    },
    unselectBox: {
        position: "absolute", 
        top: 8, 
        left: 8,
        width: 24, 
        height: 24, 
        backgroundColor: Colors.rgb_4297ff,
        borderWidth: 1,
        borderColor: Colors.white,
        backgroundColor: Colors.rgba_ffffffcc,
        borderRadius: 12
    },
    playIconContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center', 
        alignItems: 'center'
    }
});