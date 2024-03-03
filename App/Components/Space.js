import React from 'react'
import {
  View,
} from 'react-native'

import styles from './Styles/SpaceStyles'

function Space(props) {
  return (
    <View style={[styles.container, props.style]} />
  )
}

export default Space