import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'

import { Colors } from '@resources'

import styles from './Styles/ButtonStyles'

function Button(props) {
  const {
    disabled,
    title,
    style,
    onPress,
  } = props

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: disabled ? Colors.rgb_c6e0ff : Colors.rgb_4297ff
        },
        style
      ]}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button