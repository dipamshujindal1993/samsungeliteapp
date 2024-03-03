import React, { Component } from 'react'
import {
    View,
    Text,
} from 'react-native'
import { connect } from 'react-redux'

import UserActions from '@redux/UserRedux'
import LoadingSpinner from '@components/LoadingSpinner'
import ErrorScreen from '@containers/ErrorScreen'
import EndlessFlatList from '@components/EndlessFlatList'
import ProfileImage from '@components/ProfileImage'
import { formatNumber } from '@utils/TextUtils'
import { Constants } from '@resources'
import I18n from '@i18n'

import styles from './Styles/LeaderboardsListStyles'

class LeaderboardsList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
        }
        this.pageNumber = 1
    }

    componentDidMount() {
        if (this.props.period) {
            this.getLeaderboards()
        }
    }

    getLeaderboards() {
        const {
            period,
            myRepsLeaderboards,
            orgCode,
            getLeaderboards,
            getUserSummary,
        } = this.props
        if (myRepsLeaderboards) {
            if (orgCode) {
                getLeaderboards(myRepsLeaderboards, period, this.pageNumber, Constants.LEADERBOARD_FILTER.TERRITORY, orgCode)
            } else {
                getUserSummary()
            }
        } else {
            getLeaderboards(myRepsLeaderboards, period, this.pageNumber)
        }
    }

    componentDidUpdate(prevProps) {
        const {
            period,
            myRepsLeaderboards,
            orgCode,
            getUserSummaryFailure,
            repsLeaderboards,
            leaderboards,
        } = this.props

        if (prevProps.period != period || prevProps.orgCode != orgCode) {
            this.setState({
                isLoading: true,
            })
            this.pageNumber = 1
            this.getLeaderboards()
        }

        if (myRepsLeaderboards) {
            if (prevProps.getUserSummaryFailure != getUserSummaryFailure && getUserSummaryFailure) {
                this.setState({
                    isLoading: false,
                    isLoadingError: true,
                })
            }

            if (prevProps.repsLeaderboards != repsLeaderboards) {
                const { pagination, content } = repsLeaderboards
                this.total = pagination.totalCount
                this.setState((prevState) => ({
                    isLoading: false,
                    data: this.pageNumber > 1 ? prevState.data.concat(content) : content,
                }))
            }
        } else {
            if (prevProps.leaderboards != leaderboards) {
                const { pagination, content } = leaderboards
                this.total = pagination.totalCount
                this.setState((prevState) => ({
                    isLoading: false,
                    data: this.pageNumber > 1 ? prevState.data.concat(content) : content,
                }))
            }
        }
    }

    render() {
        const {
            isLoading,
            isLoadingError,
            data,
        } = this.state
        if (isLoading) {
            return <LoadingSpinner />
        } else if (isLoadingError) {
            return (
                <ErrorScreen
                    title={I18n.t('generic_error.title')}
                    message={I18n.t('generic_error.message')}
                />
            )
        } else {
            return (
                <EndlessFlatList
                    data={data}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    ItemSeparatorComponent={this.renderSeparator}
                    loadMore={() => {
                        this.pageNumber++
                        this.getLeaderboards()
                    }}
                    loadedAll={data && data.length >= this.total}
                />
            )
        }
    }

    renderItem(item, index) {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>{item.rank}.</Text>
                </View>
                <ProfileImage
                    imageUrl={item.profilePicture}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.nameText}>{item.firstName} {item.lastName}</Text>
                    <View style={styles.pointsContainer}>
                        <Text style={styles.pointsText}>{formatNumber(item.totalEarnPoint)}</Text>
                        <Text style={styles.ptsText}>{I18n.t('rewards.pts')}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderSeparator() {
        return <View style={styles.separator} />
    }
}

const mapStateToProps = (state) => ({
    period: state.nav.period,
    leaderboards: state.user.leaderboards,
    repsLeaderboards: state.user.repsLeaderboards,
    getUserSummaryFailure: state.user.getUserSummaryFailure,
    orgCode: state.user.summary && state.user.summary.personOptional ? state.user.summary.personOptional.text5 : undefined,
})

const mapDispatchToProps = (dispatch) => ({
    getLeaderboards: (myRepsLeaderboards, period, pageNumber, filter, filterId) => dispatch(UserActions.getLeaderboards(myRepsLeaderboards, period, pageNumber, filter, filterId)),
    getUserSummary: () => dispatch(UserActions.getUserSummary()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardsList)