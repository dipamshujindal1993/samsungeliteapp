import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import CommunitiesActions from '@redux/CommunitiesRedux'

import HeaderTitle from '@components/HeaderTitle'
import ErrorScreen from '@containers/ErrorScreen'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import ProfileImage from '@components/ProfileImage'
import EndlessFlatList from '@components/EndlessFlatList'
import ContentHtml from '@components/ContentHtml'
import FAB from '@components/FAB'

import EditIcon from '@svg/icon_edit.svg'
import ChatIcon from '@svg/icon_text_chat.svg'

import I18n from '@i18n'
import {
  Colors,
  Constants,
} from '@resources'
import styles from './Styles/CommunityPostListStyles'
import { getRelativeTimeFromNow, formatDate } from '@utils/TextUtils'


class CommunityPostList extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={navigation.getParam('communityName')} />,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
    }
    this.pageNumber = 1
    this.communityID = this.props.navigation.state.params.communityId
  }

  componentDidMount() {
    this.getCommunityPostList()
  }

  getCommunityPostList() {
    this.props.getCommunityPost(this.communityID, this.pageNumber)
  }

  componentDidUpdate(prevProps, prevState) {
    const { communityPost, isCommunityPostLoadingError } = this.props
    if (prevProps.communityPost != communityPost) {
      const { pagination, data } = communityPost
      this.total = pagination.total
      this.setState({
        isLoading: false,
        data: this.pageNumber > 1 ? prevState.data.concat(data) : data,
      })
    }
    if ((prevProps.isCommunityPostLoadingError != isCommunityPostLoadingError) && isCommunityPostLoadingError && prevState.isLoading) {
      this.setState({
        isLoading: false
      })
    }
  }

  render() {
    const { isLoading, data } = this.state
    const { isCommunityPostLoadingError } = this.props
    if (isLoading) {
      return <LoadingSpinner />
    } else if (isCommunityPostLoadingError) {
      return <ErrorScreen
        title={I18n.t('communities.error_loading_post')}
      />
    } else {
      return (
        <View style={styles.container}>
          {this.renderCommunityPost()}
        </View>
      )
    }
  }

  renderCommunityPost() {
    const { data } = this.state
    const { getCommunityPost } = this.props
    if (data && data.length > 0) {
      return (
        <>
          <EndlessFlatList
            style={styles.communitiesPostContainer}
            data={data}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            ItemSeparatorComponent={this.renderSeparator}
            loadMore={() => {
              this.pageNumber++
              getCommunityPost(this.communityID, this.pageNumber)
            }}
            loadedAll={data.length >= this.total}
          />
          {this.renderFAB()}
        </>
      )
    }
    else if (!this.state.isLoading) {
      return (
        <ErrorScreen
          icon={<EditIcon width={40} height={42} fill={Colors.rgb_4a4a4a} />}
          title={I18n.t('communities.no_post_yet')}
          message={I18n.t('communities.be_the_first')}
          cta={I18n.t('communities.create_post')}
          ctaOnPress={() => this.navigateToCreatePost()}
        />
      )
    }
  }

  renderFAB() {
    return (
      <FAB onPress={() => this.navigateToCreatePost()}>
        <EditIcon width={24} height={24} fill={Colors.white} />
      </FAB>
    )
  }

  navigateToCreatePost() {
    const { navigation } = this.props
    navigation.navigate('CommunityCreatePost', { communityId: navigation.getParam('communityId'), onRefresh: this._onRefresh, from: 'create' })
  }

  _onRefresh = (status) => {
    if (status === "success") {
      this.setState({ isLoading: true })
      this.pageNumber = 1
      this.getCommunityPostList()
      this.props.navigation.getParam('onRefresh')("success")
    }
  }

  renderSeparator() {
    return <Separator style={styles.itemSeparator} />
  }

  goToPostDetailScreen(item) {
    const { navigation } = this.props
    navigation.navigate('PostDetailScreen', {
      communityId: navigation.getParam('communityId'),
      discussionId: item.discussionId,
      communityName: navigation.getParam('communityName'),
      onRefresh: this._onRefresh
    })
  }

  renderDescription(description) {
    if (description && description.match(Constants.HTML_PATTERN)) {
      return (
        <ContentHtml htmlContent={description} />
      )
    } else {
      return (
        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.itemPostDescription}>{description}</Text>
      )
    }
  }

  renderItem(item, index) {
    let message = null
    try {
      let obj = JSON.parse(item.description);
      message = obj.message
    } catch (ex) {
      message = item.description
    }
    return (
      <TouchableOpacity onPress={() => this.goToPostDetailScreen(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemTopLevelContainer}>
            <ProfileImage
              borderWidth={0}
              imageUrl={item.author.imgPath}
            />
            <View style={styles.itemAuthorDetailContainer}>
              <Text style={styles.itemAuthorName}>{item.author.fullName}</Text>
              <Separator style={styles.separator} />
              <View style={styles.itemOtherDetailContainer}>
                <Text style={styles.itemTime}>{formatDate(new Date(item.createdDate))}</Text>
                <Text style={styles.itemTime}>{item.editedDate ? `${I18n.t('communities.updated')} ${getRelativeTimeFromNow(item.editedDate)}` : ''}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <ChatIcon width={15} height={15} fill={Colors.rgb_b9b9b9} />
                  <Text style={[styles.itemComment, { marginRight: 28 }]}>{item.repliesCount}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.itemPostTitle}>{item.title}</Text>
          {this.renderDescription(message)}
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state) => ({
  communityPost: state.communities.communityPost,
  isCommunityPostLoadingError: state.communities.isCommunityPostLoadingError
})

const mapDispatchToProps = (dispatch) => ({
  getCommunityPost: (communityId, pageNumber) => dispatch(CommunitiesActions.getCommunityPost(communityId, pageNumber)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CommunityPostList)
