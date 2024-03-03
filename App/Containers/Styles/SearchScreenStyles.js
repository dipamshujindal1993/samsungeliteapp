import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    searchInputContainer: { flex: 1, paddingLeft: 10 },
    searchInput: {
        ...Fonts.style.regular_17,
        color: Colors.rgb_4a4a4a
    },
    headerRight: {
        marginRight: 16,
        paddingHorizontal: 10
    },
    searchSuggestionItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 15
    },
    searchSuggestionTitleText: {
        flex: 1,
        paddingLeft: 9,
        ...Fonts.style.regular_14,
        color: Colors.rgb_676767,
    },
    separator: {
        backgroundColor: Colors.rgb_e3e3e3,
        height: 1,
        marginLeft: 24,
    }
})
