import { StyleSheet } from 'react-native'
import {
    Colors, Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1
    },
    padding_24: {
        paddingHorizontal: 24
    },
    taskImage: {
        height: "100%",
        width: '100%',
    },
    taskImageContainer: {
        height: 201,
        backgroundColor: Colors.white,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 32,
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 0.6,
        shadowRadius: 4
    },
    taskTitle: {
        ...Fonts.style.medium_29,
        color: Colors.rgb_696969,
        lineHeight: 36,
        marginBottom: 10
    },
    taskStatusOverallView: {
        backgroundColor: Colors.rgb_4297ff,
        borderRadius: 3,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 16
    },
    taskStatusOverallText: {
        ...Fonts.style.black_10,
        color: Colors.white,
    },
    dateMainContainer: {
        flexDirection: "row",
    },
    dateContainer: {
        flex: 1,
    },
    dateTitleText: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_b9b9b9,
        marginBottom: 4
    },
    dateText: {
        ...Fonts.style.light_12,
        lineHeight: 16,
        color: Colors.rgb_504e4e
    },
    webView: {
        marginVertical: 32,
    },
    actionsContainer: {
        marginTop: 12
    },
    markAsCompleteCTAView: {
        backgroundColor: Colors.rgb_4297ff,
        alignItems: "center",
        justifyContent: "center",
        height: 42,
        borderRadius: 21.5,
        marginBottom: 60,
        marginTop: 12,
        marginHorizontal: 24,
    },
    markAsCompleteCTAViewText: {
        ...Fonts.style.medium_13,
        color: Colors.white
    },
    actionContainer: {
        paddingHorizontal: 24,
        borderBottomColor: Colors.rgb_e3e3e3,
        borderBottomWidth: 1
    },
    actionItemMainView: {
        flexDirection: "row",
        paddingVertical: 20,
    },
    actionItemView: {
        flex: 1,
        marginRight: 31
    },
    actionTitleText: {
        ...Fonts.style.medium_16,
        lineHeight: 22,
        letterSpacing: 0,
        color: Colors.rgb_000000,
        marginBottom: 2
    },
    actionDescText: {
        ...Fonts.style.regular_12,
        lineHeight: 16,
        letterSpacing: 0,
        color: Colors.rgb_4a4a4a
    },
    actionIconContainer: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },
    uploadedImageView: {
        backgroundColor: Colors.rgb_f9f9f9,
        padding: 12,
        flexDirection: "row",
        borderRadius: 8,
        marginBottom: 12
    },
    uploadedImageTextConatiner: {
        flex: 1,
        flexDirection: "row",
    },
    uploadedImage: {
        marginRight: 12,
        width: 48,
        height: 48,
        borderRadius: 5
    },
    uploadedImageTextView: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center"
    },
    uploadedImageName: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_252525,
        lineHeight: 20,
        letterSpacing: 0.5
    },
    uploadedImageSize: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_9b9b9b,
        lineHeight: 20,
        letterSpacing: 0
    },
    closeIconContainer: {
        width: 17,
        alignItems: "center",
        justifyContent: "center"
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
        paddingBottom: 30,
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
        letterSpacing: 0.11
    },
    galleryPickerOption: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
        textAlign: 'left',
        marginTop: 30
    },
    galleryPickerCancel: {
        ...Fonts.style.medium_14,
        color: Colors.rgb_4297ff,
        textAlign: 'right',
        marginTop: 30,
        letterSpacing: 1.25
    },
})