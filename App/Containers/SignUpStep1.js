import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import UserActions from '@redux/UserRedux'
import { Constants } from '@resources'
import I18n from '@i18n'
import CustomTextInput from '@components/CustomTextInput'
import { isEmpty } from '@utils/TextUtils'
import { seaApi } from '@sagas'

import styles from './Styles/SignUpScreenStyles'

const INPUT_FIELDS = [
  {
    name: 'emailAddress',
    label: I18n.t('sign_up.email'),
    textContentType: 'emailAddress',
    rules: [
      {
        regex: Constants.EMAIL_PATTERN,
        errorMessage: I18n.t('sign_up.msg_invalid_email'),
      },
      {
        checkExists: true,
        errorMessage: I18n.t('sign_up.msg_email_taken'),
      },
    ],
  },
  {
    name: 'password',
    label: I18n.t('sign_up.password'),
    textContentType: 'password',
    rules: [
      {
        regex: Constants.PASSWORD_PATTERN,
        errorMessage: I18n.t('sign_up.msg_invalid_password'),
      },
    ],
  },
  {
    name: 'confirmPassword',
    label: I18n.t('sign_up.confirm_password'),
    textContentType: 'password',
    rules: [
      {
        match: true,
        errorMessage: I18n.t('sign_up.msg_password_not_match'),
      },
    ],
  },
  {
    name: 'firstName',
    label: I18n.t('sign_up.first_name'),
    textContentType: 'givenName',
    rules: [
      {
        mandatory: true,
        errorMessage: I18n.t('sign_up.msg_invalid_first_name'),
      },
    ],
  },
  {
    name: 'lastName',
    label: I18n.t('sign_up.last_name'),
    textContentType: 'familyName',
    rules: [
      {
        mandatory: true,
        errorMessage: I18n.t('sign_up.msg_invalid_last_name'),
      },
    ],
  },
]

class SignUpStep1 extends Component {
  static navigationOptions = ({ navigation }) => {
    const canGoNext = navigation.getParam('canGoNext')
    return {
      headerRight: () => (
        <TouchableOpacity
          disabled={!canGoNext}
          onPress={navigation.getParam('onNext')}>
          <Text style={canGoNext ? styles.nextEnabled : styles.nextDisabled}>{I18n.t('sign_up.next')}</Text>
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)

    this.userInfo = Object.assign({}, props.userInfo)

    var inputFields = []
    for (var i = 0; i < INPUT_FIELDS.length; i++) {
      inputFields[i] = {}
      if (i == 0 || (inputFields[i - 1].isVisible && this.userInfo[INPUT_FIELDS[i - 1].name] && this.userInfo[INPUT_FIELDS[i].name])) {
        this.focusedFieldIndex = i
        inputFields[i].isVisible = true
      }
      inputFields[i].ref = React.createRef()
    }

    this.state = {
      inputFields,
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onNext: this._onNext })
  }

  componentDidUpdate(prevProps) {
    if (this.props.userInfo != prevProps.userInfo) {
      this.userInfo = Object.assign({}, this.props.userInfo)
    }
  }

  _updateNext(canGoNext) {
    if (this.canGoNext != canGoNext) {
      this.props.navigation.setParams({ canGoNext })
      this.canGoNext = canGoNext
    }
  }

  _showError(index, errorMessage) {
    const {
      inputFields,
    } = this.state
    inputFields[index].error = true
    inputFields[index].errorMessage = errorMessage
    this.setState({
      inputFields,
    }, () => {
      if (this._scroll && index + 1 >= INPUT_FIELDS.length) {
        setTimeout(() => {
          if (this._scroll) {
            this._scroll.scrollToEnd()
          }
        }, 500)
      }
    })
  }

  _hideError(index) {
    const {
      inputFields,
    } = this.state
    inputFields[index].error = false
    this.setState({
      inputFields,
    })
  }

  _isValid = async (index, text) => {
    const rules = INPUT_FIELDS[index].rules
    if (rules) {
      for (var i = 0; i < rules.length; i++) {
        if (rules[i].regex) {
          if (text && text.match(rules[i].regex)) {
            this._hideError(index)
          } else {
            this._showError(index, rules[i].errorMessage)
            return false
          }
        }
        if (rules[i].mandatory) {
          if (isEmpty(text)) {
            this._showError(index, rules[i].errorMessage)
            return false
          } else {
            this._hideError(index)
          }
        }
        if (rules[i].match) {
          if (this.userInfo['password'] == text) {
            this._hideError(index)
          } else {
            this._showError(index, rules[i].errorMessage)
            return false
          }
        }
        if (rules[i].checkExists) {
          const response = await seaApi.checkExists({ username: text })
          if (response && response.ok && response.data && response.data.exists) {
            this._showError(index, rules[i].errorMessage)
            return false
          } else {
            this._hideError(index)
          }
        }
      }
    }
    return true
  }

  _onFocus = async (index, text) => {
    this.focusedFieldIndex = index
    if (INPUT_FIELDS[index].optional) {
      this._updateNext(true)
    } else if (isEmpty(text)) {
      this._updateNext(false)
    } else {
      this._updateNext(await this._isValid(index, text))
    }
  }

  _onBlur = (index, text) => {
    this._isValid(index, text)
  }

  _onChangeText = async (index, text) => {
    if (text != this.userInfo[INPUT_FIELDS[index].name]) {
      this.userInfo[INPUT_FIELDS[index].name] = text.trim()
      this.props.save(this.userInfo)
    }

    if (!INPUT_FIELDS[index].optional && isEmpty(text)) {
      this._updateNext(false)
    } else {
      this._updateNext(await this._isValid(index, text))
    }
  }

  _onSubmitEditing = async (index, text) => {
    if (await this._isValid(index, text)) {
      this._onNext()
    }
  }

  _onNext = async () => {
    this.props.save(this.userInfo)

    if (this.focusedFieldIndex + 1 >= INPUT_FIELDS.length) {
      // reached last field, revalidate all fields again before go to next step
      var isValid
      for (var i = 0; i < INPUT_FIELDS.length; i++) {
        isValid = await this._isValid(i, this.userInfo[INPUT_FIELDS[i].name])
        if (!isValid) {
          this._focus(i)
          break
        }
      }
      if (isValid) {
        this.props.navigation.navigate('SignUpStep2')
      }
    } else {
      const {
        inputFields,
      } = this.state

      // show & focus next field
      inputFields[this.focusedFieldIndex + 1].isVisible = true
      this.setState({
        inputFields,
      }, () => this._focus(this.focusedFieldIndex + 1))
    }
  }

  _focus = (index) => {
    const {
      inputFields,
    } = this.state
    if (inputFields[index].ref && inputFields[index].ref.current) {
      inputFields[index].ref.current.focus()
    }
  }

  render() {
    const {
      inputFields,
    } = this.state

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps='always'
        innerRef={ref => {
          this._scroll = ref
        }}>
        <View style={styles.container}>
          {
            INPUT_FIELDS.map((field, index) => {
              if (inputFields[index].isVisible) {
                return (
                  <CustomTextInput
                    inputRef={inputFields[index].ref}
                    key={index}
                    index={index}
                    style={styles.textInput}
                    label={field.label}
                    textContentType={field.textContentType}
                    autoFocus={index == this.focusedFieldIndex}
                    value={this.userInfo[INPUT_FIELDS[index].name]}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    onChangeText={this._onChangeText}
                    onSubmitEditing={this._onSubmitEditing}
                    blurOnSubmit={index + 1 > INPUT_FIELDS.length && !inputFields[index].error}
                    error={inputFields[index].error}
                    errorMessage={inputFields[index].errorMessage}
                  />
                )
              }
            })
          }
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
})

const mapDispatchToProps = (dispatch) => ({
  save: (userInfo) => dispatch(UserActions.save(userInfo)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStep1)
