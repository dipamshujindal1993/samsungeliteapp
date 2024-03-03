import React, { Component } from 'react'
import {
    TouchableOpacity,
    View,
    Text,
    Platform,
} from 'react-native'
import { connect } from 'react-redux'
import Url from 'url-parse'

import ActivitiesActions from '@redux/ActivitiesRedux'
import SearchActions from '@redux/SearchRedux'
import LoadingSpinner from '@components/LoadingSpinner'
import EndlessFlatList from '@components/EndlessFlatList'
import ImageEx from '@components/ImageEx'
import ErrorScreen from '@containers/ErrorScreen'
import {
    Colors,
    Constants,
} from '@resources'
import I18n from '@i18n'
import { formatString } from '@utils/TextUtils'
import NavigationService from '@services/NavigationService'
import { openActivityDetail } from '@services/LinkHandler'
import { getFileExtension } from '@utils/CommonUtils'
import { isVimeoVideo } from '@utils/VideoUtils'

import PlayIcon from '@svg/icon_play'
import PdfIcon from '@svg/icon_pdf'
import DocumentIcon from '@svg/icon_skills'

import styles from './Styles/SearchResultTabStyles'

class SearchResultTab extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
        }
        this.pageNumber = 0
    }

    componentDidUpdate(prevProps) {
        const {
            tab,
            activityDetail,
        } = this.props
        if (prevProps.triggerSearching != this.props.triggerSearching) {
            this.setState({
                isLoading: true,
                searchFailure: false,
                data: [],
            })
            this.pageNumber = 0
            this._searchActivitie()
        }

        switch (tab) {
            case Constants.TAB_COURSES:
                if (prevProps.courses != this.props.courses) {
                    const { pagination, data } = this.props.courses
                    this.total = pagination.total
                    this.setState((prevState) => ({
                        isLoading: false,
                        searchFailure: false,
                        data: this.pageNumber > 0 ? prevState.data.concat(data) : data,
                    }))
                } else if (this.props.searchCoursesFailure && prevProps.searchCoursesFailure != this.props.searchCoursesFailure) {
                    this.setState({
                        isLoading: false,
                        searchFailure: true,
                    })
                }
                break

            case Constants.TAB_RESOURCES:
                if (prevProps.resources != this.props.resources) {
                    const { pagination, data } = this.props.resources
                    this.total = pagination.total
                    this.setState((prevState) => ({
                        isLoading: false,
                        searchFailure: false,
                        data: this.pageNumber > 0 ? prevState.data.concat(data) : data,
                    }))
                } else if (this.props.searchResourcesFailure && prevProps.searchResourcesFailure != this.props.searchResourcesFailure) {
                    this.setState({
                        isLoading: false,
                        searchFailure: true,
                    })
                }
                break

            case Constants.TAB_ACTIVITIES:
                if (prevProps.activities != this.props.activities) {
                    const { pagination, data } = this.props.activities
                    this.total = pagination.total
                    this.setState((prevState) => ({
                        isLoading: false,
                        searchFailure: false,
                        data: this.pageNumber > 0 ? prevState.data.concat(data) : data,
                    }))
                } else if (this.props.searchActivitiesFailure && prevProps.searchActivitiesFailure != this.props.searchActivitiesFailure) {
                    this.setState({
                        isLoading: false,
                        searchFailure: true,
                    })
                }
                break

            default:
                if (prevProps.articles != this.props.articles) {
                    const { pagination, data } = this.props.articles
                    this.total = pagination.total
                    this.setState((prevState) => ({
                        isLoading: false,
                        searchFailure: false,
                        data: this.pageNumber > 0 ? prevState.data.concat(data) : data,
                    }))
                } else if (this.props.searchArticlesFailure && prevProps.searchArticlesFailure != this.props.searchArticlesFailure) {
                    this.setState({
                        isLoading: false,
                        searchFailure: true,
                    })
                }
                break
        }

        if (prevProps.activityDetail != activityDetail && activityDetail) {
            this._openActivityDetail(activityDetail)
        }
    }

    _openActivityDetail(activityDetail) {
        const modality = activityDetail.modalities && activityDetail.modalities.length > 0 ? activityDetail.modalities[0] : ''
        if (modality == Constants.MODALITY_FILTERS.ACTIVITY
            || modality == Constants.MODALITY_FILTERS.COURSES) {
            openActivityDetail(activityDetail)
            return
        }

        const {
            apiConfig,
            tokenType,
            accessToken,
        } = this.props

        const { activityId, activityType, contentType, cbtPath } = activityDetail

        let cookiesObj = {}
        switch (activityDetail.contentType) {
            case Constants.CONTENT_TYPES.PHOTO:
                sourceObj = {
                    uri: `${apiConfig.st_base_url}${'/apis/api/v1/activities/'}${activityId}${'/content'}`,
                    headers: {
                        Authorization: `${tokenType} ${accessToken}`
                    }
                }
                openActivityDetail(activityDetail, null, sourceObj)
                break

            default:
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
                } else {
                    if (Platform.OS === 'ios') {
                        let baseUrl = new Url(apiConfig.st_base_url, true)

                        cookiesObj = {
                            name: Constants.VIDEO_CONFIG.COOKIE_NAME,
                            value: `${tokenType} ${accessToken}`,
                            domain: baseUrl.hostname,
                            path: Constants.VIDEO_CONFIG.COOKIE_PATH
                        }
                    }
                }
                openActivityDetail(activityDetail, null, sourceObj, cookiesObj)
                break
        }
    }

    _onPress(item) {
        const {
            tab,
            getActivityDetail,
        } = this.props
        switch (tab) {
            case Constants.TAB_COURSES:
            case Constants.TAB_RESOURCES:
            case Constants.TAB_ACTIVITIES:
                getActivityDetail(item.activityId)
                break

            default:
                NavigationService.navigate('ArticleDetailScreen', { activityId: item.activityId })
                break
        }
    }

    _renderIcon = ({ deliveryMethod }) => {
        switch (deliveryMethod) {
            case Constants.CONTENT_TYPES.VIDEO:
                return (
                    <PlayIcon style={styles.icon} width={24} height={24} fill={Colors.rgb_ececec} />
                )

            case Constants.CONTENT_TYPES.PDF:
                return (
                    <PdfIcon style={styles.icon} width={24} height={24} fill={Colors.rgb_ececec} />
                )

            case Constants.CONTENT_TYPES.DOCUMENT:
                return (
                    <DocumentIcon style={styles.icon} width={24} height={24} fill={Colors.rgb_ececec} />
                )
        }
    }

    _renderItem = ({ item }) => {
        const { tab } = this.props
        switch (tab) {
            case Constants.TAB_COURSES:

            case Constants.TAB_RESOURCES:

            case Constants.TAB_ACTIVITIES:

            default:
                return (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => this._onPress(item)}>
                        <View style={styles.imageContainer}>
                            <ImageEx
                                style={styles.image}
                                source={{ uri: item.activityImageUrl }}
                            />
                            {this._renderIcon(item)}
                        </View>
                        <View style={styles.name_description}>
                            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )
        }
    }

    _searchActivitie() {
        this.props.searchActivities(this.props.tab, this.props.searchTerm, this.pageNumber)
    }

    render() {
        if (!this.props.shouldShowSearchSuggestions) {
            const { data, isLoading } = this.state
            if (isLoading) {
                return <LoadingSpinner />
            } else if (data && data.length > 0) {
                return (
                    <>
                        <EndlessFlatList
                            data={data}
                            renderItem={this._renderItem}
                            loadMore={() => {
                                this.pageNumber++
                                this._searchActivitie()
                            }}
                            loadedAll={data.length >= this.total}
                            refreshing={isLoading}
                            onRefresh={() => {
                                this.setState({
                                    isLoading: true,
                                    searchFailure: false,
                                    data: [],
                                })
                                this.pageNumber = 0
                                this._searchActivitie()
                            }}
                        />
                        {this.props.isLoadingActivityDetail && <LoadingSpinner />}
                    </>
                )
            } else {
                var tabName = I18n.t('search.articles')
                const { tab } = this.props
                switch (tab) {
                    case Constants.TAB_COURSES:
                        tabName = I18n.t('search.courses')
                        break

                    case Constants.TAB_RESOURCES:
                        tabName = I18n.t('search.resources')
                        break

                    case Constants.TAB_ACTIVITIES:
                        tabName = I18n.t('search.activities')
                        break
                }
                var title = I18n.t('search.not_found')
                if (this.state.searchFailure) {
                    title = I18n.t('search.unable_to_load')
                }
                return (
                    <ErrorScreen
                        title={formatString(title, tabName)}
                    />
                )
            }
        }
        return null
    }
}

const mapStateToProps = (state) => ({
    apiConfig: state.remoteConfig.apiConfig,
    tokenType: state.app.token_type,
    accessToken: state.app.access_token,
    shouldShowSearchSuggestions: state.search.shouldShowSearchSuggestions,
    searchTerm: state.search.searchTerm,
    triggerSearching: state.search.triggerSearching,
    articles: state.search.articles,
    searchArticlesFailure: state.search.searchArticlesFailure,
    courses: state.search.courses,
    searchCoursesFailure: state.search.searchCoursesFailure,
    resources: state.search.resources,
    searchResourcesFailure: state.search.searchResourcesFailure,
    activities: state.search.activities,
    searchActivitiesFailure: state.search.searchActivitiesFailure,
    isLoadingActivityDetail: state.activities.isLoadingActivityDetail,
    isLoadingActivityDetailFailure: state.activities.isLoadingActivityDetailFailure,
    activityDetail: state.activities.activityDetail,
})

const mapDispatchToProps = (dispatch) => ({
    searchActivities: (tab, searchTerm, pageNumber) => dispatch(SearchActions.searchActivities(tab, searchTerm, pageNumber)),
    getActivityDetail: (activityId) => dispatch(ActivitiesActions.getActivityDetail(activityId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultTab)