import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'
import AssessmentsActions from '@redux/AssessmentsRedux'
import NotificationsActions from '@redux/NotificationsRedux';

import Button from '@components/Button'
import ErrorScreen from '@containers/ErrorScreen'
import SingleSelectQuestion from '@components/SingleSelectQuestion'
import TrueFalseQuestion from '@components/TrueFalseQuestion'
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'
import DebugConfig from '@config/DebugConfig'
import I18n from '@i18n'
import { formatString } from '@utils/TextUtils'
import { Constants } from '@resources'

import styles from './Styles/AssessmentQuestionScreenStyle'

class AssessmentQuestionScreen extends React.Component {

    state = {
        isSelected: false,
        isSubmited: false,
        isLoading: true,
        selectedObject: undefined,
        selectedIndex: undefined
    }

    componentDidMount() {
        const { activityId } = this.props.navigation.state.params
        this.props.getActivity(activityId);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            getAssessmentQuestions,
            registerActivity,
            getAssessmentQuestion,
            postSubmitAssessments,
            getAssessmentSummary,
            postPoints,
            postActivity,
            assessments,
            navigation,
            isAnswerSubmitted,
            activities,
            result,
            assessmentFailure,
            answerSaveFailure,
            assessmentFailureMessage,
            submitAssessmentsSuccess,
            submitAssessmentsFailure,
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

        const { isSubmited } = this.state

        if (!this.activity && !this.assessments && activities != prevProps.activities && prevState.isLoading) {
            activities.filter(activity => {
                if (activity.activityId == activityId) {
                    this.activity = activity
                    getAssessmentQuestions(activityId);
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

        if (assessmentFailure && assessmentFailure != prevProps.assessmentFailure && prevState.isLoading) {
            this.setState({
                isLoading: false
            })
        }

        if (this.activity && !this.questionId && this.assessments && prevState.isLoading) {
            this.questionId = assessments.length > 0 && this.assessments[0].questionID
            getAssessmentQuestion(activityId, this.questionId);
            this.setState({
                isLoading: false
            })
        }

        if (isAnswerSubmitted && isAnswerSubmitted != prevProps.isAnswerSubmitted) {
            postSubmitAssessments(activityId);
            postActivity(Constants.TRANSACTION_SUB_TYPE.ACTIVITY.QUIZ, this.activity.startDate)
        }

        if (!isAnswerSubmitted && answerSaveFailure && answerSaveFailure != prevProps.answerSaveFailure) {
            ToastMessage(assessmentFailureMessage ? assessmentFailureMessage : I18n.t('assessment.submit_error'))
            navigation.goBack()
        }

        if (isSubmited && isAnswerSubmitted && submitAssessmentsSuccess && submitAssessmentsSuccess != prevProps.submitAssessmentsSuccess) {
            getAssessmentSummary(activityId);
        }

        if (this.activity && isSubmited && !this.isPointsAwarded && result && result != prevProps.result) {
            this.isPointsAwarded = true
            if (!isHybridActivity) {
                postPoints(this.activity.pointsRange.max, activityId, activityName, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.QUIZ)
                removeActivity(activityId)
                ToastMessage(formatString(I18n.t('assessment.awarded_points'), this.activity.pointsRange.max))
                const { initiativeId, stepId, isMission } = navigation.state.params;
                initiativeId && markTaskAsComplete(initiativeId, stepId, isMission);
            } else if (isHybridActivity === true && hybridActivityDetail) {
                postPoints(hybridActivityDetail.pointsRange.max, hybridActivityDetail.activityId, hybridActivityDetail.activityName, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.HYBRID)
                removeActivity(hybridActivityDetail.activityId)
                ToastMessage(formatString(I18n.t('hybrid.awarded_points'), hybridActivityDetail.pointsRange.max))
                postActivity(Constants.TRANSACTION_SUB_TYPE.ACTIVITY.HYBRID, hybridActivityDetail.startDate)
                hybridMarkTaskAsComplete && hybridMarkTaskAsComplete()
            }
        }

        if (isSubmited && submitAssessmentsFailure && submitAssessmentsFailure != prevProps.submitAssessmentsFailure) {
            if (!isHybridActivity) {
                ToastMessage(I18n.t('assessment.submit_error'))
            } else if (isHybridActivity === true) {
                ToastMessage(I18n.t('hybrid.complete_error'))
            }
        }
    }

    setAssessments = (assessments) => {
        this.assessments = assessments
    }

    //It will only call when the user select any otions.
    onPressSubmit = () => {
        const { navigation, postAssessmentAnswer } = this.props;
        const {
            activityId,
            activityName
        } = navigation.state.params;
        const { selectedObject } = this.state;
        this.setState({ isSubmited: true });

        if (!this.isAnswerSaved) {
            this.isAnswerSaved = true
            let learnerAnswer = [];
            selectedObject && selectedObject.answerID && selectedObject.answerID.map((id) => {
                let answerID = {
                    'answerID': id
                }
                learnerAnswer.push(answerID)
            });
            learnerAnswer.length > 0 && postAssessmentAnswer(activityId, this.questionId, { learnerAnswer })
        }

        switch (this.buttonText) {
            case I18n.t('assessment.finish'):
                navigation.goBack();
                break;

            case I18n.t('assessment.earn_bonus'):
                navigation.replace('BonusPointScreen', { activityId, activityName });
                break;

            default:
                return null
        }
    }

    onPressTrueFalse = (param) => {
        const { items, index } = param;
        this.setState({ selectedIndex: index, selectedObject: items, isSelected: true });
    }

    onPressMultiChoice = (param) => {
        const { items, index } = param;

        this.setState({
            selectedIndex: index,
            selectedObject: items,
            isSelected: true
        });
    }

    renderQuestion() {
        const { questions, result } = this.props
        const questionTitle = this.activity && this.activity.activityName

        const { questionType } = questions;
        switch (questionType) {
            case Constants.QUESTION_TYPES.TRUE_FALSE:
                return (
                    <TrueFalseQuestion
                        title={questionTitle}
                        questions={questions}
                        selectedIndex={this.state.selectedIndex}
                        isSubmited={this.state.isSubmited}
                        actions={(val) => this.onPressTrueFalse(val)} />
                )

            case Constants.QUESTION_TYPES.MULTIPLE_CHOICE:
                let resultAnswer = result ? (result.correctAnswers ? result.correctAnswers : result.incorrectAnswers) : []

                var correctAnswer = undefined
                resultAnswer && resultAnswer.map((items) => {
                    if (questions.questionID == items.questionID && items.correctAnswer) {
                        correctAnswer = items.correctAnswer.map((ans) => ans)
                    }
                })
                return (
                    <SingleSelectQuestion
                        title={questionTitle}
                        questions={questions}
                        correctAnswer={correctAnswer}
                        isSubmited={this.state.isSubmited}
                        selectedIndex={this.state.selectedIndex}
                        actions={(val) => this.onPressMultiChoice(val)} />
                )

            default:
                return null
        }
    }

    renderCTA() {
        const { isSelected, isSubmited, selectedIndex } = this.state
        const {
            isLoadingAssessment,
            isLoadingAnswerSubmit,
            isLoadingAssessmentSummary,
            isAssessmentsSubmitting,
            resultCheck
        } = this.props

        if (isSubmited && (!isAssessmentsSubmitting && !isLoadingAnswerSubmit && !isLoadingAssessmentSummary)) {
            if (resultCheck) {
                this.buttonText = I18n.t('assessment.earn_bonus');
            }
            else {
                this.buttonText = I18n.t('assessment.finish');
            }
        } else {
            this.buttonText = I18n.t('assessment.submit');
        }

        return (
            <View style={styles.seprateBottomView}>
                <Button
                    style={selectedIndex != undefined ? styles.submitButton : styles.submitDefaultButton}
                    disabled={!isSelected}
                    title={!isLoadingAssessment ? this.buttonText : null}
                    onPress={() => this.onPressSubmit()}
                />
            </View>
        )
    }

    render() {
        const {
            isLoading,
            isSubmited,
            selectedObject
        } = this.state;

        const {
            assessmentFailure,
            questions,
            resultCheck,
            isAnswerSubmitted,
            isLoadingAssessment,
            isLoadingAnswerSubmit,
            isLoadingAssessmentSummary,
            isLoadingAssessmentQuestion,
            isAssessmentsSubmitting
        } = this.props;

        if (isLoading) {
            return <LoadingSpinner />
        }

        if (!questions || assessmentFailure) {
            return (
                <ErrorScreen title={I18n.t('assessment.load_error')} />
            )
        }

        return (
            <View style={styles.container}>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    {(!isLoadingAssessmentQuestion && !isLoadingAssessment) && this.renderQuestion()}
                    {(isSubmited && !isLoadingAssessmentSummary && !isAssessmentsSubmitting) ?
                        <Feedback
                            isCorrect={resultCheck}
                            feedback={selectedObject.feedback}
                            isLoadingAnswerSubmit={isLoadingAnswerSubmit} />
                        : null
                    }
                </ScrollView>
                {this.renderCTA()}
                {(!isAnswerSubmitted && isSubmited || (isAssessmentsSubmitting || isLoadingAssessmentQuestion)) && <LoadingSpinner />}
            </View>
        )
    }
}

//I am not getting title of feedback. So i have used here mock data.

const Feedback = (props) => {
    if (!props.isLoadingAnswerSubmit) {
        return (
            <View style={styles.feedbackView}>
                {(props.isCorrect) ?
                    <Text style={styles.feedbackCorrectTxt}>{I18n.t('assessment.isCorrect')}</Text>
                    :
                    <Text style={styles.feedbackErrorTxt}>{I18n.t('assessment.isWrong')}</Text>
                }
                <Text style={styles.feedbackTxt}>{props.feedback}</Text>
            </View>
        )
    }
    return null
}



const mapStateToProps = (state) => ({
    isLoadingAssessmentQuestion: state.assessments.isLoadingAssessmentQuestion,
    isLoadingAssessmentSummary: state.assessments.isLoadingAssessmentSummary,
    isLoadingAnswerSubmit: state.assessments.isLoadingAnswerSubmit,
    isLoadingAssessment: state.assessments.isLoadingAssessment,
    isAssessmentsSubmitting: state.assessments.isAssessmentsSubmitting,
    isAnswerSubmitted: state.assessments.isAnswerSubmitted,
    submitAssessmentsSuccess: state.assessments.submitAssessmentsSuccess,
    submitAssessmentsFailure: state.assessments.submitAssessmentsFailure,
    activities: state.activities.questionDetails,
    resultCheck: state.assessments.resultCheck,
    assessments: state.assessments.assessments,
    questions: state.assessments.questions,
    assessmentFailure: state.assessments.assessmentFailure,
    answerSaveFailure: state.assessments.answerSaveFailure,
    result: state.assessments.result
})

const mapDispatchToProps = (dispatch) => ({
    postAssessmentAnswer: (assessmentId, questionId, param) => dispatch(AssessmentsActions.postAssessmentAnswer(assessmentId, questionId, param)),
    postSubmitAssessments: (assessmentId) => dispatch(AssessmentsActions.postSubmitAssessments(assessmentId)),
    getAssessmentQuestion: (assessmentId, questionId) => dispatch(AssessmentsActions.getAssessmentQuestion(assessmentId, questionId)),
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
    getAssessmentQuestions: (assessmentId) => dispatch(AssessmentsActions.getAssessmentQuestions(assessmentId)),
    getAssessmentSummary: (assessmentId) => dispatch(AssessmentsActions.getAssessmentSummary(assessmentId)),
    registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
    postPoints: (point, activityId, reason, subType) => dispatch(ActivitiesActions.postPoints(point, activityId, Constants.TRANSACTION_TYPE.ACTIVITY, reason, subType)),
    postActivity: (subType, availableDate) => dispatch(ActivitiesActions.postActivity(Constants.TRANSACTION_TYPE.ACTIVITY, subType, availableDate)),
    removeActivity: (activityId) => dispatch(ActivitiesActions.removeActivity(activityId)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentQuestionScreen)