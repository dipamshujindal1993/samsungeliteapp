import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import ImageEx from '@components/ImageEx'
import I18n from '@i18n'
import ToastMessage from '@components/ToastMessage'
import { formatNumber } from '@utils/TextUtils'

import styles from './Styles/RewardInstantWinStyles'

const validPrizesLength = [3, 4, 5]

export default class RewardInstantWin extends Component {
  redeem() {
    const { points, navigation, rewardDetail } = this.props
    if (rewardDetail.rewardPrizes && validPrizesLength.includes(rewardDetail.rewardPrizes.length)) {
      navigation.navigate('SpinTheWheelScreen', { rewardDetail: rewardDetail, totalPoint: points ? points.totalPoint : undefined })
    } else {
      ToastMessage(I18n.t('rewards.unable_to_load'))
    }
  }

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
    const { points, rewardDetail } = this.props
    if (points && points.totalPoint >= rewardDetail.requiredPoint) {
      return (
        <TouchableOpacity onPress={() => this.redeem()}>
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
