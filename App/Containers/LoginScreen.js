import React, { Component } from 'react'
import {
    Platform,
    View,
    Keyboard,
    Text,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import CustomTextInput from '@components/CustomTextInput'
import I18n from '@i18n'
import Button from '@components/Button'
import TertiaryButton from '@components/TertiaryButton'
import { isEmpty } from '@utils/TextUtils'
import { Constants } from '@resources'
import LoadingSpinner from '@components/LoadingSpinner'
import AppActions from '@redux/AppRedux'
import UserActions from '@redux/UserRedux'
import { sendEmail } from '@services/LinkHandler'

import styles from './Styles/LoginScreenStyles'

const KNOWN_ERRORS = [
    'INVALIDCREDENTIALS',
    'LOCKED',
    'ACCOUNTINACTIVE',
    'FORCECHANGE',
]

class LoginScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            footerHeight: 0,
            email: props.email,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.getAccessTokenFailure && this.props.getAccessTokenFailure != prevProps.getAccessTokenFailure) {
            var errorMessage = I18n.t('login.unknown_error')
            if (KNOWN_ERRORS.includes(this.props.error)) {
                errorMessage = I18n.t(`login.${this.props.error}`)
            }
            this.setState({
                isLoading: false,
                passwordError: true,
                errorMessage,
            })
        }
        if (this.props.access_token != prevProps.access_token) {
            this.props.signInSuccess()
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

    _onChangeEmail = (index, email) => {
        this.setState({
            email,
            emailError: !this._isValidEmail(email),
        })
    }

    _isValidEmail = (email) => {
        return !isEmpty(email) && email.match(Constants.EMAIL_PATTERN)
    }

    _login = (email, password) => {
        if (!this._isValidEmail(email)) {
            this.setState({
                emailError: true,
            })
            this._emailRef.focus()
        } else if (isEmpty(password)) {
            this.setState({
                passwordError: true,
            })
            this._passwordRef.focus()
        } else {
            this._doLogin(email, password)
        }
    }

    _doLogin = (email, password) => {
        const {
            isLoading,
        } = this.state

        if (!isLoading) {
            this.setState({
                isLoading: true,
            })
            this.props.getAccessToken(Constants.GRANT_TYPE.PASSWORD, email, password)

            this.props.save(email)
        }
    }

    contactUs = () => {
        sendEmail(
            I18n.t('login.contact_email'),
            I18n.t('login.contact_subject'),
        )
    }

    render() {
        const {
            isLoading,
            email,
            emailError,
            password,
            passwordError,
            errorMessage,
            footerHeight,
        } = this.state
        const isValidEmail = this._isValidEmail(email)

        return (
            <View style={styles.container}>
                <CustomTextInput
                    inputRef={component => this._emailRef = component}
                    style={styles.email}
                    label={I18n.t('login.email')}
                    autoFocus={!isValidEmail}
                    textContentType='emailAddress'
                    onChangeText={this._onChangeEmail}
                    value={email}
                    onBlur={() => this.setState({ emailError: !isValidEmail })}
                    error={emailError}
                    onSubmitEditing={() => {
                        if (isValidEmail) {
                            this._passwordRef.focus()
                        } else {
                            this.setState({
                                emailError: true,
                            })
                        }
                    }}
                    blurOnSubmit={false}
                    editable={!isLoading}
                />
                <CustomTextInput
                    inputRef={component => this._passwordRef = component}
                    style={styles.password}
                    label={I18n.t('login.password')}
                    autoFocus={isValidEmail && isEmpty(password)}
                    textContentType='password'
                    onChangeText={(index, password) => this.setState({
                        password,
                    })}
                    error={passwordError}
                    onSubmitEditing={() => this._login(email, password)}
                    blurOnSubmit={!isEmpty(password)}
                    editable={!isLoading}
                />
                {(emailError || passwordError) && <Text style={styles.errorMessage}>{emailError ? I18n.t('login.msg_invalid_email') : errorMessage}</Text>}
                <View style={styles.space} />
                <Button
                    title={I18n.t('login.login')}
                    disabled={!isValidEmail || isEmpty(password)}
                    onPress={() => this._doLogin(email, password)}
                />
                <TertiaryButton
                    title={I18n.t('login.forgot_password')}
                    textStyle={styles.forgot_password}
                    onPress={() => this.props.navigation.navigate('ForgotPasswordScreen', { email })}
                />
                <View style={styles.contact}>
                    <Text style={styles.contact_prefix}>{I18n.t('login.contact_prefix')}</Text>
                    <TouchableOpacity onPress={this.contactUs}>
                        <Text style={styles.contact_email}>{I18n.t('login.contact_email')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: footerHeight }} />

                {isLoading && <LoadingSpinner />}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    email: state.user.email,
    getAccessTokenFailure: state.app.getAccessTokenFailure,
    access_token: state.app.access_token,
    error: state.app.errorMessage,
})

const mapDispatchToProps = (dispatch) => ({
    getAccessToken: (grantType, email, password) => dispatch(AppActions.getAccessToken(grantType, null, email, password)),
    signInSuccess: () => dispatch(AppActions.signInSuccess()),
    save: (email) => dispatch(UserActions.save(null, email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)