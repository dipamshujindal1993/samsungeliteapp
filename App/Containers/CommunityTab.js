import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import CommunitiesActions from '@redux/CommunitiesRedux'
import { getRelativeTimeFromNow } from '@utils/TextUtils'

import ErrorScreen from '@containers/ErrorScreen'
import LoadingSpinner from '@components/LoadingSpinner'
import EndlessFlatList from '@components/EndlessFlatList'
import I18n from '@i18n'
import CommunityIcon from '@svg/icon_group.svg'

import { Colors } from '@resources'
import styles from './Styles/CommunitiesTabStyles'
class CommunityTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
    }  
    this.pageNumber = 1
  }

  componentDidMount() {
    this.getCommunities()
    this.props.resetCommunityPostSuccess()
  }

  getCommunities() {
    this.props.getCommunities(this.pageNumber)
  }

  componentDidUpdate(prevProps, prevState) {
    const {communities, isCommunityLoadingError} = this.props
    if (prevProps.communities != communities && prevState.isLoading) {
      const { pagination, data } = communities
      this.total = pagination.total
      this.setState((prevState) => ({
        isLoading: false,
        data: this.pageNumber > 1 ? prevState.data.concat(data) : data,
      }))
    }
    if ((prevProps.isCommunityLoadingError != isCommunityLoadingError) && isCommunityLoadingError && prevState.isLoading) {
      this.setState({
        isLoading: false
      })
    } 
  }

  render () {
    const {isCommunityLoadingError} = this.props
    if (this.state.isLoading) {
      return <LoadingSpinner />
    } else if (isCommunityLoadingError) {
      return <ErrorScreen
          title={I18n.t('communities.error_loading_community')}
      />
    } else {
      return (
        <View style={styles.container}>
            {this.renderCommunities()}
        </View>
      )
    }
  }

  renderCommunities() {
    const { data, isLoading } = this.state
    if (data && data.length > 0) {
      return (
        <EndlessFlatList
          style={styles.communitiesContainer}
          data={data}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          refreshing={isLoading}
          onRefresh={() => {
            this.setState({
              isLoading: true,
              data: [],
            })
            this.pageNumber = 1
            this.getCommunities()
          }}
          loadMore={() => {
            this.pageNumber++
            this.getCommunities()
          }}
          loadedAll={data.length >= this.total}
        />
      )
    }
    else if (!isLoading) {
      return (
        <ErrorScreen
          icon={<CommunityIcon width={45} height={41} fill={Colors.rgb_4a4a4a}/>}
          title={I18n.t('communities.no_communities_found')}
        />
      )
    }
  }

  renderItem(item, index) {
    return (
      <TouchableOpacity onPress={ () => this.goToCommunityPostList(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemTopItemsContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemLastMessageTime}>{getRelativeTimeFromNow(item.modifiedDate)}</Text>
          </View>
          <View style={styles.itemThreadContainer}>
              <Text style={styles.itemThread}>{I18n.t('communities.threads')}</Text>
              <Text style={styles.itemThreadCount}>{item.discussionCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  goToCommunityPostList(item) {
    this.props.navigation.navigate('CommunityPostList', { communityId: item.id, communityName: item.name, onRefresh: this._onRefresh })
  }

  _onRefresh = (status) => {
    if(status==="success"){
      this.setState({isLoading : true})
      this.pageNumber = 1
      this.getCommunities()
    }
  }
  
}

const mapStateToProps = (state) => ({
  communities: state.communities.communities,
  isCommunityLoadingError: state.communities.isCommunityLoadingError
})

const mapDispatchToProps = (dispatch) => ({
  getCommunities: (pageNumber) => dispatch(CommunitiesActions.getCommunities(pageNumber)),
  resetCommunityPostSuccess: () => dispatch(CommunitiesActions.resetCommunityPostSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(CommunityTab)
