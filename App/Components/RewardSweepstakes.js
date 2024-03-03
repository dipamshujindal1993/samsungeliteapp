import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import I18n from '@i18n'
import ImageEx from '@components/ImageEx'
import SmallRoundButton from '@components/SmallRoundButton'
import { formatNumber, formatString } from '@utils/TextUtils'
import { Constants } from '@resources'

import styles from './Styles/RewardSweepstakesStyles'

export default class RewardSweepstakes extends Component {
  constructor(props) {
    super(props)

    const { points, rewardDetail } = this.props
    const maxEntriesNumber = points ? Math.min(Constants.SWEEPSTAKES_MAX_ENTRIES, rewardDetail.rewardPrizes[0].prizes[0].remainStock, Math.floor(points.totalPoint / rewardDetail.requiredPoint)) : 0
    this.state = {
      redeemNumber: 1,
      disableMinus: true,
      disablePlus: maxEntriesNumber < 2,
      maxEntriesNumber,
    }
  }

  onPlusOrMinus(numberToChange) {
    const { redeemNumber, maxEntriesNumber } = this.state
    const newRedeemNumber = redeemNumber + numberToChange
    const disableMinus = newRedeemNumber <= 1
    const disablePlus = newRedeemNumber >= maxEntriesNumber
    this.setState({ redeemNumber: newRedeemNumber, disableMinus, disablePlus })
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.renderImage()}
          {this.renderTitle()}
          {this.renderRedeem()}
          {this.renderDescription()}
        </View>
      </ScrollView>
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
    const { redeemNumber, disableMinus, disablePlus, maxEntriesNumber } = this.state
    const { rewardDetail, navigation } = this.props
    if (maxEntriesNumber > 0) {
      return (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('RedemptionScreen', { rewardDetail, quantity: redeemNumber, headerTitle: I18n.t('redemptions.screen_title_confirm_email') })}>
            <View style={styles.redeemAvailable}>
              <Text style={styles.redeemAvailableText}>{formatString(I18n.t('rewards.reddem_entries'), redeemNumber, redeemNumber > 1 ? I18n.t('rewards.entry_plural') : I18n.t('rewards.entry_single'))}</Text>
              <Text style={styles.redeemPoint}>{formatNumber(rewardDetail.requiredPoint * redeemNumber)}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.maxEntriesText}>{formatString(I18n.t('rewards.max_entries_allowed'), Constants.SWEEPSTAKES_MAX_ENTRIES, Constants.SWEEPSTAKES_MAX_ENTRIES > 1 ? I18n.t('rewards.entry_plural').toLowerCase() : I18n.t('rewards.entry_single').toLowerCase())}</Text>
          <View style={styles.plusOrMinusContainer}>
            <SmallRoundButton 
              sign={'minus'}
              disabled={disableMinus}
              onPress={() => this.onPlusOrMinus(-1)}
            />
            <Text style={styles.redeemNumber}>{redeemNumber}</Text>
            <SmallRoundButton 
              sign={'plus'}
              disabled={disablePlus}
              onPress={() => this.onPlusOrMinus(1)}
            />
          </View>
        </View>
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
