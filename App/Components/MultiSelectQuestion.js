import React, { Component } from 'react'
import { View } from 'react-native'

import CheckBox from '@components/CheckBox'
import Question from '@components/Question'
import PollResultBar from '@components/PollResultBar'

import styles from './Styles/MultiselectQuestionStyles'

export default class MultiselectQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: props.options
        }
    }

    onPressCheckbox = (answerID) => {
        const { options } = this.state
        const { isDisabled, onAnswered } = this.props

        const changedOptions = options.map((item) => {
            let isChecked = item.isChecked
            if (item.answerID[0] == answerID) {
                isChecked = !isChecked
            }

            return { ...item, isChecked }
        })

        if (isDisabled) {
            let selectedItem = []
            changedOptions.filter((item) => {
                if (item.isChecked) {
                    selectedItem.push(true)
                    return
                }
            })
            onAnswered({ isDisabled: selectedItem.length ? false : true, options: changedOptions })
        } else {
            onAnswered({ isDisabled, options: changedOptions })
        }

        this.setState({
            options: changedOptions
        })
    }

    renderOptions = () => {
        const { options } = this.state
        const { pollAnswerSummary, pollTotalResponses } = this.props

        return (options.map((item, idx) => {
            return (
                <View key={`${idx}${item.answerID[0]}`} style={styles.answerContainer}>
                    <CheckBox
                        isChecked={item.isChecked}
                        answerText={item.answerText[0]}
                        style={!pollAnswerSummary && styles.answerView}
                        onPress={!pollAnswerSummary ? () => this.onPressCheckbox(item.answerID[0]) : null}
                    />
                    {pollAnswerSummary && pollAnswerSummary.length &&
                        <PollResultBar
                            marginValue={150}
                            marginLeft={83}
                            result={pollAnswerSummary[idx].answerId == item.answerID ? pollAnswerSummary[idx].count / pollTotalResponses : 0} />
                    }
                </View>
            )
        }))
    }

    render() {
        const { title, questionText } = this.props
        return (
            <View style={styles.container}>
                <Question
                    title={title}
                    questionText={questionText}
                />
                {this.renderOptions()}
            </View>
        )
    }
}