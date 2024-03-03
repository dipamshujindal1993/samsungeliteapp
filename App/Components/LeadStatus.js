
import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/LeadStatusStyles'

class LeadStatus extends Component {

    static leadsFilterByOptionsFromRemoteConfig = undefined

    constructor(props) {
        super(props)
        this.updateStatusFromRemoteConfig()
        this.state = {
            statusDotColor: undefined
        }
    }

    componentDidMount() {
        this.updateStatus()
    }

    componentDidUpdate(prevProps) {
        if (this.props.lead.Status != prevProps.lead.Status) {
            this.updateStatus()
        }
    }

    updateStatusFromRemoteConfig(doneCallback) {
        const { leadStatusHelp } = this.props
        const status = leadStatusHelp ? JSON.parse(leadStatusHelp) : null
        if (!this.leadsFilterByOptionsFromRemoteConfig && status.length > 0) {
            this.leadsFilterByOptionsFromRemoteConfig = status
            if (doneCallback) {
                doneCallback()
            }
        } else {
            if (doneCallback) {
                doneCallback()
            }
        }
    }

    updateStatus = () => {
        this.updateStatusFromRemoteConfig(() => {
            this.setState({
                statusDotColor: this.getLeadStatusDotStyle(this.leadsFilterByOptionsFromRemoteConfig, this.props.lead).backgroundColor
            })
        })
    };

    onLeadStatusSelection = () => {
        const { onLeadStatusSelection, lead } = this.props
        if (onLeadStatusSelection && lead) {
            onLeadStatusSelection(lead);
        }
    };

    getLeadStatusDotStyle(remoteConfig, lead) {
        if (!remoteConfig) {
            return { backgroundColor: undefined }
        }
        const foundStatusConfig = remoteConfig.find(currentStatus => {
            return currentStatus[lead.Status] !== undefined
        })

        try {
            return { backgroundColor: foundStatusConfig[lead.Status].color }
        } catch (error) {
            return { backgroundColor: undefined }
        }
    }

    render() {
        const { lead, disabled = false, style, reverse, statusDotStyle, statusTextStyle, isTextCapital = true } = this.props;
        const leadStatus = lead.Status ? lead.Status : ''
        const { statusDotColor } = this.state;
        const statusText = isTextCapital ? leadStatus.toUpperCase() : leadStatus
        return (
            <TouchableOpacity style={[styles.statusContainer, reverse && styles.reverse, style]} onPress={this.onLeadStatusSelection} disabled={disabled}>
                {statusDotColor && <View style={[styles.statusDot, statusDotStyle, { backgroundColor: statusDotColor }]}></View>}
                <Text style={[styles.statusText, reverse ? styles.statusTextReverse : styles.statusTextNormal, statusTextStyle]}> {statusText} </Text>
            </TouchableOpacity>
        )

    }

}

const mapStateToProps = (state) => ({
    leadStatusHelp: state.remoteConfig.lead_status_help
})

export default connect(mapStateToProps, null)(LeadStatus);

