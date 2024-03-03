import React, { Component } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    View, 
    ScrollView,
    StatusBar,
    Text, 
    TouchableOpacity, 
    TouchableWithoutFeedback,  
} from 'react-native'

import HeaderTitle from '@components/HeaderTitle'
import LeadItem from '@components/LeadItem'
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'
import ContentBody from '@components/ContentBody';
import { connect } from 'react-redux'
import LeadsActions from '@redux/LeadsRedux'
import I18n from '@i18n'
import { Colors } from '@resources'
import LinkHandler from '@services/LinkHandler'
import { formatDateString } from '@utils/TextUtils'
import CheckBox from '@svg/icon_complete'
import styles from './Styles/LeadDetailsScreenStyles'

const LEADSTATUSUPDATESCREEN = 'LeadStatusUpdateScreen'
const STATUS_RESOLUTION_SEPARATOR = ' - '

class LeadDetailsScreen extends Component {

    static navigationOptions = ({navigation}) => {
        const { state } = navigation
        const title = state.params.pageTitle || undefined
        return {
            headerTitle: <HeaderTitle title={title} />
        };
    }
    
    constructor(props){
        super(props)
        this.leadStatusTimer = undefined

        this.state = {
            isLoading: true,
            showStatusModal: false,
            totalStatus: [],       
            availableStatuses: [],
            availableResolutions: [],
            leadDetailsData: {},
            availableStatusesFromConfig: [],
            selectedStatus: '',  
            statusName: '',  
            selectedStatusID: null,  
            selectedLeadIndex: null,    
            selectedStatusColor: null    
        }
    }

    componentDidMount(){
        this.getLeadResolutions()
        this.getLeadStatus()
        this.fetchStatusesfromRemoteConfig()
    }

    componentDidUpdate(prevProps) {
        const { leadDetails, resolutions, navigation, leadsFilterByOptions } = this.props
        if (prevProps.leadDetails != leadDetails) {
            if (leadDetails != null || leadDetails != undefined) {
                this.constructLeadDetails()
            }
        }
        if (prevProps.resolutions != resolutions) {
            if (resolutions != null || resolutions != undefined) {
                const leadID = navigation && navigation.state.params && navigation.state.params.leadDetails.Id
                this.setState({
                    availableResolutions: resolutions
                }, () => this.getLeadDetails(leadID))
            }
        }
        if (prevProps.leadsFilterByOptions != leadsFilterByOptions) {
            if (leadsFilterByOptions && leadsFilterByOptions.length > 1) {
                this.setState({
                    totalStatus: leadsFilterByOptions
                })
            }
        }
    }

    constructLeadDetails() {
        const { leadDetails, navigation } = this.props
        if (leadDetails) {
            const item = leadDetails.LeadHistory && leadDetails.LeadHistory.length > 0 && leadDetails.LeadHistory[0]   // to be considered 1st element as the current status
            const leadName = this.getLeadNameWithResolutions(item)
            navigation.setParams({ pageTitle: leadDetails.Name });
            this.setState({
                isLoading: false,
                leadDetailsData: leadDetails,
                statusName: this.getLeadNameFromID(item.LeadStatusId),
                selectedStatus: leadName
            }, () => {
                this.constructStatuses(this.state.selectedStatus, item.LeadStatusId)
            })
        } else {
            ToastMessage(I18n.t('generic_error.message'));
            navigation.goBack()
        }
    }

    constructStatuses(status, leadID) {
        if (!status || status == null) 
            return
        const { availableStatusesFromConfig } = this.state
        const currentStatus = availableStatusesFromConfig && availableStatusesFromConfig.find((obj) => {
            return obj[status] != undefined
        })
        if (currentStatus && currentStatus.next_status && currentStatus.next_status.length > 0) {
            currentStatus.next_status.map((item) => {
                if (item.needConfirmation && item.needConfirmation == true) {
                    this.setState({ 
                        availableStatuses: null,
                        selectedStatusID: leadID ? leadID : null,
                        selectedStatusColor: currentStatus ? currentStatus[status].color : null,
                    })
                }
            })
            return 
        }
        if (currentStatus) {
            this.setState({ 
                availableStatuses: currentStatus[status].next_status || null,
                selectedStatusColor: currentStatus[status].color,
                selectedStatusID: leadID ? leadID : null
            })
        }
    }

    refreshOnSuccessFullUpdate = (leadID) => {
        if (leadID) {
            this.setState({
                isLoading: true
            })
            this.getLeadDetails(leadID, true)
        }
    }

    fetchStatusesfromRemoteConfig() {
        const { leadStatusHelp } = this.props
        const avaialbleStatuses = JSON.parse(leadStatusHelp)
        if (avaialbleStatuses && avaialbleStatuses.length > 0) {
            this.setState({
                availableStatusesFromConfig: avaialbleStatuses
            }, () => {
                this.constructStatuses(this.state.selectedStatus, 0)
            })
        }
    }

    getLeadDetails(leadID) { 
        if (leadID) {
            this.props.getLeadDetail(leadID)
        }
    }

    getLeadStatus() {
        const { leadsFilterByOptions, getLeadsFilterByOptions } = this.props
        /* First try to get the status options from redux, if n/a then fetch from API */
        if (leadsFilterByOptions && leadsFilterByOptions.length > 1) {
            this.setState({
                totalStatus: leadsFilterByOptions
            })
        } else {
            getLeadsFilterByOptions()
        }
    }

    getLeadResolutions() {
        const { navigation, getLeadResolutions } = this.props
        const leadID = navigation && navigation.state.params && navigation.state.params.leadDetails.Id
        const { resolutions } = this.props
        if (resolutions == null || resolutions == undefined) {
            getLeadResolutions()
        } else {
            this.setState({
                availableResolutions: resolutions
            }, () => this.getLeadDetails(leadID))
        }
    }

    getLeadNameWithResolutions(leadDetails) {
        const { availableResolutions } = this.state
        if (leadDetails) {
            let leadStatusId = leadDetails.LeadStatusId
            let resolutionId = leadDetails.ResolutionId
            let leadName = this.getLeadNameFromID(leadStatusId)
            let resolution = ''
            if (availableResolutions.length > 0) {
                let resolutionData = availableResolutions.find((item) => { return item.Id === resolutionId}) || undefined
                if (resolutionData) {
                    resolution = resolutionData.Name
                    return `${leadName}${STATUS_RESOLUTION_SEPARATOR}${resolution}`
                }
            }
            return leadName
        }
    }

    getLeadNameFromID(id) {
        const statusData = this.state.totalStatus
        let status = statusData && statusData.length > 0 && statusData.find((item) => {
            return item.Id === id
        })
        return status ? status.Name : undefined
    }  
    
    getLeadIDFromStatus(currentStatusName) {
        const { availableResolutions, totalStatus } = this.state
        let statusName = currentStatusName
        let resolutionSelected = undefined
        if (statusName.includes(STATUS_RESOLUTION_SEPARATOR)) {      //  Check for Closed status with resolutions
            const isClosed = currentStatusName.split(STATUS_RESOLUTION_SEPARATOR)
            if (isClosed.length > 1) {
                statusName = isClosed[0]
                let resolutions = availableResolutions
                if (resolutions.length > 0) {
                    resolutionSelected = resolutions.find((item) => {
                        return item.Name.toUpperCase() === isClosed[1].toUpperCase()
                    })
                }
            }
        }
        const statusData = totalStatus
        let status = statusData && statusData.length > 0 && statusData.find((item) => {
            return item.Name.toUpperCase() === statusName.toUpperCase()
        })
        if (resolutionSelected) {
            status = {
                ...status,
                resolutionID: resolutionSelected.Id
            }
        }
        return status ? status : null
    } 
    
    getLeadData(index) {
        const leadData = this.state.availableStatuses[index]
        return leadData ? leadData : null
    }

    constructLeadParams(leadDetailsData, navigateParams) {
        if (!leadDetailsData || leadDetailsData === null || Object.keys(leadDetailsData).length === 0) return null
        const { navigation } = this.props
        const { statusName, selectedStatusID } = this.state
        const leadID = navigation && navigation.state.params && navigation.state.params.leadDetails.Id
        let leadData = {
            Id: leadDetailsData.Id || leadID,
            UniqueId: leadDetailsData.UniqueId,
            Name: leadDetailsData.Name,
            Phone: leadDetailsData.Phone,
            Email: leadDetailsData.Email,
            interestedProducts: leadDetailsData.interestedProducts,
            Status: statusName,
            StatusID: selectedStatusID,
            persona: leadDetailsData.Persona,
        }
        if (navigateParams) {
            const { StatusID, StatusName, ResolutionID } = navigateParams
            leadData.StatusID = StatusID
            leadData.Status = StatusName
            leadData.ResolutionID = ResolutionID ? ResolutionID : undefined
        }
        return leadData
    }

    renderDivider() {
        return(
            <View style={styles.divider}/>
        )
    }

    showStatusModal = () => {
        const { availableStatuses, showStatusModal } = this.state
        const { isLeadStatusUpdating } = this.props
        if (!availableStatuses || availableStatuses == null) {
            return
        }
        if (isLeadStatusUpdating) {
            ToastMessage(I18n.t('lead_gen.status_update_progress'))
        } else {
            this.setState({
                selectedLeadIndex: null,
                showStatusModal: !showStatusModal
            })
        }
    }

    resetSelectedIndex() {
        this.setState({         //  clear the selcted index before navigating, so that if user come back it will be resetted
            selectedLeadIndex: null
        })
    }

    buildStatusUpdate(navigateParams){
        const { leadDetailsData } = this.state
        const { navigation } = this.props
        navigation.navigate(LEADSTATUSUPDATESCREEN, { 
            leadDetails: this.constructLeadParams(leadDetailsData, navigateParams),
            showProductsSold: navigateParams.shouldAskProductSolds,
            refreshLead: this.refreshOnSuccessFullUpdate
        }) 
        return 
    }

    navigateToStatusDescription(navigateParams) {
        if(navigateParams.needConfirmation == true) {
            setTimeout(() => {  // delay here is intended coz while showing modal alert can't be show. so wait till modal closes
                Alert.alert(I18n.t('lead_gen.lead_details_close_title'), I18n.t('lead_gen.lead_details_close_body'),
                [
                {text: I18n.t('lead_gen.lead_details_alert_yes'), onPress: () => this.buildStatusUpdate(navigateParams)},
                {text: I18n.t('lead_gen.lead_details_alert_cancel'), onPress: () => this.resetSelectedIndex()}
                ],
                {cancelable: true})
            }, 300)
            return
        } 
        this.buildStatusUpdate(navigateParams)
    }

    updateSelectedStatus(index) {
        if (this.leadStatusTimer === undefined) {
            const { availableStatuses, showStatusModal } = this.state
            this.setState({
                selectedLeadIndex: index
            })
            const pickedStatus = this.getLeadIDFromStatus(availableStatuses[index].Name)
            const chosenLeadData = this.getLeadData(index)
            let statusNameWithResolutions = ''
            const { Id, resolutionID } = pickedStatus
            const { shouldAskProductSolds, needConfirmation } = chosenLeadData
            if (pickedStatus) {
                statusNameWithResolutions = this.getLeadNameWithResolutions({
                    LeadStatusId: Id,
                    ResolutionId: resolutionID
                })
            }
            const navigateParams = {
                StatusID: pickedStatus ? Id : null,
                StatusName: statusNameWithResolutions,
                ResolutionID: pickedStatus ? resolutionID: null,
                shouldAskProductSolds: chosenLeadData ? shouldAskProductSolds : null,
                needConfirmation: chosenLeadData ? needConfirmation : null
            }
            this.leadStatusTimer = setTimeout(() => {      // timeout here is just to intimate the user about the selection
                this.setState({
                    showStatusModal: !showStatusModal,
                })
                this.navigateToStatusDescription(navigateParams)
                this.leadStatusTimer = undefined                               
            }, 500)              
        }

    }

    navigateToStatusHelpScreen = () => {
        const { navigation } = this.props
        const { availableStatusesFromConfig } = this.state
        navigation.navigate('LeadStatusHelpScreen', { leadStatusHelp: availableStatusesFromConfig })
    }

    renderStatusTypes() {
        const { showStatusModal, availableStatuses, selectedLeadIndex } = this.state
        if (showStatusModal) {
          return (
            <View style={styles.sortLayoutView}>
              <Text style={styles.sortByTxt}>{I18n.t('lead_gen.lead_details_status_modal_title')}</Text>
              <FlatList
                data={availableStatuses}
                keyExtractor={(item, index) => item.Name}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity
                                style={styles.sortItemView} 
                                onPress={() => this.updateSelectedStatus(index)}> 
                                { 
                                    selectedLeadIndex === index ? <CheckBox width={22} height={22} fill={Colors.rgb_4297ff} /> : 
                                    <View style={styles.checkBoxUnCheckedView}/> 
                                }
                                <Text style={styles.sortTypeText}>{item.Name}</Text>
                            </TouchableOpacity>
                }}
                extraData={this.state}
                />               
             </View>
          )
        }
    }

    renderStatusModal() {
        return(
            <Modal
                animationType='slide'
                presentationStyle='overFullScreen'
                transparent
                visible={this.state.showStatusModal}
                onRequestClose={this.showStatusModal}
                >
                <View style={styles.sortOverlay}>
                    <StatusBar backgroundColor={Colors.rgba_000000b1} barStyle={'dark-content'}/>
                    <TouchableWithoutFeedback onPress={this.showStatusModal}>
                        <View style={styles.sortTransparentView} />
                    </TouchableWithoutFeedback>
                    {this.renderStatusTypes()}
                </View>
            </Modal>
        )
    }

    renderLeadDetails() {
        const { leadDetailsData } = this.state
        const leadData = this.constructLeadParams(leadDetailsData);
        return(
            leadData? <LeadItem lead={leadData} disabled={true} onLeadSelection={this.onLeadSelection} /> : null
        )
    }

    renderLearningContent() {
        const { leadDetailsData } = this.state
        if (leadDetailsData && leadDetailsData.learningContent && leadDetailsData.learningContent.length > 0) {
            return(
                <View style={styles.interestView}>
                    <Text style={styles.cellTitleText}>{I18n.t('lead_gen.learning_resources')}</Text>
                    { leadDetailsData.learningContent.map((learningContent, index) => (
                        <Text 
                            key={index}
                            style={learningContent.Link ? styles.learningContentLink : styles.learningContentTitle}
                            onPress={learningContent.Link ? () => LinkHandler.openURL(learningContent.Link) : null}>{learningContent.Title || learningContent.name}
                        </Text>
                    ))}
                </View>
            )
        }
        return null
    }

    renderLeadInterests() {
        const { leadDetailsData } = this.state
        if (leadDetailsData && leadDetailsData.promotion) {
            const promotion = leadDetailsData.promotion
            if(promotion && promotion.Description) {
                return(
                    <View style={styles.interestView}>
                        <Text style={styles.cellTitleText}>{I18n.t('lead_gen.interest')}</Text>
                        <ContentBody style={styles.interestLinkText} body={promotion.Description} />
                    </View>
                )
            }
        }
        return null
    }

    renderStatusView() {
        const { availableStatuses, selectedStatusColor, selectedStatus } = this.state
        return(
            <View style={styles.statusView}>
                <View style={styles.rowAndSpaceBetween}>
                    <Text style={styles.cellTitleText}>{I18n.t('lead_gen.set_status')}</Text>
                    <TouchableOpacity style={styles.statusHelpButton} onPress={this.navigateToStatusHelpScreen}>
                        <Text style={styles.leadStatusDetail}>?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.selectStatusView}
                    disabled={!availableStatuses || availableStatuses == null}
                    onPress={this.showStatusModal}>
                        <View style={styles.selectStatusInlineView}>
                            <View style={[styles.statusColorBGIndicator]}>
                                <View style={[styles.statusColorIndicator, { backgroundColor: selectedStatusColor }]}/>
                            </View>
                            <Text style={styles.selectedStatusText}>{selectedStatus}</Text>
                        </View>
                </TouchableOpacity>
            </View>
        )
    }

    itemSoldBuilderForNotificationCell(item,index) {
        if (item.ProductsSold && item.ProductsSold.length > 0) {
            let productBuilder = ''
            item.ProductsSold.map((product, index) => {
                productBuilder = productBuilder+`${product.Category}, ${product.Quantity} `+I18n.t('lead_gen.items')
                if (index != item.ProductsSold.length -1) {
                    productBuilder = productBuilder+'\n'
                }
            })
            return(
                <View key={index.toString()}>
                    <Text style={styles.itemSoldProductsText}>{productBuilder}</Text>
                    <Text style={styles.itemSoldDateText}>{formatDateString(item.UpdateDate)}</Text>
                </View>
            )
        }
        return null
    }

    getHistoryItem(item, index) {
        if (!item || item == null) {
            return false
        }
        return(
            <View key={index}>
                <View style={styles.rowAndSpaceBetween}>
                    <View>
                        <Text style={styles.notificationTitle}>{this.getLeadNameWithResolutions(item)}</Text>
                        <Text style={styles.notificationDate}>{formatDateString(item.UpdateDate)}</Text>
                    </View>
                    <Text style={styles.notificationTime}>{item.RelativeDate.endsWith(' s') ? 'now' : `${item.RelativeDate}`}</Text>
                </View>
                <View>
                    {item.Note ? <Text style={styles.notificationNoteText}>{item.Note}</Text> : null}
                </View>
            </View>
        )
    }

    renderPurchasedView() {
        const { leadDetailsData } = this.state
        if (leadDetailsData) {
            const leadHistoryData = leadDetailsData.LeadHistory
            if(leadHistoryData && leadHistoryData.length > 0){
                const isShowPurchasedView = leadHistoryData.some((item, index) => {
                    return item.ProductsSold && item.ProductsSold.length > 0
                })
                if(isShowPurchasedView) {
                    return(
                        <View style={styles.interestView}>
                            <Text style={styles.cellTitleText}>{I18n.t('lead_gen.purchased')}</Text>
                            {leadHistoryData.map((item, index) => {
                                return this.itemSoldBuilderForNotificationCell(item,index)
                            })}
                        </View>
                    )
                }
            }
        }
        return null
    }

    renderHistoryView() {
        const { leadDetailsData } = this.state
        if (leadDetailsData) {
            const leadHistoryData = leadDetailsData.LeadHistory
            if(leadHistoryData && leadHistoryData.length > 0){
                return(
                    <View style={styles.historyView}>
                        <Text style={styles.cellTitleText}>{I18n.t('lead_gen.history')}</Text>
                        {
                            leadHistoryData.map((history,index) => {
                                return this.getHistoryItem(history, index)
                            })
                        }
                    </View>
                )
            }
        }
        return null
    }

    render(){
        if (this.state.isLoading){
             return <View style={styles.loading_spinner_container}>
                <LoadingSpinner />
            </View>
        }
        return(
            <ScrollView style={styles.baseView}>
                {this.renderLeadDetails()}
                {this.renderLeadInterests()}
                {this.renderLearningContent()}
                {this.renderStatusView()}
                {this.renderPurchasedView()}
                {this.renderHistoryView()}
                {this.renderStatusModal()}
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    leadStatusHelp: state.remoteConfig.lead_status_help,
    leadsFilterByOptions: state.leads.leadsFilterByOptions || undefined,
    isUpdatingLeadStatus: state.leads.isUpdatingLeadStatus,
    resolutions: state.leads.resolutions,
    leadStatus: state.leads.leadStatus,
    leadDetails: state.leads.leadDetails,
    isLeadStatusUpdating: state.leads.isLeadStatusUpdating
})

const mapDispatchToProps = (dispatch) => ({
    getLeadsResolutions: () => dispatch(LeadsActions.getLeadsResolutions()),
    getLeadsFilterByOptions: () => dispatch(LeadsActions.getLeadsFilterByOptions()),
    getLeadDetail: (id) => dispatch(LeadsActions.getLeadDetail(id))
})


export default connect(mapStateToProps, mapDispatchToProps)(LeadDetailsScreen);
