import React, { Component } from 'react'
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import RewardsActions from '@redux/RewardsRedux'
import AppActions from '@redux/AppRedux'
import ToastMessage from '@components/ToastMessage'
import UserActions from '@redux/UserRedux'
import { getRandomIntInclusive } from '@utils/CommonUtils'
import { formatNumber } from '@utils/TextUtils'
import { Constants } from '@resources'

import styles from './Styles/SpinTheWheelScreenStyles'

const getValueIntervals = (numValues) => {
  switch (numValues) {
    case 3:
      return {
        winningPositions: [
          [30, 90],    // top-left
          [150, 210],  // bottom
          [270, 330]   // top-right               
        ],
        nonWinningPositions: [
          [345, 375],
          [105, 135],
          [225, 255]
        ]
      }
    case 4:
      return {
        winningPositions: [
          [20, 65],    // top-left
          [110, 155],  // bottom-left
          [205, 248],  // bottom-right
          [293, 337],  // top-right
        ],
        nonWinningPositions: [
          [80, 100],
          [170, 190],
          [260, 280],
          [350, 370]
        ]
      }
    case 5:
      return {
        winningPositions: [
          [18, 54],    // top-left
          [90, 126],   // bottom-left
          [162, 198],  // bottom
          [234, 270],  // bottom-right
          [306, 342]   // top-right
        ],
        nonWinningPositions: [
          [64, 80],
          [136, 152],
          [208, 224],
          [280, 296],
          [352, 368]
        ]
      }
    default:
      return null
  }
}

class SpinTheWheelScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (<Text style={styles.headerRightText}>{formatNumber(navigation.getParam('totalPoint'))}</Text>)
    }
  }

  constructor(props) {
    super(props)

    const { rewardDetail } = this.props.navigation.state.params
    this.state = {
      errorSpin: false,
      inProgress: false,
      outcome: null,
      prizes: rewardDetail.rewardPrizes.map(rewardPrize => rewardPrize.prizes[0]),
      rotation: 0,
      showGame: true,
    }
    this.spinValue = new Animated.Value(0)
  }

  componentDidUpdate(prevProps, prevState) {
    const { navigation, participationResult, points, getPoints } = this.props
    const { outcome } = this.state
    if (participationResult !== prevProps.participationResult) {
      if (Object.entries(participationResult).length === 0) {
        this.setState({ errorSpin: true })
      } else if (!outcome) {
        this.setState({ outcome: participationResult })
        getPoints()
      }
    }
    if (points !== prevProps.points) {
      navigation.setParams({ totalPoint: points.totalPoint })
    }
  }

  componentWillUnmount() {
    !this.state.showGame && this.props.showHideAppRatingPrompt(true);
  }

  playSpinTheWheel() {
    const { rewardDetail } = this.props.navigation.state.params
    const { getRewardParticipationResult } = this.props
    this.setState({ inProgress: true })
    this.startWheelAnimation()
    getRewardParticipationResult(rewardDetail.rewardId, 1)
  }

  startWheelAnimation() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 360,
        duration: 2000,
        easing: Easing.sin,
        useNativeDriver: true,
      }
    ).start(() => this.loopWheelAnimation())
  }

  loopWheelAnimation() {
    const { errorSpin, outcome } = this.state
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 720,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    ).start(() => {
      if (errorSpin) {
        ToastMessage(I18n.t('rewards.spin_failure'))
        this.finishWheelAnimation()
      } else if (outcome !== null) {
        this.finishWheelAnimation()
      } else {
        this.loopWheelAnimation()
      }
    })
  }

  finishWheelAnimation() {
    const { outcome } = this.state
    let finalPosition = outcome ? this.calculateStopPosition(outcome) : 0
    this.spinValue.setValue(0)
    let duration = 2000
    if (finalPosition < 180) {
      finalPosition += 360
      duration *= 2
    }
    Animated.timing(
      this.spinValue,
      {
        toValue: finalPosition,
        duration: duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }
    ).start(() => this.displayResult())
  }

  displayResult() {
    setTimeout(() => {
      this.setState({
        inProgress: false,
        showGame: false,
        outcome: null,
      })
    }, 1000)
  }

  calculateStopPosition(outcome) {
    const { prizes } = this.state
    const rewardIds = prizes.map(prize => prize.prizeId)
    const valueIntervals = getValueIntervals(prizes.length)
    if (outcome.result === Constants.REWARD_PARTICIPATION_RESULT.WINNING) {
      const winningIndex = rewardIds.indexOf(outcome.prizes[0].prizeId)
      if (winningIndex === -1) {
        return 0
      } else {
        const winningInterval = valueIntervals.winningPositions[winningIndex]
        return getRandomIntInclusive(winningInterval[0], winningInterval[1])
      }
    } else {
      const nonWinningInterval = valueIntervals.nonWinningPositions[getRandomIntInclusive(0, prizes.length - 1)]
      return getRandomIntInclusive(nonWinningInterval[0], nonWinningInterval[1])
    }
  }

  render() {
    const { showGame } = this.state
    return (
      <View style={styles.container}>
        {showGame && this.renderWheel()}
        {!showGame && this.renderResult()}
      </View>
    )
  }

  getWheelfaceImage(numValues) {
    switch (numValues) {
      case 3:
        return require('@assets/wheel_3.png')
      case 4:
        return require('@assets/wheel_4.png')
      case 5:
        return require('@assets/wheel_5.png')
      default:
        return null
    }
  }

  renderWheelValues(prizes) {
    let positions
    switch (prizes.length) {
      case 3:
        positions = [
          styles.threeValues_topLeft,
          styles.threeValues_bottom,
          styles.threeValues_topRight
        ]
        break
      case 4:
        positions = [
          styles.fourValues_topLeft,
          styles.fourValues_bottomLeft,
          styles.fourValues_bottomRight,
          styles.fourValues_topRight
        ]
        break
      case 5:
        positions = [
          styles.fiveValues_topLeft,
          styles.fiveValues_bottomLeft,
          styles.fiveValues_bottom,
          styles.fiveValues_bottomRight,
          styles.fiveValues_topRight
        ]
        break
      default:
        break
    }
    if (positions) {
      return [...prizes.map((prize, index) => this.renderWheelValue(
        prize.type == Constants.REWARD_PARTICIPATION_RESULT_TYPE.POINT ? `${formatNumber(prize.points)} ${I18n.t('rewards.pts')}` : prize.name,
        positions[index], index, prizes.length))]
    }
  }

  renderWheelValue(value, position, index, numOfPrizes) {
    let textWidth, textFontSize
    switch (numOfPrizes) {
      case 3:
        textWidth = 120
        textFontSize = 14
        break
      case 4:
        textWidth = 100
        textFontSize = 12
        break
      case 5:
        textWidth = 84
        textFontSize = 10
        break
      default:
        break
    }
    return (
      <View key={index} style={[styles.wheelValueContainer, position]}>
        <Text style={[styles.wheelValueText, { fontSize: textFontSize, width: textWidth }]} numberOfLines={1}>{value}</Text>
      </View>
    )
  }

  renderWheel() {
    const { prizes, inProgress } = this.state
    const spinDegree = this.spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    })
    return (
      <View>
        <Text style={styles.hintText}>{I18n.t('rewards.tap_to_play')}</Text>
        <TouchableOpacity
          style={styles.wheelContainer}
          disabled={inProgress}
          onPress={() => this.playSpinTheWheel()}
        >
          <Image
            source={require('@assets/picker.png')}
            style={styles.picker}
            zIndex={1}
          />
          <View style={styles.wheelfaceContainer}>
            <Animated.View style={{ transform: [{ rotate: spinDegree }] }}>
              <Image style={styles.wheelfaceImage} source={this.getWheelfaceImage(prizes.length)} />
              {this.renderWheelValues(prizes)}
            </Animated.View>
          </View>
        </TouchableOpacity>
        <Text style={styles.goodLuckText}>{I18n.t('rewards.good_luck')}</Text>
      </View>
    )
  }

  renderResult() {
    const { participationResult } = this.props
    const prizeWon = participationResult.result === Constants.REWARD_PARTICIPATION_RESULT.WINNING
    const prizeIsPoint = prizeWon && participationResult.prizes[0].type === Constants.REWARD_PARTICIPATION_RESULT_TYPE.POINT
    if (prizeWon) {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{I18n.t('rewards.you_won')}</Text>
          {!prizeIsPoint && <Text style={styles.watchNotificationText}>{I18n.t('rewards.watch_notification_message')}</Text>}
          <Text style={styles.emoji}>🎉</Text>
          {prizeIsPoint && <Text style={styles.points}>{formatNumber(participationResult.prizes[0].value)}</Text>}
          {prizeIsPoint && <Text style={styles.pointsText}>{I18n.t('rewards.points')}</Text>}
          {!prizeIsPoint && <Text style={styles.prizeText}>{participationResult.prizes[0].name}</Text>}
          {this.renderSpinAgainButton()}
        </View>
      )
    } else {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{I18n.t('rewards.tough_luck')}</Text>
          <Text style={styles.emoji}>🎁</Text>
          <Text style={styles.noPrizeMessage}>{I18n.t('rewards.no_prize_message')}</Text>
          {this.renderSpinAgainButton()}
        </View>
      )
    }
  }

  renderSpinAgainButton() {
    const { rewardDetail } = this.props.navigation.state.params
    const { points } = this.props
    if (rewardDetail.requiredPoint <= points.totalPoint) {
      return (
        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={() => this.setState({ showGame: true })}
        >
          <Text style={styles.playAgainButtonText}>{I18n.t('rewards.spin_again')}</Text>
          <Text style={styles.playAgainPoint}>{formatNumber(rewardDetail.requiredPoint)}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.playAgainButtonDisabled}>
          <Text style={styles.playAgainButtonDisabledText}>{I18n.t('rewards.not_enough_points')}</Text>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  participationResult: state.rewards.participationResult,
  points: state.user.points,
})

const mapDispatchToProps = (dispatch) => ({
  getRewardParticipationResult: (rewardId, quantity) => dispatch(RewardsActions.getRewardParticipationResult(rewardId, quantity)),
  getPoints: () => dispatch(UserActions.getPoints()),
  showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(SpinTheWheelScreen)
