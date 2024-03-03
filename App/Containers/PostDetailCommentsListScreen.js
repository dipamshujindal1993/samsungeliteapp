import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import CommunitiesActions from '@redux/CommunitiesRedux'
import ContentHtml from '@components/ContentHtml'
import Dialog from '@components/Dialog'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import OptionsMenu from '@components/OptionsMenu'
import ProfileImage from '@components/ProfileImage'
import ToastMessage from '@components/ToastMessage'
import { MenuOption } from 'react-native-popup-menu'
import Video from 'react-native-video';
import styles from './Styles/PostDetailCommentsListStyle'
import { getRelativeTimeFromNow } from '@utils/TextUtils'
import I18n from '@i18n'
import { Colors, Constants, Fonts } from '@resources'
import MoreIcon from '@svg/icon_more.svg'
import PlayIcon from '@svg/icon_play.svg'
import HeartIcon from '@svg/icon_heart.svg'

const contentHtmlStyle = `*{
        font-family: ${Fonts.family.regular};
        font-size: ${Fonts.size.s12};}`

const postDetailCommentOptions = [
    { changePost: Constants.POST_COMMUNITY_MORE_OPTIONS.EDIT_COMMENT, option: I18n.t('postDetailComments.edit_comment'), selected: I18n.t('postDetailComments.edit_comment') },
    { changePost: Constants.POST_COMMUNITY_MORE_OPTIONS.DELETE_COMMENT, option: I18n.t('postDetailComments.delete_comment'), selected: I18n.t('postDetailComments.delete_comment') },
]

class PostDetailCommentsListScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            showPreview: false,
            selectedType: null,
            selectedUrl: null,
            showDeleteCommentDialog: false,
            isUpdatingLoader: false,
        }
        this.pageNumber = 1
        this.discussionId = this.props.discussionId;
        this.repliesCount = this.props.repliesCount;
    }

    componentDidMount() {
        this.repliesCount!== 0 && this.props.getPostCommentList(this.discussionId,this.pageNumber);
    }

    componentDidUpdate(prevProps) {
        const { 
            postCommentList, 
            isLikeCommentSuccess, 
            isDislikeCommentSuccess, 
            isCommentDeleteSuccess, 
            isCommentDeleteFailure,
            onCommentDeleteSuccess,
            isRefreshCommentList,
            getPostCommentList
        } = this.props;

        this._isRefreshCommentList = isRefreshCommentList

        if (prevProps.isDislikeCommentSuccess !== isDislikeCommentSuccess) {
            if (isDislikeCommentSuccess != undefined && !isDislikeCommentSuccess) {
                ToastMessage(I18n.t('postDetailComments.failedToUnLike'))
            }
        }

        if (prevProps.isLikeCommentSuccess !== isLikeCommentSuccess) {
            if (isLikeCommentSuccess != undefined && !isLikeCommentSuccess) {
                ToastMessage(I18n.t('postDetailComments.failedToLike'))
            }
        }

        if (prevProps.postCommentList !== postCommentList) {
            const { pagination, data } = postCommentList
            this.total = pagination.total
            this.setState((prevState) => ({
                isLoading: false,
                data: this.pageNumber > 1 ? prevState.data.concat(data) : data,
            }))
        }

        if (isCommentDeleteSuccess && isCommentDeleteSuccess !== prevProps.isCommentDeleteSuccess) {
            this.setState({
                isUpdatingLoader: false,
            })
            ToastMessage(I18n.t('postDetailComments.delete_success_msg'))
            onCommentDeleteSuccess(true)
        }

        if (isCommentDeleteFailure && isCommentDeleteFailure !== prevProps.isCommentDeleteFailure) {
            this.setState({
                isUpdatingLoader: false,
            })
            ToastMessage(I18n.t('postDetailComments.delete_error_msg'))
        }
        if(this._isRefreshCommentList){
            this._isRefreshCommentList = false
            getPostCommentList(this.discussionId);
        }
    }

    onEditSelect(item) {
        this.replyId = item && item.id
        this.props.onEditCommentClick(item)
    }

    onDeleteSelect(item) {
        this.replyId = item && item.id
        this.setState({ showDeleteCommentDialog: true })
    }

    _onSelectCommentOptions = (item, index) => {
        index == '0' ? this.onEditSelect(item) : this.onDeleteSelect(item);
    }

    render() {
        const { data } = this.state;
        var commentListCount = data && data.length
        if (this.state.isLoading) {
            return <LoadingSpinner />
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.repliesHeader}>
                        <Text style={styles.repliesHeaderText}> {commentListCount!= undefined? commentListCount: 0} {I18n.t('postDetailComments.replies')}
                        </Text>
                    </View>
                    { 
                       commentListCount>0 && 
                       data.map((item,index) => {
                            return(
                                this.renderComments(item, index)
                            )
                        })
                    }
                    {this.renderShowFullImage()}
                    {this.renderDeletePostDialog()}
                    {this.state.isUpdatingLoader && <LoadingSpinner /> }
                </View>
            )
        }
    }

    renderShowFullImage() {
        const { showPreview, selectedType, selectedUrl } = this.state;
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
                                source={{ uri: selectedUrl }}
                                style={styles.mediaPlayer}
                                ignoreSilentSwitch='ignore'
                            />
                        }
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    _renderCarouselItem(item, count) {
        let itemStyle = count> 1? styles.multipleCurosel: styles.singleCaurosel;
        return (
            <View style={itemStyle}>
                {this.renderHeroImage(item)}
            </View>
        )
    }

    renderHeroImage(uri) {
        const type = uri && uri.type
        return <TouchableOpacity onPress={() => this.setState({
            showPreview: true, 
            selectedType: type,
            selectedUrl: uri.url
        })}>
            {type && type.includes('image') ?
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

    checkIfLiked(item) {
        const { userId } = this.props
        let userfound = false;
        if (item && item.whoLiked) {
            let { whoLiked } = item
            for (var i = 0; i < whoLiked.length; i++) {
                if (whoLiked[i].userId == userId) {
                    userfound = true;
                    break;
                }
            }
        }
        return userfound;
    }

    checkIfAuthor = (item) => {
        let isDisplay = false;
        const { userId } = this.props;
        if (item) {
            if (item.userId == userId) {
                isDisplay = true;
            }    
        }
        return isDisplay;
    }

    getIndex(index) {
        this.indexValue = index
    }

    renderCommentLike(item,index) {
        const { likeCommunityCommentPost, dislikeCommunityCommentPost } = this.props;
        const userLiked = this.checkIfLiked(item);
        const heartIconColor = userLiked ? Colors.rgb_4297ff : Colors.rgb_a3a3a3
        return (
            <View style={styles.commentHeartIcon}>
                <TouchableOpacity style={styles.LikeDislikeIcon} onPress={() => {
                    userLiked ? dislikeCommunityCommentPost(item.id, this.discussionId) :
                    likeCommunityCommentPost(item.id, this.discussionId);
                    this.getIndex(index);
                    }}>
                 {index === this.indexValue ? (this.props.isLikeCommentSuccess || this.props.isDislikeCommentSuccess ? <LoadingSpinner style = {styles.loaderMargin}/> : 
                 <HeartIcon fill={heartIconColor} width={14} height={13}/>) : <HeartIcon fill={heartIconColor} width={14} height={13}/>}
                </TouchableOpacity>
                {index === this.indexValue ? (this.props.isLikeCommentSuccess || this.props.isDislikeCommentSuccess ? null : <Text style={styles.commentLikeText}>
                    {item ? item.likeCount : ""} 
                </Text>) : <Text style={styles.commentLikeText}>
                    {item ? item.likeCount : ""} 
                </Text>}
            </View>
        )
    }

    renderComments(item, index) {
        let message = null
        let images = []
        let attachementLength;
        try {
            let obj = JSON.parse(item.content);
            message = obj.message
            images = obj.images
            attachementLength = images.length
        } catch (error) {
            message = item.content
        }

        return (
            <View style={styles.commentSection} key={index}>
                <View style={styles.commentSectionContainer}>
                    <View style={[styles.itemAuthorDetails]}>
                        <ProfileImage
                            borderWidth={0}
                            diameter={20}
                            imageUrl={item.author && item.author.imgPath}
                        />
                        <Text style={styles.itemCommentAuthorName}>{item.author && item.author.fullName}</Text>
                        <Text style={styles.itemTime}> {getRelativeTimeFromNow(item.editedDate || item.createdDate)}</Text>
                    </View>

                    <View style={styles.commentHtmlStyle}>
                        <ContentHtml spinnerEnable={false} htmlContent={message} customStyle={contentHtmlStyle} webViewStyle={styles.webViewStyle} />
                    </View>
                    {attachementLength ?
                        <FlatList
                            style={styles.carouselStyle}
                            keyExtractor={(item, index) => "postDetailComments" + index}
                            horizontal={true}
                            data={images}
                            renderItem={({ item, index }) => this._renderCarouselItem(item, index, attachementLength)}
                            showsHorizontalScrollIndicator={false}
                        /> : null}

                    {this.renderCommentLike(item,index)}

                </View>

                <View style={styles.commentOptionMenu}>
                    <OptionsMenu
                        icon={<MoreIcon width={16} height={16} fill={Colors.rgb_9b9b9b} />}
                        disable={!this.checkIfAuthor(item)}>
                        {postDetailCommentOptions.map((option, index) => (
                            <MenuOption
                                key={index}
                                onSelect={() => this._onSelectCommentOptions(item, index)}>
                                <Text style={styles.optionMenuText}>{option.option}</Text>
                            </MenuOption>
                        ))}
                    </OptionsMenu>
                </View>

            </View>

        )
    }

    renderSeparator() {
        return null
    }

    renderDeletePostDialog() {
        return (
            <Dialog
                visible={this.state.showDeleteCommentDialog}
                title={I18n.t('postDetailComments.delete_comment_dialog_title')}
                message={I18n.t('postDetailComments.delete_comment_dialog_description')}
                positive={I18n.t('postDetailComments.positive_cta')}
                negative={I18n.t('postDetailComments.negative_cta')}
                positiveOnPress={() => this._deleteComment()}
                negativeOnPress={() => this.setState({ showDeleteCommentDialog: false })}
                textAlign='left'
            />
        )
    }

    _deleteComment() {
        const { deleteComment } = this.props
        this.setState({ showDeleteCommentDialog: false, isUpdatingLoader: true })
        deleteComment(this.replyId)
    }
}

const mapStateToProps = (state) => ({
    isLikeCommentSuccess: state.communities.isLikeCommentSuccess,
    isDislikeCommentSuccess: state.communities.isDislikeCommentSuccess,
    isUnlikeSuccess: state.communities.isUnlikeSuccess,
    userId: state.user.summary ? state.user.summary.userId : undefined,
    postCommentList: state.communities.postCommentList,
    isCommentDeleteSuccess: state.communities.isCommentDeleteSuccess,
    isCommentDeleteFailure: state.communities.isCommentDeleteFailure
})

const mapDispatchToProps = (dispatch) => ({
    getPostCommentList: (discussionId) => dispatch(CommunitiesActions.getPostCommentList(discussionId)),
    likeCommunityCommentPost: (replyId, discussionId) => dispatch(CommunitiesActions.likeCommunityCommentPost(replyId, discussionId)),
    dislikeCommunityCommentPost: (replyId, discussionId) => dispatch(CommunitiesActions.dislikeCommunityCommentPost(replyId, discussionId)),
    deleteComment: (replyId) => dispatch(CommunitiesActions.deleteComment(replyId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailCommentsListScreen)

