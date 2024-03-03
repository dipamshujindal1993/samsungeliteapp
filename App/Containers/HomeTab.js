import React, { Component } from 'react'
import {
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'

import ProfileCard from './ProfileCard'
import LearningCard from './LearningCard'
import NewsCard from './NewsCard'
import PromosCard from './PromosCard'
import ChannelCard from './ChannelCard'
import SpotRewardsCard from './SpotRewardsCard'
import DeviceTrackingCard from './DeviceTrackingCard'
import MerchandisingCard from './MerchandisingCard'
import DashboardCard from './DashboardCard'
import {
  hasAccessTo,
  isFeatureSupported,
} from '@utils/CommonUtils'
import { Constants } from '@resources'
import PushNotificationsHandler from '@components/PushNotificationsHandler'
import DeepLinkHandler from '@components/DeepLinkHandler'
import SpotRewardPopup from '@components/SpotRewardPopup'
import LocationListener from '@components/LocationListener'
import AppRatingDialog from '@components/AppRatingDialog'
import ChangeAffiliationCodeResultDialog from '@components/ChangeAffiliationCodeResultDialog'

import styles from './Styles/HomeTabStyles'

class HomeTab extends Component {
  render() {
    const {
      channelId,
      userAudiences,
      fsm,
      multiChannel,
      learning,
      learnTabs,
      promos,
      news,
      spotRewards,
      imeiTracking,
      merchandising,
      dashboards,
      geofencing,
    } = this.props
    const isFsm = userAudiences && isFeatureSupported(fsm, userAudiences.data)
    const multiChannelEnabled = userAudiences && isFeatureSupported(multiChannel, userAudiences.data)
    const learningEnabled = userAudiences && isFeatureSupported(learning, userAudiences.data)
    const hasAccessToActivities = hasAccessTo(Constants.TAB_ACTIVITIES, learnTabs)
    const promosEnabled = userAudiences && isFeatureSupported(promos, userAudiences.data)
    const newsEnabled = userAudiences && isFeatureSupported(news, userAudiences.data)
    const spotRewardsEnabled = userAudiences && isFeatureSupported(spotRewards, userAudiences.data)
    const imeiTrackingEnabled = userAudiences && isFeatureSupported(imeiTracking, userAudiences.data)
    const merchandisingEnabled = userAudiences && isFeatureSupported(merchandising, userAudiences.data)
    const dashboardsEnabled = userAudiences && isFeatureSupported(dashboards, userAudiences.data)
    const geofencingEnabled = userAudiences && isFeatureSupported(geofencing, userAudiences.data)

    return (
      <ScrollView style={styles.container}>
        <ProfileCard isFsm={isFsm} />
        {(multiChannelEnabled || channelId) && <ChannelCard />}
        {learningEnabled && <LearningCard type={hasAccessToActivities ? Constants.TAB_ACTIVITIES : Constants.TAB_COURSES} />}
        {promosEnabled && <PromosCard />}
        {newsEnabled && <NewsCard />}
        {spotRewardsEnabled && <SpotRewardsCard />}
        {imeiTrackingEnabled && <DeviceTrackingCard />}
        {isFsm && merchandisingEnabled && <MerchandisingCard />}
        {dashboardsEnabled && <DashboardCard />}
        {!channelId && <PushNotificationsHandler />}
        <DeepLinkHandler />
        <SpotRewardPopup />
        {geofencingEnabled && <LocationListener />}
        <AppRatingDialog />
        <ChangeAffiliationCodeResultDialog />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  channelId: state.user.channelId,
  userAudiences: state.user.audiences,
  fsm: state.remoteConfig.featureConfig.fsm,
  multiChannel: state.remoteConfig.featureConfig.multi_channel,
  learning: state.remoteConfig.featureConfig.learning,
  learnTabs: state.nav.learnTabs,
  promos: state.remoteConfig.featureConfig.promos,
  news: state.remoteConfig.featureConfig.news,
  spotRewards: state.remoteConfig.featureConfig.spot_rewards,
  imeiTracking: state.remoteConfig.featureConfig.imei_tracking,
  merchandising: state.remoteConfig.featureConfig.merchandising,
  dashboards: state.remoteConfig.featureConfig.dashboards,
  geofencing: state.remoteConfig.featureConfig.geofencing,
})

export default connect(mapStateToProps)(HomeTab)
