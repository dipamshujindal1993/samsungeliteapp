import React, { Component } from 'react'
import {
    Platform,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info'

import UserActions from '@redux/UserRedux'

import ErrorScreen from '@containers/ErrorScreen'
import HeaderButton from '@components/HeaderButton'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import ToastMessage from '@components/ToastMessage'
import { open } from '@services/LinkHandler'
import I18n from '@i18n'
import { Constants, Colors } from '@resources'
import { formatString } from '@utils/TextUtils'
import RightArrowIcon from '@svg/icon_arrowright.svg'
import {
    hasAccessTo,
} from '@utils/CommonUtils'

import styles from './Styles/SettingsScreenStyles'

class SettingsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => (
                <HeaderButton
                    style={styles.headerButton}
                    textStyle={styles.headerButtonText}
                    title={I18n.t('settings.logout')}
                    onPress={navigation.getParam('logOut')}
                />
            ),
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isLoading: props.userSummary && props.userSummary.username ? false : true,
            isLoadingError: false,
            optedInPushNotifications: props.userSummary && props.userSummary.push_opt_in,
            optedInEmailPromotions: props.userSummary && props.userSummary.email_opt_in,
        }

        this.RULES_POLICIES = [
            {
                title: 'redemption_official_rules',
                onPress: () => open({ url: this.props.redemptionRulesUrl })
            },
            {
                title: 'terms_of_service',
                onPress: () => props.navigation.navigate('TNCDetailScreen')
            },
            {
                title: 'privacy_policy',
                onPress: () => open({ url: Constants.PRIVACY_POLICY_URL, headerTitle: I18n.t('settings.privacy_policy') })
            }
        ]
    }

    componentDidMount() {
        const {
            userSummary,
            getUserSummary,
            navigation,
        } = this.props
        if (!userSummary || !userSummary.username) {
            getUserSummary()
        }

        navigation.setParams({ logOut: this._logOut })
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            updateUserSummarySuccess,
            updateUserSummaryFailure,
            userSummary
        } = this.props

        if (userSummary != prevProps.userSummary && prevState.isLoading) {
            if (userSummary == null) {
                this.setState({
                    isLoading: false,
                    isLoadingError: true
                })
            } else {
                this.setState({
                    isLoading: false,
                    isLoadingError: false,
                    optedInPushNotifications: userSummary.push_opt_in,
                    optedInEmailPromotions: userSummary.email_opt_in
                })
            }
        }
        if (updateUserSummarySuccess && prevProps.updateUserSummarySuccess !== updateUserSummarySuccess) {
            this.setState({
                isUpdatingUserSummary: false
            })
        }
        if (updateUserSummaryFailure && prevProps.updateUserSummaryFailure !== updateUserSummaryFailure) {
            ToastMessage(I18n.t('settings.failed_to_update_preferences'))
            this.setState({
                isUpdatingUserSummary: false,
                optedInPushNotifications: userSummary.push_opt_in,
                optedInEmailPromotions: userSummary.email_opt_in
            })
        }
    }

    _logOut = () => {
        this.props.logOut()
    }

    _optedInPushNotifications = (value) => {
        this.setState({
            optedInPushNotifications: value,
        }, () => this._onUpdate({
            "push_opt_in": value
        }))
    }

    _optedInEmailPromotions = (value) => {
        this.setState({
            optedInEmailPromotions: value,
        }, () => this._onUpdate({
            "email_opt_in": value
        }))
    }

    _onUpdate = (userInfo) => {
        const {
            updateUserSummary
        } = this.props

        if (userInfo) {
            updateUserSummary(userInfo)
            this.setState({ isUpdatingUserSummary: true })
        }
    }

    _renderPreferences(prefer) {
        const {
            optedInPushNotifications,
            optedInEmailPromotions
        } = this.state
        const {
            channelId,
        } = this.props

        let value, onValueChange
        if (prefer == 'push_notifications') {
            value = optedInPushNotifications
            onValueChange = this._optedInPushNotifications
        } else if (prefer == 'email_promotions') {
            value = optedInEmailPromotions
            onValueChange = this._optedInEmailPromotions
        }
        return (
            <View style={styles.preferenceContainer}>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.preference}>{I18n.t(`${'settings.'}${prefer}`)}</Text>
                    <Text style={styles.description}>{I18n.t(`${'settings.'}${prefer}${'_description'}`)}</Text>
                </View>
                <Switch
                    disabled={channelId != undefined}
                    value={value}
                    onValueChange={onValueChange}
                    thumbColor={Platform.OS === 'android' ? Colors.white : null}
                    trackColor={{ true: channelId != undefined ? Colors.rgba_4297ff80 : Colors.rgb_4297ff }}
                />
            </View>
        )
    }

    _renderRulesPolicies({ title, onPress }, idx) {
        const {
            homeTabs,
        } = this.props
        if (title !== 'redemption_official_rules' || hasAccessTo(Constants.TAB_REWARDS, homeTabs)) {
            return (
                <TouchableOpacity key={idx} onPress={onPress}>
                    <View style={styles.policyContainer}>
                        <Text style={styles.policy}>{I18n.t(`${'settings.'}${title}`)}</Text>
                        <RightArrowIcon width={24} height={24} />
                    </View>
                    <Separator style={styles.policySeparator} />
                </TouchableOpacity>
            )
        }
    }

    render() {
        const {
            isLoading,
            isLoadingError,
            isUpdatingUserSummary
        } = this.state

        if (isLoading) {
            return <LoadingSpinner />
        } else if (isLoadingError) {
            return <ErrorScreen
                title={I18n.t('generic_error.title')}
                message={I18n.t('generic_error.message')}
            />
        } else {
            return (
                <View style={styles.container}>
                    {this._renderPreferences('push_notifications')}
                    <Separator style={styles.preferencesSeparator} />
                    {this._renderPreferences('email_promotions')}

                    <View style={styles.policiesContainer}>
                        {this.RULES_POLICIES.map((policy, idx) =>
                            this._renderRulesPolicies(policy, idx)
                        )}
                    </View>

                    <View style={styles.space} />
                    <Text style={styles.version}>
                        {formatString(I18n.t('settings.version'), `${' '}${DeviceInfo.getVersion()}`)}
                    </Text>
                    {(isUpdatingUserSummary) && <LoadingSpinner />}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    channelId: state.user.channelId,
    redemptionRulesUrl: state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.redemption_rules_url : undefined,
    userSummary: state.user.summary,
    updateUserSummaryFailure: state.user.updateUserSummaryFailure,
    updateUserSummarySuccess: state.user.updateUserSummarySuccess,
    homeTabs: state.nav.homeTabs,
})

const mapDispatchToProps = (dispatch) => ({
    getUserSummary: () => dispatch(UserActions.getUserSummary()),
    logOut: () => dispatch(UserActions.logOut()),
    updateUserSummary: (userSummary) => dispatch(UserActions.updateUserSummary(userSummary)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)