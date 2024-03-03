import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
} from 'react-native'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectActionSheet } from '@expo/react-native-action-sheet'

import NavigationActions from '@redux/NavigationRedux'
import UserActions from '@redux/UserRedux'

import ToastMessage from '@components/ToastMessage'
import I18n from '@i18n'

import styles from './Styles/ChannelCardStyles'

class ChannelCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedChannelId: props.channelId,
        }
    }

    componentDidMount() {
        this.props.getChannels()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.channel != this.props.channel) {
            this.props.reset()
        }

        if (prevProps.getChannelFailure != this.props.getChannelFailure && this.props.getChannelFailure) {
            this.props.hideLoading()
            ToastMessage(I18n.t('multichannel.msg_failed_to_switch'))
            this.setState({
                selectedChannelId: this.props.channelId,
            })
        }
    }

    _showActionSheet(options, callback) {
        setTimeout(() => this.props.showActionSheetWithOptions({
            options,
            cancelButtonIndex: options.length,
        }, callback), 100)
    }

    _onChannelSelected = (buttonIndex) => {
        const {
            channels,
            getChannel,
            reset,
            defaultView,
            showLoading,
        } = this.props
        const options = this._getOptions()
        switch (options[buttonIndex]) {
            case I18n.t('multichannel.default_view'):
                this.setState({
                    selectedChannelId: null,
                }, () => {
                    defaultView()
                    reset()
                })
                break

            case I18n.t('multichannel.action_sheet_cancel'):
                break

            default:
                const selectedChannel = channels.find(channel => channel.profile_name == options[buttonIndex])
                if (selectedChannel) {
                    this.setState({
                        selectedChannelId: selectedChannel.id,
                    }, () => {
                        showLoading()
                        getChannel(selectedChannel.id)
                    })
                }
                break
        }
    }

    _getOptions = () => {
        const {
            channels,
            channelId,
        } = this.props
        var options = []
        if (channelId) {
            options.push(I18n.t('multichannel.default_view'))
        }
        channels.map(channel => {
            if (channel.id != channelId) {
                options.push(channel.profile_name)
            }
        })
        options.push(I18n.t('multichannel.action_sheet_cancel'))
        return options
    }

    _onChannelPress = () => {
        const {
            channels,
        } = this.props
        if (channels && channels.length > 0) {
            this._showActionSheet(this._getOptions(), this._onChannelSelected)
        } else {
            ToastMessage(I18n.t('multichannel.msg_no_channels'))
        }
    }

    render() {
        const {
            channels,
        } = this.props
        const {
            selectedChannelId,
        } = this.state
        var channelName = I18n.t('multi_channel.name')
        if (selectedChannelId) {
            const selectedChannel = channels.find(channel => channel.id == selectedChannelId)
            if (selectedChannel) {
                channelName = selectedChannel.profile_name
            }
        }
        return (
            <TouchableOpacity style={styles.container} onPress={this._onChannelPress}>
                <Text style={styles.channelName}>{channelName}</Text>
                <Text style={styles.btnChangeText}>{I18n.t('multi_channel.cta')}</Text>
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = (state) => ({
    channels: state.user.channels,
    channelId: state.user.channelId,
    channel: state.user.channel,
    getChannelFailure: state.user.getChannelFailure,
    tokenType: state.user.channel ? state.user.channel.token_type : undefined,
    accessToken: state.user.channel ? state.user.channel.access_token : undefined,
})

const mapDispatchToProps = (dispatch) => ({
    getChannels: () => dispatch(UserActions.getChannels()),
    getChannel: (id) => dispatch(UserActions.getChannel(id)),
    defaultView: () => dispatch(UserActions.defaultView()),
    showLoading: () => dispatch(NavigationActions.showLoading()),
    hideLoading: () => dispatch(NavigationActions.hideLoading()),
    reset: () => dispatch(NavigationActions.reset()),
})

export default compose(
    connectActionSheet,
    connect(mapStateToProps, mapDispatchToProps)
)(ChannelCard)