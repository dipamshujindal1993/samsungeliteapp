import React from 'react'
import {
  TouchableOpacity,
} from 'react-native'

import styles from './Styles/FABStyles'

function FAB(props) {
  const {
    style,
    onPress,
  } = props

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}>
       {props.children}
    </TouchableOpacity>
  )
}

export default FAB