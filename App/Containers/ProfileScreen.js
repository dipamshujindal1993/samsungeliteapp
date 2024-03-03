import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { connect } from 'react-redux'
import UserActions from '@redux/UserRedux'

import BadgesTab from '@containers/BadgesTab'
import LoadingSpinner from '@components/LoadingSpinner'
import ProfileSection from '@components/ProfileSection'
import I18n from '@i18n'
import { Colors } from '@resources'
import { isFeatureSupported } from '@utils/CommonUtils'

import SettingsIcon from '@svg/icon_settings.svg'

import styles from './Styles/ProfileScreenStyles'

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate('SettingsScreen') }}>
            <SettingsIcon width={20} height={20} fill={Colors.white} />
          </TouchableOpacity>
        </View>
      )
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: props.summary && props.summary.firstName && props.summary.lastName ? false : true,
    }

    const {
      userAudiences,
      samsungPay,
      streak,
      transactionHistory,
      badges,
    } = this.props
    this.samsungPayEnabled = userAudiences && isFeatureSupported(samsungPay, userAudiences.data)
    this.streakEnabled = userAudiences && isFeatureSupported(streak, userAudiences.data)
    this.transactionHistoryEnabled = userAudiences && isFeatureSupported(transactionHistory, userAudiences.data)
    this.badgesEnabled = userAudiences && isFeatureSupported(badges, userAudiences.data)
  }

  componentDidMount() {
    const {
      cheilSummary,
      getCheilSummary,
      getUserSummary,
      getWeeklyActivations,
      summary,
      getActivities,
    } = this.props
    if (!summary || !summary.firstName || !summary.lastName) {
      getUserSummary()
    }
    if (!cheilSummary) {
      getCheilSummary()
    }
    if (this.samsungPayEnabled) {
      getWeeklyActivations()
    }
    if (this.streakEnabled) {
      getActivities()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { summary } = this.props
    if (summary && summary.firstName && summary.lastName && prevState.isLoading) {
      this.setState({
        isLoading: false
      })
    }
  }

  renderActivations() {
    const {
      activations,
      navigation,
    } = this.props
    if (activations) {
      return (
        <TouchableOpacity style={styles.column} disabled={!this.transactionHistoryEnabled}
          onPress={() => navigation.navigate('TransactionHistoryScreen')}>
          <Text style={styles.count}>{activations.totalCount || 0}</Text>
          <Text style={styles.countTitle}>{I18n.t('profile.weekly_activations')}</Text>
        </TouchableOpacity>
      )
    }
    return null
  }

  renderCampaigns(campaigns) {
    if (campaigns) {
      return (
        <View style={styles.column}>
          <Text style={styles.count}>{campaigns}</Text>
          <Text style={styles.countTitle}>{I18n.t('profile.campaign_streak')}</Text>
        </View>
      )
    }
    return null
  }

  renderSeparator(activations, campaigns) {
    if (this.samsungPayEnabled && activations && this.streakEnabled && campaigns) {
      return (
        <View style={styles.separator} />
      )
    }
    return null
  }

  renderActivationsAndStreak() {
    const { activations, activities } = this.props
    let campaigns = activities && activities.campaigns && activities.campaigns[0]
    campaigns = campaigns && campaigns.conditions && campaigns.conditions[0]
    campaigns = campaigns && campaigns.achievementCount
    if ((this.samsungPayEnabled && activations) || (this.streakEnabled && campaigns)) {
      return (
        <View style={styles.countCard}>
          {this.samsungPayEnabled && this.renderActivations(activations)}
          {this.renderSeparator(activations, campaigns)}
          {this.renderCampaigns(campaigns)}
        </View>
      )
    }
  }

  render() {
    const {
      channelId,
      summary,
      cheilSummary,
    } = this.props
    if (this.state.isLoading) {
      return <LoadingSpinner />
    } else {
      return (
        <View style={styles.container}>
          <ProfileSection
            isviewOnly={channelId != undefined}
            profileImageUrl={summary.imageUrl}
            name={`${summary.firstName} ${summary.lastName}`}
            repCode={cheilSummary ? cheilSummary.repCode : null}
            email={summary.username}
          />
          {this.renderActivationsAndStreak()}
          {this.badgesEnabled && <BadgesTab />}
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  channelId: state.user.channelId,
  activations: state.user.activations,
  cheilSummary: state.user.cheilSummary,
  summary: state.user.summary,
  userAudiences: state.user.audiences,
  samsungPay: state.remoteConfig.featureConfig.samsung_pay,
  streak: state.remoteConfig.featureConfig.streak,
  transactionHistory: state.remoteConfig.featureConfig.transaction_history,
  badges: state.remoteConfig.featureConfig.badges,
  activities: state.user.activities,
})

const mapDispatchToProps = (dispatch) => ({
  getUserSummary: () => dispatch(UserActions.getUserSummary()),
  getCheilSummary: () => dispatch(UserActions.getCheilSummary()),
  getWeeklyActivations: () => dispatch(UserActions.getWeeklyActivations()),
  getActivities: () => dispatch(UserActions.getActivities()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
