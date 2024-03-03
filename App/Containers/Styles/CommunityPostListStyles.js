import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({

    headerTitleText: {
        ...Fonts.style.medium_17,
        color: Colors.rgb_4a4a4a,
    },
    container: {
        flex: 1,
    },
    communitiesPostContainer:{
        backgroundColor:Colors.white
    },
    itemContainer: {
        flex:1,
        justifyContent:'space-evenly',
        paddingLeft: 24,
        paddingVertical: 20,
        backgroundColor:Colors.rgb_fdfdfd,
        borderColor: Colors.rgb_ececec,
        borderWidth: 1,
    },
    itemTopLevelContainer: {
        width:'100%',
        flexDirection:'row',
    },
    itemAuthorDetailContainer: {
        flex:1,  
        justifyContent:'space-evenly',
    },
    itemOtherDetailContainer: { 
        flexDirection: "row",
        justifyContent:'space-between',
    },
    itemAuthorName: {
        ...Fonts.style.bold_13,
        color: Colors.rgb_4a4a4a,
        marginLeft:11,
    },
    itemTime: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_9b9b9b,
        marginLeft:11,
    },
    itemComment: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_9b9b9b,
        marginLeft:4,
    },
    itemPostTitle: {
        ...Fonts.style.bold_17,
        color: Colors.rgb_4a4a4a,
        marginTop: 13,
        marginBottom: 10,
        marginRight: 24
    },
    itemPostDescription: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        letterSpacing: 0.1,
        marginRight: 24
    },
    itemSeparator: {
        height: 11,
        backgroundColor:Colors.white
    },
    separator: {
        height: 0.5,
        backgroundColor:Colors.rgb_e1e1e1
    },
})
