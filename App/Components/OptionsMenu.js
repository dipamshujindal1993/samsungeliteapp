import React from 'react'
import {
    View,
    Text,
} from 'react-native'
import {
    Menu,
    MenuTrigger,
    MenuOptions,
} from 'react-native-popup-menu'

import styles from './Styles/OptionsMenuStyles'
export default OptionsMenu = (props) => (
    props.disable ? null :
    <Menu>
        <MenuTrigger>
            {props.icon ? <View style={[styles.iconContainer]}>{props.icon}</View> : <Text style={styles.textStyle}>{props.text}</Text>}
        </MenuTrigger>
        <MenuOptions>
            {props.children}
        </MenuOptions>
    </Menu>
)