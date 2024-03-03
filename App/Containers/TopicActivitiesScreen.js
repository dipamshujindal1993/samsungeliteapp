import React, { Component } from 'react'
import {
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Url from 'url-parse'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'

import ErrorScreen from '@containers/ErrorScreen'
import EndlessFlatList from '@components/EndlessFlatList'
import HeaderTitle from '@components/HeaderTitle'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import { Constants, Colors } from '@resources'
import { isEmpty } from '@utils/TextUtils'
import { getFileExtension } from '@utils/CommonUtils'
import { isVimeoVideo } from '@utils/VideoUtils'
import I18n from '@i18n'
import { openActivityDetail } from '@services/LinkHandler'

import AttachmentIcon from '@svg/icon_attachment.svg'
import DocumentIcon from '@svg/icon_skills.svg'
import FolderIcon from '@svg/icon_folder.svg'
import HistoryIcon from '@svg/icon_history.svg'
import PDFIcon from '@svg/icon_pdf.svg'
import PlayIcon from '@svg/icon_play.svg'

import styles from './Styles/TopicActivitiesScreenStyles'

class TopicActivitiesScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            errorLoading: false,
            data: [],
        }
        this.pageNumber = 0
        this.pageLimit = 10
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={navigation.getParam('headerTitle')} />,
        }
    }

    componentDidMount() {
        this._getTopicActivities()
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            topicActivitiesFailure,
            topicActivities,
        } = this.props
        if (topicActivities != prevProps.topicActivities) {
            if (topicActivities === null) {
                this.setState({
                    isLoading: false,
                    errorLoading: true,
                })
            } else {
                const { activities, totalActivities } = topicActivities
                this.total = totalActivities

                if (activities && activities.length) {
                    this.setState({
                        data: this.pageNumber > 0 ? prevState.data.concat(activities) : activities,
                        isLoading: false
                    })
                } else {
                    this.setState({
                        isLoading: false,
                    })
                }
            }
        }
        if (prevProps.topicActivitiesFailure != topicActivitiesFailure && topicActivitiesFailure) {
            this.setState({
                isLoading: false,
                errorLoading: true,
            })
        }
    }

    _getTopicActivities() {
        const { navigation, getTopicActivities } = this.props
        const { topicId } = navigation.state.params
        getTopicActivities(topicId, this.pageLimit, this.pageNumber)
    }

    showLoading = (isFileDownloading) => {
        this.setState({
            isFileDownloading
        })
    }

    _openActivityDetail(activity) {
        const {
            accessToken,
            apiConfig,
            tokenType
        } = this.props

        const { activityId, activityType, contentType, cbtPath } = activity

        let cookiesObj = {}
        let sourceObj = {}

        if (cbtPath && cbtPath != null && isVimeoVideo(cbtPath)) {
            sourceObj = {
                uri: cbtPath
            }
        } else {
            sourceObj = {
                uri: `${apiConfig.st_base_url}${'/apis/api/v1/activities/'}${activityId}${'/content'}`,
                headers: {
                    Authorization: `${tokenType} ${accessToken}`
                }
            }
        }

        if (Platform.OS === 'android' && activityType == Constants.ACTIVITY_TYPES.DOCUMENT) {
            sourceObj.extension = getFileExtension(contentType)
        }

        if (Platform.OS === 'ios' && contentType == Constants.CONTENT_TYPES.VIDEO) {
            let baseUrl = new Url(apiConfig.st_base_url, true)

            cookiesObj = {
                name: Constants.VIDEO_CONFIG.COOKIE_NAME,
                value: `${tokenType} ${accessToken}`,
                domain: baseUrl.hostname,
                path: Constants.VIDEO_CONFIG.COOKIE_PATH
            }
        }
        openActivityDetail(activity, null, sourceObj, cookiesObj, (isLoad) => this.showLoading(isLoad))
    }

    renderError() {
        const { navigation, topicActivitiesFailure } = this.props
        const { errorLoading } = this.state

        let errorTitle, errorIcon
        let parentScreen = navigation.getParam('parentScreen')

        switch (parentScreen) {
            case Constants.TOPIC_TYPES.DEMOS:
                errorTitle = (errorLoading || topicActivitiesFailure) ? I18n.t('learn_demo.fetch_error') : I18n.t('learn_demo.no_demos')
                break
            case Constants.TOPIC_TYPES.MERCHANDISING:
                errorTitle = (errorLoading || topicActivitiesFailure) ? I18n.t('merchandising.load_error') : I18n.t('merchandising.no_merchandising')
                errorIcon = (!errorLoading && !topicActivitiesFailure) && <HistoryIcon fill={Colors.rgb_4a4a4a} width={44} height={45} />
                break
            case Constants.TOPIC_TYPES.RESOURCES:
                errorTitle = (errorLoading || topicActivitiesFailure) ? I18n.t('learn_resource.fetch_error') : I18n.t('learn_resource.no_resources')
                break
            case Constants.TOPIC_TYPES.REWARDS:
                errorTitle = errorLoading ? I18n.t('rewards.redemption_rules_error') : I18n.t('rewards.no_redemption_rules')
                break
            default:
                errorTitle = I18n.t('generic_error.title')
                break
        }

        return (
            errorTitle && <ErrorScreen
                icon={errorIcon && errorIcon}
                title={errorTitle}
            />
        )
    }

    renderFileTypes = (contentType) => {
        let contentTypeName = !isEmpty(contentType) && contentType.replace('SEA_', '')

        switch (contentTypeName) {
            case Constants.RESOURCE_TYPES.DOCUMENT:
                return <>
                    <DocumentIcon fill={Colors.rgb_4a4a4a} width={14} height={13} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.FOLDER:
                return <>
                    <FolderIcon fill={Colors.rgb_4a4a4a} width={13} height={11} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.IMAGE:
            case Constants.RESOURCE_TYPES.PHOTO:
                return <>
                    <AttachmentIcon fill={Colors.rgb_4a4a4a} width={13} height={13} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.PDF:
                return <>
                    <PDFIcon fill={Colors.rgb_4a4a4a} width={11} height={13} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.VIDEO:
                return <>
                    <PlayIcon fill={Colors.rgb_4a4a4a} width={14} height={14} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            default:
                return <Text style={styles.itemType}>
                    {contentTypeName}
                </Text>
        }
    }

    renderItem = (activity) => {
        const { activityName, activityType, activityImage, contentType } = activity
        let contentTypeName = !isEmpty(contentType) && contentType.replace('SEA_', '')
        let imageProps = {
            style: styles.itemImage,
            source: { uri: activityImage }
        };
        if (contentTypeName === Constants.RESOURCE_TYPES.PDF || contentTypeName === Constants.RESOURCE_TYPES.DOCUMENT) {
            imageProps.renderDefaultSource = () => { return this.getDefaultImageSource(contentTypeName) };
        }

        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => this._openActivityDetail(activity)}>
                <View style={styles.itemImageContainer}>
                    <ImageEx {...imageProps} />
                    {activityType == Constants.RESOURCE_TYPES.VIDEO &&
                        <View style={styles.itemTypeImage}>
                            <PlayIcon fill={Colors.rgb_ececec} width={24} height={24} />
                        </View>
                    }
                </View>

                <View style={styles.itemDetailContainer}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{activityName}</Text>
                    <View style={styles.itemTypeContainer}>
                        {this.renderFileTypes(contentType)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    getDefaultImageSource = (contentType) => {
        if (contentType === Constants.RESOURCE_TYPES.PDF) {
            return (
                <TouchableOpacity disabled={true}>
                    <View style={[styles.itemImage, { backgroundColor: Colors.rgb_f9f9f9, alignItems: 'center', justifyContent: 'center' }]}>
                        <PDFIcon width={45} height='30%' fill={Colors.rgb_9b9b9b} />
                    </View>
                </TouchableOpacity>
            );
        } else if (contentType === Constants.RESOURCE_TYPES.DOCUMENT) {
            return (
                <TouchableOpacity disabled={true}>
                    <View style={[styles.itemImage, { backgroundColor: Colors.rgb_f9f9f9, alignItems: 'center', justifyContent: 'center' }]}>
                        <DocumentIcon width={45} height='30%' fill={Colors.rgb_9b9b9b} />
                    </View>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    }

    renderTopicActivities() {
        const { data } = this.state

        if (data.length) {
            return (
                <EndlessFlatList
                    data={data}
                    ItemSeparatorComponent={() => <Separator style={styles.itemSeparator} />}
                    loadMore={() => {
                        this.pageNumber++
                        this._getTopicActivities()
                    }}
                    loadedAll={data.length >= this.total}
                    renderItem={({ item }) => this.renderItem(item)}
                />
            )
        }
        else {
            return this.renderError()
        }
    }

    render() {
        const { isLoading, isFileDownloading } = this.state
        const { isLoadingTopicActivities } = this.props
        if (isLoading) {
            return <LoadingSpinner />
        } else {
            return (
                <View style={styles.mainContainer}>
                    {this.renderTopicActivities()}
                    {(isLoadingTopicActivities || isFileDownloading) && <LoadingSpinner />}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    apiConfig: state.remoteConfig.apiConfig,
    accessToken: state.app.access_token,
    tokenType: state.app.token_type,
    isLoadingTopicActivities: state.activities.isLoadingTopicActivities,
    topicActivities: state.activities.topicActivities,
    topicActivitiesFailure: state.activities.topicActivitiesFailure
})

const mapDispatchToProps = (dispatch) => ({
    getTopicActivities: (topicId, pageLimit, pageNumber) => dispatch(ActivitiesActions.getTopicActivities(topicId, pageLimit, pageNumber))
})

export default connect(mapStateToProps, mapDispatchToProps)(TopicActivitiesScreen)