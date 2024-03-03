import { StyleSheet } from 'react-native'

import {
  Colors,
  Fonts,
} from '../../Resources'

const alignCenter = {
    alignItems: 'center',
}

const flexRow = {
    flexDirection: 'row',
}

const spaceBetween = {
    justifyContent: 'space-between'
}

const alignViewCenter = {
    alignItems: 'center', 
    justifyContent: 'center',
}

const checkBoxImage = {
    height: 22,
    width: 22 
}

export default StyleSheet.create({
    baseView: {
        flex: 1,
        backgroundColor: Colors.white
    },
    textInputView: {
        marginTop: 2,
        paddingHorizontal: 15,
        paddingTop: 9,
        paddingBottom: 16,
        backgroundColor: Colors.rgb_f9f9f9,
        shadowOffset: { width: 0, height: -2 },
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 0.6,
        shadowRadius: 4,
        ...Platform.select({
            android: {
                elevation: 4,
            },
        }),
    },
    textInputOuterView:{
        marginTop: 12,
        paddingLeft: 18,
        paddingRight: 21,
        paddingTop: 10,
        paddingBottom: 20,
        paddingVertical: 8,
        backgroundColor: Colors.white,
        height: 115,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.rgb_d8d8d8,
    },
    statusDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    statusText: {
        ...Fonts.style.regular_15,
        letterSpacing: -0.38,
        color: Colors.rgb_4a4a4a,
    },
    multilineTextInput: {
        flex: 1,
        ...Fonts.style.regular_14,
        lineHeight: 20,
        color: Colors.rgb_4a4a4a,
        alignSelf: 'stretch',
        textAlignVertical: 'top',
    },
    productSoldView:{
        ...flexRow, 
        paddingLeft: 24,
        paddingRight: 15,
        paddingTop: 18,
        paddingBottom: 15.5,
        ...alignCenter,
        ...spaceBetween
    },
    productSoldText:{
        color: Colors.rgb_4a4a4a,
        letterSpacing: -0.4,
        ...Fonts.style.bold_16
    },
    addBtnView:{
        width: 70,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.rgb_4297ff 
    },
    addText:{
        color: Colors.white,
        ...Fonts.style.medium_14
    },
    productSoldSeparator: {
        height: 0.5, 
        marginLeft: 24,
        backgroundColor: Colors.rgb_b9b9b9
    },
    selectProductSoldModalText:{
        paddingVertical: 16, 
        paddingHorizontal: 24 
    },
    productItemView:{
        paddingLeft: 24,
        paddingRight: 18,
        paddingVertical: 10,
        ...flexRow,
        ...spaceBetween
    },
    productItemtext:{
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_14,
        marginHorizontal: 16
    },
    productListExtra: {
        height: 11
    },
    selectProductTitle:{
        ...Fonts.style.medium_18,
        color: Colors.rgb_4a4a4a,
        textAlign: 'left',
        textAlignVertical: 'center'
    },
    minusHorizontalLine: {
        height: 1,
        width: 14,
        backgroundColor: Colors.rgb_4a4a4a
    },
    productCounterView: {
        ...alignCenter,
        ...spaceBetween, 
        flexDirection: 'row'
    },
    productCounterText:{
        ...Fonts.style.regular_16,
        color: Colors.rgb_4a4a4a,
        marginHorizontal: 14
    },
    counterViews: {
        width: 18, 
        height: 18, 
        ...alignViewCenter
    },
    productCheckBoxRowView: {
        ...flexRow,
        ...alignViewCenter
    },
    checkBoxUnCheckedView:{
       ...checkBoxImage,
       borderColor: Colors.rgb_b9b9b9, 
       borderRadius: 11, 
       borderWidth: 0.8
    },
    modal_scrim: {
        flex: 1,
        ...flexRow,
        ...alignViewCenter,
        backgroundColor: Colors.rgba_0000008a,
    },
    modal_window: {
        flex: 1,
        maxHeight: 458,
        marginHorizontal: 32,
        backgroundColor: Colors.white,
        borderRadius: 6
    },
    button_container: {
        paddingVertical: 16, 
        paddingHorizontal: 24,
        justifyContent: 'flex-end',
        ...alignCenter
    },
    button: {
        ...Fonts.style.bold_15,
        color: Colors.rgb_4297ff,
        alignSelf: 'flex-end'
    },
    separator:{
        height: 0.5, 
        backgroundColor: Colors.rgb_b9b9b9
    },
    productSoldListView: {
        paddingVertical: 22.5,
        paddingHorizontal: 27,
    },
    productSoldListItem: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
        marginBottom: 20
    },
    loading_spinner_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
