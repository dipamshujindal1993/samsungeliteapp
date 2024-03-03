import { StyleSheet } from 'react-native'

import {
  Colors,
  Fonts,
} from '../../Resources'

export default StyleSheet.create({
    baseView:{
        flex: 1,
        backgroundColor: Colors.white
    },  
    itemView: {
        paddingHorizontal: 20, 
        paddingVertical: 16
    },
    itemSeparator: {
        height: 0.5,  
        marginLeft: 20, 
        backgroundColor: Colors.rgb_d8d8d8,
    },
    statusTypeRow:{
        flex: 3, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        flexDirection: 'row'
    }, 
    statusColorIndicator:{
        borderRadius: 6.5, 
        height: 13, 
        width: 13, 
    },      
    statusType: {
        marginLeft: 17,
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.bold_15,
    },
    statusDescription: {
        marginTop: 9,
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_13,
    }
})