import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1
    },
    headerButton: {
        paddingLeft: 8,
        marginRight: 24
    },
    headerButtonText: {
        lineHeight: 16,
        letterSpacing: 0
    },
    preferenceContainer: {
        flexDirection: 'row',
        paddingTop: 25,
        paddingBottom: 20.5,
        paddingLeft: 23,
        paddingRight: 25,
    },
    descriptionContainer: {
        flex: 1,
        paddingRight: 18
    },
    preference: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
        lineHeight: 18,
        letterSpacing: 0.12
    },
    description: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_989898,
        lineHeight: 18,
        letterSpacing: 0.1,
        paddingTop: 6
    },
    preferencesSeparator: {
        height: 0.5,
        marginLeft: 23,
        marginRight: 26
    },
    policiesContainer: {
        marginTop: 15
    },
    policyContainer: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 18,
        paddingLeft: 24,
        paddingRight: 20
    },
    policy: {
        flex: 1,
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a
    },
    policySeparator: {
        height: 0.5,
        marginLeft: 23
    },
    space: {
        flex: 1,
    },
    version: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        marginBottom: 37,
        textAlign: 'center'
    }
})
