import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'

import styles from './Styles/QuaternaryButtonStyles'

function QuaternaryButton(props) {
  const {
    title,
    style,
    onPress,
  } = props

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default QuaternaryButton