import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24
    },
    headerRight: {
        marginRight: 24
    },
    headerRightText: {
        color: Colors.rgb_4297ff,
        lineHeight: Fonts.size.s20,
        ...Fonts.style.black_20
    },
    title: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        color: Colors.rgb_464544,
        lineHeight: Fonts.size.s30,
        textAlign: 'center',
        ...Fonts.style.medium_24
    },
    box: {
        flex: 0.8,
        bottom: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottom: {
        marginBottom: 20
    },
    button: {
        width: '100%',
        height: 42
    },
    bonusBox: {
        height: 86,
        width: 80,
        marginVertical: 22,
        justifyContent: "space-between"
    },
    congratulationBox: {
        height: 236,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: "space-between"
    }
})

const customStyle = {
    congratulationGiftIcon: {
        width: 120,
        topHeight: 75,
        bottomHeight: 39
    },
    bonusGiftIcon: {
        width: 80,
        topHeight: 50,
        bottomHeight: 26
    }
}

export {
    customStyle,
    styles
}