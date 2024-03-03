import React from 'react'
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native'

import { Colors } from '@resources'
import CheckIcon from '@svg/icon_complete.svg'

import styles from './Styles/CheckBoxStyles'

function CheckBox(props) {
    const {
        answerText,
        isChecked,
        onPress,
        style
    } = props

    return (
        <TouchableOpacity style={[styles.container, { ...style }]} disabled={!onPress} onPress={onPress}>
            <View style={styles.checkboxContainer} >
                {isChecked ? <CheckIcon fill={Colors.rgb_4297ff} width={26} height={26} /> : <View style={styles.unCheckedBox} />}
            </View >
            <Text style={styles.answerText}> {answerText} </Text>
        </TouchableOpacity>
    )
}
export default CheckBox