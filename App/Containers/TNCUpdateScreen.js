import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import RNExitApp from 'react-native-exit-app'

import Button from '@components/Button'
import I18n from '@i18n'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import RadioButton from '@components/RadioButton'
import Space from '@components/Space'
import TertiaryButton from '@components/TertiaryButton'
import ToastMessage from '@components/ToastMessage'
import UserActions from '@redux/UserRedux'
import { Constants } from '@resources'

import styles from './Styles/TNCUpdateScreenStyles'
import AppName from '@svg/icon_logo_elite.svg'

class TNCUpdateScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      agree: false,
      updating: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { 
      acceptedNewTermsConditions,
      updateUserSummarySuccess, 
      updateUserSummaryFailure, 
    } = this.props
    if (updateUserSummaryFailure && updateUserSummaryFailure !== prevProps.updateUserSummaryFailure) {
      ToastMessage(I18n.t('tnc.fail_update'))
      this.setState({ updating: false })
    }
    if (updateUserSummarySuccess && updateUserSummarySuccess !== prevProps.updateUserSummarySuccess) {
      acceptedNewTermsConditions()
      this.setState({ updating: false })
    }
  }

  onContinue() {
    const { tnc, updateUserSummary } = this.props
    const newTncHash = tnc.hash
    const userInfo = {
      "personOptional1": {
        "text2": newTncHash,
      }
    }
    this.setState({ updating: true })
    updateUserSummary(userInfo)
  }

  onDecline() {
    RNExitApp.exitApp()
  }

  render() {
    const { updating } = this.state
    return (
      <View style={styles.container}>
        {this.renderImage()}
        {this.renderLogo()}
        {this.renderContent()}
        {updating && <LoadingSpinner />}
      </View>
    )
  }

  renderImage() {
    return <ImageEx
      style={styles.image}
      source={{ uri: `${Constants.S3_BASE_URL}/terms_conditions_update.png` }}
    />
  }

  renderLogo() {
    return <AppName
      height={31}
      width={190}
      style={styles.logo}
    />
  }

  renderContent() {
    const { navigation } = this.props
    const { agree } = this.state
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{I18n.t('tnc.tnc_title')}</Text>
        <Text style={styles.body}>{I18n.t('tnc.tnc_message')}</Text>
        <TouchableOpacity
          style={styles.selectorContainer}
          onPress={() => this.setState((prevState) => ({ agree: !prevState.agree }))}
        >
          <View>
            <RadioButton isSelected={agree}/>
          </View>
          <Text style={styles.selector}>{I18n.t('tnc.i_agree')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TNCDetailScreen')}>
            <Text style={[styles.selector, styles.blue]}>{I18n.t('tnc.tnc')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <Space />
        <Button
          onPress={() => this.onContinue()}
          disabled={!agree}
          title={I18n.t('tnc.continue')}
        />
        <TertiaryButton 
          onPress={() => this.onDecline()}
          style={styles.declineButton} 
          textStyle={styles.blue} 
          title={I18n.t('tnc.decline')} 
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  tnc: state.user.tnc,
  updateUserSummaryFailure: state.user.updateUserSummaryFailure,
  updateUserSummarySuccess: state.user.updateUserSummarySuccess,
})

const mapDispatchToProps = (dispatch) => ({
  acceptedNewTermsConditions: () => dispatch(UserActions.acceptedNewTermsConditions()),
  updateUserSummary: (userInfo) => dispatch(UserActions.updateUserSummary(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(TNCUpdateScreen)
