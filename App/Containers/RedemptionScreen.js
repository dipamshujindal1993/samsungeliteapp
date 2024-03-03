import React, { Component } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import Button from '@components/Button'
import CustomTextInput from '@components/CustomTextInput'
import HeaderTitle from '@components/HeaderTitle'
import I18n from '@i18n'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import OTPDialog from '@components/OTPDialog'
import RewardsActions from '@redux/RewardsRedux'
import AppActions from '@redux/AppRedux'
import ToastMessage from '@components/ToastMessage'
import UserActions from '@redux/UserRedux'
import { Constants } from '@resources'
import { isEmpty, formatString } from '@utils/TextUtils'

import styles from './Styles/RedemptionScreenStyles'

const screenStatus = {
  confirm: 1,
  update: 2,
  redemptionSuccess: 3,
  redemptionOnHold: 4,
}

class RedemptionScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={navigation.getParam('headerTitle')}/>
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      status: screenStatus.confirm,
      buttonDisabled: false,
      ineligible: true,
      newEmail: '',
      keyboardOn: false,
      dialogOn: false,
      footerHeight: 24,
      isLoading: false,
    }
    this.keyboardWillShowAgain = false
  }

  componentDidMount() {
    const { rewardId, rewardDetail } = this.props.navigation.state.params
    if(rewardDetail){
      this.setState({
        ineligible: rewardDetail.status === Constants.REWARD_STATUS.PENDING
      })
    }
    if(rewardId){
      this.props.getRewardDetail(rewardId)
    }
    if (Platform.OS === 'ios') {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._onkeyboardHide)
    } else {
      this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
      this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this._onkeyboardHide)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.keyboardWillShowSub.remove()
      this.keyboardWillHideSub.remove()
    } else {
      this.keyboardDidShowSub.remove()
      this.keyboardDidHideSub.remove()
    }
    this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true);
  }

  _keyboardWillShow = () => {
    this.setState({
      keyboardOn: true,
      footerHeight: 200
    })
    this.keyboardWillShowAgain = false
  }

  _keyboardDidShow = () => {
    this.setState({
      keyboardOn: true,
    })
    this.keyboardWillShowAgain = false
  }

  _onkeyboardHide = () => {
    if (!this.keyboardWillShowAgain){
      this.setState({
        keyboardOn: false,
        footerHeight: 24,
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { participationResult, getPoints, summary, rewardDetails, updateUserSummarySuccess, updateUserSummaryFailure } = this.props
    const { rewardId } = this.props.navigation.state.params
    if (participationResult && participationResult !== prevProps.participationResult) {
      if (participationResult.result === Constants.REWARD_PARTICIPATION_RESULT.COMPLETED) {
        this.switchScreenStatus(screenStatus.redemptionSuccess)
        getPoints()
      } else if (participationResult.result === Constants.REWARD_PARTICIPATION_RESULT.PENDED) {
        this.switchScreenStatus(screenStatus.redemptionOnHold)
      } else {
        ToastMessage(I18n.t('redemptions.unable_to_redeem'))
      }
      this.setState({ buttonDisabled: false })
    }
    if (summary !== prevProps.summary && updateUserSummarySuccess) {
      this.setState({ isLoading: false })
      this.switchScreenStatus(screenStatus.confirm)
    }
    if (updateUserSummaryFailure && updateUserSummaryFailure !== prevProps.updateUserSummaryFailure) {
      this.setState({ isLoading: false })
      ToastMessage(I18n.t('redemptions.error_update_account'))
    }
    if (rewardDetails !=  prevProps.rewardDetails) {
      const rewardDetail = this.props.rewardDetails.filter(rewardDetail => rewardDetail.rewardId == rewardId)[0]
      this.props.navigation.setParams({
        rewardDetail
      })
      this.setState({ineligible: rewardDetail.status === Constants.REWARD_STATUS.PENDING})
    }
  }

  switchScreenStatus(status) {
    const { navigation } = this.props
    switch (status) {
      case screenStatus.confirm:
        this.setState({ status: screenStatus.confirm })
        navigation.setParams({ headerTitle: I18n.t('redemptions.screen_title_confirm_email') })
        break
      case screenStatus.update:
        this.setState({ status: screenStatus.update })
        navigation.setParams({ headerTitle: I18n.t('redemptions.screen_title_change_email') })
        break
      case screenStatus.redemptionSuccess:
        this.setState({ status: screenStatus.redemptionSuccess })
        navigation.setParams({ headerTitle: I18n.t('redemptions.screen_title_complete') })
        break
      case screenStatus.redemptionOnHold:
        this.setState({ status: screenStatus.redemptionOnHold })
        navigation.setParams({ headerTitle: I18n.t('redemptions.screen_title_on_hold') })
        break
      default:
        break
    }
  }

  onConfirmEmail() {
    const { getRewardParticipationResult } = this.props
    const { rewardDetail, quantity } = this.props.navigation.state.params
    getRewardParticipationResult(rewardDetail.rewardId, quantity)
    this.setState({ buttonDisabled: true })
  }

  onNewEmailSubmit() {
    const { newEmail } = this.state
    const validEmail = this.isValidEmail(newEmail)
    if (validEmail) {
      this.keyboardWillShowAgain = true
      this.setState({ dialogOn: true })
    }
  }

  onOTPValidated() {
    this.setState({ dialogOn: false, isLoading: true })
    this.props.updateUserSummary({ userName: this.state.newEmail })
  }

  isValidEmail = (email) => {
    return !isEmpty(email) && email.match(Constants.EMAIL_PATTERN)
  }

  render() {
    const { keyboardOn, isLoading } = this.state
    const { rewardDetail } = this.props.navigation.state.params;
    if(!rewardDetail){
      return <LoadingSpinner />
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        {!keyboardOn && this.renderImage()}
        {!keyboardOn && this.renderTitle()}
        {this.renderContent()}
        {this.renderSpace()}
        {this.renderCTAButton()}
        {this.renderFooter()}
        {this.renderDialog()}
        {isLoading && <LoadingSpinner />}
      </KeyboardAvoidingView>
    )
  }

  renderSpace() {
    return <View style={styles.space}/>
  }

  renderFooter() {
    const { footerHeight } = this.state
    return <View style={{height: footerHeight}}/>
  }

  renderImage() {
    const { rewardDetail } = this.props.navigation.state.params
    return (
      <ImageEx
        style={styles.titleImage}
        source={{ uri: rewardDetail.imageUrl }}
      />
    )
  }

  renderTitle() {
    const { status } = this.state
    let title
    switch (status) {
      case screenStatus.confirm:
        title = I18n.t('redemptions.title_confirm_email')
        break
      case screenStatus.update:
        title = I18n.t('redemptions.title_new_email')
        break
      case screenStatus.redemptionSuccess:
        title = I18n.t('redemptions.title_redeem_success')
        break
      case screenStatus.redemptionOnHold:
        title = I18n.t('redemptions.title_redeem_on_hold')
        break
      default:
        break
    }
    return !isEmpty(title) && <Text style={styles.title}>{title}</Text>
  }

  renderContent() {
    const { status, newEmail, ineligible } = this.state
    const { summary } = this.props
    const { rewardDetail } = this.props.navigation.state.params
    switch (status) {
      case screenStatus.confirm:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitleText}>{summary.username}</Text>
            <Text style={styles.descriptionText}>{ineligible ? I18n.t('redemptions.desc_redeem_on_hold') : I18n.t('redemptions.desc_confirm_email')}</Text>
            <TouchableOpacity onPress={() => this.switchScreenStatus(screenStatus.update)}>
              <Text style={styles.changeEmailText}>{I18n.t('redemptions.change_your_email_address')}</Text>
            </TouchableOpacity>
          </View>
        )
      case screenStatus.update:
        const isValidEmail = isEmpty(newEmail) || this.isValidEmail(newEmail)
        return (
          <View style={styles.updateContentContainer}>
            <View style={styles.contentContainer}>
              <CustomTextInput
                style={styles.emailTextInput}
                autoFocus={true}
                label={I18n.t('redemptions.label_email')}
                textContentType={'emailAddress'}
                value={newEmail}
                onChangeText={(index, value) => this.setState({ newEmail: value })}
                error={!isValidEmail}
              />
              {isValidEmail && <Text style={styles.descriptionText}>{I18n.t('redemptions.desc_new_email')}</Text>}
              {!isValidEmail && <Text style={styles.descriptionErrorText}>{I18n.t('sign_up.msg_invalid_email')}</Text>}
            </View>
            <TouchableOpacity onPress={() => this.switchScreenStatus(screenStatus.confirm)}>
              <Text style={styles.keepCurrentText}>{I18n.t('redemptions.keep_current_email_address')}</Text>
            </TouchableOpacity>
          </View>
        )
      case screenStatus.redemptionSuccess:
        let descriptionText = ''
        switch(rewardDetail.type) {
          case Constants.REWARD_TYPES.REDEMPTION:
            descriptionText = formatString(I18n.t('redemptions.desc_redeem_success_product'), rewardDetail.title)
            break
          case Constants.REWARD_TYPES.SWEEPSTAKES:
            descriptionText = formatString(I18n.t('redemptions.desc_redeem_success_sweepstakes'), rewardDetail.title)
            break
          case Constants.REWARD_TYPES.INSTANT_WHEEL:
            descriptionText = formatString(I18n.t('redemptions.desc_redeem_success_instant_win'), rewardDetail.title)
            break
          default:
            descriptionText = ''
            break
        }
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitleText}>{summary.username}</Text>
            <Text style={styles.descriptionText}>{descriptionText}</Text>
          </View>
        )
      case screenStatus.redemptionOnHold:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitleText}>{summary.username}</Text>
            <Text style={styles.descriptionText}>{I18n.t('redemptions.desc_redeem_on_hold')}</Text>
          </View>
        )
      default:
        return null
    }
  }

  renderCTAButton() {
    const { status, buttonDisabled } = this.state
    const { navigation } = this.props
    let title, onPress
    switch (status) {
      case screenStatus.confirm:
        title = I18n.t('redemptions.confirm')
        onPress = () => this.onConfirmEmail()
        break
      case screenStatus.update:
        title = I18n.t('redemptions.submit')
        onPress = () => this.onNewEmailSubmit()
        break
      case screenStatus.redemptionSuccess:
        title = I18n.t('redemptions.return_to_catalog')
        onPress = () =>  navigation.pop(2), this.shouldPrompAppRating = true
        break
      case screenStatus.redemptionOnHold:
        title = I18n.t('redemptions.return_to_catalog')
        onPress = () => navigation.pop(2)
        break
      default:
        return null
    }
    return (
      <Button
        style={styles.buttonCTA}
        title={title}
        disabled={buttonDisabled}
        onPress={onPress}
      />
    )
  }

  renderDialog() {
    const { dialogOn ,newEmail } = this.state
    const { otpExpirationTime } = this.props
    if (dialogOn) {
      return (
        <OTPDialog
          title={I18n.t('otp.dialog_title')}
          message={formatString(I18n.t('otp.dialog_body'), newEmail, otpExpirationTime)}
          positive={I18n.t('otp.dialog_positive_cta')}
          onOTPValidated={() => this.onOTPValidated()}
          negative={I18n.t('otp.dialog_negative_cta')}
          negativeOnPress={() => this.setState({ dialogOn: false })}
          email={newEmail}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  participationResult: state.rewards.participationResult,
  summary: state.user.summary,
  otpExpirationTime: state.remoteConfig.otp_expiration_time,
  rewardDetails: state.rewards.rewardDetails,
  updateUserSummarySuccess: state.user.updateUserSummarySuccess,
  updateUserSummaryFailure: state.user.updateUserSummaryFailure,
})

const mapDispatchToProps = (dispatch) => ({
  getPoints: () => dispatch(UserActions.getPoints()),
  getRewardParticipationResult: (rewardId, quantity) => dispatch(RewardsActions.getRewardParticipationResult(rewardId, quantity)),
  updateUserSummary: (userSummary) => dispatch(UserActions.updateUserSummary(userSummary)),
  getRewardDetail: (rewardId) => dispatch(RewardsActions.getRewardDetail(rewardId)),
  showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(RedemptionScreen)
