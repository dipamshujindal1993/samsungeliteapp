import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Colors } from '@resources';

import CheckIcon from '@svg/icon_checkmark.svg'
import RadioButton from '@components/RadioButton';
import Question from '@components/Question'
import PollResultBar from '@components/PollResultBar'

import styles from './Styles/SingleSelectQuestionStyle';

export default function SingleSelectQuestion(props) {
    const { title, selectedIndex, isSubmited, questions, correctAnswer, isDisabled, singleSelectedAnswerID, pollAnswerSummary, pollTotalResponses } = props;
    let tempCorrectAnswer = undefined

    correctAnswer && correctAnswer.map((answers) =>
        tempCorrectAnswer = answers.answerID[0]
    )
    return (
        <View style={styles.container}>
            <Question
                title={title}
                questionText={questions && questions.questionText}
            />
            {questions && questions.options && questions.options.map((items, index) => {
                let param = { items, index, isDisabled: (isDisabled === true ? !isDisabled : isDisabled), options: items.answerID[0] }

                return (
                    <View key={`${index}${items.answerID[0]}`} style={styles.optionContainer}>
                        <TouchableOpacity
                            style={[styles.optionButton, !pollAnswerSummary && styles.optionButtonPadding]}
                            disabled={!pollAnswerSummary ? isSubmited : true}
                            onPress={() => props.actions(param)}
                            key={index}>
                            <View style={styles.optionLeftSideView}>
                                <RadioButton
                                    isSubmited={isSubmited}
                                    optionText={items.answerText[0]}
                                    isSelected={selectedIndex == index || items.answerID[0] == singleSelectedAnswerID} />
                            </View>
                            {(isSubmited && tempCorrectAnswer == items.answerID[0]) &&
                                <CheckIcon
                                    fill={Colors.rgb_4297ff}
                                    width={20}
                                    height={20}
                                />
                            }
                        </TouchableOpacity>
                        {pollAnswerSummary && pollAnswerSummary.length &&
                            <PollResultBar
                                marginValue={150}
                                marginLeft={67}
                                result={pollAnswerSummary[index].answerId == items.answerID[0] ? pollAnswerSummary[index].count / pollTotalResponses: 0} />
                        }
                    </View>
                )
            })}
        </View>
    )
}