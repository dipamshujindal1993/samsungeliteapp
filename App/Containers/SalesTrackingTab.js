import React, {Component} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import {connect} from "react-redux";
import ActivitiesActions from '@redux/ActivitiesRedux'
import UserActions from '@redux/UserRedux'
import CourseItem from '@components/CourseItem';
import EndlessFlatList from '@components/EndlessFlatList';
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator';
import ErrorScreen from "@containers/ErrorScreen";
import { open } from '@services/LinkHandler'
import {formatDate, getRelativeTimeFromNow} from '@utils/TextUtils'
import I18n from '@i18n'
import {Constants,Colors} from '@resources'
import PdfIcon from '@svg/icon_pdf.svg'

import styles from './Styles/SalesTrackingTabStyles'

class SalesTrackingTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isTotallySelected: true,
            currentActivity:'',
            isLoading:true,
            isLoadingTotallyWeekly:false
        }
        this.pageSize = 10
        this.page = 0;
    }

    componentDidMount() {
        this.props.getSalesTrackingCampaign(1,10)
    }

    getSalesTracks() {
        const { getSalesTracking} = this.props
        const { isTotallySelected, campaignId } = this.state
        getSalesTracking(campaignId, isTotallySelected ? Constants.SALES_TRACKING.TOTAL: Constants.SALES_TRACKING.WEEKLY, this.page, this.pageSize)
    }

    componentDidUpdate(prevProps,prevState) {
        const { activities, getActivity, salesTracking, salesTrackingFailure, salesTrackingCampaign, noActiveCampaign, eligibleStatus, salesTrackingCampaignFailure } = this.props
        if ((noActiveCampaign || salesTrackingFailure || salesTrackingCampaignFailure) && (prevState.isLoading || prevState.isLoadingTotallyWeekly)) {
            this.setState({ isLoading:false, isLoadingTotallyWeekly:false })
        }

        if (salesTrackingCampaign != prevProps.salesTrackingCampaign) {
            const { campaignId, eligibilityLink } = salesTrackingCampaign.content[0]

            if (eligibleStatus){
                this.setState({ campaignId },()=>{
                    this.getSalesTracks()
                })

                if (eligibilityLink.includes('activityId')) {
                    const id=eligibilityLink.split('activityId=');
                    const activityId=id[1]
                    this.setState({activityId})
                    getActivity(activityId)
                } else {
                    this.setState({isLoading:false})
                }
            } else {
                this.setState({isLoading:false, isLoadingTotallyWeekly:false})
            }
        }

        if (salesTracking != prevProps.salesTracking && (prevState.isLoading || prevState.isLoadingTotallyWeekly)) {
            this.setState({ isLoading:false, isLoadingTotallyWeekly:false })
        }

        if (activities != prevProps.activities) {
            const { activityId } = this.state
            let index=activities.findIndex((activity)=> activity.activityId == activityId)
            index>-1? this.setState({ currentActivity:activities[index], isLoading:false }):this.setState({  isLoading:false })
        }
    }

    renderActive() {
        const { salesTracking } = this.props
        const { isLoadingTotallyWeekly } = this.state
        return <View>
            <View style={styles.parentContainer}>
            <Text
                style={styles.campaignName}>{salesTracking.title}</Text>
            <Text
                style={styles.dateText}>{`${formatDate(new Date(salesTracking.startDate))} - ${formatDate(new Date(salesTracking.endDate))}`}</Text>

            <View style={styles.statsTotallyWeeklyView}>
                <View>
                    <Text style={styles.statsText}>{I18n.t('sales_tracking.stats')}</Text>
                    <Text
                        style={styles.updatedText}>{`${I18n.t('sales_tracking.updated')}  : ${getRelativeTimeFromNow(new Date(salesTracking.lastUpdated))}`}</Text>
                </View>
                {this.renderTotallyWeeklyView()}
            </View>
            {this.renderPointsView()}

            <Text style={styles.pointsByDeviceText}>{I18n.t('sales_tracking.points_by_device')}</Text>
            </View>
            <View style={[styles.pointsListContainer, isLoadingTotallyWeekly ? styles.pointsByDeviceLoadingView : styles.pointsByDeviceLoadedView ]}>
                {this.renderList()}
            </View>
        </View>
    }

    handleTotallyWeeklyView(isTotallySelected){
        this.setState({ isTotallySelected,isLoadingTotallyWeekly:true },()=>{
            this.getSalesTracks()
        })
    }

    renderTotallyWeeklyView() {
        const { isTotallySelected, isLoadingTotallyWeekly } = this.state
        return <View style={styles.totalWeeklyView}>
            <TouchableOpacity
                disabled={isLoadingTotallyWeekly}
                onPress={() =>this.handleTotallyWeeklyView(true)}
                style={isTotallySelected ? styles.totallySelectedView : styles.totallyUnSelectedView}>
                <Text
                    style={isTotallySelected ? styles.totallySelectedTextView : styles.totallyUnSelectedTextView}>{I18n.t('sales_tracking.total')}</Text>

            </TouchableOpacity>
            <TouchableOpacity
                disabled={isLoadingTotallyWeekly}
                onPress={() => this.handleTotallyWeeklyView(false)}
                style={isTotallySelected ? styles.weeklySelectedView : styles.weeklyUnSelectedView}>
                <Text
                    style={isTotallySelected ? styles.weeklySelectedTextView : styles.weeklyUnSelectedTextView}>{I18n.t('sales_tracking.weekly')}</Text>
            </TouchableOpacity>

        </View>
    }

    renderPointsView() {
        const {salesTracking} = this.props

        return <View style={styles.pointsView}>
            <View style={styles.pointsChildView}>
                <Text style={styles.pointsText}>{salesTracking.earned}</Text>
                <Text style={styles.pointsEarnedText}>{I18n.t('sales_tracking.total_points_earned')}</Text>
            </View>
            <View style={styles.divider}/>
            <View style={styles.pointsChildView}>
                <Text style={styles.pointsText}>{salesTracking.sold}</Text>
                <Text style={styles.pointsEarnedText}>{I18n.t('sales_tracking.total_devices_sold')}</Text>
            </View>
        </View>
    }

    renderItem(item, index,totalSize) {
        return <View style={[styles.itemContainer,((index===0)?styles.itemContainerFirstItem:(totalSize-1===index)?styles.itemContainerLastItem:null)]}>
            <Text style={styles.itemName}>{item.deviceName}</Text>
            <Text style={styles.itemName}>{item.rewardValue}</Text>
        </View>
    }

    onItemPress=()=>{
        const { salesTrackingCampaign, salesTrackingCampaignFailure, getSalesTrackingCampaign } = this.props
        if (salesTrackingCampaignFailure){
            this.setState({isLoading:true})
            getSalesTrackingCampaign(1,10)
        } else {
            open({url: salesTrackingCampaign.content[0].eligibilityLink})
        }
    }

    renderFooter = () => {
        return <CourseItem
              onPress={() => this.onItemPress()}
                item={this.state.currentActivity}/>
    }

    renderList() {
        const { salesTracking } = this.props
        const { isLoadingTotallyWeekly } = this.state
        return isLoadingTotallyWeekly? <LoadingSpinner/> :<EndlessFlatList
            keyExtractor={(item, index) => item.id || index.toString()}
            data={salesTracking.content}
            renderItem={({ item, index }) => this.renderItem(item, index, salesTracking.content.length)}
            ListFooterComponent={this.renderFooter}
            ItemSeparatorComponent={(() => <Separator style={styles.separator} />)}
            loadedAll={true}
        />
    }

    render() {
        const {
            salesTracking,
            noActiveCampaign,
            eligibleStatus,
            salesTrackingFailure,
            salesTrackingCampaignFailure
        } = this.props

        if (this.state.isLoading) {
            return <LoadingSpinner/>
        } else {
            return (
                <View style={styles.container}>
                    {(salesTrackingCampaignFailure || salesTrackingFailure || noActiveCampaign || !eligibleStatus || !salesTracking)?
                        <ErrorScreen
                            icon={salesTrackingCampaignFailure ? null: <PdfIcon fill={Colors.rgb_4a4a4a} width='10%' height='10%'/>}
                            title={(salesTrackingCampaignFailure) ? I18n.t('generic_error.title') : (noActiveCampaign ? I18n.t('sales_tracking.no_active_title') : I18n.t('sales_tracking.ineligible_title'))}
                            messageStyles={styles.messageTextStyle}
                            message={(salesTrackingCampaignFailure) ? I18n.t('generic_error.message')  :noActiveCampaign ? I18n.t('sales_tracking.no_active_desc') : I18n.t('sales_tracking.ineligible_desc')}
                            cta={(salesTrackingCampaignFailure ) ? I18n.t('generic_error.retry'): (noActiveCampaign?null:I18n.t('sales_tracking.learn_how'))}
                            ctaOnPress={() => { this.onItemPress()}
                            }
                        /> : this.renderActive()
                    }

                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    salesTracking: state.user.salesTracking,
    salesTrackingCampaignFailure:state.user.salesTrackingCampaignFailure,
    salesTrackingCampaign:state.user.salesTrackingCampaign,
    salesTrackingFailure:state.user.salesTrackingFailure,
    noActiveCampaign:state.user.noActiveCampaign,
    eligibleStatus:state.user.eligibleStatus,
    activities: state.activities.activities,
})

const mapDispatchToProps = (dispatch) => ({
    getSalesTrackingCampaign: (page, pageSize) => dispatch(UserActions.getSalesTrackingCampaign(page, pageSize)),
    getSalesTracking: (campaignId,filter, page, pageSize) => dispatch(UserActions.getSalesTracking(campaignId,filter, page, pageSize)),
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId))
})

export default connect(mapStateToProps, mapDispatchToProps)(SalesTrackingTab)
