import React, { Component } from 'react'
import { Text, View, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import Video from 'react-native-video';
import { connect } from 'react-redux'
import CommunitiesActions from '@redux/CommunitiesRedux'
import AppActions from '@redux/AppRedux'
import HeaderTitle from '@components/HeaderTitle'
import ToastMessage from '@components/ToastMessage'
import LoadingSpinner from '@components/LoadingSpinner'
import ProfileImage from '@components/ProfileImage'
import Separator from '@components/Separator'
import ContentHtml from '@components/ContentHtml'
import ImageEx from '@components/ImageEx'
import OptionsMenu from '@components/OptionsMenu'
import PostDetailCommentsList from '@containers/PostDetailCommentsListScreen'
import Dialog from '@components/Dialog'
import { MenuOption } from 'react-native-popup-menu'
import styles from './Styles/PostDetailScreenStyles'
import { getRelativeTimeFromNow, formatDate } from '@utils/TextUtils'
import I18n from '@i18n'
import { Colors, Constants } from '@resources'
import MoreIcon from '@svg/icon_more.svg'
import PlayIcon from '@svg/icon_play.svg'
import ChatIcon from '@svg/icon_text_chat.svg'
import HeartIcon from '@svg/icon_heart.svg'
import ReplyIcon from '@svg/icon_send.svg'
import AddComment from '@components/AddComment';
import ErrorScreen from '@containers/ErrorScreen'


const postDetailOptions = [
    { changePost: Constants.POST_COMMUNITY_MORE_OPTIONS.EDIT, option: I18n.t('postDetails.edit_post'), selected: I18n.t('postDetails.edit_post') },
    { changePost: Constants.POST_COMMUNITY_MORE_OPTIONS.DELETE, option: I18n.t('postDetails.delete_post'), selected: I18n.t('postDetails.delete_post') },
]

class PostDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            activeCarouselIdx: 0,
            showPreview: false,
            selectedType: null,
            selectedUrl: null,
            showDeletePostDialog: false,
            isUpdatingLoader: false,
            showAddCommentModal: false
        }

        this.viewabilityConfig = {
            minimumViewTime: 500,
            viewAreaCoveragePercentThreshold: 60,
        };

        this.discussionId = props.navigation.getParam('discussionId')
        this.isTrigger = false
    }

    static navigationOptions = ({ navigation, }) => {
        const { params } = navigation.state;
        const isDisbale = params && navigation.getParam('isAuthor')
        return {
            headerTitle: () => <HeaderTitle title={navigation.getParam('communityName')} />,
            headerRight: () => (
                isDisbale &&
                <OptionsMenu
                    icon={<MoreIcon fill={Colors.rgb_9b9b9b} />}>
                    {postDetailOptions.map((option, index) => (
                        <MenuOption
                            key={index}
                            onSelect={() => navigation.getParam('onSelectPeriod')(index)}
                        >
                            <Text style={styles.optionMenuText}>{option.option}</Text>
                        </MenuOption>
                    ))}
                </OptionsMenu>)
        }
    }


    componentDidMount() {
        this.props.resetAddCommentSuccess()
        this.props.navigation.setParams({
            onSelectPeriod: this._onSelectPeriod
        })
        this.props.getPostDetail(this.discussionId);
    }

    checkIfAuthor = () => {
        let isDisplay = false;
        const { postViewData, userId, navigation } = this.props
        if (postViewData && postViewData.author) {
            if (postViewData.author.userId == userId) {
                isDisplay = true;
            }
        }
        navigation.setParams({
            isAuthor: isDisplay
        });
    }

    componentDidUpdate(prevProps) {
        const { postViewData, isLikeSuccess, isUnlikeSuccess, isDeleteSuccess, isDeleteFailure,  navigation } = this.props;
        if (prevProps.postViewData !== postViewData) {
            this._isRefresh = false
            this.setState({isLoading: false, showAddCommentModal: false})
            this.checkIfAuthor()
        }

        if (prevProps.isUnlikeSuccess !== isUnlikeSuccess) {
            if (isUnlikeSuccess != undefined && !isUnlikeSuccess) {
                ToastMessage(I18n.t('postDetails.unlike_failed'))
            }
        }

        if (prevProps.isLikeSuccess !== isLikeSuccess) {
            if (isLikeSuccess != undefined && !isLikeSuccess) {
                ToastMessage(I18n.t('postDetails.like_failed'))
            }
        }

        if (isDeleteSuccess && isDeleteSuccess !== prevProps.isDeleteSuccess) {
            this.setState({
                isUpdatingLoader: false,
            })
            ToastMessage(I18n.t('deletePostDialog.delete_success_msg'))
            navigation.getParam('onRefresh')("success")
            navigation.goBack()
        }

        if (isDeleteFailure && isDeleteFailure !== prevProps.isDeleteFailure) {
            this.setState({
                isUpdatingLoader: false,
            })
            ToastMessage(I18n.t('deletePostDialog.delete_error_msg'))
        }

    }

    onEditSelect() {
        const { navigation, postViewData } = this.props
        navigation.navigate('CommunityCreatePost', { communityId: postViewData.communityId, onRefresh: this._onRefresh, from: 'edit', communityName: navigation.getParam('communityName'), discussionId: this.discussionId })
    }

    _onRefresh = (status) => {
        if(status || status==="success"){
            this._isRefresh = status
            this.isTrigger = true
            this.props.getPostDetail(this.discussionId);
            const { onRefresh } = this.props.navigation.state.params;
            onRefresh && onRefresh("success");
        }
        else{
            this.setState({showAddCommentModal: false})
        }
    }

    onDeleteSelect() {
        this.setState({ showDeletePostDialog: true })
    }

    _onSelectPeriod = (index) => {
        index == '0' ? this.onEditSelect() : this.onDeleteSelect();
        this.props.navigation.setParams({
            selectedPeriod: postDetailOptions[index].selected,
        })
    }

     componentWillUnmount() {
        this.props.addCommentSuccess && this.props.showHideAppRatingPrompt(true);
     }

    render() {
        const { isLoading, showAddCommentModal, isUpdatingLoader} = this.state
        const { postViewData, getPostDetail } = this.props
        if (isLoading) {
            return <LoadingSpinner />
        } else if(postViewData!= null) {
            return (
                <View style={styles.container}>
                    {postViewData && this.renderPostData()}
                    {this.renderShowFullImage()}
                    {this.renderDeletePostDialog()}
                    {!showAddCommentModal && this.renderReplyCTA()}
                    {showAddCommentModal && this.renderAddComment()}
                    {isUpdatingLoader && <LoadingSpinner /> }
                </View>
            )
        } else {
            return  <ErrorScreen
            title={I18n.t('postDetails.error_title_info')}
            />
        }
    }

    onReplyClick(){
        this.replyItem=undefined
        this.setState({showAddCommentModal: true})
    }

    renderReplyCTA() {
        return(
            <TouchableOpacity style={styles.replyView} onPress={() => this.onReplyClick()}>
                <ReplyIcon fill={Colors.rgb_4297ff} width={16} height={16}/>
                <Text style={styles.replyText}>{I18n.t('postDetails.reply')}</Text>
            </TouchableOpacity>
        )
    }

    renderAddComment() {
        const { showAddCommentModal } = this.state
        if(!showAddCommentModal){
            return null
        }
        return (
            <View style={styles.addCommentContainer}>
                <AddComment 
                    visible={showAddCommentModal}
                    onDismiss={(isRefresh) => this._onRefresh(isRefresh)}
                    cancelable={false}
                    replyData = {this.replyItem}
                    discussionId={this.discussionId}
                    navigation={this.props.navigation}
                />
            </View>
          )
    }

    renderDeletePostDialog() {
        return (
            <Dialog
                visible={this.state.showDeletePostDialog}
                title={I18n.t('deletePostDialog.title')}
                message={I18n.t('deletePostDialog.description')}
                positive={I18n.t('deletePostDialog.positive_cta')}
                negative={I18n.t('deletePostDialog.negative_cta')}
                positiveOnPress={() => this._deletePost()}
                negativeOnPress={() => this.setState({ showDeletePostDialog: false })}
                textAlign='left'
            />
        )
    }

    _deletePost() {
        const { deletePost } = this.props
        this.setState({ showDeletePostDialog: false, isUpdatingLoader: true })
        deletePost(this.discussionId)
    }

    onEditComment(replyItem) {
        this.replyItem=replyItem
        this.setState({showAddCommentModal: true})
    }

    renderShowFullImage() {
        const { showPreview, selectedType, selectedUrl } = this.state;
        const {
            tokenType,
            accessToken,
        } = this.props
        return (
            <Modal
                visible={showPreview}
                transparent={true}
                animationType="fade"
                hasBackdrop={false}>
                <TouchableWithoutFeedback onPress={() => this.setState({ showPreview: false })}>
                    <View style={styles.preViewBackground}>
                        {selectedType && selectedType.includes("image") ?
                            <ImageEx
                                style={styles.previewImage}
                                source={{ uri: selectedUrl }}
                                resizeMode={"contain"}
                            /> :
                            <Video
                                resizeMode={"contain"}
                                source={{
                                    uri: selectedUrl,
                                    headers: {
                                        Authorization: `${tokenType} ${accessToken}`
                                    }
                                }}
                                style={styles.mediaPlayer}
                                ignoreSilentSwitch='ignore'
                            />
                        }
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    _renderCarouselItem(item, index, count) {
        const { activeCarouselIdx } = this.state

        let itemStyle = index === activeCarouselIdx ? styles.carouselMiddleItem : styles.carouselMiddleItemInactive;

        if (count > 1) {
            if (index === 0) {
                itemStyle = index === activeCarouselIdx ? styles.carouselFirstItem : styles.carouselFirstItemInactive
            }
            else if (index === count - 1) {
                itemStyle = index === activeCarouselIdx ? styles.carouselLastItem : styles.carouselLastItemInactive
            }
        } else {
            itemStyle = styles.singleCaurosel;
        }

        return (
            <View style={itemStyle}>
                {this.renderHeroImage(item)}
            </View>
        )
    }

    renderHeroImage(uri) {
        const {showAddCommentModal} = this.state
        return <TouchableOpacity 
                    disabled = {showAddCommentModal}
                    onPress={() => this.setState({
                        showPreview: true, 
                        selectedType: uri.type,
                        selectedUrl: uri.url
                    })
                }>
            {uri.type && uri.type.includes("image") ?
                <ImageEx
                    style={styles.heroImage}
                    source={{ uri: uri.url }}
                /> :
                <View style={styles.heroImage} >
                    <View style={styles.playIconView}>
                        <PlayIcon width={40} height={40} fill={Colors.rgb_ececec} />
                    </View>
                    <ImageEx
                        style={styles.heroImage}
                        source={{ uri: uri.thumbnail }}
                    />
                </View>
            }
        </TouchableOpacity>
    }

    _onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length) {
            this.setState({ activeCarouselIdx: viewableItems[0].index })
        }
    }

    checkWhoLiked() {
        const { userId, postViewData } = this.props
        let userfound = false;
        if (postViewData && postViewData.whoLiked) {
            for (var i = 0; i < postViewData.whoLiked.length; i++) {
                if (postViewData.whoLiked[i].userId !== null && postViewData.whoLiked[i].userId == userId) {
                    userfound = true;
                    break;
                }
            }
        return userfound;
       }
     }

    checkIfLikedByMe() {
        const {  postViewData } = this.props
        let isLikedByMe = false;
        if (postViewData != null) {
            isLikedByMe = typeof(postViewData.isLikedByMe) !== "undefined" ? postViewData.isLikedByMe : this.checkWhoLiked()
        }
        return isLikedByMe;
    }

    renderLike() {
        const { postViewData, likeCommunityPost, unlikeCommunityPost, isLikeSuccess, isUnlikeSuccess } = this.props;
        const userLiked = this.checkIfLikedByMe();
        const heartIconColor = userLiked ? Colors.rgb_4297ff : Colors.rgb_a3a3a3
        return (
            <View style={styles.likeImage}>
            <TouchableOpacity style={styles.LikeDislikeIcon} onPress={() => userLiked ? unlikeCommunityPost(this.discussionId) :
                likeCommunityPost(this.discussionId)}>
               {isLikeSuccess || isUnlikeSuccess ? <LoadingSpinner style = {styles.loaderMargin} /> : <HeartIcon fill={heartIconColor} width={19} height={17} />}
            </TouchableOpacity>
            {isLikeSuccess || isUnlikeSuccess ? null : <Text style={styles.likeText}>
                {postViewData ? postViewData.likeCount : ""}
            </Text> }
           </View>
        )
    }

    renderPostData() {
        const { postViewData } = this.props;
        const { showAddCommentModal } = this.state
        var message = null
        var images = []
        var galleryLength = images.length
        try {
            let obj = JSON.parse(postViewData.description);
            message = obj.message
            images = obj.images
            galleryLength = images.length
        } catch (error) {
            message = postViewData.description
        }

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEnabled={!showAddCommentModal}>
                <SafeAreaView style={styles.safeArea}>

                    <View style={styles.itemContainer}>
                        <View style={styles.itemTopLevelContainer}>
                            <ProfileImage
                                borderWidth={0}
                                imageUrl={postViewData.author.imgPath}
                            />
                            <View style={styles.itemAuthorDetailContainer}>
                                <Text style={styles.itemAuthorName}>{postViewData.author.fullName}</Text>
                                <Separator style={styles.separator} />
                                <View style={[styles.itemOtherDetailContainer]}>
                                    <Text style={styles.itemTime}>{formatDate(new Date(postViewData.createdDate))}</Text>
                                    <Text style={styles.itemTime}>{I18n.t('communities.updated')} {getRelativeTimeFromNow(postViewData.editedDate || postViewData.createdDate)}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <ChatIcon width={15} height={15} fill={Colors.rgb_b9b9b9} />
                                        <Text style={[styles.itemComment, { marginRight: 28 }]}>{postViewData.repliesCount}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.itemPostTitle}>{postViewData.title}</Text>
                        <ContentHtml spinnerEnable={true} htmlContent={message} style={[styles.htmlContainer]} />
                    </View>

                    {galleryLength ?
                        <FlatList
                            scrollEnabled={!showAddCommentModal}
                            style={styles.carouselStyle}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            pagingEnabled={true}
                            data={images}
                            renderItem={({ item, index }) => this._renderCarouselItem(item, index, galleryLength)}
                            showsHorizontalScrollIndicator={false}
                            viewabilityConfig={{
                                itemVisiblePercentThreshold: 70
                            }}
                            onViewableItemsChanged={this._onViewableItemsChanged}
                        /> : null}

                    {this.renderLike()}
                    <PostDetailCommentsList
                        discussionId={this.discussionId}
                        onCommentDeleteSuccess={(isRefresh) => this._onRefresh(isRefresh)}
                        onEditCommentClick = {(replyItem) => this.onEditComment(replyItem)}
                        isRefreshCommentList = {this._isRefresh}
                        repliesCount = {postViewData.repliesCount}
                    />
                </SafeAreaView>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    tokenType: state.app.token_type,
    accessToken: state.app.access_token,
    postViewData: state.communities.postViewData,
    isLikeSuccess: state.communities.isLikeSuccess,
    isUnlikeSuccess: state.communities.isUnlikeSuccess,
    userId: state.user.summary ? state.user.summary.userId : undefined,
    isDeleteSuccess: state.communities.isDeleteSuccess,
    isDeleteFailure: state.communities.isDeleteFailure,
    addCommentSuccess : state.communities.addCommentSuccess,
})

const mapDispatchToProps = (dispatch) => ({
    resetAddCommentSuccess: () => dispatch(CommunitiesActions.resetAddCommentSuccess()),
    getPostDetail: (discussionId) => dispatch(CommunitiesActions.getPostDetail(discussionId)),
    likeCommunityPost: (discussionId) => dispatch(CommunitiesActions.likeCommunityPost(discussionId)),
    unlikeCommunityPost: (discussionId) => dispatch(CommunitiesActions.unlikeCommunityPost(discussionId)),
    deletePost: (discussionId) => dispatch(CommunitiesActions.deletePost(discussionId)),
    showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailScreen)

