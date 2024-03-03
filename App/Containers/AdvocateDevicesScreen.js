import React, { Component, Fragment } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { compose } from 'redux'
import { connect } from 'react-redux';
import { connectActionSheet } from '@expo/react-native-action-sheet'
import UserActions from '@redux/UserRedux';
import moment from "moment";

import Button from '@components/Button';
import CustomTextInput from '@components/CustomTextInput'
import Dialog from '@components/Dialog';
import ErrorScreen from '@containers/ErrorScreen';
import LoadingSpinner from '@components/LoadingSpinner';
import ProfileImage from '@components/ProfileImage';
import RadioButton from '@components/RadioButton';
import Separator from '@components/Separator';
import ToastMessage from '@components/ToastMessage'
import Widget from '@components/Widget';
import I18n from '@i18n';
import { Colors } from '@resources';
import { isEmpty,  formatString, formatDate } from '@utils/TextUtils';
import IconCell from '@svg/icon_cell.svg';
import IconNetwork from '@svg/icon_network.svg';

import styles from './Styles/AdvocateDevicesScreenStyles';

class AdvocateDevicesScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      selectedDevice: null,
      isShowUpdateConfirmation: false,
      selectedStatus: null,
      imeiNumber: ''
    }
  }

  componentDidMount() {
    this.getInfo();
    this.props.getIMEIStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedDevice } = this.state;
    const { advocateInfo, devices, advocateInfoFailure, advocateDevicesFailure, updateAdvocateStatusResult } = this.props;
    if (advocateInfo && advocateInfo !== prevProps.advocateInfo && advocateInfo.userId && advocateInfo.userId.length > 0) {
      this.getDevices();
    }
    if (devices && devices !== prevProps.devices && this.state.isLoading) {
      let firstDevice = (devices && devices.length > 0) ? devices[0] : null;
      this.setState({
        isLoading: false,
        selectedDevice: firstDevice
      });
      if(firstDevice.deviceId > 0) {
        this.props.getAdvocateDeviceHistory(advocateInfo.userId, firstDevice.deviceId);
      }
    }
    if((advocateInfoFailure != prevProps.advocateInfoFailure && advocateInfoFailure) || (advocateDevicesFailure != prevProps.advocateDevicesFailure && advocateDevicesFailure)) {
      this.setState({
        isLoading: false
      });
    }
    if (updateAdvocateStatusResult && updateAdvocateStatusResult !== prevProps.updateAdvocateStatusResult) {
      if (updateAdvocateStatusResult.ok) {
        this.props.getAdvocateDeviceHistory(advocateInfo.userId, selectedDevice.deviceId);
        this.setState({isShowUpdateConfirmation: false});
      } else {
        ToastMessage(I18n.t('advocate_devices.error_update'))
      }
    }
  }

  getInfo() {
    this.setState({
      isLoading: true
    });
    const { advocateId } = this.props.navigation.state.params;
    this.props.getAdvocateInfo(advocateId);
  }

  getDevices() {
    this.setState({
      isLoading: true
    });
    const { advocateInfo } = this.props;
    this.props.getAdvocateDevices(advocateInfo.userId);
  }

  renderProfile() {
    const { advocateInfo, devices, advocateDevicesFailure } = this.props;
    return (
      <View style={styles.contentHolder}>
      <View style={[styles.rowContainer, styles.profileContainer]}>
        <View style={styles.profileLeft}>
          <ProfileImage borderWidth={0} diameter={64} imageUrl={advocateInfo.profilePicture || ''} />
        </View>
        <View style={styles.profileRight}>
          <Text style={styles.name}>{advocateInfo.fullName}</Text>
          {!isEmpty(advocateInfo.email) && <Text style={styles.email}>{advocateInfo.email}</Text>}
          {!isEmpty(advocateInfo.repCode) && <Text style={styles.repCode}>{formatString(I18n.t('home.profile_card.rep_code'), advocateInfo.repCode)}</Text>}
        </View>
      </View>
      {
        (!advocateDevicesFailure && devices && devices.length > 0) &&
        this.renderUpdateCTA()
      }
    </View>
    )
  }

  renderUpdateCTA() {
    return (
        <Button
            title={I18n.t("advocate_devices.update_cta")}
            onPress={() => {
              this.showActionSheet(this.selectStatus)
            }
          }
        />
    )
  }

  renderDevices() {
    const { selectedDevice } = this.state;
    const { advocateInfo, devices } = this.props;
    return (
      <View style={styles.contentHolder}>
        <Text style={styles.contentTitle}>{I18n.t('advocate_devices.devices_title')}</Text>
        {
          devices.map((d, i) => {
            return(<TouchableOpacity
              style={[ (i > 0 ? styles.deviceRow : {}), styles.rowContainer]}
              onPress={() => {
                if(selectedDevice.deviceId !== d.deviceId) {
                  this.setState({selectedDevice: d});
                  this.props.getAdvocateDeviceHistory(advocateInfo.userId, d.deviceId);
                }
              }}
              key={'device' + i}>
              <View style={styles.deviceLeft}>
                <RadioButton
                optionText={d.deviceName}
                isSelected={selectedDevice.deviceId === d.deviceId} />
              </View>
              <Text style={styles.deviceRight}>{d.deviceImei}</Text>
          </TouchableOpacity>)
          })
        }
      </View>
    )
  }

  renderDeviceHistory() {
    const { selectedDevice } = this.state;
    const { deviceHistory, advocateDeviceHistoryFailure } = this.props;
    let history = (deviceHistory && deviceHistory.content && deviceHistory.content.length > 0) ? deviceHistory.content : [];
    history = [...history].sort(function(x, y){
      return moment(y.timestamp) - moment(x.timestamp);
    });
    return(
      <View style={styles.contentHolder}> 
        <Text style={styles.contentTitle}>{formatString(I18n.t('advocate_devices.history_title'), selectedDevice.deviceName)}</Text>
        {
          advocateDeviceHistoryFailure ? 
          this.renderError("AdvocateDeviceHistoryFailure")
          :
          (history && history.length > 0) ?
            <View style={styles.historyContainer}>
            {
              history.map((d, i) => {
                return(
                <Fragment key={'history' + i}>
                  {i !== 0 && this.renderSeparator(Colors.rgb_979797)}
                  <View style={[(i === 0 ? styles.historyRowFirst : (i === deviceHistory.content.length - 1 ? styles.historyRowLast : styles.historyRow)), styles.rowContainer]}>
                  <Text style={styles.historyLeft}>{d.statusText}</Text>
                  <Text style={styles.historyRight}>{formatDate(new Date(moment(d.timestamp)))}</Text>
                </View>
                </Fragment>)
              })
            }
            </View>
            :
            this.renderError("NoDeviceHistory")
        }
      </View>
    )
  }

  renderError (type) {
    const { selectedDevice } = this.state;
    const { advocateInfo } = this.props;
    switch(type){
      case "AdvocateInfoFailure":
        return(
          <ErrorScreen
          title={I18n.t('advocate_devices.error_title_info')}
          message={I18n.t('advocate_devices.error_info')}
          cta={I18n.t('advocate_devices.error_cta_info')}
          ctaOnPress={() => {
            this.getInfo();
          }}
          />
        );
      case "AdvocateDevicesFailure":
        return (
          <ErrorScreen
          icon={<IconNetwork width={40} height={43} fill={Colors.rgb_000000}/>}
          title={I18n.t('advocate_devices.error_title_loading')}
          message={I18n.t('advocate_devices.error_message_loading')}
          cta={I18n.t('advocate_devices.error_cta_loading')}
          ctaOnPress={() => {
            this.getDevices();
          }}
          />
        );
      case "NoDeviceFound":
        return (
          <ErrorScreen
          icon={<IconCell width={23} height={40} fill={Colors.rgb_000000}/>}
          title={I18n.t('advocate_devices.error_title_no_device')}
          />
        );
      case "AdvocateDeviceHistoryFailure":
        return (
          <Widget
              message={I18n.t('advocate_devices.error_history')}
              onRefresh={() => {
                this.props.getAdvocateDeviceHistory(advocateInfo.userId, selectedDevice.deviceId);
              }}
          />
        );
        case "NoDeviceHistory":
          return (
            <Widget message={I18n.t('advocate_devices.error_no_device_history')} />
          );
        default:
          return null;
    }
  }

  renderSeparator (color) {
    return (
      <Separator style={[styles.separator, {backgroundColor: color}]}/>
    )
  }

  showActionSheet(callback) {
    const { imeiStatus } = this.props;
    let options = imeiStatus.map(s => s.statusText);
    setTimeout(() => this.props.showActionSheetWithOptions({
      options,
      cancelButtonIndex: imeiStatus.length,
    }, callback), 100);
  }

  selectStatus = (buttonIndex) => {
    const { imeiStatus } = this.props;
    this.setState({
      isShowUpdateConfirmation: true,
      selectedStatus: imeiStatus[buttonIndex]
    });
  }
  
  hasGetIMEI(status){
    return (status && status.requireImei);
  }

  renderDialogBody() {
    const { selectedStatus } = this.state;
    if (this.hasGetIMEI(selectedStatus)) {
      return (
        <View style={styles.dialogBodyContainer}>
          <CustomTextInput
            autoFocus={true}
            label={I18n.t('advocate_devices.update_text_label')}
            multiline={false}
            minLength={14}
            showCounter={true}
            textStyles={styles.textInputStyles}
            onChangeText={(index, value) => this.setState({ imeiNumber: value })}
            error={false}
            errorMessage={''}
          />
        </View>
      )
    } else {
      return null
    }
  }

  updateStatus() {
    const { selectedDevice, selectedStatus, imeiNumber} = this.state;
    const { advocateInfo } = this.props;
    this.props.updateAdvocateStatus(advocateInfo.userId, selectedDevice.deviceId, selectedStatus.statusId, (selectedStatus && selectedStatus.requireImei) ? (this.hasGetIMEI(selectedStatus) ? imeiNumber : selectedDevice.deviceImei) : null);
    this.setState({isShowUpdateConfirmation: false});
  }

  render() {
    const { isLoading, selectedDevice, isShowUpdateConfirmation, selectedStatus, imeiNumber } = this.state;
    const { devices, advocateInfoFailure, advocateDevicesFailure, isDeviceHistoryLoading, isUpdateAdvocateStatusLoading } = this.props;
  
    if (isLoading) {
      return <LoadingSpinner />
    } else {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
            {
              advocateInfoFailure ? 
              this.renderError("AdvocateInfoFailure")
              :
              <Fragment>
              {this.renderProfile()}
              {
                advocateDevicesFailure ? 
                this.renderError("AdvocateDevicesFailure")
                :
                (devices && devices.length > 0) ?
                <Fragment>
                  {this.renderSeparator(Colors.rgb_d8d8d8)}
              
                  {this.renderDevices()}

                  {this.renderSeparator(Colors.rgb_d8d8d8)}

                  {
                    isDeviceHistoryLoading ? 
                    <LoadingSpinner />
                    :
                    selectedDevice.deviceId > 0 &&
                    this.renderDeviceHistory()
                  }
                </Fragment>
                :
                this.renderError("NoDeviceFound")
              }
              </Fragment>
            }
            <Dialog 
              visible={isShowUpdateConfirmation}
              title={I18n.t('advocate_devices.update_confirm_title')}
              message={selectedStatus && selectedStatus.statusText}
              positive={I18n.t('advocate_devices.update_cta_positive')}
              negative={I18n.t('advocate_devices.update_cta_negative')}
              positiveOnPress={(!this.hasGetIMEI(selectedStatus) || imeiNumber.length >= 14) ? () => this.updateStatus() : null}
              negativeOnPress={() => this.setState({isShowUpdateConfirmation: false})}
              onDismiss={() => this.setState({isShowUpdateConfirmation: false})}
              renderBody={this.renderDialogBody.bind(this)}
              hasTextInput={true}
              textAlign='left'
            />
          </ScrollView>
          {isUpdateAdvocateStatusLoading && <LoadingSpinner />}
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  imeiStatus: state.user.imeiStatus,
  imeiStatusFailure: state.user.imeiStatusFailure,
  advocateInfo: state.user.advocateInfo,
  devices: state.user.advocateDevices,
  deviceHistory: state.user.advocateDeviceHistory,
  isDeviceHistoryLoading: state.user.isAdvocateDeviceHistoryLoading,
  advocateInfoFailure: state.user.advocateInfoFailure,
  advocateDevicesFailure: state.user.advocateDevicesFailure,
  advocateDeviceHistoryFailure: state.user.advocateDeviceHistoryFailure,
  isUpdateAdvocateStatusLoading: state.user.isUpdateAdvocateStatusLoading,
  updateAdvocateStatusResult: state.user.updateAdvocateStatusResult
})

const mapDispatchToProps = (dispatch) => ({
  getIMEIStatus: () => dispatch(UserActions.getIMEIStatus()),
  getAdvocateInfo: (advocateId) => dispatch(UserActions.getAdvocateInfo(advocateId)),
  getAdvocateDevices: (advocateId) => dispatch(UserActions.getAdvocateDevices(advocateId)),
  getAdvocateDeviceHistory: (advocateId, deviceId) => dispatch(UserActions.getAdvocateDeviceHistory(advocateId, deviceId)),
  updateAdvocateStatus: (advocateId, deviceId, statusId, deviceImei) => dispatch(UserActions.updateAdvocateStatus(advocateId, deviceId, statusId, deviceImei)),
})

export default compose(
  connectActionSheet,
  connect(mapStateToProps, mapDispatchToProps)
)(AdvocateDevicesScreen)