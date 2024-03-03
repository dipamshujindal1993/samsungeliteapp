import React, { Component } from 'react'
import {
  View,
  Text,
  Switch,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import Button from '@components/Button'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import Space from '@components/Space'
import TertiaryButton from '@components/TertiaryButton'
import AppActions from '@redux/AppRedux'
import UserActions from '@redux/UserRedux'
import { Colors, Constants } from '@resources'
import ToastMessage from '@components/ToastMessage'
import { openInAppBrowser } from '@services/LinkHandler'

import styles from './Styles/SignUpStep3Styles'

import StartupActions from '@redux/StartupRedux'

class SignUpStep3 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      optedInPushNotifications: true,
      optedInEmailPromotions: true,
    }
  }
  
  componentDidUpdate(prevProps) {
    const { 
      isChangeAffiliation 
    } = this.props.navigation.state.params
    const { 
      accessToken, 
      errorMessage, 
      getAccessToken, 
      getAccessTokenFailure,
      postSignUp, 
      refreshAudiences, 
      refreshAudiencesFailure,
      refreshAudiencesSuccess,
      showHideChangingAffiliationCodeSuccessDialog, 
      signedIn,
      appErrorMessage,
      signOut,
      signUpSuccess, 
      signUpFailure,  
      signInSuccess,
      startup,
      updateUserSummarySuccess,
      updateUserSummaryFailure,
      userId, 
      userSummary,
      userInfo,
      save,
    } = this.props

    if (signUpSuccess && prevProps.signUpSuccess != signUpSuccess) {
      refreshAudiences(userId)
    } else if (updateUserSummarySuccess && prevProps.updateUserSummarySuccess !== updateUserSummarySuccess) {
      refreshAudiences(userSummary.userId)
    } else if (updateUserSummaryFailure && prevProps.updateUserSummaryFailure !== updateUserSummaryFailure) {
      ToastMessage(I18n.t('sign_up.unable_change_affiliation'))
      this.setState({ isLoading: false })
    } else if (signUpFailure && prevProps.signUpFailure != signUpFailure) {
      this.setState({
        isLoading: false,
      })
      ToastMessage(errorMessage.includes('.') ? errorMessage.substring(errorMessage.indexOf('.') + 1) : errorMessage)
    } else if (refreshAudiencesSuccess && prevProps.refreshAudiencesSuccess != refreshAudiencesSuccess) {
      if (isChangeAffiliation) {
        showHideChangingAffiliationCodeSuccessDialog(true)
        getAccessToken(Constants.GRANT_TYPE.REFRESH_TOKEN)
      } else {
        const {
          emailAddress,
          password,
        } = userInfo
        getAccessToken(Constants.GRANT_TYPE.PASSWORD, emailAddress, password)
        save(emailAddress)

        postSignUp()
      }
    } else if (refreshAudiencesFailure && prevProps.refreshAudiencesFailure != refreshAudiencesFailure) {
      if (isChangeAffiliation) {
        showHideChangingAffiliationCodeSuccessDialog(true)
        getAccessToken(Constants.GRANT_TYPE.REFRESH_TOKEN)
      } else {
        this.setState({
          isLoading: false,
        })

        postSignUp()
      }
    } 
    else if (getAccessTokenFailure && prevProps.getAccessTokenFailure != getAccessTokenFailure) {
      this.setState({
        isLoading: false,
      })

      postSignUp()

      if (signedIn) {
        signOut()
      } else {
        ToastMessage(appErrorMessage)
        this.props.navigation.navigate('StartScreen')
      }
    } else if (accessToken && prevProps.accessToken !== accessToken) {
      if (isChangeAffiliation) {
        startup()
      } else {
        signInSuccess()

        postSignUp()
      }
    }
  }

  _optedInPushNotifications = (value) => {
    this.setState({
      optedInPushNotifications: value,
    })
  }

  _optedInEmailPromotions = (value) => {
    this.setState({
      optedInEmailPromotions: value,
    })
  }

  _onUpdate = (userInfoChangingAffiliationCode) => {
    const {
      optedInPushNotifications,
      optedInEmailPromotions,
    } = this.state
    const {
      userSummary,
      navigation,
    } = this.props
    
    let fieldChanges = false
    if (userInfoChangingAffiliationCode.phone !== userSummary.businessAddress.mobile ||
      optedInPushNotifications !== userSummary.push_opt_in ||
      optedInEmailPromotions !== userSummary.email_opt_in ||
      userInfoChangingAffiliationCode.role !== userSummary.primaryJob ||
      userInfoChangingAffiliationCode.store != userSummary.organizations.filter(organization => organization.isPrimary)[0].name) {
      fieldChanges = true
    }
    if (!fieldChanges) {
      navigation.pop(2)
    } else {
      const userInfo = {
        "businessAddress": {
          "mobile": userInfoChangingAffiliationCode.phone, 
        },
        "push_opt_in": optedInPushNotifications,
        "email_opt_in": optedInEmailPromotions,
        "primaryDomainId": userInfoChangingAffiliationCode.domainId,
        "primaryOrganizationId": userInfoChangingAffiliationCode.organizationId,
      }
      if (userInfoChangingAffiliationCode.jobTemplateId) {
        userInfo['primaryJobId'] = userInfoChangingAffiliationCode.jobTemplateId
      }
      this.props.updateUserSummary(userInfo)
      this.setState({ isLoading: true })
    }
  }

  render () {
    const {
      signUp,
      userInfo,
      userInfoChangingAffiliationCode,
      navigation,
    } = this.props

    const {
      isLoading,
      optedInPushNotifications,
      optedInEmailPromotions,
    } = this.state

    const { 
      isChangeAffiliation,
    } = this.props.navigation.state.params

    return (
      <View style={styles.container}>
        <View style={styles.preferenceContainer}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.preference}>{I18n.t('sign_up.push_notifications')}</Text>
            <Text style={styles.description}>{I18n.t('sign_up.push_notifications_description')}</Text>
          </View>
          <Switch
            value={optedInPushNotifications}
            onValueChange={this._optedInPushNotifications}
            thumbColor={Platform.OS === 'android' ? Colors.white : null}
            trackColor={{true: Colors.rgb_4297ff}}
          />
        </View>
        <Separator />
        <View style={styles.preferenceContainer}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.preference}>{I18n.t('sign_up.email_promotions')}</Text>
            <Text style={styles.description}>{I18n.t('sign_up.email_promotions_description')}</Text>
          </View>
          <Switch
            value={optedInEmailPromotions}
            onValueChange={this._optedInEmailPromotions}
            thumbColor={Platform.OS === 'android' ? Colors.white : null}
            trackColor={{true: Colors.rgb_4297ff}}
          />
        </View>
        <Separator />
        <Space />
        {!isChangeAffiliation &&
          <Button
            title={I18n.t('sign_up.sign_up')}
            onPress={() => {
              this,this.setState({
                isLoading: true,
              })
              signUp(Object.assign({}, userInfo, { optedInPushNotifications, optedInEmailPromotions }))}
            }
          />
        }
        {isChangeAffiliation && 
          (<View>
            <Button
              title={I18n.t('sign_up.update')}
              onPress={() => this._onUpdate(userInfoChangingAffiliationCode)}
            />
            <TertiaryButton
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              title={I18n.t('sign_up.cancel')}
              onPress={() => navigation.pop(2)}
            />
          </View>)
        }
        <View style={styles.acceptTermsConditionsContainer}>
          <Text style={styles.acceptTermsConditions}>{I18n.t('sign_up.accept_terms_conditions_prefix')}
            <Text style={styles.acceptTermsConditionsUnderline} onPress={() => this.props.navigation.navigate('TNCDetailScreen', { isChangeAffiliation })}>{I18n.t('sign_up.terms_of_service')}</Text>
            {I18n.t('sign_up.accept_terms_conditions_infix')}
            <Text style={styles.acceptTermsConditionsUnderline} onPress={() => openInAppBrowser(Constants.PRIVACY_POLICY_URL, I18n.t('settings.privacy_policy'))}>{I18n.t('sign_up.privacy_policy')}</Text>
            {I18n.t('sign_up.accept_terms_conditions_suffix')}
          </Text>
        </View>
        { ((isLoading) && <LoadingSpinner />) }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  signUpSuccess: state.user.signUpSuccess,
  signUpFailure: state.user.signUpFailure,
  userSummary: state.user.summary,
  updateUserSummaryFailure: state.user.updateUserSummaryFailure,
  updateUserSummarySuccess: state.user.updateUserSummarySuccess,
  userId: state.user.userId,
  refreshAudiencesSuccess: state.user.refreshAudiencesSuccess,
  refreshAudiencesFailure: state.user.refreshAudiencesFailure,
  getAccessTokenFailure: state.app.getAccessTokenFailure,
  signedIn: state.app.signedIn,
  accessToken: state.app.access_token,
  appErrorMessage: state.app.errorMessage,
  errorMessage: state.user.errorMessage,
  userInfo: state.user.userInfo,
  userInfoChangingAffiliationCode: state.user.userInfoChangingAffiliationCode,
})

const mapDispatchToProps = (dispatch) => ({
  getAccessToken: (grantType, email, password) => dispatch(AppActions.getAccessToken(grantType, null, email, password)),
  save: (email) => dispatch(UserActions.save(null, email)),
  signUp: (userInfo) => dispatch(UserActions.signUp(userInfo)),
  refreshAudiences: (userId) => dispatch(UserActions.refreshAudiences(userId)),
  postSignUp: () => dispatch(UserActions.postSignUp()),
  startup: () => dispatch(StartupActions.startup()),
  signInSuccess: () => dispatch(AppActions.signInSuccess()),
  signOut: () => dispatch(AppActions.signOut()),
  updateUserSummary: (userSummary) => dispatch(UserActions.updateUserSummary(userSummary)),
  showHideChangingAffiliationCodeSuccessDialog: (isVisible) => dispatch(UserActions.showHideChangingAffiliationCodeSuccessDialog(isVisible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStep3)