import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'

import styles from './Styles/TertiaryButtonStyles'

function TertiaryButton(props) {
  const {
    title,
    style,
    onPress,
    textStyle,
  } = props

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default TertiaryButton