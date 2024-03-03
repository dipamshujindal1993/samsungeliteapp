import { StyleSheet, Platform } from 'react-native'
import {
    Colors,
    Fonts,
  } from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    headerTitle: {
        marginLeft: Platform.OS === 'android' ? 20 : 0,
    },
    filterView: { 
        flexDirection: 'row',
        height: 46, 
        marginHorizontal: 16, 
        marginTop: 20,
        marginBottom: 9,
        paddingLeft: 18,
        paddingRight: 21,
        backgroundColor: Colors.rgb_4297ff, 
        borderRadius: 8,
        alignItems: 'center'
    },
    filterValueText: {
        ...Fonts.style.regular_16,
        color: Colors.white,
        flex:1,
        letterSpacing: -0.4,
        textAlign:'left'
    },
    filterCTAText: {
        ...Fonts.style.bold_14,
        color: Colors.white,
        flex:1,
        letterSpacing: -0.35,
        textAlign:'right'
    },
    sortOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    sortTransparentView: { 
        flex: 2, 
        backgroundColor: Colors.rgba_00000099, 
    },
    sortLayoutView: {
        backgroundColor: Colors.white,
        padding: 16,
        borderTopLeftRadius: 8, 
        borderTopRightRadius: 8
    },
    sortItemView: {
        padding: 24,
    },
})