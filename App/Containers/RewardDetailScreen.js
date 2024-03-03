import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
} from 'react-native'

import ErrorScreen from '@containers/ErrorScreen'
import I18n from '@i18n'
import LoadingSpinner from '@components/LoadingSpinner'
import RewardRedemption from '@components/RewardRedemption'
import RewardInstantWin from '@components/RewardInstantWin'
import RewardSweepstakes from '@components/RewardSweepstakes'
import RewardsActions from '@redux/RewardsRedux'
import { Constants } from '@resources'
import { formatNumber } from '@utils/TextUtils'

import styles from './Styles/RewardDetailScreenStyles'

class RewardDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (<Text style={styles.headerRightText}>{formatNumber(navigation.getParam('totalPoint'))}</Text>)
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      error: false,
    }
  }

  componentDidMount() {
    const { getRewardDetail, navigation, points } = this.props
    const { rewardId } = navigation.state.params
    getRewardDetail(rewardId)
    if (points) {
      navigation.setParams({ totalPoint: points.totalPoint })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { rewardDetails, navigation, points } = this.props
    const { rewardId } = navigation.state.params
    if (rewardDetails && rewardDetails !== prevProps.rewardDetails) {
      const rewardDetail = rewardDetails.find(rewardDetail => rewardDetail.rewardId == rewardId)
      if (rewardDetail) {
        this.setState({
          error: false,
          isLoading: false,
          rewardDetail,
        })
      } else {
        this.setState({
          error: true,
          isLoading: false,
        })
      }
    }
    if (points !== prevProps.points) {
      if (points && points.totalPoint) {
        navigation.setParams({ totalPoint: points.totalPoint })
      }
    }
  }

  errorCtaOnPress() {
    const { getRewardDetail, navigation } = this.props
    const { rewardId } = navigation.state.params
    getRewardDetail(rewardId)
    this.setState({
      error: false,
      isLoading: true,
    })
  }

  render() {
    const { error, isLoading, rewardDetail } = this.state
    if (isLoading) {
      return <LoadingSpinner />
    } else if (error) {
      return (
        <ErrorScreen
          title={I18n.t('generic_error.title')}
          message={I18n.t('generic_error.message')}
          cta={I18n.t('generic_error.retry')}
          ctaOnPress={this.errorCtaOnPress.bind(this)}
        />
      )
    } else {
      switch (rewardDetail.type) {
        case Constants.REWARD_TYPES.REDEMPTION:
        case Constants.REWARD_TYPES.GIFT_CARD:
        case Constants.REWARD_TYPES.BLUEDOOR:
          return (
            <RewardRedemption
              {...this.props}
              rewardDetail={rewardDetail}
            />
          )
        case Constants.REWARD_TYPES.SWEEPSTAKES:
          return (
            <RewardSweepstakes 
              {...this.props}
              rewardDetail={rewardDetail}
            />
          )
        case Constants.REWARD_TYPES.INSTANT_WHEEL:
          return (
            <RewardInstantWin 
              {...this.props}
              rewardDetail={rewardDetail}
            />
          )
        default:
          return null
      }
      
    }
  }
}

const mapStateToProps = (state) => ({
  points: state.user.points,
  rewardDetails: state.rewards.rewardDetails,
})

const mapDispatchToProps = (dispatch) => ({
  getRewardDetail: (rewardId) => dispatch(RewardsActions.getRewardDetail(rewardId))
})

export default connect(mapStateToProps, mapDispatchToProps)(RewardDetailScreen)
