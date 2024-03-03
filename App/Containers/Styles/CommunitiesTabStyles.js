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

    communitiesContainer:{
        backgroundColor:Colors.white
    },

    itemContainer: {
        alignItems: 'flex-start',
        justifyContent:'center',
        height: 82,
        marginHorizontal: 24,
    },

    itemTopItemsContainer: {
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between'
    },

    itemThreadContainer: {
        flexDirection:'row',
        marginTop:9,
        alignItems:'center'
    },

    itemTitle: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_545454,
    },

    itemLastMessageTime: {
        ...Fonts.style.regular_9,
        color: Colors.rgb_9b9b9b,
    },

    itemThread: {
        ...Fonts.style.regular_11,
        color: Colors.rgb_727272,
    },

    itemThreadCount: {
        ...Fonts.style.bold_11,
        color: Colors.rgb_727272,
    },

    w9Info: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_9b9b9b,
        lineHeight: 20,
    },

})
