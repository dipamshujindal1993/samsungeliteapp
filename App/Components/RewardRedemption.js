import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import ImageEx from '@components/ImageEx'
import I18n from '@i18n'
import { formatNumber } from '@utils/TextUtils'

import styles from './Styles/RewardRedemptionStyles'

export default class RewardRedemption extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.renderImage()}
        {this.renderTitle()}
        {this.renderRedeem()}
        {this.renderDescription()}
      </View>
    )
  }

  renderImage() {
    return (
      <ImageEx
        style={styles.titleImage}
        source={{ uri: this.props.rewardDetail.imageUrl }}
      />
    )
  }

  renderTitle() {
    return (
      <Text style={styles.title}>{this.props.rewardDetail.title}</Text>
    )
  }

  renderRedeem() {
    const { points, rewardDetail, navigation } = this.props
    if (points && points.totalPoint >= rewardDetail.requiredPoint) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('RedemptionScreen', { rewardDetail, quantity: 1, headerTitle: I18n.t('redemptions.screen_title_confirm_email') })}>
          <View style={styles.redeemAvailable}>
            <Text style={styles.redeemAvailableText}>{I18n.t('rewards.redeem')}</Text>
            <Text style={styles.redeemPoint}>{formatNumber(rewardDetail.requiredPoint)}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.redeemUnavailable}>
          <Text style={styles.redeemUnavailableText}>{I18n.t('rewards.not_enough_points')}</Text>
        </View>
      )
    }

  }

  renderDescription() {
    return (
      <Text style={styles.description}>{this.props.rewardDetail.description}</Text>
    )
  }
}
