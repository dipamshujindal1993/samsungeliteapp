import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'

import HeaderTitle from '@components/HeaderTitle'
import ErrorScreen from '@containers/ErrorScreen'
import List from '@components/List'
import LoadingSpinner from '@components/LoadingSpinner'
import I18n from '@i18n'

import styles from './Styles/CoursesScreenStyles'

class CoursesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={navigation.getParam('headerTitle')} />,
        }
    }

    componentDidMount() {
        const { activityType } = this.props.navigation.state.params
        this.props.getCourses(activityType)
    }

    onItemClick = (id) => {
        if (id) {
            this.props.navigation.navigate('ArticleDetailScreen', { activityId: id, headerTitle: I18n.t('promos.promos') })
        }
    }

    renderCourses() {
        const { isLoadingPromos, courses, promosFailure, employeeType } = this.props
        let courseError = promosFailure ? I18n.t('promos.load_error') : (courses && courses.length <= 0 ? I18n.t('promos.msg_no_promos') : '' )

        if (courses) {
            return (
                <List
                    style={styles.coursesList}
                    data={courses}
                    onItemPress={this.onItemClick}
                    error={courseError}
                    employeeType={employeeType}
                />
            )
        } else if (!isLoadingPromos) {
            return (<ErrorScreen
                title={I18n.t('promos.msg_no_promos')}
            />
            )
        }
    }

    render() {
        if (this.props.isLoadingPromos) {
            return <LoadingSpinner />
        } else {
            return (
                <View style={styles.container}>
                    {this.renderCourses()}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    isLoadingPromos: state.activities.isLoadingPromos,
    courses: state.activities.promos,
    promosFailure: state.activities.promosFailure,
    employeeType: state.user.summary ? state.user.summary.employeeType : undefined,
})

const mapDispatchToProps = (dispatch) => ({
    getCourses: (activityType) => dispatch(ActivitiesActions.getCourses(activityType))
})

export default connect(mapStateToProps, mapDispatchToProps)(CoursesScreen)