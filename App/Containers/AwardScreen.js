import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import CustomTextInput from '@components/CustomTextInput'
import Dialog from '@components/Dialog'
import EndlessFlatList from '@components/EndlessFlatList'
import I18n from '@i18n'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import RewardsActions from '@redux/RewardsRedux'
import Separator from '@components/Separator'
import ToastMessage from '@components/ToastMessage'
import UserActions from '@redux/UserRedux'
import { formatNumber, formatString } from '@utils/TextUtils'

import {
  Colors,
} from '@resources'
import styles from './Styles/LookUpScreenStyles'

class AwardScreen extends Component {
  constructor(props) {
    super(props)

    const { userSelected } = props.navigation.state.params
    this.state = {
      isLoading: true,
      userSelected,
      awardSelected: null,
      awards: [],
      dialogVisible: false,
    }
    this.awardPageNumber = 1
  }

  componentDidMount() {
    const { getPoints, getSpotRewards, points } = this.props
    getSpotRewards(this.awardPageNumber)
    if (!points) {
      getPoints()
    }
  }

  componentDidUpdate(prevProps) {
    const { getPoints, getSpotRewardsSuccess, postSpotRewardsResult, spotRewards } = this.props
    if (getSpotRewardsSuccess && spotRewards !== prevProps.spotRewards) {
      this.setState(prevState => ({
        awards: this.awardPageNumber === 1 ? spotRewards.content : prevState.awards.concat(spotRewards.content),
        totalAwardsCount: spotRewards.pagination.totalCount,
        isLoading: false,
      }))
    }
    if (postSpotRewardsResult && postSpotRewardsResult !== prevProps.postSpotRewardsResult) {
      if (postSpotRewardsResult.ok) {
        ToastMessage(I18n.t('rep_look_up.award_submitted'))
        getPoints()
      } else {
        ToastMessage(I18n.t('rep_look_up.unable_to_award'))
      }
    }
  }

  onPressAward(item) {
    this.setState({
      dialogVisible: true,
      awardSelected: item,
      comment: '',
    })
  }

  onConfirmRecognition() {
    const { awardSelected, userSelected, comment } = this.state
    const { postSpotRewards } = this.props
    postSpotRewards(awardSelected.spotRewardId, userSelected.userId, comment)
    this.setState({ dialogVisible: false, comment: '' })
  }

  onCancelRecognition() {
    this.setState({ dialogVisible: false, comment: '' })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPointBank()}
        {this.renderList()}
        {this.renderRecognitionDialog()}
      </View>
    )
  }

  renderPointBank() {
    const { points } = this.props
    return (
      <View style={styles.pointBankContainer}>
        <Text style={styles.pointBankText}>{I18n.t('rep_look_up.point_bank')}</Text>
        <Text style={styles.pointBankValue}>{points ? formatNumber(points.territoryPoint) : 0}</Text>
      </View>
    )
  }

  renderList() {
    const { awards, isLoading, totalAwardsCount, userSelected } = this.state
    const { getSpotRewards } = this.props
    if (isLoading) {
      return <LoadingSpinner />
    } else if (awards) {
      return (
        <EndlessFlatList
          data={awards}
          renderItem={({ item, index }) => this.renderAwardItem(item, index)}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={() => this.renderRepItem(userSelected)}
          loadMore={() => {
            this.awardPageNumber++
            getSpotRewards(this.awardPageNumber)
          }}
          loadedAll={awards.length >= totalAwardsCount}
        />
      )
    }
  }

  renderRepItem(item) {
    return (
      <View style={styles.repItemContainer}>
        <ImageEx
          style={styles.profileImage}
          source={{ uri: item.profilePicture }}
        />
        <View>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.emailOrRepCode}>{item.email}</Text>
          <Text style={styles.emailOrRepCode}>{`${I18n.t('rep_look_up.rep_code_id')} ${item.repCode}`}</Text>
        </View>
      </View>
    )
  }

  renderAwardItem(item) {
    const {
      points,
    } = this.props
    const enoughPoints = points && points.territoryPoint > item.point
    return (
      <TouchableOpacity style={styles.awardItemContainer} onPress={() => this.onPressAward(item)} disabled={!enoughPoints}>
        <View style={styles.awardTextContainer}>
          <Text style={styles.awardTitleText}>{item.title}</Text>
          <Text style={styles.awardDescriptionText}>{item.description}</Text>
        </View>
        <Text style={[styles.awardPoint, { color: enoughPoints ? Colors.rgb_4297ff : Colors.rgb_b9b9b9 }]}>{formatNumber(item.point)}</Text>
      </TouchableOpacity>
    )
  }

  renderSeparator() {
    return <Separator style={styles.separator} />
  }

  renderRecognitionDialog() {
    const { dialogVisible, userSelected } = this.state
    const firstName = userSelected ? userSelected.firstName : ''
    return <Dialog
      visible={dialogVisible}
      title={formatString(I18n.t('rep_look_up.recognition_dialog_title'), firstName)}
      positive={I18n.t('rep_look_up.confirm')}
      positiveOnPress={() => this.onConfirmRecognition()}
      negative={I18n.t('rep_look_up.cancel')}
      negativeOnPress={() => this.onCancelRecognition()}
      renderBody={this.renderDialogBody.bind(this)}
      hasTextInput={true}
    />
  }

  renderDialogBody() {
    const { awardSelected } = this.state
    if (awardSelected) {
      return (
        <View style={styles.dialogBodyContainer}>
          <Text style={styles.dialogDescriptionText}>{`${awardSelected.title} - ${awardSelected.description}`}</Text>
          <CustomTextInput
            autoFocus={true}
            label={I18n.t('rep_look_up.recognition_dialog_label')}
            multiline={true}
            maxLength={50}
            showCounter={true}
            textStyles={styles.textInputStyles}
            onChangeText={(index, value) => this.setState({ comment: value })}
          />
        </View>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  points: state.user.points,
  spotRewards: state.rewards.spotRewards,
  getSpotRewardsSuccess: state.rewards.getSpotRewardsSuccess,
  postSpotRewardsResult: state.rewards.postSpotRewardsResult,
})

const mapDispatchToProps = (dispatch) => ({
  getPoints: () => dispatch(UserActions.getPoints()),
  getSpotRewards: (page) => dispatch(RewardsActions.getSpotRewards(page)),
  postSpotRewards: (spotRewardId, recipientId, comment) => dispatch(RewardsActions.postSpotRewards(spotRewardId, recipientId, comment)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AwardScreen)
