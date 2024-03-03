import React from 'react'
import {
  ActivityIndicator,
} from 'react-native'

import styles from './Styles/LoadingSpinnerStyles'

function LoadingSpinner(props) {
  return (
    <ActivityIndicator
      { ...props }
      style={[props.doNotFill ? null : styles.absoluteFill, props.style]}
    />
  )
}

export default LoadingSpinner