import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationService from '@services/NavigationService'

import I18n from '@i18n'
import ActivitiesActions from '@redux/ActivitiesRedux'
import Carousel from '@components/Carousel'
import Widget from '@components/Widget'
import { Constants } from '@resources'
import { hasAccessTo } from '@utils/CommonUtils'
import { openActivityDetail } from '@services/LinkHandler'

import styles from './Styles/LearningCardStyles'

class LearningCard extends Component {
    componentDidMount() {
        this._getCourses()
    }

    _onPressSelectItem = (item) => {
        openActivityDetail(item)
    }

    _onSeeAllPress = () => {
        const {
            type,
            homeTabs,
            learnTabs,
        } = this.props
        var container = 'LearnScreen'
        if (!hasAccessTo(Constants.TAB_ACTIVITIES, learnTabs) && !hasAccessTo(Constants.TAB_COURSES, learnTabs)) {
            NavigationService.navigate(container)
        }

        if (hasAccessTo(Constants.TAB_LEARN, homeTabs)) {
            container = 'LearnTab'
        }
        if (type == Constants.TAB_ACTIVITIES) {
            NavigationService.navigate(`ActivitiesIn${container}`)
        } else if (type == Constants.TAB_COURSES) {
            NavigationService.navigate(`CoursesIn${container}`)
        }
    }

    _renderSeeAll() {
        return (
            <TouchableOpacity style={styles.btnSeeAll} onPress={this._onSeeAllPress}>
                <Text style={styles.btnSeeAllText}>{I18n.t('learn.see_all')}</Text>
            </TouchableOpacity>
        )
    }

    _onRefresh = () => {
        this._getCourses()
    }

    _getCourses = () => [
        this.props.getCourses(this.props.type == Constants.TAB_ACTIVITIES ? Constants.ACTIVITIES : Constants.ACTIVITY_TYPES.SIMPLIFIED_CURRICULUM, this.props.pageSize)
    ]

    _renderData() {
        if (this.props.isLoadingActivities || this.props.isLoadingCourses) {
            return (
                <Widget isLoading={true} />
            )
        } else if (this.props.activitiesFailure || this.props.coursesFailure) {
            return (
                <Widget
                    message={I18n.t('learn.unable_to_load')}
                    onRefresh={this._onRefresh}
                />
            )
        } else {
            const {
                type,
                learnerActivities,
                learnerCourses,
            } = this.props
            var data = type == Constants.TAB_ACTIVITIES
                ? learnerActivities && learnerActivities.data ? learnerActivities.data : []
                : learnerCourses && learnerCourses.data ? learnerCourses.data : []

            if (type == Constants.TAB_ACTIVITIES) {
                data = data.filter(item => item.status !== Constants.COURSE_STATUSES.COMPLETED)
            }

            if (data.length > 0) {
                return (
                    <Carousel
                        data={data.slice(0, 3)}
                        onPressSelectItem={this._onPressSelectItem}
                    />
                )
            } else {
                return (
                    <Widget message={type == Constants.TAB_ACTIVITIES ? I18n.t('learn.completed_all_activities') : I18n.t('learn.no_learning_yet')} />
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{I18n.t('learn.card_title')}</Text>
                    {this._renderSeeAll()}
                </View>

                {this._renderData()}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    homeTabs: state.nav.homeTabs,
    isLoadingActivities: state.activities.isLoadingActivities,
    activitiesFailure: state.activities.activitiesFailure,
    learnerActivities: state.activities.learnerActivities,
    isLoadingCourses: state.activities.isLoadingCourses,
    coursesFailure: state.activities.coursesFailure,
    learnerCourses: state.activities.learnerCourses,
    pageSize: state.remoteConfig.apiConfig && state.remoteConfig.apiConfig.page_size ? state.remoteConfig.apiConfig.page_size.learning_activities || 10 : 10,
})

const mapDispatchToProps = (dispatch) => ({
    getCourses: (activityType, pageSize) => dispatch(ActivitiesActions.getCourses(activityType, 1, pageSize)),
})
export default connect(mapStateToProps, mapDispatchToProps)(LearningCard)