import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from '@react-native-community/datetimepicker'
import { connectActionSheet } from '@expo/react-native-action-sheet'

import AppActions from '@redux/AppRedux'
import UserActions from '@redux/UserRedux'
import {
  Colors,
  Constants,
} from '@resources'
import I18n from '@i18n'
import CustomTextInput from '@components/CustomTextInput'
import {
  isEmpty,
  formatDate,
} from '@utils/TextUtils'
import { getValueFromPath } from '@utils/CommonUtils'
import InfoIcon from '@svg/icon_info.svg'
import Dialog from '@components/Dialog'
import ToastMessage from '@components/ToastMessage'

import styles from './Styles/SignUpScreenStyles'

const inputFieldsGenerator = (inputFields, inputFieldsStructure) => {
  const fillFields = (inputFields, structureItem) => {
    if (Array.isArray(structureItem)) {
      const fieldArray = []
      for (let item of structureItem) {
        fieldArray.push(fillFields(inputFields, item))
      }
      return fieldArray
    } else {
      const fieldFound = inputFields.find(inputField => inputField.name === structureItem.name)
      return {
        ...structureItem,
        ...fieldFound,
      }
    }
  }
  return fillFields(inputFields, inputFieldsStructure)
}

const SIGN_UP_FIELDS = [
  [
    {
      index: 0,
      pos: '1st',
      name: 'phone',
    },
    {
      index: 1,
      pos: '2nd',
      name: 'dob',
    },
  ],
  [
    {
      index: 2,
      pos: '1st',
      name: 'zip',
    },
    {
      index: 3,
      pos: '2nd',
      name: 'affiliationCode',
    },
  ],
  {
    index: 4,
    name: 'store',
  },
  {
    index: 5,
    name: 'role',
  },
  // {
  //   index: 6,
  //   name: 'referralCode',
  // },
]

const CHANGE_AFFILIATION_FIELDS = [
  {
    index: 0,
    name: 'phone',
  },
  [
    {
      index: 1,
      pos: '1st',
      name: 'zip',
    },
    {
      index: 2,
      pos: '2nd',
      name: 'affiliationCode',
    },
  ],
  {
    index: 3,
    name: 'store',
  },
  {
    index: 4,
    name: 'role',
  },
]

const INPUT_FIELDS = [
  {
    name: 'phone',
    label: I18n.t('sign_up.phone'),
    textContentType: 'telephoneNumber',
    maxLength: 10,
    path: 'businessAddress.mobile',
    rules: [
      {
        regex: Constants.PHONE_PATTERN,
        errorMessage: I18n.t('sign_up.msg_invalid_phone'),
      },
    ],
    type: 'profile',
  },
  {
    name: 'dob',
    label: I18n.t('sign_up.dob'),
    editable: false,
    path: 'birthDate',
    rules: [
      {
        mandatory: true,
        errorMessage: I18n.t('sign_up.msg_invalid_dob'),
      },
    ],
    type: 'profile',
  },
  {
    name: 'zip',
    label: I18n.t('sign_up.zip'),
    textContentType: 'postalCode',
    maxLength: 5,
    path: 'orgContactInfo.zip',
    rules: [
      {
        regex: Constants.ZIP_PATTERN,
        errorMessage: I18n.t('sign_up.msg_invalid_zip'),
      },
    ],
    type: 'store',
  },
  {
    name: 'affiliationCode',
    label: I18n.t('sign_up.affiliation_code'),
    path: 'optionalInfo.text2',
    rules: [
      {
        mandatory: true,
        errorMessage: I18n.t('sign_up.msg_invalid_affiliation_code'),
      },
    ],
    type: 'store',
  },
  {
    name: 'store',
    label: I18n.t('sign_up.store'),
    editable: false,
    path: 'name',
    rules: [
      {
        mandatory: true,
        errorMessage: I18n.t('sign_up.msg_not_select_store'),
      },
    ],
    type: 'store',
  },
  {
    name: 'role',
    label: I18n.t('sign_up.role'),
    editable: false,
    path: 'primaryJob',
    rules: [
      {
        mandatory: true,
        errorMessage: I18n.t('sign_up.msg_not_select_role'),
      },
    ],
    type: 'profile',
  },
  {
    name: 'referralCode',
    label: I18n.t('sign_up.referral_code'),
    optional: true,
    type: 'other',
  },
]

class SignUpStep2 extends Component {
  static navigationOptions = ({ navigation }) => {
    const canGoNext = navigation.getParam('canGoNext')
    return {
      headerRight: () => (
        <TouchableOpacity
          disabled={!canGoNext}
          onPress={navigation.getParam('onNext')}>
          <Text style={canGoNext ? styles.nextEnabled : styles.nextDisabled}>{I18n.t('sign_up.next')}</Text>
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)

    if (this.props.navigation.state.params && this.props.navigation.state.params.isChangeAffiliation) {
      this.isChangeAffiliation = true
    } else {
      this.isChangeAffiliation = false
    }

    this.today = new Date()

    let inputFields = []
    if (this.isChangeAffiliation) {
      this.INPUT_FIELDS = inputFieldsGenerator(INPUT_FIELDS, CHANGE_AFFILIATION_FIELDS)
      const initialValue = {}
      for (let field of this.INPUT_FIELDS.flat()) {
        initialValue[field.name] = getValueFromPath(field.type === 'profile' ? this.props.userSummary : field.type === 'store' ? this.props.organizationDetail : undefined, field.path)
      }
      this.userInfo = Object.assign({}, initialValue)
      this._save(this.userInfo)
    } else {
      this.userInfo = Object.assign({}, props.userInfo)
      this.INPUT_FIELDS = inputFieldsGenerator(INPUT_FIELDS, SIGN_UP_FIELDS)
    }
    for (var i = 0; i < this.INPUT_FIELDS.length; i++) {
      var index
      var fieldName
      if (Array.isArray(this.INPUT_FIELDS[i])) {
        for (var j = 0; j < this.INPUT_FIELDS[i].length; j++) {
          index = this.INPUT_FIELDS[i][j].index
          inputFields[index] = {}
          inputFields[index].index = index
          inputFields[index].ref = React.createRef()
          inputFields[index].pos = this.INPUT_FIELDS[i][j].pos
          fieldName = this.INPUT_FIELDS[i][j].name
          inputFields[index].name = fieldName
          inputFields[index].optional = this.INPUT_FIELDS[i][j].optional
          inputFields[index].rules = this.INPUT_FIELDS[i][j].rules
          if (index == 0 || this.userInfo[fieldName]) {
            this.focusedFieldIndex = index
            inputFields[index].isVisible = true
          }
        }
      } else {
        index = this.INPUT_FIELDS[i].index
        inputFields[index] = {}
        inputFields[index].index = index
        inputFields[index].ref = React.createRef()
        inputFields[index].pos = this.INPUT_FIELDS[i].pos
        fieldName = this.INPUT_FIELDS[i].name
        inputFields[index].name = fieldName
        inputFields[index].optional = this.INPUT_FIELDS[i].optional
        inputFields[index].rules = this.INPUT_FIELDS[i].rules
        if (index === 0) {
          this.focusedFieldIndex = index
          inputFields[index].isVisible = true
        } else if (inputFields[index - 1].isVisible && this.userInfo[fieldName]) {
          this.focusedFieldIndex = index
          inputFields[index].isVisible = true
        }
      }
    }

    this.state = {
      inputFields,
      showAffiliationCodeInfo: false,
      showDateTimePicker: false,
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onNext: this._onNext })

    if (this.props.apiConfig.use_proxy) {
      this.props.getRoles()
    } else {
      this.props.getAccessToken(Constants.GRANT_TYPE.CLIENT_CREDENTIALS)
    }

    const {
      inputFields,
    } = this.state
    this._onFocus(this.focusedFieldIndex, this.userInfo[inputFields[this.focusedFieldIndex].name])
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showDateTimePicker != prevState.showDateTimePicker && !this.state.showDateTimePicker) {
      const {
        inputFields,
      } = this.state
      const index = inputFields.find(field => field.name == 'dob').index
      this._isValid(index, this.userInfo['dob'])
    }
    if (this.props.userInfo != prevProps.userInfo) {
      this.userInfo = Object.assign({}, this.props.userInfo)
    }
    if (this.props.userInfoChangingAffiliationCode != prevProps.userInfoChangingAffiliationCode) {
      this.userInfo = Object.assign({}, this.props.userInfoChangingAffiliationCode)
    }
    if (this.props.stores != prevProps.stores) {
      const {
        inputFields,
      } = this.state
      const index = inputFields.find(field => field.name == 'store').index
      if (this.props.stores && this.props.stores.length > 0) {
        this._hideError(index)
        if (this.showStoresAfterFetched) {
          this._showStores()
        }
      } else if (inputFields[index].isVisible) {
        this._onChangeText(index, '')
        this._showError(index, I18n.t('sign_up.msg_stores_not_found'))
      }
    }
    if (this.props.roles != prevProps.roles) {
      const {
        inputFields,
      } = this.state
      const index = inputFields.find(field => field.name == 'role').index
      if (this.props.roles && this.props.roles.length > 0) {
        this._hideError(index)
        if (this.showRolesAfterFetched) {
          this._showRoles()
        }
      } else if (inputFields[index].isVisible) {
        this._onChangeText(index, '')
        this._showError(index, I18n.t('sign_up.msg_roles_not_found'))
      }
    }
    if (this.props.access_token != prevProps.access_token) {
      this.props.getRoles()
    }
    if (prevProps.domains != this.props.domains && this.props.domains) {
      if (this.props.domains.length > 0) {
        this.props.getTermsConditions(this.props.domains[0].code)
      }
    }
    if (prevProps.tnc != this.props.tnc) {
      this.userInfo['tncHash'] = this.props.tnc ? this.props.tnc.hash : undefined
      this._save(this.userInfo)
    }
    if (prevProps.domains !== this.props.domains) {
      if (this.props.domains.length > 0 && this.props.domains[0]) {
        this.userInfo['domainId'] = this.props.domains[0].organizationId
        this._save(this.userInfo)
      }
    }
  }

  _updateNext(canGoNext) {
    if (this.canGoNext != canGoNext) {
      this.props.navigation.setParams({ canGoNext })
      this.canGoNext = canGoNext
    }
  }

  _showError(index, errorMessage) {
    const {
      inputFields,
    } = this.state
    inputFields[index].error = true
    inputFields[index].errorMessage = errorMessage
    this.setState({
      inputFields,
    }, () => {
      if (this._scroll && index + 1 >= inputFields.length) {
        setTimeout(() => {
          if (this._scroll) {
            this._scroll.scrollToEnd()
          }
        }, 500)
      }
    })
  }

  _hideError(index) {
    const {
      inputFields,
    } = this.state
    inputFields[index].error = false
    this.setState({
      inputFields,
    })
  }

  _isValid = (index, text, showErrorIfInvalid = true) => {
    const {
      inputFields,
    } = this.state
    const rules = inputFields[index].rules
    if (rules) {
      for (var i = 0; i < rules.length; i++) {
        if (rules[i].regex) {
          if (text && text.match(rules[i].regex)) {
            this._hideError(index)
          } else {
            if (showErrorIfInvalid) {
              this._showError(index, rules[i].errorMessage)
            }
            return false
          }
        }
        if (rules[i].mandatory) {
          if (isEmpty(text)) {
            if (showErrorIfInvalid) {
              this._showError(index, rules[i].errorMessage)
            }
            return false
          } else {
            this._hideError(index)
          }
        }
        if (rules[i].match) {
          if (this.userInfo['password'] == text) {
            this._hideError(index)
          } else {
            if (showErrorIfInvalid) {
              this._showError(index, rules[i].errorMessage)
            }
            return false
          }
        }
      }
    }
    return true
  }

  _save = (userInfo) => {
    if (this.isChangeAffiliation) {
      this.props.save(null, userInfo)
    } else {
      this.props.save(userInfo)
    }
  }

  _onFocus = (index, text) => {
    const {
      inputFields,
    } = this.state
    const fieldName = inputFields[index].name
    if (fieldName != 'dob') {
      this.setState({
        showDateTimePicker: false,
      })
    }

    this.focusedFieldIndex = index
    if (inputFields[index].optional) {
      this._updateNext(true)
    } else if (isEmpty(text)) {
      this._updateNext(false)
    } else {
      this._updateNext(this._isValid(index, text))
    }
  }

  _onBlur = (index, text) => {
    this._isValid(index, text)
  }

  _onChangeText = (index, text) => {
    const {
      inputFields,
    } = this.state

    if (text != this.userInfo[inputFields[index].name]) {
      this.userInfo[inputFields[index].name] = text.trim()
      this._save(this.userInfo)
    }

    const fieldName = inputFields[index].name
    if (fieldName == 'zip' || fieldName == 'affiliationCode') {
      const zipIndex = inputFields.find(field => field.name == 'zip').index
      const isValidZip = this._isValid(zipIndex, this.userInfo['zip'], false)
      const affiliationCodeIndex = inputFields.find(field => field.name == 'affiliationCode').index
      const isValidAffiliationCode = this._isValid(affiliationCodeIndex, this.userInfo['affiliationCode'], false)
      if (isValidZip && isValidAffiliationCode) {
        this.showStoresAfterFetched = false
        this._onChangeText(inputFields.find(field => field.name == 'store').index, '')
        this.props.getStores(this.userInfo['zip'], this.userInfo['affiliationCode'])
        this.props.getDomains(this.userInfo['affiliationCode'])
      }
    }

    if (!inputFields[index].optional && isEmpty(text)) {
      this._updateNext(false)
    } else {
      this._updateNext(this._isValid(index, text))
    }
  }

  _onSubmitEditing = (index, text) => {
    if (this._isValid(index, text)) {
      this._onNext()
    }
  }

  _onNext = () => {
    const { inputFields } = this.state
    if (this.focusedFieldIndex + 1 >= inputFields.length) {
      // reached last field, revalidate all fields again before go to next step
      var isValid
      for (var i = 0; i < inputFields.length; i++) {
        isValid = true
        if (!this._isValid(i, this.userInfo[inputFields[i].name])) {
          isValid = false
          this._focus(i)
          break
        }
      }
      if (isValid) {
        if (this.userInfo['domainId']) {
          this.props.navigation.navigate('SignUpStep3', { isChangeAffiliation: this.isChangeAffiliation })
        } else {
          ToastMessage(I18n.t('sign_up.msg_cannot_verify_affiliation_code'))
        }
      }
    } else {
      const nextField = inputFields[this.focusedFieldIndex + 1].name
      // show & focus next field
      if (nextField == 'dob') {
        this._focus(this.focusedFieldIndex + 1)
      } else if (nextField == 'store') {
        const zipIndex = inputFields.find(field => field.name == 'zip').index
        if (this._isValid(zipIndex, this.userInfo['zip'])) {
          inputFields[this.focusedFieldIndex + 1].isVisible = true
          this.setState({
            inputFields,
          }, () => this._focus(this.focusedFieldIndex + 1))
        } else {
          this._focus(zipIndex)
        }
      } else {
        inputFields[this.focusedFieldIndex + 1].isVisible = true
        this.setState({
          inputFields,
        }, () => this._focus(this.focusedFieldIndex + 1))
      }
    }
  }

  _focus = (index) => {
    const {
      showDateTimePicker,
      inputFields,
    } = this.state
    const fieldName = inputFields[index].name
    if (fieldName == 'dob') {
      this._blur(this.focusedFieldIndex)
      if (!showDateTimePicker) {
        this.setState({
          showDateTimePicker: true,
        })
      }
      this._onFocus(index, this.userInfo[fieldName])
    } else if (fieldName == 'store') {
      const zipIndex = inputFields.find(field => field.name == 'zip').index
      const isValidZip = this._isValid(zipIndex, this.userInfo['zip'])
      const affiliationCodeIndex = inputFields.find(field => field.name == 'affiliationCode').index
      const isValidAffiliationCode = this._isValid(affiliationCodeIndex, this.userInfo['affiliationCode'])
      if (isValidZip && isValidAffiliationCode) {
        this._blur(this.focusedFieldIndex)
        this._onFocus(index, this.userInfo[fieldName])

        if (isEmpty(this.userInfo['store'])) {
          if (this.props.stores && this.props.stores.length > 0) {
            this._showStores()
          } else {
            this._showError(index, I18n.t('sign_up.msg_stores_not_found'))
          }
        }
      } else {
        if (this.focusedFieldIndex == affiliationCodeIndex) {
          if (isValidAffiliationCode && !isValidZip) {
            this._focus(zipIndex)
          }
        } else if (!isValidZip) {
          this._focus(zipIndex)
        } else if (!isValidAffiliationCode) {
          this._focus(affiliationCodeIndex)
        }
      }
    } else if (fieldName == 'role') {
      this._blur(this.focusedFieldIndex)
      this._onFocus(index, this.userInfo[fieldName])

      if (isEmpty(this.userInfo['role'])) {
        if (this.props.roles && this.props.roles.length > 0) {
          this._showRoles()
        } else {
          this._showError(index, I18n.t('sign_up.msg_roles_not_found'))
        }
      }
    } else if (inputFields[index].ref && inputFields[index].ref.current) {
      inputFields[index].ref.current.focus()
    }
  }

  _blur = (index) => {
    const {
      inputFields,
    } = this.state
    if (inputFields[index].ref && inputFields[index].ref.current) {
      inputFields[index].ref.current.blur()
    }
  }

  _showAffiliationCodeInfo = () => {
    this.setState({
      showAffiliationCodeInfo: true,
    })
  }

  _showDatePicker = () => {
    this.setState(prevState => {
      return {
        showDateTimePicker: !prevState.showDateTimePicker,
      }
    }, () => {
      const {
        showDateTimePicker,
        inputFields,
      } = this.state
      if (showDateTimePicker) {
        this._focus(inputFields.find(field => field.name == 'dob').index)
      }
    })
  }

  _selectDOB = (event, dob) => {
    this.setState(prevState => {
      return {
        showDateTimePicker: Platform.OS === 'ios' ? true : false,
        dob: dob ? dob : prevState.dob,
      }
    }, () => {
      if (dob) {
        this._onChangeText(this.focusedFieldIndex, formatDate(dob))
        this._save(this.userInfo)
      }
    })
  }

  _onStoresPress = () => {
    const {
      inputFields,
    } = this.state
    this._focus(inputFields.find(field => field.name == 'store').index)

    if (this.props.stores && this.props.stores.length > 0) {
      this._showStores()
    } else {
      this.showStoresAfterFetched = true
      this.showRolesAfterFetched = false
      this.props.getStores(this.userInfo['zip'], this.userInfo['affiliationCode'])
    }
  }

  _showStores = () => {
    if (!this.showStores) {
      var options = []
      this.props.stores.map(store => {
        options.push(store.name)
      })
      options.push(I18n.t('sign_up.action_sheet_cancel'))
      this._showActionSheet(options, this._selectStore)
      this.showStores = true
    }
  }

  _selectStore = (buttonIndex) => {
    this.showStores = false
    if (buttonIndex < this.props.stores.length) {
      this.userInfo['organizationId'] = this.props.stores[buttonIndex].organizationId
      this._save(this.userInfo)

      const {
        inputFields,
      } = this.state
      this._onChangeText(inputFields.find(field => field.name == 'store').index, this.props.stores[buttonIndex].name)
      this._onNext()
    } else {
      this._isValid(this.focusedFieldIndex, this.userInfo['store'])
    }
  }

  _onRolesPress = () => {
    const {
      inputFields,
    } = this.state
    this._focus(inputFields.find(field => field.name == 'role').index)

    if (this.props.roles && this.props.roles.length > 0) {
      this._showRoles()
    } else {
      this.showStoresAfterFetched = false
      this.showRolesAfterFetched = true
      this.props.getRoles()
    }
  }

  _showRoles = () => {
    if (!this.showRoles) {
      var options = []
      this.props.roles.map(role => {
        options.push(role.jobName)
      })
      options.push(I18n.t('sign_up.action_sheet_cancel'))
      this._showActionSheet(options, this._selectRole)
      this.showRoles = true
    }
  }

  _selectRole = (buttonIndex) => {
    this.showRoles = false
    if (buttonIndex < this.props.roles.length) {
      this.userInfo['jobTemplateId'] = this.props.roles[buttonIndex].jobTemplateId
      this._save(this.userInfo)

      const {
        inputFields,
      } = this.state
      this._onChangeText(inputFields.find(field => field.name == 'role').index, this.props.roles[buttonIndex].jobName)
      this._onNext()
    } else {
      this._isValid(this.focusedFieldIndex, this.userInfo['role'])
    }
  }

  _showActionSheet(options, callback) {
    setTimeout(() => this.props.showActionSheetWithOptions({
      options,
      cancelButtonIndex: options.length,
    }, callback), 100)
  }

  _renderInputField(field) {
    const {
      inputFields,
    } = this.state
    const index = field.index

    var icon = onIconPress = onPress = null
    switch (field.name) {
      case 'dob':
        onPress = this._showDatePicker
        break

      case 'store':
        onPress = this._onStoresPress
        break

      case 'role':
        onPress = this._onRolesPress
        break

      case 'affiliationCode':
        icon = <InfoIcon width={12.8} height={12.8} fill={Colors.rgb_4a4a4a} />
        onIconPress = this._showAffiliationCodeInfo
        break
    }

    return (
      <CustomTextInput
        inputRef={inputFields[index].ref}
        key={field.name}
        index={index}
        style={field.pos == '1st' ? styles.firstColumn : field.pos == '2nd' ? styles.secondColumn : styles.textInput}
        label={field.label}
        icon={icon}
        onIconPress={onIconPress}
        editable={field.editable}
        onPress={onPress}
        textContentType={field.textContentType}
        maxLength={field.maxLength}
        autoFocus={index == this.focusedFieldIndex}
        isFocused={this.focusedFieldIndex == index}
        value={this.userInfo[inputFields[index].name]}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        onChangeText={this._onChangeText}
        onSubmitEditing={this._onSubmitEditing}
        blurOnSubmit={index + 1 > inputFields.length && !inputFields[index].error}
        error={inputFields[index].error}
        errorMessage={inputFields[index].errorMessage}
      />
    )
  }

  render() {
    const {
      inputFields,
      showAffiliationCodeInfo,
      showDateTimePicker,
      dob,
    } = this.state
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps='always'
        innerRef={ref => {
          this._scroll = ref
        }}>
        <View style={styles.container}>
          {
            this.INPUT_FIELDS.map((field, index) => {
              if (Array.isArray(field)) {
                var hasDOB = false
                for (var i = 0; i < field.length; i++) {
                  if (field[i].name == 'dob') {
                    hasDOB = true
                    break
                  }
                }
                return (
                  <View key={index}>
                    <View style={styles.rowContainer}>
                      {
                        field.map((rowField) => {
                          if (inputFields[rowField.index].isVisible
                            || (inputFields[rowField.index].pos == '1st' && inputFields[rowField.index + 1].isVisible)
                            || (inputFields[rowField.index].pos == '2nd' && inputFields[rowField.index - 1].isVisible)) {
                            return this._renderInputField(rowField)
                          }
                        })
                      }
                    </View>
                    {hasDOB && showDateTimePicker && <DateTimePicker
                      display='spinner'
                      value={dob || new Date(1990, 0, 1)}
                      onChange={this._selectDOB}
                      minimumDate={new Date(this.today.getFullYear() - 100, this.today.getMonth(), this.today.getDate())}
                      maximumDate={new Date(this.today.getFullYear() - 18, this.today.getMonth(), this.today.getDate())} />
                    }
                  </View>
                )
              } else if (inputFields[field.index].isVisible) {
                return this._renderInputField(field)
              }
            })
          }
          <Dialog
            visible={showAffiliationCodeInfo}
            title={I18n.t('sign_up.affiliation_code_dialog_title')}
            message={I18n.t('sign_up.affiliation_code_dialog_message')}
            positive={I18n.t('sign_up.affiliation_code_dialog_cta')}
            positiveOnPress={() => this.setState({ showAffiliationCodeInfo: false })}
            onDismiss={() => this.setState({ showAffiliationCodeInfo: false })}
            textAlign='center'
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  apiConfig: state.remoteConfig.apiConfig,
  access_token: state.app.b2b ? state.app.b2b.access_token : undefined,
  organizationDetail: state.user.organizationDetail,
  roles: state.user.roles ? state.user.roles.data : undefined,
  domains: state.user.domains ? state.user.domains.data : undefined,
  stores: state.user.stores ? state.user.stores.data : undefined,
  userSummary: state.user.summary,
  userInfo: state.user.userInfo,
  userInfoChangingAffiliationCode: state.user.userInfoChangingAffiliationCode,
  tnc: state.user.tnc,
})

const mapDispatchToProps = (dispatch) => ({
  getAccessToken: (grantType) => dispatch(AppActions.getAccessToken(grantType)),
  getStores: (zip, affiliationCode) => dispatch(UserActions.getStores(0, zip, affiliationCode)),
  getDomains: (affiliationCode) => dispatch(UserActions.getDomains(1, null, affiliationCode)),
  getTermsConditions: (orgCode) => dispatch(UserActions.getTermsConditions(orgCode)),
  getRoles: () => dispatch(UserActions.getRoles()),
  save: (userInfo, userInfoChangingAffiliationCode) => dispatch(UserActions.save(userInfo, null, userInfoChangingAffiliationCode)),
})

export default compose(
  connectActionSheet,
  connect(mapStateToProps, mapDispatchToProps)
)(SignUpStep2)
