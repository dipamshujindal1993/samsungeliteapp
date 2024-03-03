import React, { Component } from 'react'
import {
    BackHandler,
    Dimensions,
    ScrollView,
    View
} from 'react-native'
import { connect } from 'react-redux'
import ActivitiesActions from '@redux/ActivitiesRedux'
import AssessmentsActions from '@redux/AssessmentsRedux'

import Button from '@components/Button'
import ErrorScreen from '@containers/ErrorScreen'
import HeaderBack from '@components/HeaderBack'
import MultiSelectQuestion from '@components/MultiSelectQuestion'
import LoadingSpinner from '@components/LoadingSpinner'
import SingleSelectQuestion from '@components/SingleSelectQuestion'
import TrueFalseQuestion from '@components/TrueFalseQuestion'
import ToastMessage from '@components/ToastMessage'
import DebugConfig from '@config/DebugConfig'
import I18n from '@i18n'
import { Constants } from '@resources'

import styles from './Styles/AssessmentScreenStyles'

const { width: screenWidth } = Dimensions.get('window')

class AssessmentScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isDisabled: true,
            progressBarWidth: 0,
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
            postSubmitAssessments
        } = this.props
        const { activityId, onSucess } = navigation.state.params

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
                ToastMessage(I18n.t('assessment.activity_register_error'))
                navigation.goBack()
            }
        }

        if (!DebugConfig.skipRegisterAssessment && this.activity && this.activity.isRegistered && assessments != prevProps.assessments && assessments.length && prevState.isLoading) {
            this.setAssessments(assessments)
        } else if (this.activity && assessments != prevProps.assessments && assessments.length && prevState.isLoading) {
            this.setAssessments(assessments)
        }

        if (questionSequenceId != prevState.questionSequenceId) {
            this.learnerAnswer = null
            this.setState({
                progressBarWidth: Math.floor(screenWidth / assessments.length) * questionSequenceId,
                singleSelectedAnswerID: null
            })
        }

        if (assessmentFailure && assessmentFailure != prevProps.assessmentFailure && prevState.isLoading) {
            this.setState({
                isLoading: false
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
            onSucess({ showDialog: true, activeAssessmentId: activityId, assessmentTitle: this.activity.activityName })
            navigation.goBack()
        } else if (this.isAllAnswered && submitAssessmentsFailure && submitAssessmentsFailure != prevProps.submitAssessmentsFailure) {
            ToastMessage(I18n.t('assessment.assessment_submit_error'))
        }

        if (assessmentFailureMessage && assessmentFailureMessage != prevProps.assessmentFailureMessage) {
            this.isAllAnswered = false
            ToastMessage(I18n.t('assessment.submit_error'))
        }
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove()
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
        assessments.map((item) => {
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
        const {
            navigation,
            isAnswerSubmitted,
            postAssessmentAnswer,
            postSubmitAssessments,
        } = this.props
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
            } else if (this.isAllAnswered && isAnswerSubmitted) {
                postSubmitAssessments(activityId)
            }
        }
    }

    _hasChangedAnswers(questionType, oldAnswers, newAnswers) {
        if ((!oldAnswers && newAnswers) || (oldAnswers && !newAnswers)) {
            return true
        }
        switch (questionType) {
            case Constants.QUESTION_TYPES.MULTIPLE_CHOICE:
            case Constants.QUESTION_TYPES.TRUE_FALSE:
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
        }

        return false
    }

    learnerAnswerBuilder = (learnerOptions) => {
        const { question } = this.props

        let learnerAnswer = []
        if (question && learnerOptions) {
            switch (question.questionType) {
                case Constants.QUESTION_TYPES.MULTIPLE_CHOICE:
                case Constants.QUESTION_TYPES.TRUE_FALSE:
                    let answerID = {
                        'answerID': learnerOptions
                    }
                    learnerAnswer.push(answerID)
                    this.setState({
                        singleSelectedAnswerID: learnerOptions
                    })
                    break

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
                    break
            }

            if (this._hasChangedAnswers(question.questionType, question.learnerAnswer, learnerAnswer)) {
                this.learnerAnswer = learnerAnswer
            } else {
                this.learnerAnswer = null
            }

            if (question.isMandatory && (!this.learnerAnswer || !this.learnerAnswer.length)) {
                this.setState({
                    isDisabled: (question.isMandatory === true ? !question.isAnswered : question.isMandatory)
                })
            }
        }
    }

    renderQuestion() {
        const { question } = this.props
        const questionTitle = this.activity && this.activity.activityName
        let learnerPreAnswers = question.options
        let isDisabled = question.isMandatory
        this.showCTA = true
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
                        <SingleSelectQuestion
                            title={questionTitle}
                            questions={question}
                            singleSelectedAnswerID={learnerPreAnswers}
                            isDisabled={isDisabled}
                            actions={(args) => this.onAnswered(args)}
                        />
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
                        <MultiSelectQuestion
                            questionID={this.questionID}
                            title={questionTitle}
                            questionText={question.questionText}
                            options={learnerPreAnswers}
                            isDisabled={isDisabled}
                            onAnswered={(args) => this.onAnswered(args)}
                        />
                    )
                case Constants.QUESTION_TYPES.TRUE_FALSE:
                    if (question.isAnswered && question.learnerAnswer && question.learnerAnswer.length && !this.state.singleSelectedAnswerID) {
                        learnerPreAnswers = question.learnerAnswer[0].answerID
                        isDisabled = false
                    } else {
                        learnerPreAnswers = this.state.singleSelectedAnswerID
                    }
                    return (
                        <TrueFalseQuestion
                            title={questionTitle}
                            questions={question}
                            singleSelectedAnswerID={learnerPreAnswers}
                            isDisabled={isDisabled}
                            actions={(args) => this.onAnswered(args)} />
                    )
                default:
                    this.showCTA = false
                    return (
                        <ErrorScreen
                            title={I18n.t('assessment.unsupported_content')}
                        />
                    )
            }
        }
    }

    renderCTA() {
        const { questionSequenceId, isDisabled } = this.state
        let ctaTitle = I18n.t('assessment.next')

        if (this.assessments && this.assessments.length == questionSequenceId) {
            ctaTitle = I18n.t('assessment.finish')
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
        const { isLoading, progressBarWidth } = this.state

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
                    title={I18n.t('assessment.assessment_load_error')} />
            }
            return (
                <View style={styles.container}>
                    <View style={[styles.progressView]}>
                        <View style={[styles.progressBar, { width: progressBarWidth }]} />
                    </View>
                    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
                        {!isLoadingAssessment && !isLoadingAssessmentQuestion && this.renderQuestion()}
                    </ScrollView>
                    {(!isLoadingAssessment && !isLoadingAssessmentQuestion && this.showCTA) && this.renderCTA()}
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
})
export default connect(mapStateToProps, mapDispatchToProps)(AssessmentScreen)