import React from 'react'
import {
  View,
} from 'react-native'

import styles from './Styles/SeparatorStyles'

function Separator(props) {
  return (
    <View style={[styles.container, props.style]} />
  )
}

export default Separator