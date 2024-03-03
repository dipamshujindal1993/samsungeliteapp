import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'

import { isEmpty } from '@utils/TextUtils'
import I18n from '@i18n'
import {
  Constants,
  Colors,
} from '@resources'

import styles from './Styles/CustomTextInputStyles'

export default class CustomTextInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: props.value ? props.value : '',
      hidePassword: this.props.textContentType == 'password',
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value != prevProps.value) {
      this.setState({
        text: this.props.value,
      })
    }
    if (this.props.isFocused != prevProps.isFocused) {
      this.setState({
        isFocused: this.props.isFocused,
      })
    }
  }

  _onFocus = () => {
    this.setState({
      isFocused: true,
    })

    if (this.props.onFocus) {
      this.props.onFocus(this.props.index, this.state.text)
    }
  }

  _onBlur = () => {
    this.setState({
      isFocused: false,
    })

    if (this.props.onBlur) {
      this.props.onBlur(this.props.index, this.state.text)
    }
  }

  _onChangeText = (text) => {
    if (this.props.textContentType == 'password') {
      text = text.replace(Constants.SPACES_PATTERN, '')
    }

    this.setState({ text })

    if (this.props.onChangeText) {
      this.props.onChangeText(this.props.index, text)
    }
  }

  autoCapitalize(textContentType) {
    switch (textContentType) {
      case 'emailAddress':
      case 'password':
        return 'none'

      case 'givenName':
      case 'familyName':
        return 'words'

      default:
        return 'sentences'
    }
  }

  autoCompleteType(textContentType) {
    switch (textContentType) {
      case 'emailAddress':
        return 'email'

      case 'password':
      case 'confirmPassword':
        return 'password'

      case 'firstName':
      case 'lastName':
        return 'name'

      case 'phone':
        return 'tel'

      case 'zip':
        return 'postal-code'

      default:
        return 'off'
    }
  }

  keyboardType(textContentType) {
    switch (textContentType) {
      case 'emailAddress':
        return 'email-address'

      case 'telephoneNumber':
        return 'phone-pad'

      case 'postalCode':
        return 'numeric'
    }
  }

  showHidePassword = () => {
    this.setState(prevState => {
      return {
        hidePassword: !prevState.hidePassword
      }
    })
  }

  render() {
    const {
      isFocused,
      text,
      hidePassword,
    } = this.state

    const {
      index,
      inputRef,
      style,
      inputStyle,
      label,
      labelStyle,
      onPress,
      icon,
      onIconPress,
      editable,
      returnKeyType,
      textContentType,
      keyboardType,
      onSubmitEditing,
      error,
      errorMessage,
      maxLength,
      showCounter,
      textStyles,
    } = this.props

    const textLength = text ? text.length : 0
    return (
      <View style={style}>
        <View style={styles.label_info}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          {icon && <TouchableOpacity disabled={!onIconPress} onPress={onIconPress} style={styles.icon}>{icon}</TouchableOpacity>}
        </View>
        <View>
          <TouchableOpacity disabled={!onPress} onPress={onPress}>
            <TextInput
              {...this.props}
              ref={inputRef}
              style={[
                styles.textInput,
                textStyles,
                inputStyle,
                {
                  borderBottomColor: error ? Colors.rgb_ff4337 : isFocused ? Colors.rgb_4297ff : Colors.rgb_d3dfef,
                  borderBottomWidth: isFocused ? 2 : 0.5,
                },
                {
                  paddingRight: textContentType == 'password' && !isEmpty(text) ? 65 : 0,
                },
              ]}
              autoCapitalize={this.autoCapitalize(textContentType)}
              autoCompleteType={this.autoCompleteType(textContentType)}
              pointerEvents={editable == false ? 'none' : 'auto'}
              keyboardType={keyboardType || this.keyboardType(textContentType)}
              returnKeyType={returnKeyType ? returnKeyType : 'next'}
              secureTextEntry={hidePassword}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              onSubmitEditing={onSubmitEditing ? () => onSubmitEditing(index, text) : null}
              onChangeText={this._onChangeText}
              value={text}
              selection={editable == false ? { start: 0 } : null}
            />
          </TouchableOpacity>
          {showCounter && maxLength && <Text style={styles.counterNumber}>{`${textLength}/${maxLength}`}</Text>}
          {
            textContentType == 'password' && !isEmpty(text) &&
            <Text style={styles.showHidePassword} onPress={this.showHidePassword}>{hidePassword ? I18n.t('sign_up.show') : I18n.t('sign_up.hide')}</Text>
          }
        </View>
        {error && errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
    )
  }
}