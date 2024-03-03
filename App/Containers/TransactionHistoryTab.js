import React, { Component } from 'react'
import {
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import EndlessFlatList from '@components/EndlessFlatList'
import ErrorScreen from '@containers/ErrorScreen'
import I18n from '@i18n'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import UserActions from '@redux/UserRedux'
import { Constants } from '@resources'
import { formatDate, formatNumber } from '@utils/TextUtils'

import styles from './Styles/TransactionHistoryTabStyles'

class TransactionHistoryTab extends Component {
  constructor(props) {
    super(props)

    const { tab } = this.props
    switch (tab) {
      case Constants.TAB_ACTIVITIES:
        this.category = {
          name: Constants.POINTS_HISTORY_TABS.ACTIVITIES,
          categoryString: [
            Constants.POINTS_HISTORY_CATEGORIES.ACTIVITY,
            Constants.POINTS_HISTORY_CATEGORIES.QUIZ_BONUS_POINTS,
            Constants.POINTS_HISTORY_CATEGORIES.STREAK_CAMPAIGN,
          ].join(',')
        }
        break
      case Constants.TAB_COURSES:
        this.category = {
          name: Constants.POINTS_HISTORY_TABS.COURSES,
          categoryString: [
            Constants.POINTS_HISTORY_CATEGORIES.COURSES,
          ].join(',')
        }
        break
      case Constants.TAB_REWARDS:
        this.category = {
          name: Constants.POINTS_HISTORY_TABS.REWARDS,
          categoryString: [
            Constants.POINTS_HISTORY_CATEGORIES.REWARD_REDEMPTION,
            Constants.POINTS_HISTORY_CATEGORIES.REDEMPTION_CANCELLED,
            Constants.POINTS_HISTORY_CATEGORIES.SALES_TRACKING,
            Constants.POINTS_HISTORY_CATEGORIES.S_PAY_ACTIVIATIONS,
            Constants.POINTS_HISTORY_CATEGORIES.SPOT_REWARD,
          ].join(',')
        }
        break
      default:
        this.category = {
          name: Constants.POINTS_HISTORY_TABS.Admin,
          categoryString: [
            Constants.POINTS_HISTORY_CATEGORIES.ADMIN_ADJUSTMENT,
            Constants.POINTS_HISTORY_CATEGORIES.EXPIRED,
          ].join(',')
        }
    }

    this.pageNumber = 1
    this.total = 0
    this.state = {
      data: [],
      isLoading: true,
      error: false,
    }
  }

  componentDidMount() {
    this.getTransactionHistory()
  }

  getTransactionHistory() {
    const { getTransactionHistory } = this.props
    getTransactionHistory(this.category.name, this.category.categoryString, this.pageNumber)
  }

  componentDidUpdate(prevProps) {
    const { transactionHistory } = this.props
    if (transactionHistory && transactionHistory !== prevProps.transactionHistory) {
      const currentTabHistory = transactionHistory[this.category.name]
      if (currentTabHistory && currentTabHistory.isError) {
        this.setState({
          isLoading: false,
          error: true,
        })
      } else if (currentTabHistory) {
        const { pagination, content } = currentTabHistory
        this.total = pagination.totalCount
        this.setState((prevState) => ({
          isLoading: false,
          data: this.pageNumber > 1 ? prevState.data.concat(content) : content,
          error: false,
        }))
      }
    }
  }

  render() {
    const { isLoading, data, error } = this.state
    if (isLoading) {
      return <LoadingSpinner />
    } else if (error) {
      return <ErrorScreen title={I18n.t('transaction_history.error_title')} />
    } else if (data.length === 0) {
      return <ErrorScreen title={I18n.t('transaction_history.no_history_title')} />
    } else {
      return (
        <EndlessFlatList
          data={data}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ItemSeparatorComponent={() => this.renderSeparator()}
          loadMore={() => {
            this.pageNumber++
            this.getTransactionHistory()
          }}
          loadedAll={data.length >= this.total}
        />
      )
    }
  }

  renderSeparator() {
    return <Separator style={styles.separator} />
  }

  renderItem(item, index) {
    const plusSign = item.type === Constants.POINTS_HISTORY_TYPE.EARN
      || item.type === Constants.POINTS_HISTORY_TYPE.ADD
      || item.type === Constants.POINTS_HISTORY_TYPE.CANCEL
    let description = formatDate(new Date(item.historyDate))
    if (item.subCategory) {
      description = `${description}  |  ${item.subCategory}`
    }
    var title = item.comment || item.reason
    switch (item.category) {
      case Constants.POINTS_HISTORY_CATEGORIES.REDEMPTION_CANCELLED:
      case Constants.POINTS_HISTORY_CATEGORIES.ADMIN_ADJUSTMENT:
      case Constants.POINTS_HISTORY_CATEGORIES.EXPIRED:
        title = item.reason || item.comment
        break
    }
    return (
      <View style={styles.itemContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <View style={styles.pointContainer}>
          {plusSign && <Text style={styles.plusSign}>{'+ '}</Text>}
          {!plusSign && <Text style={styles.minusSign}>{'- '}</Text>}
          <Text style={styles.pointNumber}>{formatNumber(Math.abs(item.point))}</Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  transactionHistory: state.user.transactionHistory,
})

const mapDispatchToProps = (dispatch) => ({
  getTransactionHistory: (categoryName, categoryString, page) => dispatch(UserActions.getTransactionHistory(categoryName, categoryString, page)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistoryTab)
