import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'

import {
  Colors,
} from '@resources'

import styles from './Styles/SecondaryButtonStyles'

function SecondaryButton(props) {
  const {
    title,
    style,
    onPress,
    disabled,
  } = props

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, style]}
      onPress={onPress}>
      <Text style={[styles.text, {
        color: disabled ? Colors.rgb_9b9b9b : Colors.rgb_4297ff,
      }]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default SecondaryButton