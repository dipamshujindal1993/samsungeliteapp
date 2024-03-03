import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native'
import { connect } from 'react-redux'

import EndlessFlatList from '@components/EndlessFlatList'
import HeaderInput from '@components/HeaderInput'
import I18n from '@i18n'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import UserActions from '@redux/UserRedux'
import { formatNumber } from '@utils/TextUtils'
import { Colors } from '@resources'

import styles from './Styles/LookUpScreenStyles'
import GroupIcon from '@svg/icon_group.svg'

export const LOOKUP_TYPE = {
  REP: 'Rep',
  ADVOCATE: 'Advocate',
}

class LookUpScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const getUsers = navigation.getParam('getUsers')
    const onChangeText = navigation.getParam('onChangeText')
    const type = navigation.getParam('type')
    return {
      headerTitle: (
        <HeaderInput
          navigation={navigation}
          placeholder={type == LOOKUP_TYPE.REP ? I18n.t('rep_look_up.search_rep') : I18n.t('look_up_advocate.search_pro')}
          onChangeText={onChangeText}
          onSubmitEditing={getUsers}
          submitWhenValueChange={true}
          returnKeyType={'send'}
        />
      )
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      userSelected: null,
      users: [],
      queryValue: {
        value: '',
        pageNumber: 1,
      },
    }
    this.userPageNumber = 1
    this.newQuery = false
  }

  componentDidMount() {
    const { getPoints, getUsers, navigation } = this.props
    this.type = navigation.getParam('type')
    this.props.navigation.setParams({
      getUsers: this.getUsers.bind(this),
      onChangeText: this.onChangeText.bind(this),
    })
    getUsers(this.userPageNumber, '')
    if (this.type == LOOKUP_TYPE.REP) {
      getPoints()
    }
  }

  componentDidUpdate(prevProps) {
    const { users } = this.props
    if (users && users !== prevProps.users) {
      this.setState(prevState => ({
        isLoading: false,
        userSelected: null,
        users: this.newQuery ? users.content : prevState.users.concat(users.content),
        totalUsersCount: users.pagination.totalCount,
      }))
    }
  }

  getUsers(value) {
    const { queryValue } = this.state
    if (value !== queryValue.value) {
      this.newQuery = true
      this.userPageNumber = 1
    } else {
      if (this.userPageNumber === queryValue.pageNumber) {
        this.userPageNumber = 1
        this.newQuery = true
      } else {
        this.newQuery = false
      }
    }
    this.setState({ queryValue: { value, pageNumber: this.userPageNumber } })
    this.props.getUsers(this.userPageNumber, value)
  }

  onChangeText() {
    this.setState({ isLoading: true })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.type == LOOKUP_TYPE.REP && this.renderPointBank()}
        {this.renderList()}
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
    const { isLoading, queryValue, totalUsersCount, users, userSelected } = this.state
    const { getUsersFailure } = this.props
    if (getUsersFailure) {
      return this.renderError(this.type == LOOKUP_TYPE.REP ? I18n.t('rep_look_up.unable_search') : I18n.t('look_up_advocate.unable_search'))
    } else if (isLoading) {
      return <LoadingSpinner />
    } else if (users.length === 0) {
      return this.type == LOOKUP_TYPE.REP ? this.renderError(I18n.t('rep_look_up.no_reps_found')) : null
    } else if (!userSelected) {
      return (
        <EndlessFlatList
          data={users}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={({ item, index }) => this.renderRepItem(item, index)}
          loadMore={() => {
            this.userPageNumber++
            this.getUsers(queryValue.value)
          }}
          loadedAll={users.length >= totalUsersCount}
        />
      )
    }
  }

  _onItemClick(item) {
    Keyboard.dismiss()

    if (this.type == LOOKUP_TYPE.REP) {
      this.props.navigation.navigate('AwardScreen', { userSelected: item })
    } else {
      this.props.navigation.navigate('AdvocateDevicesScreen', { advocateId: item.userId })
    }
  }

  renderRepItem(item) {
    return (
      <TouchableOpacity style={styles.repItemContainer} onPress={() => this._onItemClick(item)}>
        <ImageEx
          style={styles.profileImage}
          source={{ uri: item.profilePicture }}
        />
        <View>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.emailOrRepCode}>{item.email}</Text>
          <Text style={styles.emailOrRepCode}>{`${I18n.t('rep_look_up.rep_code_id')} ${item.repCode}`}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderError(errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <GroupIcon
          height={41}
          width={45}
          fill={Colors.rgb_4a4a4a}
        />
        <Text style={styles.errorMessageText}>{errorMessage}</Text>
      </View>
    )
  }

  renderSeparator() {
    return <Separator style={styles.separator} />
  }
}

const mapStateToProps = (state) => ({
  getUsersFailure: state.user.getUsersFailure,
  points: state.user.points,
  users: state.user.users,
})

const mapDispatchToProps = (dispatch) => ({
  getPoints: () => dispatch(UserActions.getPoints()),
  getUsers: (page, query) => dispatch(UserActions.getUsers(page, query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LookUpScreen)
