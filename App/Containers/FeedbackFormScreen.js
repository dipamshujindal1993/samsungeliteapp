import React, { Component } from 'react'
import {
    Text,
    View,
    Platform,
} from 'react-native'

import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view'

import I18n from '@i18n'
import { connect } from 'react-redux'
import { Colors } from '@resources'
import UserActions from '@redux/UserRedux'
import { isEmpty, formatString } from '@utils/TextUtils'
import HeaderButton from '@components/HeaderButton'
import CustomTextInput from '@components/CustomTextInput'
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'

import styles from './Styles/FeedbackFormScreenStyles'

class FeedbackForm extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        return {
            headerRight: () => (
                <HeaderButton
                    disabled={params && params.disable}
                    title={I18n.t('feedback_form.submit')}
                    onPress={() => params.onPressSubmit()}
                />
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            title: undefined,
            label: undefined
        }
    }

    _onPressSubmit = () => {
        const {
            summary,
            sendFeedbackFormRequest,
        } = this.props
        let form = {
            title: this.state.title,
            message: this.state.message,
            from: summary.username,
        }
        let id = summary.userId
        this.setState({ isLoading: true })
        sendFeedbackFormRequest(form, id)
    }

    getTitle() {
        let title = undefined
        const {
            summary,
            organizationDetail,
        } = this.props
        if (!summary || !organizationDetail) {
            return title
        }

        const affiliationCode = organizationDetail.optionalInfo && organizationDetail.optionalInfo.text2
        let device = Platform.OS == 'ios' ? 'iOS' : 'Android'
        const majorVersion = parseInt(Platform.Version, 10);

        return formatString(I18n.t('feedback_form.feedback_to'), summary.userId, affiliationCode, device, majorVersion)
    }

    getOrganizationDetail() {
        if (!this.isLoadingOrganizationDetail) {
            const {
                summary,
                getOrganizationDetail,
            } = this.props
            const organizations = summary && summary.organizations;
            const organizationsPri = organizations && organizations.find(org => org.isPrimary)
            if (organizationsPri) {
                getOrganizationDetail(organizationsPri.id)
                this.isLoadingOrganizationDetail = true
            }
        }
    }

    componentDidMount() {
        const {
            summary,
            getUserSummary,
            navigation,
        } = this.props

        navigation.setParams({ disable: true, onPressSubmit: this._onPressSubmit });

        this.setState({ title: this.getTitle(), titlePlaceholder: I18n.t('feedback_form.message_title'), label: I18n.t('feedback_form.message') })

        if (summary) {
            this.getOrganizationDetail()
        } else {
            getUserSummary()
        }
    }

    componentDidUpdate(prevProps) {
        const {
            summary,
            sendFeedbackSuccess,
            sendFeedbackFailure,
            navigation,
            organizationDetail,
        } = this.props
        if (prevProps.summary != summary) {
            this.getOrganizationDetail()
        }
        if (prevProps.organizationDetail != organizationDetail) {
            this.setState({
                isLoading: false,
                title: this.getTitle(),
            })
        }
        if (prevProps.sendFeedbackSuccess != sendFeedbackSuccess || prevProps.sendFeedbackFailure != sendFeedbackFailure) {
            this.setState({ isLoading: false })
            if(sendFeedbackSuccess){
                ToastMessage(I18n.t('feedback_form.success'))
                navigation.goBack();
            } 
            sendFeedbackFailure && ToastMessage(I18n.t('feedback_form.failure'))
            
        }
    }


    onChangeText = () => {
        const { message, title } = this.state
        this.props.navigation.setParams({ disable: (isEmpty(title) || isEmpty(message)) });
    }


    _headerText() {
        return (
            <View style={styles.inputStyle}>
                <Text style={styles.headerTitleText}>{I18n.t('feedback_form.title')}</Text>
            </View>
        )
    }

    _renderInputTitle() {
        const {
            isLoading,
            titleError,
            title
        } = this.state

        return (
            <CustomTextInput
                inputRef={component => this._titleRef = component}
                inputStyle={styles.title}
                multiline={true}
                label={!isEmpty(title) && this.state.titlePlaceholder}
                placeholder={this.state.titlePlaceholder}
                placeholderTextColor={Colors.rgb_d8d8d8}
                underlineColorAndroid={Colors.transparent}
                onChangeText={(index, title) => {
                    this.setState({
                        title,
                        titleError: isEmpty(title && title.trim())
                    }, () => this.onChangeText())
                }}
                value={title && title.trim()}
                maxLength={100}
                onBlur={() => this.setState({ titleError: isEmpty(title && title.trim()) })}
                error={titleError}
                onSubmitEditing={() => {
                    if (!isEmpty(title)) {
                        this._messageRef.focus()
                    } else {
                        this.setState({
                            titleError: true,
                        })
                    }
                }}
                blurOnSubmit={false}
                editable={!isLoading}
            />
        )
    }


    _renderInputsBody() {
        const {
            isLoading,
            message,
            messageError
        } = this.state
        return (
            <CustomTextInput
                label={!isEmpty(message) && this.state.label}
                placeholder={this.state.label}
                inputStyle={styles.message}
                inputRef={component => this._messageRef = component}
                underlineColorAndroid={Colors.transparent}
                placeholderTextColor={Colors.rgb_d8d8d8}
                error={messageError}
                multiline={true}
                textAlignVertical={'top'}
                maxLength={2000}
                onChangeText={(index, message) => {
                    this.setState({
                        message,
                        messageError: isEmpty(message)
                    }, () => this.onChangeText())
                }}
                editable={!isLoading}
                onFocus={() => { this.setState({ isMessageFocused: true }) }}
                onBlur={() => this.setState({ isMessageFocused: false, messageError: isEmpty(message) })}
            />
        )
    }

    render() {
        const { isLoading } = this.state
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='always'
                style={styles.container}>
                {this._headerText()}
                <View style={styles.subContainer}>
                    <View>
                        {this._renderInputTitle()}
                    </View>
                    <View style={{ paddingVertical: 18 }}>
                        {this._renderInputsBody()}
                    </View>
                    {isLoading && <LoadingSpinner />}
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    summary: state.user.summary,
    sendFeedbackSuccess: state.user.sendFeedbackSuccess,
    sendFeedbackFailure: state.user.sendFeedbackFailure,
    organizationDetail: state.user.organizationDetail
})

const mapDispatchToProps = (dispatch) => ({
    getUserSummary: () => dispatch(UserActions.getUserSummary()),
    sendFeedbackFormRequest: (form, id) => dispatch(UserActions.sendFeedbackFormRequest(form, id)),
    getOrganizationDetail: (organizationId) => dispatch(UserActions.getOrganizationDetail(organizationId))
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackForm)
