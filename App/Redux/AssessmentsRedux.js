import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({

    getAssessmentQuestions: ['assessmentId'],
    getAssessmentQuestionsSuccess: ['assessments'],
    getAssessmentQuestionsFailure: null,

    getAssessmentQuestion: ['assessmentId', 'questionId'],
    getAssessmentQuestionSuccess: ['questions'],
    getAssessmentQuestionFailure: [],

    postAssessmentAnswer: ['assessmentId', 'questionId', 'param'],
    postAssessmentAnswerSuccess: ['answer'],
    postAssessmentAnswerFailure: ['assessmentFailureMessage'],

    getAssessmentSummary: ['assessmentId'],
    getAssessmentSummarySuccess: ['result'],
    getAssessmentSummaryFailure: ['assessmentId'],

    getPollSummary: ['pollId'],
    getPollSummarySuccess: ['pollSummary'],
    getPollSummaryFailure: [],
    removePollSummary: [],

    postSubmitAssessments: ['assessmentId'],
    postSubmitAssessmentsSuccess: [],
    postSubmitAssessmentsFailure: [],

})

export const AssessmentsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    assessments: [],
    questions: [],
    answer: [],
    result: []
})

/* ------------- Selectors ------------- */

export const ActivitySelectors = {
}

/* ------------- Reducers ------------- */

export const getAssessmentQuestions = (state) => {
    return state.merge({ isLoadingAssessment: true, assessmentFailure: false, submitAssessmentsSuccess: null, submitAssessmentsFailure: null, answerSaveFailure: null, result: null, resultAnswer: null, resultCheck: null })
}

export const getAssessmentQuestionsSuccess = (state, { assessments }) => {
    return state.merge({ assessments, isLoadingAssessment: false, })
}

export const getAssessmentQuestionsFailure = (state) => {
    return state.merge({ isLoadingAssessment: false, assessmentFailure: true })
}


export const getAssessmentQuestion = (state) => {
    return state.merge({ isLoadingAssessmentQuestion: true, assessmentFailure: false })
}

export const getAssessmentQuestionSuccess = (state, { questions }) => {
    return state.merge({ isLoadingAssessmentQuestion: false, questions })
}

export const getAssessmentQuestionFailure = (state) => {
    return state.merge({ isLoadingAssessmentQuestion: false, assessmentFailure: true })
}


export const postAssessmentAnswer = (state) => {
    return state.merge({ isLoadingAnswerSubmit: true, isAnswerSubmitted: false, answerSaveFailure: false, assessmentFailureMessage: null })
}

export const postAssessmentAnswerSuccess = (state, { answer }) => {
    return state.merge({ isLoadingAnswerSubmit: false, isAnswerSubmitted: true, answer, answerSaveFailure: false, assessmentFailureMessage: null })
}

export const postAssessmentAnswerFailure = (state, { assessmentFailureMessage }) => {
    return state.merge({ isLoadingAnswerSubmit: false, isAnswerSubmitted: false, answerSaveFailure: true, assessmentFailureMessage })
}

export const getAssessmentSummary = (state) => {
    return state.merge({ isLoadingAssessmentSummary: true, assessmentFailure: false, resultAnswer: undefined, resultCheck: undefined })
}

export const getAssessmentSummarySuccess = (state, { result }) => {
    let resultCheck = result.correctAnswers ? true : false
    return state.merge({ isLoadingAssessmentSummary: false, result, resultCheck })
}

export const getAssessmentSummaryFailure = (state) => {
    return state.merge({ isLoadingAssessmentSummary: false, assessmentFailure: true })
}

export const getPollSummary = (state) =>
    state.merge({ pollSummary: null, isLoadingPollSummary: true, pollSummaryFailure: false })

export const getPollSummarySuccess = (state, { pollSummary }) =>
    state.merge({ pollSummary, isLoadingPollSummary: false, pollSummaryFailure: false })

export const getPollSummaryFailure = (state) =>
    state.merge({ pollSummary: null, pollSummaryFailure: true, isLoadingPollSummary: false })

export const removePollSummary = (state) =>
    state.merge({ pollSummary: null })

export const postSubmitAssessments = (state) =>
    state.merge({ isAssessmentsSubmitting: true, submitAssessmentsSuccess: false, submitAssessmentsFailure: false })

export const postSubmitAssessmentsSuccess = (state) =>
    state.merge({ isAssessmentsSubmitting: false, submitAssessmentsSuccess: true, submitAssessmentsFailure: false, })

export const postSubmitAssessmentsFailure = (state) =>
    state.merge({ isAssessmentsSubmitting: false, submitAssessmentsFailure: true, submitAssessmentsSuccess: false })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {

    [Types.GET_ASSESSMENT_QUESTIONS]: getAssessmentQuestions,
    [Types.GET_ASSESSMENT_QUESTIONS_SUCCESS]: getAssessmentQuestionsSuccess,
    [Types.GET_ASSESSMENT_QUESTIONS_FAILURE]: getAssessmentQuestionsFailure,

    [Types.GET_ASSESSMENT_QUESTION]: getAssessmentQuestion,
    [Types.GET_ASSESSMENT_QUESTION_SUCCESS]: getAssessmentQuestionSuccess,
    [Types.GET_ASSESSMENT_QUESTION_FAILURE]: getAssessmentQuestionFailure,

    [Types.POST_ASSESSMENT_ANSWER]: postAssessmentAnswer,
    [Types.POST_ASSESSMENT_ANSWER_SUCCESS]: postAssessmentAnswerSuccess,
    [Types.POST_ASSESSMENT_ANSWER_FAILURE]: postAssessmentAnswerFailure,

    [Types.GET_ASSESSMENT_SUMMARY]: getAssessmentSummary,
    [Types.GET_ASSESSMENT_SUMMARY_SUCCESS]: getAssessmentSummarySuccess,
    [Types.GET_ASSESSMENT_SUMMARY_FAILURE]: getAssessmentSummaryFailure,

    [Types.GET_POLL_SUMMARY]: getPollSummary,
    [Types.GET_POLL_SUMMARY_SUCCESS]: getPollSummarySuccess,
    [Types.GET_POLL_SUMMARY_FAILURE]: getPollSummaryFailure,
    [Types.REMOVE_POLL_SUMMARY]: removePollSummary,

    [Types.POST_SUBMIT_ASSESSMENTS]: postSubmitAssessments,
    [Types.POST_SUBMIT_ASSESSMENTS_SUCCESS]: postSubmitAssessmentsSuccess,
    [Types.POST_SUBMIT_ASSESSMENTS_FAILURE]: postSubmitAssessmentsFailure
})
