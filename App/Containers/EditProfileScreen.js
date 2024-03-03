import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import { withNavigationFocus } from 'react-navigation'

import AppActions from '@redux/AppRedux'
import UserActions from '@redux/UserRedux'

import Button from '@components/Button'
import CustomTextInput from '@components/CustomTextInput'
import Dialog from '@components/Dialog'
import OTPDialog from '@components/OTPDialog'
import ProfileImage from '@components/ProfileImage'
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'

import I18n from '@i18n'
import { isEmpty, formatString } from '@utils/TextUtils'
import styles from './Styles/EditProfileScreenStyles'
import { Colors, Constants } from '@resources'
import { getValueFromPath } from '@utils/CommonUtils'

import InfoIcon from '@svg/icon_info.svg'
import EditIcon from '@svg/icon_edit.svg'

const INPUT_FIELDS = [
  {
    name: 'affiliationCode',
    path: 'optionalInfo.text2',
    label: I18n.t('sign_up.affiliation_code'),
    rules: {
      editable: false,
      mandatory: true,
      errorMessage: I18n.t('sign_up.msg_invalid_affiliation_code'),
    },
    type: 'store'
  },
  {
    name: 'zip',
    path: 'orgContactInfo.zip',
    label: I18n.t('sign_up.zip'),
    textContentType: 'postalCode',
    maxLength: 5,
    rules: {
        mandatory: true,
        regex: Constants.ZIP_PATTERN,
        errorMessage: I18n.t('sign_up.msg_invalid_zip'),
      },
    type: 'store'
  },
  {
    name: 'store',
    path: 'name',
    label: I18n.t('edit_profile.store_address'),
    rules: {
      editable: false,
      mandatory: true,
      noStoreMessage: I18n.t('sign_up.msg_stores_not_found'),
      errorMessage: I18n.t('sign_up.msg_not_select_store'),
    },
    type: 'store'
  },
  {
    name: 'firstName',
    path: 'firstName',
    label: I18n.t('sign_up.first_name'),
    textContentType: 'givenName',
    rules: {
      editable: false,
      mandatory: true,
      errorMessage: I18n.t('sign_up.msg_invalid_first_name'),
    },
    type: 'profile'
  },
  {
    name: 'lastName',
    path: 'lastName',
    label: I18n.t('sign_up.last_name'),
    textContentType: 'familyName',
    rules: {
      editable: false,
      mandatory: true,
      errorMessage: I18n.t('sign_up.msg_invalid_last_name'),
    },
    type: 'profile'
  },
  {
    name: 'emailAddress',
    path: 'username',
    label: I18n.t('sign_up.email'),
    textContentType: 'emailAddress',
    rules: {
      mandatory: true,
      regex: Constants.EMAIL_PATTERN,
      errorMessage: I18n.t('sign_up.msg_invalid_email'),
      warningMessage: I18n.t('edit_profile.email_warning'),
      emailTakenMessage: I18n.t('edit_profile.msg_email_taken'),
    },
    type: 'profile'
  },
  {
    name: 'employeeId',
    path: 'personOptional.text1',
    label: I18n.t('edit_profile.employee_id'),
    keyboardType: 'numeric',
    maxLength: 20,
    rules: {
      mandatory: false,
    },
    type: 'profile'
  },
  {
    name: 'phone',
    path: 'businessAddress.mobile',
    label: I18n.t('sign_up.phone'),
    textContentType: 'telephoneNumber',
    maxLength: 10,
    rules: {
      mandatory: true,
      regex: Constants.PHONE_PATTERN,
      errorMessage: I18n.t('sign_up.msg_invalid_phone'),
    },
    type: 'profile'
  },
  {
    name: 'role',
    path: 'primaryJob',
    label: I18n.t('sign_up.role'),
    rules: {
      editable: false,
      mandatory: true,
      noRolesMessage: I18n.t('edit_profile.unable_fetch_roles'),
      errorMessage: I18n.t('sign_up.msg_not_select_role'),
    },
    type: 'profile'
  },
  {
    name: 'carrierEmailAddress',
    path: 'businessAddress.email2',
    label: I18n.t('edit_profile.carrier_email'),
    textContentType: 'emailAddress',
    rules: {
      mandatory: false,
      regex: Constants.EMAIL_PATTERN,
      errorMessage: I18n.t('edit_profile.msg_invalid_email')
    },
    type: 'profile'
  },
]


class EditProfileScreen extends Component {
  constructor(props) {
    super(props)
    
    const inputFields = INPUT_FIELDS.map(field => {
      return {
        value: getValueFromPath(field.type==='profile' ? props.userSummary : props.organizationDetail, field.path),
        isError: false,
        type: field.type,
        name: field.name
    }})

    this.state = {
      isLoading: true,
      newProfileImage: null,
      inputFields: inputFields,
      showAffiliationCodeInfo: false,
      showOTPDialog: false,
      isUpdatingLoader: false,
    }

    this.showRolesAfterFetched = false
    this.showStoresAfterFetched = false
  }

  chooseFile = () => {
    var options = {
      title: I18n.t('edit_profile.select_a_photo'),
      takePhotoButtonTitle: I18n.t('edit_profile.take_a_photo'),
      chooseFromLibraryButtonTitle: I18n.t('edit_profile.pick_from_gallery'),
      quality:1, 
      maxWidth: 300, 
      maxHeight: 300,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if(response.uri || response.data){
        const file = {
          uri: response.uri,
          type: response.type,
          name: "profile.jpg"
        }
        this.setState({newProfileImage:file})
      }
    });
  };


  componentDidMount() {
    if (this.props.userSummary === null) {
      this.props.getUserSummary()
    }
    if (this.props.apiConfig.use_proxy) {
      if (this.props.userSummary) {
        const organizations = this.props.userSummary.organizations;
        if (organizations) {
          const isPrimaryOrganization = organizations.find(org => org.isPrimary)
          this.props.getOrganizationDetail(isPrimaryOrganization ? isPrimaryOrganization.id : null)
          this.isLoadingOrganizationDetail = true
        }
      }

      this.props.getRoles()
    } else {
      this.props.getAccessToken(Constants.GRANT_TYPE.CLIENT_CREDENTIALS)
    }
  }
  
  componentDidUpdate(prevProps) {
    const {
      access_token,
      emailExists,
      userSummary,
      roles,
      uploadProfileImageSuccess,
      uploadProfileImageFailure,
      organizationDetail,
      stores,
      updateUserSummaryFailure,
      updateUserSummarySuccess,
      getUserSummary,
      isFocused,
    } = this.props

    if(updateUserSummaryFailure && updateUserSummaryFailure !==prevProps.updateUserSummaryFailure){
      this.setState({isUpdatingLoader: false})
      ToastMessage(I18n.t('edit_profile.save_error'))
    }

    if(updateUserSummarySuccess && updateUserSummarySuccess !==prevProps.updateUserSummarySuccess && isFocused){
      getUserSummary()
      this.goBackWithSuccessToast()
    }

    if (uploadProfileImageSuccess && uploadProfileImageSuccess !== prevProps.uploadProfileImageSuccess) {
      if (this.changedField.length) {
        this.validateAndUpload()
      } else {
        this.goBackWithSuccessToast()
      }
    }

    if(uploadProfileImageFailure && uploadProfileImageFailure !==prevProps.uploadProfileImageFailure){
      this.setState({isUpdatingLoader: false})
      ToastMessage(I18n.t('edit_profile.save_error'))
    }

    if ((userSummary || userSummary != prevProps.userSummary) && this.state.isLoading && !this.isLoadingOrganizationDetail) {
      if (this.props.apiConfig.use_proxy || access_token != prevProps.access_token) {
        const organizations = userSummary.organizations;
        if (organizations) {
          const isPrimaryOrganization = organizations.find(org => org.isPrimary)
          this.props.getOrganizationDetail(isPrimaryOrganization ? isPrimaryOrganization.id : null)
          this.isLoadingOrganizationDetail = true
        }

        if (!this.prefetchedRoles) {
          this.props.getRoles()
        }
      }
    }

    if ((userSummary || userSummary != prevProps.userSummary) && organizationDetail != prevProps.organizationDetail && this.state.isLoading) {
      const inputFields = INPUT_FIELDS.map(field => {
        return {
          value: getValueFromPath(field.type==='profile' ? userSummary : organizationDetail, field.path),
          isError: false,
          type: field.type,
          name: field.name
      }})
      
      this.setState({
        isLoading: false,
        inputFields,
      })

      if (organizationDetail && organizationDetail.orgContactInfo && organizationDetail.optionalInfo) {
        this.props.getStores(organizationDetail.orgContactInfo.zip, organizationDetail.optionalInfo.text2)
      }
    }

    if (roles !== prevProps.roles) {
      if (roles && roles.length > 0) {
        if (this.showRolesAfterFetched) {
          this.showRoles()
          this.showRolesAfterFetched = false
        }
      } else {
        const { inputFields } = this.state
        inputFields[8].isError = true
        this.setState({ inputFields })
      }
      this.prefetchedRoles = true
    }

    if (stores !== prevProps.stores && isFocused) {
      if (stores && stores.length > 0) {
        if (this.showStoresAfterFetched) {
          this.showStores()
          this.showStoresAfterFetched = false
        }
      } else {
        const { inputFields } = this.state
        inputFields[2].isError = true
        inputFields[2].value = ''
        this.setState({ inputFields })
      }
    }

    if (prevProps.emailExists != emailExists) {
      const { inputFields } = this.state
      inputFields[5].emailTaken = emailExists
      this.setState({ inputFields })
    }
  }

  validate() {
    const { inputFields } = this.state
    this.countOfValidField = 0
    for (let index = 0 ; index < inputFields.length; index++) {
      if (INPUT_FIELDS[index].rules.mandatory && isEmpty(inputFields[index].value)) {
        inputFields[index].isError = true
      } else if (INPUT_FIELDS[index].rules.mandatory && INPUT_FIELDS[index].rules.regex && !INPUT_FIELDS[index].rules.regex.test(inputFields[index].value)) {
        inputFields[index].isError = true
      } else if (!inputFields[index].emailTaken) {
        inputFields[index].isError = false
        this.countOfValidField++
      }
    }
    this.setState({ inputFields })
  }

  validateAndUpload(){
    const { inputFields, newProfileImage} = this.state
    this.validate()

    if(this.countOfValidField && this.countOfValidField===inputFields.length){
      if(this.props.userSummary.username!==inputFields[5].value){
        this.setState({showOTPDialog:true})
      }
      else{
        this.setState({isUpdatingLoader: true})
        this.createAndPostUserData()
      }
    }  
  }

  createAndPostUserData(){
    const { inputFields } = this.state
    const userInfo = {}
    if (this.changedField.includes(2)) {
      userInfo.primaryOrganizationId = this.primaryOrganizationId
    }
    if (this.changedField.includes(5)) {
      userInfo.userName = inputFields[5].value
    }
    if (this.changedField.includes(6)) {
      userInfo.personOptional1 = {
        "text1": inputFields[6].value
      }
    }
    if (this.changedField.includes(7)) {
      userInfo.businessAddress = {
        "mobile": inputFields[7].value
      }
    }
    if (this.changedField.includes(8)) {
      userInfo.primaryJobId = this.primaryRoleId
    }
    if (this.changedField.includes(9)) {
      userInfo.businessAddress ?
        userInfo.businessAddress.email2 = inputFields[9].value :
        userInfo.businessAddress = {
          "email2": inputFields[9].value
        }
    }
    this.props.updateUserSummary(userInfo)
  }

  onRolesPress = () => {
    if (this.props.roles && this.props.roles.length > 0) {
      this.showRoles()
    } else {
      this.props.getRoles()
      this.showStoresAfterFetched = false
      this.showRolesAfterFetched = true
    }
  }

  selectRole = (buttonIndex) => {
    if (buttonIndex < this.props.roles.length) {
      const { inputFields } = this.state
      inputFields[8].value = this.props.roles[buttonIndex].jobName
      this.primaryRoleId = this.props.roles[buttonIndex].jobTemplateId
      this.setState({ inputFields })
    }
  }

  showRoles = () => {
    const roleOptions = []
    this.props.roles.map(role => {
      roleOptions.push(role.jobName)
    })
    roleOptions.push(I18n.t('sign_up.action_sheet_cancel'))
    this.showActionSheet(roleOptions, this.selectRole)
  }

  onAffiliationPress = () => {
    this.props.navigation.navigate('SignUpStep2', { isChangeAffiliation: true })
  }

  onStoresPress = () => {
    if (this.props.stores && this.props.stores.length > 0) {
      this.showStores()
    } else {
      this.showStoresAfterFetched = true
      this.showRolesAfterFetched = false
      const { inputFields } = this.state
      this.props.getStores(inputFields[1].value, inputFields[0].value)
    }
  }

  selectStore = (buttonIndex) => {
    if (buttonIndex < this.props.stores.length) {
      const { inputFields } = this.state
      inputFields[2].value = this.props.stores[buttonIndex].name
      inputFields[2].isError = false
      this.primaryOrganizationId = this.props.stores[buttonIndex].organizationId
      this.setState({ inputFields })
    }
  }

  showStores = () => {
    const storeOptions = []
    this.props.stores.map(store => {
      storeOptions.push(store.name)
    })
    storeOptions.push(I18n.t('sign_up.action_sheet_cancel'))
    this.showActionSheet(storeOptions, this.selectStore)
  }

  showActionSheet(options, callback) {
    setTimeout(() => this.props.showActionSheetWithOptions({
      options,
      cancelButtonIndex: options.length,
    }, callback), 100)
  }

  showAffiliationCodeInfo = () => {
    this.setState({
      showAffiliationCodeInfo: true,
    })
  }

  getStoresOnChange = (index) => {
    this.validate()
    const { inputFields } = this.state
    const fieldName = inputFields[index].name
    if (fieldName == 'zip' || fieldName == 'affiliationCode') {
      inputFields[2].value = ''
      const zipIndex = inputFields.findIndex(field => field.name == 'zip')
      const isValidZip = !inputFields[zipIndex].isError
      const affiliationCodeIndex = inputFields.findIndex(field => field.name == 'affiliationCode')
      const isValidAffiliationCode = !inputFields[affiliationCodeIndex].isError

      if (isValidZip && isValidAffiliationCode) {
        this.showStoresAfterFetched = false
        this.props.getStores(inputFields[zipIndex].value, inputFields[affiliationCodeIndex].value)
      }
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingSpinner />
    } else {
      return (
        <>
          <KeyboardAwareScrollView keyboardShouldPersistTaps='always' style={styles.container}>
            {this.renderProfileImage()}
            {this.renderStoreInfo()}
            {this.renderProfileInfo()}
            {this.renderUpdate()}
            {this.renderAffiliationCodeInfo()}
            {this.renderOTPDialog()}
          </KeyboardAwareScrollView>
          { this.state.isUpdatingLoader && <LoadingSpinner /> }
        </>
      )
    }
    
  }

  renderProfileImage() {
    const { userSummary } = this.props
    const { newProfileImage } = this.state
    return (
      <View style={styles.imageContainer}>
        <ProfileImage
          imageUrl={newProfileImage ? newProfileImage.uri : userSummary.imageUrl}
          diameter={92}
          onPress={() => this.chooseFile()}
        />
        <TouchableOpacity style={styles.editIcon} onPress={() => this.chooseFile()}>
          <EditIcon width={18} height={18} fill={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }


  renderStoreInfo() {
    const { inputFields } = this.state
    const storeInputField = inputFields.filter((field) => field.type==='store')
    const STORE_INPUT_FIELDS = INPUT_FIELDS.filter((field) => field.type==='store')
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleText}>{I18n.t('edit_profile.your_store')}</Text>
        {STORE_INPUT_FIELDS.map((field, index) => {
          let errorMessage = ''
          let icon = onPress = onIconPress = null
          const error = storeInputField[index].isError
          switch(index) {
            case 0: 
              onIconPress = this.showAffiliationCodeInfo
              onPress = this.onAffiliationPress
              icon = <InfoIcon width={12.8} height={12.8} fill={Colors.rgb_4a4a4a} />
              errorMessage = STORE_INPUT_FIELDS[index].rules.errorMessage
              break
            case 2:
              onPress = this.onStoresPress
              if (!this.props.stores || this.props.stores.length === 0) {
                errorMessage = STORE_INPUT_FIELDS[index].rules.noStoreMessage
              } else {
                errorMessage = STORE_INPUT_FIELDS[index].rules.errorMessage
              }
              break
            default:
              errorMessage = STORE_INPUT_FIELDS[index].rules.errorMessage
          }
          return (
          <CustomTextInput
            key={index}
            index={index}
            style={styles.textInput}
            label={field.label}
            editable={STORE_INPUT_FIELDS[index].rules.editable}
            textContentType={field.textContentType}
            maxLength={field.maxLength}
            value={storeInputField[index].value}
            onChangeText={(index, value) => {
              storeInputField[index].value = value,
              this.getStoresOnChange(index)
            }}
            onPress={onPress}
            errorMessage={errorMessage}
            icon={icon}
            onIconPress={onIconPress}
            error={error}
          />
        )})}
       
      </View>
    )
  }

  _validatePhone = (number) => {
    const { inputFields } = this.state
    inputFields[7].value = number
    if (!isEmpty(number) && number.match(Constants.PHONE_PATTERN)) {
      inputFields[7].isError = false
    } else {
      inputFields[7].isError = true
    }
    this.setState({ inputFields })
  }

  _isValidEmail = (email) => {
    return !isEmpty(email) && email.match(Constants.EMAIL_PATTERN)
  }

  _validateEmail = (email, index) => {
    const { inputFields } = this.state
    inputFields[index].value = email
    if (this._isValidEmail(email)) {
      inputFields[index].isError = false
      if (this.props.userSummary.username != email) {
        this.props.checkExists(email)
      }
    } else {
      inputFields[index].isError = true
    }
    this.setState({ inputFields })
  }

  renderProfileInfo() {
    const { inputFields, showEmailWarning } = this.state
    const profileInputField = inputFields.filter((field) => field.type==='profile')
    const PROFILE_INPUT_FIELD = INPUT_FIELDS.filter((field) => field.type==='profile')
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleText}>{I18n.t('edit_profile.your_profile')}</Text>
        {PROFILE_INPUT_FIELD.map((field, index) => {
          const onPress = index === 5 ? this.onRolesPress : null
          const error = index !== 2 ? profileInputField[index].isError : showEmailWarning || profileInputField[index].isError || profileInputField[index].emailTaken
          let errorMessage = ''
          switch(index) {
            case 2:
              if (profileInputField[index].isError) {
                errorMessage = PROFILE_INPUT_FIELD[index].rules.errorMessage
              } else if (profileInputField[index].emailTaken) {
                errorMessage = PROFILE_INPUT_FIELD[index].rules.emailTakenMessage
              } else {
                errorMessage = PROFILE_INPUT_FIELD[index].rules.warningMessage
              }
              break
            case 5:
              if (!this.props.roles || this.props.roles.length === 0) {
                errorMessage = PROFILE_INPUT_FIELD[index].rules.noRolesMessage
              } else {
                errorMessage = PROFILE_INPUT_FIELD[index].rules.errorMessage
              }
              break
            default:
              errorMessage = PROFILE_INPUT_FIELD[index].rules.errorMessage
          }

          return (
          <CustomTextInput
            key={index}
            index={index}
            style={styles.textInput}
            label={field.label}
            editable={PROFILE_INPUT_FIELD[index].rules.editable}
            textContentType={field.textContentType}
            keyboardType={field.keyboardType}
            maxLength={field.maxLength}
            value={profileInputField[index].value}
            onChangeText={(index, value) => {
              profileInputField[index].value = value
              if (index === 2) {
                this._validateEmail(value, 5)
              }
              if (index === 4) {
                this._validatePhone(value)
              }
              if (index === 6) {
                this._validateEmail(value, 9)
              }
            }}
            onFocus={(index) => {
              if (index === 2) { this.setState({ showEmailWarning: true }) }
            }}
            onBlur={(index) => {
              if (index === 2) { this.setState({ showEmailWarning: false }) }
            }}
            onPress={onPress}
            error={error}
            errorMessage={errorMessage}
          />
        )})}
      </View>
    )
  }

  goBackWithSuccessToast(){
    const { navigation } = this.props
    ToastMessage(I18n.t('edit_profile.save_success'))
    navigation.goBack()
  }

  onUpdateButtonPress(){
    this.changedField = []
    const { inputFields, newProfileImage } = this.state
    const { userSummary, organizationDetail } = this.props
    const organizations = userSummary.organizations;
    const isPrimaryOrganization = organizations.find(org => org.isPrimary)
    if (organizationDetail.orgContactInfo.zip !== inputFields[1].value) {
      this.changedField.push(1)
    }
    if (this.primaryOrganizationId && isPrimaryOrganization.id !== this.primaryOrganizationId) {
      this.changedField.push(2)
    }
    if (userSummary.username !== inputFields[5].value) {
      this.changedField.push(5)
    }
    if (userSummary.personOptional.text1 !== inputFields[6].value) {
      this.changedField.push(6)
    }
    if (userSummary.businessAddress.mobile !== inputFields[7].value) {
      this.changedField.push(7)
    }
    if (userSummary.primaryJob !== inputFields[8].value) {
      this.changedField.push(8)
    }
    if (userSummary.businessAddress.email2 !== inputFields[9].value) {
      this.changedField.push(9)
    }

    if (newProfileImage) {
      this.setState({isUpdatingLoader: true})
      this.props.postUserProfileImage(newProfileImage)
    } else if (this.changedField.length) {
      this.validateAndUpload()
    } else {
      this.goBackWithSuccessToast()
    }
  }

  renderUpdate() {
    return (
      <Button
        style={styles.updateButton}
        title={I18n.t('edit_profile.update')}
        onPress={() => this.onUpdateButtonPress()}
      />
    )
  }

  renderAffiliationCodeInfo() {
    return (
      <Dialog 
        visible={this.state.showAffiliationCodeInfo}
        title={I18n.t('sign_up.affiliation_code_dialog_title')}
        message={I18n.t('sign_up.affiliation_code_dialog_message')}
        positive={I18n.t('sign_up.affiliation_code_dialog_cta')}
        positiveOnPress={() => this.setState({showAffiliationCodeInfo: false})}
        onDismiss={() => this.setState({showAffiliationCodeInfo: false})}
        textAlign='center'
      />
    )
  }

  onOTPValidated() {
    this.setState({showOTPDialog: false,isUpdatingLoader: true})
    this.createAndPostUserData()
  }

  renderOTPDialog() {
    const { inputFields, showOTPDialog } = this.state
    const { otpExpirationTime } = this.props
    if (showOTPDialog) {
      return (
        <OTPDialog
          title={I18n.t('otp.dialog_title')}
          message={formatString(I18n.t('otp.dialog_body'), inputFields[5].value, otpExpirationTime)}
          positive={I18n.t('otp.dialog_positive_cta')}
          onOTPValidated={() => this.onOTPValidated()}
          negative={I18n.t('otp.dialog_negative_cta')}
          negativeOnPress={() => this.setState({showOTPDialog: false})}
          email={inputFields[5].value}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  apiConfig: state.remoteConfig.apiConfig,
  emailExists: state.user.exists,
  userSummary: state.user.summary,
  roles: state.user.roles ? state.user.roles.data : undefined,
  access_token: state.app.b2b ? state.app.b2b.access_token : undefined,
  updateUserSummaryFailure: state.user.updateUserSummaryFailure,
  updateUserSummarySuccess: state.user.updateUserSummarySuccess,
  uploadProfileImageSuccess: state.user.uploadProfileImageSuccess,
  uploadProfileImageFailure: state.user.uploadProfileImageFailure,
  organizationDetail: state.user.organizationDetail,
  stores: state.user.stores ? state.user.stores.data : undefined,
  otpExpirationTime: state.remoteConfig.otp_expiration_time,
})

const mapDispatchToProps = (dispatch) => ({
  getUserSummary: () => dispatch(UserActions.getUserSummary()),
  getRoles: () => dispatch(UserActions.getRoles()),
  getAccessToken: (grantType) => dispatch(AppActions.getAccessToken(grantType)),
  updateUserSummary: (userSummary) => dispatch(UserActions.updateUserSummary(userSummary)),
  postUserProfileImage: (file) => dispatch(UserActions.postUserProfileImage(file)),
  getOrganizationDetail: (organizationId) => dispatch(UserActions.getOrganizationDetail(organizationId)),
  getStores: (zip, affiliationCode) => dispatch(UserActions.getStores(0, zip, affiliationCode)),
  checkExists: (username) => dispatch(UserActions.checkExists(username)),
})

export default compose(
  connectActionSheet,
  connect(mapStateToProps, mapDispatchToProps)
)(withNavigationFocus(EditProfileScreen))