import React, { Component } from 'react';
import NavigationService from '@services/NavigationService'
import Dialog from '@components/Dialog';
import LinkHandler from '@services/LinkHandler'
import I18n from '@i18n'
import { connect } from 'react-redux';
import AppActions from '@redux/AppRedux'
import { currentTimeSeconds } from '@utils/DateUtils'

class AppRatingDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showRateApp: false,
        }
    }

    openStore() {
        this.showHideRateApp(false)
        LinkHandler.openStoreApp();
    }

    showHideRateApp(isVisible) {
        this.setState({
            showRateApp: isVisible,
        })
    }

    render() {
        const { showRateApp } = this.state
        const { isAppRatingPromptVisible } = this.props
        if (showRateApp) {
            return (
                <Dialog
                    visible={showRateApp}
                    title={I18n.t('rating.rating_title')}
                    message={I18n.t('rating.rating_message_second_popup')}
                    positive={I18n.t('rating.positive_cta_second')}
                    negative={I18n.t('rating.negative_cta_second')}
                    negativeOnPress={() => this.showHideRateApp(false)}
                    positiveOnPress={() => this.openStore()}
                    onDismiss={() => this.showHideRateApp(false)}
                    textAlign='left'
                />
            )
        } else if (isAppRatingPromptVisible) {
            const {
                appRatingPromptInterval,
                lastSeenAppRatingPrompt,
                showHideAppRatingPrompt,
                updateLastSeenAppRatingPrompt,
            } = this.props
            if (!lastSeenAppRatingPrompt || currentTimeSeconds() - lastSeenAppRatingPrompt > appRatingPromptInterval) {
                return (
                    <Dialog
                        title={I18n.t('rating.rating_title')}
                        message={I18n.t('rating.rating_message_first_popup')}
                        positive={I18n.t('rating.positive_cta_first')}
                        negative={I18n.t('rating.negative_cta_first')}
                        negativeOnPress={() => {
                            showHideAppRatingPrompt(false);
                            updateLastSeenAppRatingPrompt()
                            NavigationService.navigate('FeedbackFormScreen');
                        }}
                        positiveOnPress={() => {
                            showHideAppRatingPrompt(false);
                            updateLastSeenAppRatingPrompt()
                            this.showHideRateApp(true)
                        }}
                        onDismiss={() => {
                            showHideAppRatingPrompt(false)
                            updateLastSeenAppRatingPrompt()
                        }}
                        textAlign='left'
                    />
                )
            } else {
                showHideAppRatingPrompt(false)
            }
        }
        return null
    }

}

const mapStateToProps = (state) => ({
    isAppRatingPromptVisible: state.app.isAppRatingPromptVisible,
    lastSeenAppRatingPrompt: state.app.lastSeenAppRatingPrompt,
    appRatingPromptInterval: state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.app_rating_prompt_interval : 0,
})

const mapDispatchToProps = (dispatch) => ({
    showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible)),
    updateLastSeenAppRatingPrompt: () => dispatch(AppActions.updateLastSeenAppRatingPrompt(currentTimeSeconds())),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppRatingDialog)