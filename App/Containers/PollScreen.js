import React, { Component } from 'react'
import {
    ScrollView,
    View
} from 'react-native'
import { connect } from 'react-redux'
import ActivitiesActions from '@redux/ActivitiesRedux'
import AssessmentsActions from '@redux/AssessmentsRedux'
import UserActions from '@redux/UserRedux'
import NotificationsActions from '@redux/NotificationsRedux';

import Button from '@components/Button'
import ErrorScreen from '@containers/ErrorScreen'
import HeaderRight from '@components/HeaderRight'
import LoadingSpinner from '@components/LoadingSpinner'
import SingleSelectQuestion from '@components/SingleSelectQuestion'
import MultiSelectQuestion from '@components/MultiSelectQuestion'
import ToastMessage from '@components/ToastMessage'
import DebugConfig from '@config/DebugConfig'
import I18n from '@i18n'
import {
    Constants,
} from '@resources'

import { formatNumber, formatString } from '@utils/TextUtils'

import styles from './Styles/PollScreenStyles'

class PollScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isDisabled: true
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => <HeaderRight text={formatNumber(navigation.getParam('totalPoint'))} />
        }
    }

    componentDidMount() {
        const {
            navigation,
            getActivity
        } = this.props
        const { activityId } = navigation.state.params
        getActivity(activityId)
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            navigation,
            activities,
            registerActivity,
            assessments,
            question,
            pollSummary,
            getAssessmentQuestions,
            getAssessmentQuestion,
            getPollSummary,
            assessmentFailure,
            assessmentFailureMessage,
            postSubmitAssessments,
            isAnswerSubmitted,
            submitAssessmentsSuccess,
            submitAssessmentsFailure,
            postPoints,
            postActivity,
            getPoints,
            points,
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

        const { singleSelectedAnswerID, pollAnswerSummary } = this.state

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
                ToastMessage(I18n.t('poll.activity_register_error'))
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

        if (this.assessments && this.assessments.length && !this.questionID && prevState.isLoading) {
            this.questionID = this.assessments[0].questionID
            getAssessmentQuestion(activityId, this.questionID)
        }

        if (this.assessments && this.assessments.length && question && question != prevProps.question && prevState.isLoading) {
            this.setState({
                isLoading: false
            })
        }

        if (singleSelectedAnswerID && singleSelectedAnswerID != prevState.singleSelectedAnswerID) {
            this.setState({
                isDisabled: false
            })
        }

        if (this.activity && this.assessments && this.isAnswered && isAnswerSubmitted && isAnswerSubmitted != prevProps.isAnswerSubmitted) {
            postSubmitAssessments(activityId)
        }

        if (this.activity && this.isAnswered && submitAssessmentsSuccess && submitAssessmentsSuccess != prevProps.submitAssessmentsSuccess) {
            if (!isHybridActivity) {
                postPoints(this.activity.pointsRange.max, activityId, activityName, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.POLL)
                removeActivity(activityId)
                ToastMessage(formatString(I18n.t('poll.awarded_points'), this.activity.pointsRange.max))
                const { initiativeId, stepId, isMission } = navigation.state.params;
                initiativeId && markTaskAsComplete(initiativeId, stepId, isMission);
            }
            getPollSummary(activityId)
        } else if (this.isAnswered && submitAssessmentsFailure && submitAssessmentsFailure != prevProps.submitAssessmentsFailure) {
            if (!isHybridActivity) {
                ToastMessage(I18n.t('poll.submit_error'))
            } else if (isHybridActivity) {
                ToastMessage(I18n.t('hybrid.complete_error'))
            }
        }

        if (this.activity && this.questionID && this.assessments && this.isAnswered && submitAssessmentsSuccess && pollSummary && pollSummary != prevProps.pollSummary) {
            if (pollSummary.pollId == activityId && pollSummary.questions && pollSummary.questions.length && pollSummary.questions[0].questionId == this.questionID) {
                if (pollSummary.totalResponses) {

                    this.pollTotalResponses = pollSummary.totalResponses
                    this.setState({
                        pollAnswerSummary: pollSummary.questions[0].answers
                    })
                }
                if (isHybridActivity === true && hybridActivityDetail) {
                    postPoints(hybridActivityDetail.pointsRange.max, hybridActivityDetail.activityId, hybridActivityDetail.activityName, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.HYBRID)
                    removeActivity(hybridActivityDetail.activityId)
                    ToastMessage(formatString(I18n.t('hybrid.awarded_points'), hybridActivityDetail.pointsRange.max))
                    postActivity(Constants.TRANSACTION_SUB_TYPE.ACTIVITY.HYBRID, hybridActivityDetail.startDate)
                    hybridMarkTaskAsComplete && hybridMarkTaskAsComplete()
                }
            }
        }

        if (pollAnswerSummary != prevState.pollAnswerSummary) {
            getPoints()
        }

        if (pollAnswerSummary != prevState.pollAnswerSummary && points && points != prevProps.points && points.totalPoint) {
            navigation.setParams({ totalPoint: points.totalPoint })
        }

        if (assessmentFailureMessage && assessmentFailureMessage != prevProps.assessmentFailureMessage) {
            ToastMessage(assessmentFailureMessage)
        }
    }

    componentWillUnmount() {
        const { removePollSummary } = this.props
        removePollSummary()
    }

    setAssessments = (assessments) => {
        this.assessments = assessments
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
        const {
            navigation,
            postAssessmentAnswer,
            postActivity,
        } = this.props

        const { activityId } = navigation.state.params

        if (this.assessments && !this.isAnswered) {
            if (this.questionID && this.learnerAnswer && this.learnerAnswer.length) {
                this.isAnswered = true
                postAssessmentAnswer(activityId, this.questionID, { learnerAnswer: this.learnerAnswer })
                postActivity(Constants.TRANSACTION_SUB_TYPE.ACTIVITY.POLL, this.activity.startDate)
            }
        } else if (this.isAnswered) {
            navigation.goBack()
        }
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
                        this.setState({
                            isDisabled: true
                        })
                    }
                    break
            }

            this.learnerAnswer = learnerAnswer
        }
    }

    renderQuestion() {
        const { pollAnswerSummary } = this.state
        const { question } = this.props

        let questionTitle = this.activity && this.activity.activityName

        if (pollAnswerSummary && pollAnswerSummary.length && this.activity.pointsRange) {
            questionTitle = formatString(I18n.t('poll.awarded_points_title'), this.activity.pointsRange.max)
        }
        let learnerPreAnswers = question.options
        let isDisabled = true
        if (question) {
            switch (question.questionType) {
                case Constants.QUESTION_TYPES.MULTIPLE_CHOICE:
                    if (this.learnerAnswer && this.learnerAnswer.length && !this.state.singleSelectedAnswerID) {
                        learnerPreAnswers = this.learnerAnswer[0].answerID
                        isDisabled = false
                    } else {
                        learnerPreAnswers = this.state.singleSelectedAnswerID
                        isDisabled = learnerPreAnswers ? false : true
                    }
                    return (
                        <SingleSelectQuestion
                            title={questionTitle}
                            questions={question}
                            singleSelectedAnswerID={learnerPreAnswers}
                            isDisabled={isDisabled}
                            actions={(args) => this.onAnswered(args)}
                            pollAnswerSummary={pollAnswerSummary}
                            pollTotalResponses={this.pollTotalResponses}
                        />
                    )
                case Constants.QUESTION_TYPES.MULTIPLE_SELECT:

                    if (this.learnerAnswer && this.learnerAnswer.length) {
                        learnerPreAnswers = question.options.map((item) => {
                            let isChecked = item.isChecked
                            this.learnerAnswer.map((answer) => {
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
                            onAnswered={!pollAnswerSummary ? (args) => this.onAnswered(args) : null}
                            pollAnswerSummary={pollAnswerSummary}
                            pollTotalResponses={this.pollTotalResponses}
                        />
                    )
                default:
                    return (
                        <ErrorScreen
                            title={I18n.t('poll.unsupported_content')}
                        />
                    )
            }
        }
    }

    renderCTA() {
        const { isDisabled } = this.state
        const { submitAssessmentsSuccess, pollSummary } = this.props

        let ctaTitle = I18n.t('poll.submit')

        if (this.assessments && pollSummary && submitAssessmentsSuccess) {
            ctaTitle = I18n.t('poll.back_to_activities')
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
        const { isLoading } = this.state

        const {
            assessmentFailure,
            isLoadingAssessment,
            isLoadingAssessmentQuestion,
            isLoadingAnswerSubmit,
            isLoadingPollSummary,
            isAssessmentsSubmitting
        } = this.props

        if (isLoading) {
            return <LoadingSpinner />
        }
        else {
            if (assessmentFailure) {
                return <ErrorScreen
                    title={I18n.t('poll.load_error')} />
            }
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
                        {!isLoadingAssessment && !isLoadingAssessmentQuestion && this.renderQuestion()}
                    </ScrollView>
                    {!isLoadingAssessment && !isLoadingAssessmentQuestion && this.renderCTA()}
                    {(isLoadingAssessment || isLoadingAssessmentQuestion || isLoadingAnswerSubmit || isLoadingPollSummary || isAssessmentsSubmitting) && <LoadingSpinner />}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    activities: state.activities.questionDetails,
    assessments: state.assessments.assessments,
    question: state.assessments.questions,
    pollSummary: state.assessments.pollSummary,
    assessmentFailure: state.assessments.assessmentFailure,
    assessmentFailureMessage: state.assessments.assessmentFailureMessage,
    isLoadingAssessment: state.assessments.isLoadingAssessment,
    isLoadingAssessmentQuestion: state.assessments.isLoadingAssessmentQuestion,
    isLoadingAnswerSubmit: state.assessments.isLoadingAnswerSubmit,
    isLoadingPollSummary: state.assessments.isLoadingPollSummary,
    isAnswerSubmitted: state.assessments.isAnswerSubmitted,
    isAssessmentsSubmitting: state.assessments.isAssessmentsSubmitting,
    submitAssessmentsSuccess: state.assessments.submitAssessmentsSuccess,
    submitAssessmentsFailure: state.assessments.submitAssessmentsFailure,
    points: state.user.points
})

const mapDispatchToProps = (dispatch) => ({
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
    registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
    getAssessmentQuestions: (assessmentId) => dispatch(AssessmentsActions.getAssessmentQuestions(assessmentId)),
    getAssessmentQuestion: (assessmentId, questionId) => dispatch(AssessmentsActions.getAssessmentQuestion(assessmentId, questionId)),
    postAssessmentAnswer: (assessmentId, questionId, param) => dispatch(AssessmentsActions.postAssessmentAnswer(assessmentId, questionId, param)),
    getPollSummary: (pollId) => dispatch(AssessmentsActions.getPollSummary(pollId)),
    postSubmitAssessments: (assessmentId) => dispatch(AssessmentsActions.postSubmitAssessments(assessmentId)),
    removePollSummary: () => dispatch(AssessmentsActions.removePollSummary()),
    postPoints: (point, activityId, reason, subType) => dispatch(ActivitiesActions.postPoints(point, activityId, Constants.TRANSACTION_TYPE.ACTIVITY, reason, subType)),
    postActivity: (subType, availableDate) => dispatch(ActivitiesActions.postActivity(Constants.TRANSACTION_TYPE.ACTIVITY, subType, availableDate)),
    getPoints: () => dispatch(UserActions.getPoints()),
    removeActivity: (activityId) => dispatch(ActivitiesActions.removeActivity(activityId)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})
export default connect(mapStateToProps, mapDispatchToProps)(PollScreen)