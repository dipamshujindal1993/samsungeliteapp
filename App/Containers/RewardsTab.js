import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'

import EndlessFlatList from '@components/EndlessFlatList'
import I18n from '@i18n'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import RefreshIcon from '@svg/icon_syncing'
import RewardsActions from '@redux/RewardsRedux'
import UserActions from '@redux/UserRedux'
import { formatNumber, formatDate } from '@utils/TextUtils'
import { Colors, Constants } from '@resources'
import { open } from '@services/LinkHandler'

import styles from './Styles/RewardsTabStyles'

class RewardsTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      data: [],
    }
    this.pageNumber = 1
  }

  componentDidMount() {
    const { getRewards, getPoints, getUserSummary, summary } = this.props
    if (summary) {
      getRewards(this.pageNumber)
      getPoints()
      this.startedLoading = true
    } else {
      getUserSummary()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { getRewards, getPoints, points, rewards, summary } = this.props
    if (summary !== prevProps.summary && !this.startedLoading) {
      this.pageNumber = 1
      getRewards(this.pageNumber)
      getPoints()
    }
    if (rewards && rewards !== prevProps.rewards) {
      this.total = rewards.pagination.totalCount
      this.setState({
        isLoading: false,
        data: this.pageNumber > 1 ? prevState.data.concat(rewards.content) : rewards.content,
      })
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingSpinner />
    } else {
      return (
        <View style={styles.container}>
          {this.renderRewardsCatalog()}
        </View>
      )
    }
  }

  renderMyPoints = () => {
    const { getPoints, points } = this.props
    const hasExpiringPoints = points && points.expiration && points.expiration.dueDate
    if (points) {
      return (
        <View style={styles.pointsContainer}>
          <View style={[styles.myPointsContainer, hasExpiringPoints ? styles.topBordersRound : styles.allBordersRound]}>
            <Text style={styles.myPointsText}>{I18n.t('rewards.my_points')}</Text>
            <Text style={styles.myPointsNumber}>{formatNumber(points.totalPoint)}</Text>
          </View>
          {hasExpiringPoints && <View style={[styles.pointsExpiringContainer, styles.bottomBordersRound]}>
            <View style={styles.pointsExpiringTextContainer}>
              <Text style={styles.pointsExpiringText}>{I18n.t('rewards.points_expiring')}</Text>
              <Text style={styles.pointsExpiringDate}>{formatDate(new Date(points.expiration.dueDate))}</Text>
            </View>
            <Text style={styles.pointsExpiringNumber}>{formatNumber(points.expiration.totalPoint)}</Text>
          </View>}
        </View>
      )
    } else {
      return (
        <View style={styles.pointsContainer}>
          <View style={[styles.myPointsContainer, styles.allBordersRound]}>
            <Text style={styles.myPointsText}>{I18n.t('rewards.error_loading_points')}</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={() => getPoints()}>
              <RefreshIcon width={13} height={13} fill={Colors.rgb_4297ff} />
              <Text style={styles.refreshText}>{I18n.t('rewards.refresh')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderRewardsCatalog() {
    const { getRewards } = this.props
    const { data } = this.state
    if (data && data.length > 0) {
      return (
        <EndlessFlatList
          style={styles.rewardsContainer}
          data={data}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.renderMyPoints}
          ListFooterComponent={this.renderFooter}
          loadMore={() => {
            this.pageNumber++
            getRewards(this.pageNumber)
          }}
          loadedAll={data.length >= this.total}
        />
      )
    } else {
      return <LoadingSpinner />
    }
  }

  renderSeparator() {
    return <View style={styles.separator} />
  }

  renderItem(item, index) {
    const { points, navigation } = this.props
    let warnFlag
    if (item.warnFlags.lastChance) { warnFlag = Constants.REWARD_WARNFLAG.LAST_CHANCE }
    else if (item.warnFlags.limited) { warnFlag = Constants.REWARD_WARNFLAG.LIMITED_OFFER }
    else if (item.warnFlags.outOfStock) { warnFlag = Constants.REWARD_WARNFLAG.OUT_OF_STOCK }
    const pointsEnough = points && points.totalPoint >= item.requiredPoint
    return (
      <TouchableOpacity onPress={() => navigation.navigate('RewardDetailScreen', { rewardId: item.rewardId, totalPoint: points ? points.totalPoint : undefined })}>
        <View style={styles.itemContainer}>
          <ImageEx
            style={styles.itemImage}
            source={{ uri: item.imageUrl }}
          />
          <View style={styles.itemDetailContainer}>
            <Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.itemDescription}>{item.description}</Text>
            <View style={warnFlag !== undefined ? styles.warningAndPtsContainer : styles.onlyPointsContainer}>
              {warnFlag !== undefined && <View style={warnFlag === Constants.REWARD_WARNFLAG.OUT_OF_STOCK ? styles.warningContainerGrey : styles.warningContainer}>
                <Text style={styles.warningText}>{I18n.t(warnFlag)}</Text>
              </View>}
              <View style={styles.rewardPointsContainer}>
                <Text style={pointsEnough ? styles.rewardPointsBlue : styles.rewardPointsGrey}>{formatNumber(item.requiredPoint)}</Text>
                <Text style={pointsEnough ? styles.ptsBlue : styles.ptsGrey}>{I18n.t('rewards.pts')}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    return (
      <View>
        {this.renderSeparator()}
        <View style={styles.footerBoxContainer}>
          <Text style={styles.w9Info}>
            {this.props.w9Info}
          </Text>
          <Text onPress={() => open({ url: this.props.redemptionRulesUrl })} style={styles.learnAllRules}>
            {I18n.t('rewards.learn_all_rules')}
          </Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  summary: state.user.summary,
  rewards: state.rewards.rewards,
  points: state.user.points,
  w9Info: state.remoteConfig.w9_info,
  redemptionRulesUrl: state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.redemption_rules_url : undefined,
})

const mapDispatchToProps = (dispatch) => ({
  getUserSummary: () => dispatch(UserActions.getUserSummary()),
  getRewards: (page) => dispatch(RewardsActions.getRewards(page)),
  getPoints: () => dispatch(UserActions.getPoints()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RewardsTab)

