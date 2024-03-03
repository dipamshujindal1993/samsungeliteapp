import React, { Component } from 'react'
import {
    Platform,
    Keyboard,
    View,
    Text,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import LoadingSpinner from '@components/LoadingSpinner'
import CustomTextInput from '@components/CustomTextInput'
import Button from '@components/Button'
import {
    formatString,
    isEmpty,
} from '@utils/TextUtils'
import { Constants } from '@resources'
import OTPDialog from '@components/OTPDialog'

import styles from './Styles/ForgotPasswordScreenStyles'

class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: props.navigation.state.params.email,
            footerHeight: 0,
        }
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub.remove()
            this.keyboardWillHideSub.remove()
        }
    }

    _keyboardWillShow = (event) => {
        this.setState({
            footerHeight: event.endCoordinates.height,
        })
    }

    _keyboardWillHide = () => {
        this.setState({
            footerHeight: 0,
        })
    }

    _isValidEmail = (email) => {
        return !isEmpty(email) && email.match(Constants.EMAIL_PATTERN)
    }

    _onChangeEmail = (index, email) => {
        this.setState({
            email,
            emailError: !this._isValidEmail(email),
        })
    }

    _renderMessage() {
        const {
            emailError,
        } = this.state

        if (emailError) {
            return (
                <Text style={styles.errorMessage}>{I18n.t('forgot_password.msg_invalid_email')}</Text>
            )
        } else {
            return (
                <Text style={styles.infoMessage}>{I18n.t('forgot_password.passcode_message')}</Text>
            )
        }
    }

    _renderOTPDialog() {
        const {
            showOTPDialog,
            email,
        } = this.state
        if (showOTPDialog) {
            const {
                otpExpirationTime,
            } = this.props
            return (
                <OTPDialog
                    title={I18n.t('forgot_password.email_verification_dialog_title')}
                    message={formatString(I18n.t('forgot_password.email_verification_dialog_message'), email, otpExpirationTime)}
                    negative={I18n.t('forgot_password.email_verification_dialog_negative')}
                    positive={I18n.t('forgot_password.email_verification_dialog_positive')}
                    negativeOnPress={() => this.setState({ showOTPDialog: false })}
                    email={email}
                    onOTPValidated={(otp) => {
                        this.setState({ showOTPDialog: false })
                        this.props.navigation.navigate('NewPasswordScreen', { otp, email })
                    }}
                />
            )
        }
    }

    render() {
        const {
            isLoading,
            email,
            emailError,
            footerHeight,
        } = this.state

        return (
            <View style={styles.container}>
                <CustomTextInput
                    style={styles.email}
                    label={I18n.t('forgot_password.email')}
                    autoFocus={true}
                    textContentType='emailAddress'
                    onChangeText={this._onChangeEmail}
                    value={email}
                    error={emailError}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                        if (this._isValidEmail(email)) {
                            this.setState({ showOTPDialog: true })
                        }
                    }}
                />
                {this._renderMessage()}
                <View style={styles.space} />
                <Button
                    title={I18n.t('forgot_password.submit')}
                    disabled={emailError || isEmpty(email)}
                    onPress={() => this.setState({ showOTPDialog: true })}
                />
                <View style={{ height: footerHeight }} />
                {this._renderOTPDialog()}
                {isLoading && <LoadingSpinner />}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    otpExpirationTime: state.remoteConfig.otp_expiration_time,
})

export default connect(mapStateToProps)(ForgotPasswordScreen)