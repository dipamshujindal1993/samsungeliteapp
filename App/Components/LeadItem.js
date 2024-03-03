
import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/LeadItemStyles'
import { openMessageApp, openPhoneApp } from '@services/LinkHandler'
import LeadStatus from '@components/LeadStatus'
import I18n from '@i18n'
import { formatPhoneNumber, formatString } from '@utils/TextUtils'

class LeadItem extends Component {

	constructor(props) {
		super(props)
		this.leadSmsTextFromRemoteConfig = undefined
		this.updateleadSmsTextFromRemoteConfig()
	}

	updateleadSmsTextFromRemoteConfig(doneCallback) {
		const { leadSMSText } = this.props
		if (!this.leadSmsTextFromRemoteConfig && leadSMSText) {
			this.leadSmsTextFromRemoteConfig = leadSMSText
			if (doneCallback) {
				doneCallback()
			}
		} else {
			if (doneCallback) {
				doneCallback()
			}
		}
	}

	render() {
		const { lead } = this.props;
		return this.renderLead(lead)
	}

	renderLead(lead) {
		const { disabled } = this.props;
		const interestedProducts = (lead && lead.interestedProducts) ? lead.interestedProducts : []
		
		return (
			<TouchableOpacity onPress={this.onLeadSelection} disabled={disabled}>
				<View style={styles.leadContainer}>
					<View style={styles.leftBox}>
						<View>
							<Text style={styles.name}>{lead.Name}</Text>
							<Text style={styles.productName}>{interestedProducts.join(',')}</Text>
						</View>
						<View>
							<Text style={styles.phoneNumber}>{formatPhoneNumber(lead.Phone)}</Text>
							{lead.Id ? <Text style={styles.leadId}>{formatString(I18n.t('lead_gen.lead_id'),lead.Id)}</Text> : null}
						</View>
					</View>
					<View style={styles.leftBox}>
						<LeadStatus lead={lead} disabled reverse />
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								disabled = {lead.Phone ? false : true}
								style={styles.callView}
								onPress={() => this.doCall(lead.Phone)}>
									<Text style={styles.call}>{I18n.t('lead_gen.call')}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled = {lead.Phone ? false : true}
								style={styles.smsView} 
								onPress={() => this.doSms(lead)}>
									<Text style={styles.sms}>{I18n.t('lead_gen.sms')}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	onLeadSelection = () => {
		this.props.onLeadSelection(this.props.lead);
	};

	doCall = phoneNumber => {
		openPhoneApp(phoneNumber);
	};

	doSms = lead => {
		this.updateleadSmsTextFromRemoteConfig(() => {
			const { userSummary } = this.props
			const organizations = userSummary.organizations;
			const isPrimaryOrganization = organizations && organizations.find(org => org.isPrimary)
		
			let smsMessage = JSON.parse(this.leadSmsTextFromRemoteConfig)
			if(smsMessage.length > 0){
				if (lead && lead.interestedProducts[0]) {
					smsMessage = smsMessage[0].template1
				} else {
					smsMessage = smsMessage[1].template2
				}
			}
			
			const placeHolders = smsMessage.match(/\[.*?\]/gi)
			if (placeHolders) {
				var placeHolder = ''
				for (var i = 0; i < placeHolders.length; i++) {
					placeHolder = placeHolders[i]
					switch (placeHolder) {
						case '[CUSTOMER_NAME]':
							smsMessage = smsMessage.replace(placeHolder, lead.Name)
							break
						case '[REP_FIRST_NAME]':
							smsMessage = smsMessage.replace(placeHolder, userSummary.firstName)
							break
						case '[PRODUCT_NAME]':
							smsMessage = smsMessage.replace(placeHolder, lead.interestedProducts[0])
							break
						case '[STORE_NAME]':
							smsMessage = smsMessage.replace(placeHolder, isPrimaryOrganization.name)
							break
						case '[NEW_LINE]':
							smsMessage = smsMessage.replace(placeHolder, '\n')
							break
					}
				}
			}
			openMessageApp(lead.Phone, smsMessage)
		});
	};	
}

const mapStateToProps = state => ({
	pulseUserProfile: state.user.pulseUserProfile,
	userSummary: state.user.summary,
	leadSMSText: state.remoteConfig.lead_sms_text
})

export default connect(mapStateToProps)(LeadItem)