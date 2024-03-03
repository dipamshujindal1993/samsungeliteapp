import React, { Component } from 'react'
import {
  Animated,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import UserActions from '@redux/UserRedux'

import styles from './Styles/OTPDialogStyles'

const OTPLength = 6

class OTPDialog extends Component {

  constructor(props) {
    super(props)

    this.state = {
      error: false,
      textInputValue: '',
      shownValue: ''.padEnd(OTPLength, '-').split(''),
      resentOpacity: new Animated.Value(0),
    }
  }

  componentDidMount() {
    const { email, requestOTP } = this.props
    requestOTP(email)
  }

  componentDidUpdate(prevProps) {
    const {
      verifyOTPResponse,
      onOTPValidated,
      verifyOTPFailure,
    } = this.props
    if (verifyOTPResponse !== prevProps.verifyOTPResponse) {
      if (verifyOTPResponse.success) {
        this.resetField()
        onOTPValidated(this.state.textInputValue)
      } else {
        this.setState({ error: true })
      }
    }
    if (verifyOTPFailure && prevProps.verifyOTPFailure != verifyOTPFailure) {
      this.setState({
        error: true,
        errorMessage: I18n.t('otp.dialog_msg_verify_failed'),
      })
    }
  }

  showResent() {
    this.setState({ resentOpacity: new Animated.Value(1) }, () => this.fadeOutResent())
  }

  fadeOutResent() {
    Animated.timing(
      this.state.resentOpacity,
      {
        toValue: 0,
        duration: 3000,
      }
    ).start()
  }

  onChangeText(value) {
    const { email, verifyOTP } = this.props
    this.setState({
      error: false,
      textInputValue: value,
      shownValue: value.padEnd(OTPLength, '-').split(''),
    })
    if (value.length === OTPLength) {
      verifyOTP(email, value)
    }
  }

  negativeOnPress() {
    this.resetField()
    if (this.props.negativeOnPress) {
      this.props.negativeOnPress()
    }
  }

  resendOTPOnPress() {
    const { email, requestOTP } = this.props
    this.resetField()
    requestOTP(email)
    this.showResent()
  }

  resetField() {
    this.refTextInput.focus()
    this.setState({
      textInputValue: '',
      shownValue: ''.padEnd(OTPLength, '-').split(''),
      error: false,
    })
  }

  render() {
    const { cancelable, onDismiss } = this.props
    return (
      <Modal
        transparent
        hardwareAccelerated
        visible={this.props.visible}
        onRequestClose={() => cancelable !== false && onDismiss ? onDismiss() : null}
      >
        <View style={styles.background}>
          <View style={styles.dialogView}>
            {this.renderTitle()}
            {this.renderResend()}
            {this.renderMessage()}
            {this.renderInput()}
            {this.renderError()}
            {this.renderBottomCTA()}
          </View>
          {Platform.OS === 'ios' && <View style={styles.iosFooter} />}
        </View>
      </Modal>
    )
  }

  renderResend() {
    return (
      <Animated.Text style={[styles.resendText, { opacity: this.state.resentOpacity }]}>{I18n.t('otp.resent_notification')}</Animated.Text>
    )
  }

  renderTitle() {
    const { title, titleTextAlign } = this.props
    if (title) {
      return (
        <Text style={[styles.title, { textAlign: titleTextAlign }]}>{title}</Text>
      )
    }
    return null
  }

  renderMessage() {
    const { message, messageTextAlign } = this.props
    if (message) {
      return (
        <Text style={[styles.message, { textAlign: messageTextAlign }]}>{message}</Text>
      )
    }
    return null
  }

  renderInput() {
    const { textInputValue, shownValue } = this.state
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          ref={component => this.refTextInput = component}
          style={styles.textInput}
          autoFocus={true}
          caretHidden={true}
          keyboardType={'number-pad'}
          maxLength={OTPLength}
          value={textInputValue}
          onChangeText={(value) => this.onChangeText(value)}
          zIndex={1}
        />
        <View style={styles.textInputView}>
          {shownValue.map((value, index) => {
            return (
              <View
                key={index}
                style={[styles.otpDigitContainer, index === 2 && styles.middleSpaceRight, index === 3 && styles.middleSpaceLeft]}>
                <Text style={styles.otpDigit}>{value}</Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  renderError() {
    return (
      (this.state.error) ?
        <Text style={styles.errorMessage}>{this.state.errorMessage ? this.state.errorMessage : I18n.t('otp.dialog_msg_invalid_otp')}</Text>
        : null
    )
  }

  renderBottomCTA() {
    const { negative, positive } = this.props

    return (
      <View style={styles.ctaView}>
        {negative &&
          <TouchableOpacity onPress={() => this.negativeOnPress()}>
            <Text style={styles.cta}>{negative}</Text>
          </TouchableOpacity>}
        {positive &&
          <TouchableOpacity onPress={() => this.resendOTPOnPress()}>
            <Text style={styles.cta}>{positive}</Text>
          </TouchableOpacity>}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  verifyOTPResponse: state.user.verifyOTPResponse,
  verifyOTPFailure: state.user.verifyOTPFailure,
})

const mapDispatchToProps = (dispatch) => ({
  requestOTP: (email) => dispatch(UserActions.requestOTP(email)),
  verifyOTP: (email, otp) => dispatch(UserActions.verifyOTP(email, otp)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OTPDialog)