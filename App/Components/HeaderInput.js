import React, { Component } from 'react'
import {
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import styles from './Styles/HeaderInputStyles'
import ClearIcon from '@svg/icon_close.svg'

export default class HeaderInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }
  }

  onChangeText(value) {
    const { onChangeText, onSubmitEditing, submitWhenValueChange } = this.props
    this.setState({ value })
    if (onChangeText) {
      onChangeText()
    }
    if (submitWhenValueChange && onSubmitEditing){
      onSubmitEditing(value)
    }
  }

  onSubmitEditing(value) {
    const { onSubmitEditing } = this.props
    if (onSubmitEditing) {
      onSubmitEditing(value)
    } else {
      return null
    }
  }

  onClearInputs() {
    const { onSubmitEditing } = this.props
    this.setState({ value: '' })
    if (onSubmitEditing) {
      this.onSubmitEditing('')
    }
  }

  render() {
    const { placeholder, returnKeyType } = this.props
    const { value } = this.state
    return (
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.headerTextInput}
          value={value}
          placeholder={placeholder}
          autoFocus={true}
          onChangeText={this.onChangeText.bind(this)}
          onSubmitEditing={() => this.onSubmitEditing(value)}
          returnKeyType={returnKeyType}
        />
        <TouchableOpacity onPress={() => this.onClearInputs()}>
          <ClearIcon
            style={styles.clearIcon}
            height={14}
            width={14}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
