import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import Question from '@components/Question'
import CheckIcon from '@svg/icon_checkmark.svg';
import CloseIcon from '@svg/icon_close.svg';
import { Colors } from '@resources';

import styles from './Styles/TrueFalseQuestionStyle';

export default function TrueFalseQuestion(props) {
    const { title, selectedIndex, isSubmited, questions, isDisabled, singleSelectedAnswerID } = props;
    return (
        <View style={styles.container}>
            <Question
                title={title}
                questionText={questions && questions.questionText}
            />
            <View style={styles.trueFalseView}>
                {questions && questions.options && questions.options.map((items, index) => {

                    let param = { items, index, isDisabled: (isDisabled === true ? !isDisabled : isDisabled), options: items.answerID[0] }
                    let tintColor = Colors.rgb_b9b9b9;
                    let buttonStyle = [styles.trueFalseButton];
                    if (selectedIndex == index || items.answerID[0] == singleSelectedAnswerID) {
                        tintColor = Colors.rgb_4a4a4a
                        buttonStyle.push(styles.selectedTrueFalseButton)
                    }
                    return (
                        <TouchableOpacity
                            key={index}
                            disabled={isSubmited}
                            style={buttonStyle}
                            onPress={() => props.actions(param)}>
                            {index == 0
                                ? <CheckIcon fill={tintColor} width={43} height={43} />
                                : <CloseIcon fill={tintColor} width={43} height={43} />
                            }
                            <Text style={styles.trueFalseButtonTxt}>{items.answerText[0]}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}