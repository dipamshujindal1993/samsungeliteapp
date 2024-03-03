import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'

import { Colors } from '@resources'

import styles from './Styles/HeaderButtonStyles'

function HeaderButton(props) {
  const {
    disabled,
    title,
    style,
    textStyle,
    onPress,
  } = props

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.container,
        style
      ]}
      onPress={onPress}>
      <Text style={[
        styles.text,
        textStyle,
        {
          color: disabled ? Colors.rgb_b9b9b9 : Colors.rgb_4297ff
        },
      ]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default HeaderButton