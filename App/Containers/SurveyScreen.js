import React, { Component } from 'react'
import {
    BackHandler,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View
} from 'react-native'
import { connect } from 'react-redux'
import ActivitiesActions from '@redux/ActivitiesRedux'
import AssessmentsActions from '@redux/AssessmentsRedux'
import NotificationsActions from '@redux/NotificationsRedux';

import Button from '@components/Button'
import ErrorScreen from '@containers/ErrorScreen'
import DescriptiveQuestion from '@components/DescriptiveQuestion'
import HeaderBack from '@components/HeaderBack'
import MultiSelectQuestion from '@components/MultiSelectQuestion'
import LoadingSpinner from '@components/LoadingSpinner'
import RankingQuestion from '@components/RankingQuestion'
import SingleSelectQuestion from '@components/SingleSelectQuestion'
import ToastMessage from '@components/ToastMessage'
import DebugConfig from '@config/DebugConfig'
import I18n from '@i18n'
import {
    Constants,
} from '@resources'

import { formatString } from '@utils/TextUtils'

import styles from './Styles/SurveyScreenStyles'

const { width: screenWidth } = Dimensions.get('window')
class SurveyScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isDisabled: true,
            progressBarWidth: 0,
            footerHeight: 24
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: () => <HeaderBack onPress={navigation.getParam('backButtonPressHandler')} />
        }
    }

    componentDidMount() {
        const {
            navigation,
            getActivity
        } = this.props
        const { activityId } = navigation.state.params
        getActivity(activityId)
        navigation.setParams({ backButtonPressHandler: this._backButtonPressHandler })
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
        } else {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this._keyboardWillHide)
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backButtonPressHandler)
    }

    componentDidUpdate(prevProps, prevState) {
        const { questionSequenceId } = this.state
        const {
            navigation,
            activities,
            registerActivity,
            assessments,
            question,
            getAssessmentQuestions,
            getAssessmentQuestion,
            assessmentFailure,
            assessmentFailureMessage,
            isAnswerSubmitted,
            submitAssessmentsSuccess,
            submitAssessmentsFailure,
            postSubmitAssessments,
            postPoints,
            postActivity,
            removeActivity,
            markTaskAsComplete,
        } = this.props

        const {
            activityId,
            activityName,
            isHybridActivity,
            hybridActivityDetail,
            hybridMarkTaskAsComplete
        } = navigation.state.params

        if (!this.activity && !this.assessments && activities != prevProps.activities && prevState.isLoading) {
            activities.filter(activity => {
                if (activity.activityId == activityId) {
                    this.activity = activity
                    getAssessmentQuestions(activityId)
                }
            })
        }

        if (this.activity && !DebugConfig.skipRegisterAssessment && prevState.isLoading) {
            if (!this.activity.isRegistered && !this.registerActivityCalled) {
                this.registerActivityCalled = true
                registerActivity(activityId)
            } else if (this.activity.registerActivityFailure) {
                ToastMessage(I18n.t('survey.activity_register_error'))
                navigation.goBack()
            }
        }

        if (!DebugConfig.skipRegisterAssessment && this.activity && this.activity.isRegistered && assessments != prevProps.assessments && assessments.length && prevState.isLoading) {
            this.setAssessments(assessments)
        } else if (this.activity && assessments != prevProps.assessments && assessments.length && prevState.isLoading) {
            this.setAssessments(assessments)
        }

        if (assessmentFailure && assessmentFailure != prevProps.assessmentFailure && prevState.isLoading) {
            this.setState({
                isLoading: false
            })
        }

        if (questionSequenceId != prevState.questionSequenceId) {
            this.learnerAnswer = null
            this.setState({
                progressBarWidth: Math.floor(screenWidth / assessments.length) * questionSequenceId,
                singleSelectedAnswerID: null
            })
        }

        if (this.assessments && this.assessments.length && this.assessments.length >= questionSequenceId && questionSequenceId != prevState.questionSequenceId) {
            this.assessments.map((item, idx) => {
                if (item.questionSequenceId == questionSequenceId) {
                    this.questionID = item.questionID
                    getAssessmentQuestion(activityId, this.questionID)
                }
            })
        }

        if (question && question != prevProps.question) {
            this.setState({
                isDisabled: (question.isMandatory === true ? !question.isAnswered : question.isMandatory)
            })
        }

        if (this.activity && this.isAllAnswered && this.assessments && this.assessments.length == questionSequenceId && isAnswerSubmitted && isAnswerSubmitted != prevProps.isAnswerSubmitted) {
            postSubmitAssessments(activityId)
        }

        if (this.activity && this.isAllAnswered && submitAssessmentsSuccess && submitAssessmentsSuccess != prevProps.submitAssessmentsSuccess) {
            if (!isHybridActivity) {
                postPoints(this.activity.pointsRange.max, activityId, activityName, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.SURVEY)
                removeActivity(activityId)
                ToastMessage(formatString(I18n.t('survey.awarded_points'), this.activity.pointsRange.max))
                const { initiativeId, stepId, isMission } = navigation.state.params;
                initiativeId && markTaskAsComplete(initiativeId, stepId, isMission);
            } else if (isHybridActivity === true && hybridActivityDetail) {
                postPoints(hybridActivityDetail.pointsRange.max, hybridActivityDetail.activityId, hybridActivityDetail.activityName, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.HYBRID)
                removeActivity(hybridActivityDetail.activityId)
                ToastMessage(formatString(I18n.t('hybrid.awarded_points'), hybridActivityDetail.pointsRange.max))
                postActivity(Constants.TRANSACTION_SUB_TYPE.ACTIVITY.HYBRID, hybridActivityDetail.startDate)
                hybridMarkTaskAsComplete && hybridMarkTaskAsComplete()
            }
            navigation.goBack()
        } else if (this.isAllAnswered && submitAssessmentsFailure && submitAssessmentsFailure != prevProps.submitAssessmentsFailure) {
            if (!isHybridActivity) {
                ToastMessage(I18n.t('survey.submit_error'))
            }
            else if (isHybridActivity === true) {
                ToastMessage(I18n.t('hybrid.complete_error'))
            }
        }

        if (assessmentFailureMessage && assessmentFailureMessage != prevProps.assessmentFailureMessage) {
            ToastMessage(assessmentFailureMessage)
        }
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove()
        this.keyboardWillShowSub.remove()
        this.keyboardWillHideSub.remove()
    }

    _keyboardWillShow = (event) => {
        this.setState({
            footerHeight: Platform.OS === 'ios' ? event.endCoordinates.height : 0
        })
    }

    _keyboardWillHide = () => {
        this.setState({
            footerHeight: 24
        })
    }

    _backButtonPressHandler = () => {
        const { questionSequenceId } = this.state
        if (this.assessments && this.assessments.length) {
            if (questionSequenceId && questionSequenceId != 1 && questionSequenceId <= this.assessments.length) {
                this.setState({
                    questionSequenceId: questionSequenceId - 1
                })
            } else {
                this.props.navigation.goBack()
            }
        } else {
            this.props.navigation.goBack()
        }
        return true
    }

    setAssessments = (assessments) => {
        this.assessments = assessments
        assessments.map((item, idx) => {
            if (item.questionSequenceId == 1) {
                this.setState({
                    questionSequenceId: 1,
                    isLoading: false
                })
            }
        })
    }

    onAnswered = ({ isDisabled, options }) => {
        this.learnerAnswerBuilder(options)

        if (isDisabled != this.state.isDisabled) {
            this.setState({
                isDisabled
            })
        }
    }

    onCTAPress = () => {
        const { questionSequenceId } = this.state
        const { navigation, postAssessmentAnswer, postSubmitAssessments, postActivity } = this.props
        const { activityId } = navigation.state.params
        if (this.assessments && this.assessments.length) {
            if (questionSequenceId < this.assessments.length) {
                this.setState({
                    questionSequenceId: questionSequenceId + 1
                })
            } else if (this.assessments.length == questionSequenceId) {
                this.isAllAnswered = true
            }

            if (this.questionID && this.learnerAnswer && this.learnerAnswer.length) {
                postAssessmentAnswer(activityId, this.questionID, { learnerAnswer: this.learnerAnswer })
            } else if (this.isAllAnswered) {
                postSubmitAssessments(activityId)
                postActivity(Constants.TRANSACTION_SUB_TYPE.ACTIVITY.SURVEY, this.activity.startDate)
            }
        }
    }

    _hasChangedAnswers(questionType, oldAnswers, newAnswers) {
        if ((!oldAnswers && newAnswers) || (oldAnswers && !newAnswers)) {
            return true
        }
        switch (questionType) {
            case Constants.QUESTION_TYPES.MULTIPLE_CHOICE:
                return oldAnswers[0].answerID != newAnswers[0].answerID

            case Constants.QUESTION_TYPES.MULTIPLE_SELECT:
                if (oldAnswers) {
                    for (var i = 0; i < oldAnswers.length; i++) {
                        if (oldAnswers[i].answerID != newAnswers[i] && newAnswers[i].answerID) {
                            return true
                        }
                    }
                }
                break

            case Constants.QUESTION_TYPES.DESCRIPTIVE:
                return oldAnswers[0].answerText != newAnswers[0].answerText

            case Constants.QUESTION_TYPES.RANKING:
                if (oldAnswers) {
                    for (var i = 0; i < oldAnswers.length; i++) {
                        if (oldAnswers[i].answerID != newAnswers[i].answerID || oldAnswers[i].matchAnswerID != newAnswers[i].matchAnswerID) {
                            return true
                        }
                    }
                }
                break
        }

        return false
    }

    learnerAnswerBuilder = (learnerOptions) => {

        const { question } = this.props

        let learnerAnswer = []
        if (question && learnerOptions) {
            switch (question.questionType) {
                case Constants.QUESTION_TYPES.MULTIPLE_CHOICE:
                    let answerID = {
                        'answerID': learnerOptions
                    }
                    learnerAnswer.push(answerID)
                    this.setState({
                        singleSelectedAnswerID: learnerOptions
                    })
                    break;

                case Constants.QUESTION_TYPES.MULTIPLE_SELECT:
                    learnerOptions.length && learnerOptions.map((item) => {
                        if (item.isChecked) {
                            let answerData = {
                                'answerID': item.answerID && item.answerID[0]
                            }
                            learnerAnswer.push(answerData)
                        }
                    })
                    if (!learnerAnswer.length) {
                        learnerAnswer = null
                    }
                    break;

                case Constants.QUESTION_TYPES.DESCRIPTIVE:

                    let answerData = {
                        'answerText': learnerOptions
                    }
                    learnerAnswer.push(answerData)
                    break;

                case Constants.QUESTION_TYPES.RANKING:
                    learnerOptions.length && learnerOptions.map((item, index) => {
                        let answerData = {
                            'answerID': item.answerID && item.answerID[0],
                            'matchAnswerID': parseInt(index + 1).toString(),
                        }
                        learnerAnswer.push(answerData)
                    })
                    break;
            }

            if (this._hasChangedAnswers(question.questionType, question.learnerAnswer, learnerAnswer)) {
                this.learnerAnswer = learnerAnswer
            } else {
                this.learnerAnswer = null
            }

            if (question.isMandatory && (!this.learnerAnswer || !this.learnerAnswer.length)) {
                this.setState({
                    isDisabled: question.isMandatory
                })
            }
        }
    }

    renderQuestion() {
        const { question } = this.props
        const questionTitle = this.activity && this.activity.activityName
        let learnerPreAnswers = question.options
        let isDisabled = question.isMandatory
        if (question) {
            switch (question.questionType) {
                case Constants.QUESTION_TYPES.MULTIPLE_CHOICE:
                    if (question.isAnswered && question.learnerAnswer && question.learnerAnswer.length && !this.state.singleSelectedAnswerID) {
                        learnerPreAnswers = question.learnerAnswer[0].answerID
                        isDisabled = false
                    } else {
                        learnerPreAnswers = this.state.singleSelectedAnswerID
                    }
                    return (
                        <ScrollView style={styles.container}>
                            <SingleSelectQuestion
                                title={questionTitle}
                                questions={question}
                                singleSelectedAnswerID={learnerPreAnswers}
                                isDisabled={isDisabled}
                                actions={(args) => this.onAnswered(args)}
                            />
                        </ScrollView>
                    )
                case Constants.QUESTION_TYPES.MULTIPLE_SELECT:
                    if (question.isAnswered && question.learnerAnswer && question.learnerAnswer.length) {
                        learnerPreAnswers = question.options.map((item) => {
                            let isChecked = item.isChecked
                            question.learnerAnswer.map((answer) => {
                                if (answer.answerID == item.answerID[0]) {
                                    isChecked = true
                                    isDisabled = false
                                }
                            })
                            return { ...item, isChecked }
                        })
                    }
                    return (
                        <ScrollView style={styles.container}>
                            <MultiSelectQuestion
                                questionID={this.questionID}
                                title={questionTitle}
                                questionText={question.questionText}
                                options={learnerPreAnswers}
                                isDisabled={isDisabled}
                                onAnswered={(args) => this.onAnswered(args)}
                            />
                        </ScrollView>
                    )
                case Constants.QUESTION_TYPES.DESCRIPTIVE:
                    learnerPreAnswers = ''
                    if (question.isAnswered && question.learnerAnswer && question.learnerAnswer.length) {
                        question.learnerAnswer.map((answer) => {
                            if (answer.answerText) {
                                learnerPreAnswers = answer.answerText
                                isDisabled = false
                            }
                        })
                    }
                    return (
                        <KeyboardAvoidingView style={styles.descriptiveContainer} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                            <DescriptiveQuestion
                                questionID={this.questionID}
                                title={questionTitle}
                                questionText={question.questionText}
                                options={learnerPreAnswers}
                                isDisabled={isDisabled}
                                onAnswered={(args) => this.onAnswered(args)}
                            />
                        </KeyboardAvoidingView>
                    )
                case Constants.QUESTION_TYPES.RANKING:

                    if (question.isAnswered && question.learnerAnswer && question.learnerAnswer.length) {
                        let learnerOptions = []

                        question.learnerAnswer.map((answer) => {
                            isDisabled = false
                            question.options.map((item) => {
                                if (answer.answerID == item.answerID[0]) {
                                    learnerOptions.push(item)
                                }
                            })
                        })
                        learnerPreAnswers = learnerOptions
                    }
                    return <RankingQuestion
                        questionID={this.questionID}
                        title={questionTitle}
                        questionText={question.questionText}
                        options={learnerPreAnswers}
                        isDisabled={isDisabled}
                        onAnswered={(args) => this.onAnswered(args)}
                    />
                default:
                    return null
            }
        }
    }

    renderCTA() {
        const { questionSequenceId, isDisabled } = this.state
        let ctaTitle = I18n.t('survey.next')

        if (this.assessments && this.assessments.length == questionSequenceId) {
            ctaTitle = I18n.t('survey.submit')
        }

        return (
            <Button
                style={styles.cta}
                title={ctaTitle}
                onPress={this.onCTAPress}
                disabled={isDisabled}
            />
        )
    }

    render() {
        const {
            isLoading,
            progressBarWidth,
            footerHeight
        } = this.state

        const {
            assessmentFailure,
            isLoadingAssessment,
            isLoadingAssessmentQuestion,
            isLoadingAnswerSubmit,
            isAssessmentsSubmitting
        } = this.props

        if (isLoading) {
            return <LoadingSpinner />
        }
        else {
            if (assessmentFailure) {
                return <ErrorScreen
                    title={I18n.t('survey.load_error')} />
            }
            return (
                <View style={styles.container}>
                    <View style={[styles.progressView]}>
                        <View style={[styles.progressBar, { width: progressBarWidth }]} />
                    </View>
                    {!isLoadingAssessment && !isLoadingAssessmentQuestion && this.renderQuestion()}
                    {!isLoadingAssessment && !isLoadingAssessmentQuestion && this.renderCTA()}
                    <View style={{ height: footerHeight }} />
                    {(isLoadingAssessment || isLoadingAssessmentQuestion || isLoadingAnswerSubmit || isAssessmentsSubmitting) && <LoadingSpinner />}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    activities: state.activities.questionDetails,
    assessments: state.assessments.assessments,
    question: state.assessments.questions,
    assessmentFailure: state.assessments.assessmentFailure,
    assessmentFailureMessage: state.assessments.assessmentFailureMessage,
    isLoadingAssessment: state.assessments.isLoadingAssessment,
    isLoadingAssessmentQuestion: state.assessments.isLoadingAssessmentQuestion,
    isLoadingAnswerSubmit: state.assessments.isLoadingAnswerSubmit,
    isAnswerSubmitted: state.assessments.isAnswerSubmitted,
    isAssessmentsSubmitting: state.assessments.isAssessmentsSubmitting,
    submitAssessmentsSuccess: state.assessments.submitAssessmentsSuccess,
    submitAssessmentsFailure: state.assessments.submitAssessmentsFailure
})

const mapDispatchToProps = (dispatch) => ({
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
    registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
    getAssessmentQuestions: (assessmentId) => dispatch(AssessmentsActions.getAssessmentQuestions(assessmentId)),
    getAssessmentQuestion: (assessmentId, questionId) => dispatch(AssessmentsActions.getAssessmentQuestion(assessmentId, questionId)),
    postAssessmentAnswer: (assessmentId, questionId, param) => dispatch(AssessmentsActions.postAssessmentAnswer(assessmentId, questionId, param)),
    postSubmitAssessments: (assessmentId) => dispatch(AssessmentsActions.postSubmitAssessments(assessmentId)),
    postPoints: (point, activityId, reason, subType) => dispatch(ActivitiesActions.postPoints(point, activityId, Constants.TRANSACTION_TYPE.ACTIVITY, reason, subType)),
    postActivity: (subType, availableDate) => dispatch(ActivitiesActions.postActivity(Constants.TRANSACTION_TYPE.ACTIVITY, subType, availableDate)),
    removeActivity: (activityId) => dispatch(ActivitiesActions.removeActivity(activityId)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SurveyScreen)