import React, { Component } from 'react'
import {
    TouchableOpacity,
    View,
    Text,
} from 'react-native'
import { connect } from 'react-redux'

import LoadingSpinner from '@components/LoadingSpinner'
import NavigationService from '@services/NavigationService'
import ProfileImage from '@components/ProfileImage'
import UserActions from '@redux/UserRedux'
import { isFeatureSupported } from '@utils/CommonUtils'
import {
    isEmpty,
    formatString,
    formatNumber,
} from '@utils/TextUtils'
import I18n from '@i18n'

import {
    Colors,
} from '@resources'
import styles from './Styles/ProfileCardStyles'

class ProfileCard extends Component {

    constructor(props) {
        super(props)
        const {
            userAudiences,
            leaderboards,
            transactionHistory,
            redeemablePoints,
            nonRedeemablePoints,
            streak,
        } = this.props
        this.leaderboardsEnabled = userAudiences && isFeatureSupported(leaderboards, userAudiences.data)
        this.transactionHistoryEnabled = userAudiences && isFeatureSupported(transactionHistory, userAudiences.data)
        this.pointsEnabled = userAudiences && (isFeatureSupported(redeemablePoints, userAudiences.data) || isFeatureSupported(nonRedeemablePoints, userAudiences.data))
        this.streakEnabled = userAudiences && isFeatureSupported(streak, userAudiences.data)
    }

    componentDidMount() {
        const {
            summary,
            getUserSummary,
            getActivities,
            getCheilSummary,
            getPoints,
        } = this.props

        if (!summary) {
            getUserSummary()
        }
        if (this.streakEnabled) {
            getActivities()
        }
        getCheilSummary()
        getPoints()
    }

    render() {
        const {
            isFsm,
            summary,
            cheilSummary
        } = this.props

        const firstname = (summary && summary.firstName) || (cheilSummary && cheilSummary.firstName)
        const lastName = (summary && summary.lastName) || (cheilSummary && cheilSummary.lastName)
        const primaryOrganization = summary && summary.organizations && summary.organizations.find(organization => organization.isPrimary)
        const fsmTerritory = summary && summary.personOptional && summary.personOptional.text3
        const repCode = cheilSummary && cheilSummary.repCode
        return (
            <TouchableOpacity style={styles.container} onPress={() => NavigationService.navigate('ProfileScreen')}>
                <View style={styles.image_info}>
                    <ProfileImage
                        borderWidth={0}
                        diameter={64}
                        imageUrl={summary && summary.imageUrl}
                        showWreath={true}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName} numberOfLines={1}>{firstname} {lastName}</Text>
                        {isFsm && fsmTerritory && <Text style={styles.storeAddress}>{fsmTerritory}</Text>}
                        {!isFsm && primaryOrganization && <Text style={styles.storeAddress} numberOfLines={1}>{primaryOrganization.name}</Text>}
                        {!isFsm && !isEmpty(repCode) && <Text style={styles.repCode}>{formatString(I18n.t('home.profile_card.rep_code'), repCode)}</Text>}
                    </View>
                    {!summary && <LoadingSpinner />}
                </View>
                {this.renderPointsCard()}
            </TouchableOpacity>
        )
    }

    renderPointsCard() {
        if (!this.leaderboardsEnabled && !this.pointsEnabled && !this.streakEnabled) {
            return null
        }

        return (
            <View style={[styles.leaderboard_points, { paddingVertical: 13 }]}>
                {this.leaderboardsEnabled && this.renderLeaderBoard()}
                {this.pointsEnabled && this.renderDivider()}
                {this.pointsEnabled && this.renderPoints()}
                {this.streakEnabled && this.renderDivider()}
                {this.streakEnabled && this.renderStreakDays()}
            </View>
        )
    }

    renderLeaderBoard() {
        const {
            cheilSummary,
        } = this.props
        return (
            <TouchableOpacity style={styles.pointsContainer} onPress={() => NavigationService.navigate('LeaderboardScreen')}>
                <View style={styles.positionContainer}><Text style={styles.hash}>#</Text><Text style={styles.points}>{cheilSummary && cheilSummary.leaderBoard ? cheilSummary.leaderBoard.rank : 0}</Text></View>
                <Text style={styles.pointsLable}>{I18n.t('home.profile_card.leaderboard')}</Text>
            </TouchableOpacity>
        )
    }

    renderPoints() {
        const {
            points,
        } = this.props
        return (
            <TouchableOpacity style={styles.pointsContainer} disabled={!this.transactionHistoryEnabled} onPress={() => NavigationService.navigate('TransactionHistoryScreen')}>
                <Text style={styles.points}>{points ? formatNumber(points.totalPoint) : 0}</Text>
                <Text style={styles.pointsLable}>{I18n.t('home.profile_card.points')}</Text>
            </TouchableOpacity>
        )
    }

    renderStreakDays() {
        const {
            activities,
        } = this.props
        const activityCount = (activities && activities.activityCount) ? activities.activityCount : 0
        return (
            <TouchableOpacity style={styles.pointsContainer} disabled={!this.transactionHistoryEnabled} onPress={() => NavigationService.navigate('TransactionHistoryScreen')}>
                <Text style={styles.points}>{activityCount}</Text>
                <Text style={styles.pointsLable}>{I18n.t('home.profile_card.streak_days')}</Text>
            </TouchableOpacity>
        )
    }

    renderDivider() {
        return (
            <View style={styles.divider} />
        )
    }
}

const mapStateToProps = (state) => ({
    userAudiences: state.user.audiences,
    leaderboards: state.remoteConfig.featureConfig.leaderboards,
    transactionHistory: state.remoteConfig.featureConfig.transaction_history,
    redeemablePoints: state.remoteConfig.featureConfig.redeemable_points,
    nonRedeemablePoints: state.remoteConfig.featureConfig.non_redeemable_points,
    streak: state.remoteConfig.featureConfig.streak,
    summary: state.user.summary,
    points: state.user.points,
    activities: state.user.activities,
    cheilSummary: state.user.cheilSummary,
})

const mapDispatchToProps = (dispatch) => ({
    getUserSummary: () => dispatch(UserActions.getUserSummary()),
    getActivities: () => dispatch(UserActions.getActivities()),
    getCheilSummary: () => dispatch(UserActions.getCheilSummary()),
    getPoints: () => dispatch(UserActions.getPoints()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard)