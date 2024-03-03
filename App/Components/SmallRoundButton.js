import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
} from 'react-native'

import styles from './Styles/SmallRoundButtonStyles'

const SIGN_VALID = {
  PLUS: 'plus',
  MINUS: 'minus',
}

export default class SmallRoundButton extends Component {
  render() {
    const { sign, disabled, onPress } = this.props
    return (
      <TouchableOpacity
        style={[styles.button, disabled ? styles.buttonDisabled : null]}
        disabled={disabled}
        onPress={onPress}>
        {this.renderSign(sign)}
      </TouchableOpacity>
    )
  }

  renderSign(sign) {
    switch(sign) {
      case SIGN_VALID.PLUS:
        return (
          <View style={styles.signContainer}>
            <View style={styles.centerHorizontalLine} />
            <View style={styles.centerVerticalLine}/>
          </View>
        )
      case SIGN_VALID.MINUS:
        return (
          <View style={styles.signContainer}>
            <View style={styles.minusHorizontalLine} />
          </View>
        )
      default:
        return null
    }
  }
}
