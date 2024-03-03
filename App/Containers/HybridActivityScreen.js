import React, { Component } from 'react'
import {
    FlatList,
    ScrollView,
    Text,
    View
} from 'react-native'
import { connect } from 'react-redux'
import ActivitiesActions from '@redux/ActivitiesRedux'
import NotificationsActions from '@redux/NotificationsRedux';

import Button from '@components/Button'
import ContentHtml from '@components/ContentHtml'
import DotsIndicator from '@components/DotsIndicator'
import ErrorScreen from '@containers/ErrorScreen'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'
import NavigationService from '@services/NavigationService'
import { Constants } from '@resources'
import I18n from '@i18n'

import styles from './Styles/HybridActivityScreenStyles'

class HybridActivityScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isLoadingError: false,
            activeChildIdx: 0
        }
        this.isCTAClicked = false
    }

    componentDidMount() {
        const { activityId } = this.props.navigation.state.params
        this.props.getActivity(activityId)
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            activities,
            completeActivity,
            getActivityChild,
            registerActivity,
            navigation,
        } = this.props

        const { activityId } = navigation.state.params

        const { activeChildIdx } = this.state

        //get Parent Activity by matching with activityId
        if (activities !== prevProps.activities) {
            if (activities == null) {
                this.setState({
                    isLoading: false,
                    isLoadingError: true
                })
            } else {
                activities.filter(activity => {
                    if (activity.activityId == activityId) {
                        this.parentActivity = activity
                    }
                })

                this.setState({
                    isLoading: this.parentActivity == undefined ? false : prevState.isLoading,
                    isLoadingError: this.parentActivity == undefined,
                })
            }
        }

        if (this.parentActivity && prevState.isLoading) {
            if (!this.parentActivity.isRegistered && !this.registerActivityCalled) {
                this.registerActivityCalled = true
                // Register Parent Activity if it's NOT registered
                registerActivity(activityId)
            } else if (this.parentActivity.registerActivityFailure) {
                // Close - If Register Parent Activity is FAILED
                ToastMessage(I18n.t('hybrid.activity_register_error'))
                navigation.goBack()
            }

            // get child activites
            if (!this.parentActivity.childActivities && !this.isLoadingChildActivities) {
                this.isLoadingChildActivities = true
                getActivityChild(activityId)
            }

            if (this.parentActivity && this.parentActivity.isRegistered && this.parentActivity.childActivities) {
                this._hybridActivityTypeHandler()
            }
        }

        if (activeChildIdx != prevState.activeChildIdx) {
            // Complete Child Activity on Every Swipe and onNEXT CTA click if it's NOT completed
            if (this.carouselActivities && this.carouselActivities.length && prevState.activeChildIdx < this.carouselActivities.length - 1 && !this.carouselActivities[prevState.activeChildIdx].isCompleted) {
                completeActivity(this.parentActivity.childActivities[prevState.activeChildIdx].activityId, Constants.ACTIVITY_STATUSES.ATTENDED, activityId)
            }

            if (activeChildIdx == this.carouselActivities.length) {
                this._hybridSubActivityTypeHandler(this.carouselActivities.length)
            }
        }
    }

    _navigateToScreen = (contentType, navParams) => {

        switch (contentType) {
            case Constants.CONTENT_TYPES.VIDEO:
                NavigationService.replace('VideoActivityScreen', navParams)
                break

            case Constants.CONTENT_TYPES.POLL:
                NavigationService.replace('PollScreen', navParams)
                break

            case Constants.CONTENT_TYPES.QUIZ:
                NavigationService.replace('AssessmentQuestionScreen', navParams)
                break

            case Constants.CONTENT_TYPES.SURVEY:
                NavigationService.replace('SurveyScreen', navParams)
                break

            default:
                ToastMessage(I18n.t('generic_error.unsupported_content'))
                this.props.navigation.goBack()
        }
    }

    _hybridActivityTypeHandler = () => {
        const { activeChildIdx } = this.state
        this.setState({
            isLoading: false
        })

        if (this.parentActivity && this.parentActivity.childActivities && this.parentActivity.childActivities.length) {
            const { activityId, activityName, contentType } = this.parentActivity.childActivities[activeChildIdx]
            if (contentType === Constants.CONTENT_TYPES.VIDEO) {
                let navParams = {
                    activityId,
                    activityName,
                    isHybridActivity: true,
                    onCompleteMainHybridActivity: () => {
                        this._hybridSubActivityTypeHandler(this.parentActivity.childActivities.length - 1)
                    },
                }

                this._navigateToScreen(contentType, navParams)
            }
        } else {
            return null
        }
    }

    _hybridSubActivityTypeHandler = (activeChildIdx) => {
        if (this.parentActivity && this.parentActivity.childActivities && activeChildIdx == this.parentActivity.childActivities.length - 1) {
            const { activityId, activityName, contentType } = this.parentActivity.childActivities[activeChildIdx]

            let navParams = {
                activityId,
                activityName,
                isHybridActivity: true,
                hybridActivityDetail: this.parentActivity,
                hybridMarkTaskAsComplete: this.taskCompletionCallback
            }

            this._navigateToScreen(contentType, navParams)
        }
    }

    taskCompletionCallback = () => {
        const { markTaskAsComplete, navigation } = this.props
        const { initiativeId, stepId, isMission } = navigation.state.params
        initiativeId && markTaskAsComplete(initiativeId, stepId, isMission)
    }

    onCTAPress = () => {
        const { completeActivity, navigation } = this.props
        const { activityId } = navigation.state.params
        const { activeChildIdx } = this.state

        if (!this.carouselActivities[activeChildIdx].isCompleted) {
            completeActivity(this.parentActivity.childActivities[activeChildIdx].activityId, Constants.ACTIVITY_STATUSES.ATTENDED, activityId)
        }
        this.setState({
            activeChildIdx: activeChildIdx + 1
        })
    }

    renderDescription(activityDescription) {
        if (activityDescription && activityDescription.match(Constants.HTML_PATTERN)) {
            return (
                <ContentHtml htmlContent={activityDescription} style={styles.htmlContainer} />
            )
        } else {
            return (
                <Text style={styles.contentDescription}>{activityDescription}</Text>
            )
        }
    }

    renderHeroImage(uri) {
        return (
            <View style={styles.heroImageContainer}>
                <ImageEx
                    style={styles.heroImage}
                    source={{ uri }}
                />
            </View>
        )
    }

    renderCTA() {
        return (
            <Button
                style={styles.cta}
                title={I18n.t('hybrid.next')}
                onPress={this.onCTAPress}
            />
        )
    }

    _renderIndicator = (activityChild, activeChildIdx) => {
        return (
            <DotsIndicator
                activeDotIndex={activeChildIdx}
                dotsData={activityChild}
                style={styles.dotsContainer}
            />
        )
    }

    _renderCarouselDetail = (carousel, index) => {
        const {
            activeChildIdx,
        } = this.state
        if (index == activeChildIdx) {
            return (
                <View>
                    <Text style={styles.contentTitle}>{carousel.activityName}</Text>
                    {this.renderDescription(carousel.activityDescription)}
                </View>
            )
        }
    }

    _renderCarouselItem = ({ item, index }) => {
        const {
            activeChildIdx,
        } = this.state
        var style = index === activeChildIdx ? styles.carouselMiddleItem : styles.carouselMiddleItemInactive
        if (index === 0) {
            style = index === activeChildIdx ? styles.carouselFirstItem : styles.carouselFirstItemInactive
        } else if (index === this.carouselActivities.length - 1) {
            style = index === activeChildIdx ? styles.carouselLastItem : styles.carouselLastItemInactive
        }
        return (
            <ScrollView style={style}>
                {this.renderHeroImage(item.activityImageUrl || item.imageURL)}
                {this._renderIndicator(this.carouselActivities, activeChildIdx)}
                {this._renderCarouselDetail(item, index)}
            </ScrollView>
        )
    }

    _onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            this.setState({
                activeChildIdx: viewableItems[0].index,
            })
        }
    }

    _renderContent = () => {
        const { activeChildIdx } = this.state

        if (this.parentActivity && this.parentActivity.childActivities && this.parentActivity.childActivities.length &&
            this.parentActivity.childActivities[activeChildIdx].contentType === Constants.CONTENT_TYPES.SLIDE) {

            this.carouselActivities = [...this.parentActivity.childActivities]
            this.carouselActivities.splice(this.carouselActivities.length - 1, 1)

            return (
                <View style={styles.mainContainer}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                        pagingEnabled={true}
                        data={this.carouselActivities}
                        renderItem={this._renderCarouselItem}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 75
                        }}
                        onViewableItemsChanged={this._onViewableItemsChanged}
                        showsHorizontalScrollIndicator={false}
                    />
                    {activeChildIdx === this.carouselActivities.length - 1 &&
                        this.renderCTA()
                    }
                </View>
            )
        } else {
            return <ErrorScreen
                title={I18n.t('generic_error.unsupported_content')}
            />
        }
    }

    render() {
        const { isLoading, isLoadingError } = this.state

        if (isLoading) {
            return <LoadingSpinner />
        } else if (isLoadingError) {
            return <ErrorScreen
                title={I18n.t('activity.load_activity_error')}
            />
        } else {
            return this._renderContent()
        }
    }
}

const mapStateToProps = (state) => ({
    activities: state.activities.activities,
})

const mapDispatchToProps = (dispatch) => ({
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
    getActivityChild: (activityId) => dispatch(ActivitiesActions.getActivityChild(activityId)),
    registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
    completeActivity: (activityId, status, parentActivityId) => dispatch(ActivitiesActions.completeActivity(activityId, status, parentActivityId)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})
export default connect(mapStateToProps, mapDispatchToProps)(HybridActivityScreen)