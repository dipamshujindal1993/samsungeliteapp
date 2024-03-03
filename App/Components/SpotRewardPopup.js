import React, { Component } from 'react';
import { connect } from 'react-redux'

import I18n from '@i18n'
import Dialog from '@components/Dialog'

import NavigationService from '@services/NavigationService'
import NotificationsActions from '@redux/NotificationsRedux';

class SpotRewardPopup extends Component {

    _markNotificationsAsRead() {
        const { spotRewardNotification, userId, markNotificationsAsRead } = this.props;
        if(spotRewardNotification && spotRewardNotification.length > 0){
            let ids = spotRewardNotification.map((d, i) => d.id)
            markNotificationsAsRead(ids, userId)
        }
    }

    render() {
        const {
            spotRewardNotification,
            clearSpotReward
        } = this.props;

        return (
            <>
                {spotRewardNotification && spotRewardNotification.length > 0 &&
                    <Dialog
                        title={I18n.t('spot_reward_notification.title')}
                        negativeOnPress={() => {
                            this._markNotificationsAsRead()
                            clearSpotReward()
                        }}
                        message={
                            spotRewardNotification.length > 1 ?
                                I18n.t('spot_reward_notification.multiple_reward_body') :
                                spotRewardNotification[0].message.notification.body
                        }
                        negative={I18n.t('spot_reward_notification.cta_negative')}
                        positive={I18n.t('spot_reward_notification.cta_positive')}
                        positiveOnPress={() => {
                            this._markNotificationsAsRead()
                            NavigationService.navigate('Rewards')
                            clearSpotReward()
                        }}
                    />
                }
            </>
        )
    }

}

const mapStateToProps = (state) => ({
    spotRewardNotification: state.notifications.spotRewardNotification,
    userId: state.user.summary ? state.user.summary.userId : undefined
})

const mapDispatchToProps = (dispatch) => ({
    clearSpotReward: () => dispatch(NotificationsActions.clearSpotReward()),
    markNotificationsAsRead: (ids, userId) => dispatch(NotificationsActions.markNotificationsAsRead(ids, userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(SpotRewardPopup)