import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({

    spinner: {
        backgroundColor: Colors.white,
    },
    
    container: {
        flex: 1,
    },

    inputContainer: {
        marginTop: 34,
        marginHorizontal: 20,
    },
    
    inputText: {
        ...Fonts.style.bold_16,
    },

    inputLabel: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_a3a3a3,
    },
    
    messageContainer: {
        marginTop: 18,
        paddingHorizontal: 0,
        maxHeight: 200
    },

    inputMessage: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        lineHeight: 12,
        marginTop: 10,
    },

    attachmentIconContainer: {
        marginRight: 24, 
        marginTop: 14
    },

    space: {
        flex: 1,
    },

    bottomView: {
        flexDirection: 'row',
        height: 48, 
        backgroundColor: Colors.rgb_fafafa,
        alignItems:'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    },

    insetImageContainer: {
        flexDirection: 'row'
    },

    insertImage: {
        marginLeft: 16,
        ...Fonts.style.regular_14,
        color: Colors.rgb_a3a3a3,
    },

    sizeLimit: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
    },

    sizeLimitContainer: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    done: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4297ff,
    },

    pickerBackground: {
        flex: 1,
        backgroundColor: Colors.rgba_252525CC,
        justifyContent: 'center',
    },

    pickerView: {
        marginLeft: 36,
        marginRight: 41,
        paddingTop: 29,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 14,
        backgroundColor: Colors.white,
        elevation: 6,
        shadowOffset: { width: 0, height: 6 },
        shadowColor: Colors.rgba_0000004c,
        shadowOpacity: 0.2,
        shadowRadius: 6
    },

    galleryPickerTitle: {
        ...Fonts.style.regular_20,
        color: Colors.rgb_4a4a4a,
        letterSpacing: 0.11,
        marginBottom: 15
    },

    galleryPickerOption: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
        textAlign: 'left',
        paddingVertical: 15
    },

    galleryPickerCancel: {
        ...Fonts.style.medium_14,
        color: Colors.rgb_4297ff,
        textAlign: 'right',
        paddingVertical: 15,
        letterSpacing: 1.25
    },

    thumbnailViewContainer: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: Colors.rgb_fafafa,
    },

    thumbnailView: {
        justifyContent: 'center', 
        alignItems:'center'
    },

    itemImage: {
        height: 60,
        width: 60,
        marginHorizontal: 4,
        borderRadius: 12,
    },

    closeIconContainer: {
        position: "absolute", 
        top: -6, 
        right: 0,
    },

    commonIcon: {
        position: "absolute", 
        top: -6, 
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },

    removeIconView: {
        backgroundColor: Colors.white,
        borderColor: Colors.rgb_0074d4,
        borderWidth: 1,
    },

    failedIconView: {
        backgroundColor: Colors.rgb_ff4339,
    },

    failed_upload: {
        ...Fonts.style.medium_11,
        color: Colors.rgb_ff4339,
        textAlign: 'center',
    },
})
