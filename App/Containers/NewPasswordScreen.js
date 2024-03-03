import React, { Component } from 'react'
import {
    Platform,
    Keyboard,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import LoadingSpinner from '@components/LoadingSpinner'
import CustomTextInput from '@components/CustomTextInput'
import Button from '@components/Button'
import { isEmpty } from '@utils/TextUtils'
import { Constants } from '@resources'
import AppActions from '@redux/AppRedux'
import UserActions from '@redux/UserRedux'

import styles from './Styles/NewPasswordScreenStyles'

const KNOWN_ERRORS = [
    'INVALIDCREDENTIALS',
    'LOCKED',
    'ACCOUNTINACTIVE',
    'FORCECHANGE',
]

class NewPasswordScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            footerHeight: 0,
        }
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.updatePasswordSuccess != this.props.updatePasswordSuccess && this.props.updatePasswordSuccess) {
            const {
                email,
            } = this.props.navigation.state.params

            this.props.getAccessToken(Constants.GRANT_TYPE.PASSWORD, email, this.state.password)

            this.props.save(email)
        }
        if (prevProps.updatePasswordFailure != this.props.updatePasswordFailure && this.props.updatePasswordFailure) {
            this.setState({
                serverError: I18n.t('forgot_password.msg_reset_password_error'),
            })
        }
        if (prevProps.getAccessTokenFailure != this.props.getAccessTokenFailure && this.props.getAccessTokenFailure) {
            var errorMessage = I18n.t('login.unknown_error')
            if (KNOWN_ERRORS.includes(this.props.error)) {
                errorMessage = I18n.t(`login.${this.props.error}`)
            }
            this.setState({
                serverError: errorMessage,
            })
        }
        if (this.props.access_token != prevProps.access_token) {
            this.props.signInSuccess()
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

    _onChangePassword = (index, password) => {
        this.setState({
            password,
            validPassword: !isEmpty(password) && password.match(Constants.PASSWORD_PATTERN),
            confirmPassword: '',
            passwordMatch: false,
            serverError: false,
        })
    }

    _onChangeConfirmPassword = (index, confirmPassword) => {
        this.setState({
            confirmPassword,
            passwordMatch: confirmPassword == this.state.password,
            serverError: false,
        })
    }

    _submit = () => {
        const {
            password,
            passwordMatch,
        } = this.state
        if (passwordMatch && !this.props.isUpdatingPassword) {
            const {
                otp,
                email,
            } = this.props.navigation.state.params
            this.props.updatePassword(otp, email, password)
        }
    }

    render() {
        const {
            password,
            validPassword,
            confirmPassword,
            passwordMatch,
            serverError,
            footerHeight,
        } = this.state

        return (
            <View style={styles.container}>
                <CustomTextInput
                    style={styles.password}
                    label={I18n.t('forgot_password.password')}
                    autoFocus={true}
                    textContentType='password'
                    onChangeText={this._onChangePassword}
                    value={password}
                    onSubmitEditing={() => {
                        if (validPassword) {
                            this._confirmPasswordRef.focus()
                        }
                    }}
                    blurOnSubmit={false}
                    error={!validPassword && !isEmpty(password)}
                    errorMessage={I18n.t('forgot_password.msg_invalid_password')}
                    editable={!this.props.isUpdatingPassword}
                />
                {validPassword && <CustomTextInput
                    inputRef={component => this._confirmPasswordRef = component}
                    style={styles.confirmPassword}
                    label={I18n.t('forgot_password.confirm_password')}
                    textContentType='password'
                    onChangeText={this._onChangeConfirmPassword}
                    value={confirmPassword}
                    onSubmitEditing={this._submit}
                    blurOnSubmit={false}
                    error={(!passwordMatch && !isEmpty(confirmPassword)) || serverError}
                    errorMessage={serverError ? serverError : I18n.t('forgot_password.msg_password_not_match')}
                    editable={!this.props.isUpdatingPassword}
                />}
                {validPassword &&
                    <>
                        <View style={styles.space} />
                        <Button
                            title={I18n.t('forgot_password.submit')}
                            disabled={!passwordMatch}
                            onPress={this._submit}
                        />
                        <View style={{ height: footerHeight }} />
                    </>
                }
                {(this.props.isUpdatingPassword || this.props.isGettingAccessToken) && <LoadingSpinner />}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    isUpdatingPassword: state.user.isUpdatingPassword,
    updatePasswordSuccess: state.user.updatePasswordSuccess,
    updatePasswordFailure: state.user.updatePasswordFailure,
    isGettingAccessToken: state.app.isGettingAccessToken,
    getAccessTokenFailure: state.app.getAccessTokenFailure,
})

const mapDispatchToProps = (dispatch) => ({
    updatePassword: (otp, email, password) => dispatch(UserActions.updatePassword(otp, email, password)),
    getAccessToken: (grantType, email, password) => dispatch(AppActions.getAccessToken(grantType, null, email, password)),
    signInSuccess: () => dispatch(AppActions.signInSuccess()),
    save: (email) => dispatch(UserActions.save(null, email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewPasswordScreen)