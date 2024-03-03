import React, { Component } from 'react'
import { View } from 'react-native'

import MultiLineTextInput from '@components/MultiLineTextInput'
import Question from '@components/Question'

import I18n from '@i18n'
import { isEmpty } from '@utils/TextUtils'
import { Constants } from '@resources'

import styles from './Styles/DescriptiveQuestionStyles'

export default class DescriptiveQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.options,
            valueError: false
        }
    }

    _checkValue() {
        const { value } = this.state
        const { isDisabled, onAnswered } = this.props
        if (isDisabled) {
            if (isEmpty(value)) {
                this.setState({
                    valueError: true
                })
            }
            onAnswered({ isDisabled: isEmpty(value), options: value })
        } else {
            onAnswered({ isDisabled, options: value })
        }
    }

    renderAnswers() {
        const { value, valueError, isLoading } = this.state
        const { isDisabled } = this.props

        return (
            <MultiLineTextInput
                autoFocus={isEmpty(value)}
                placeholder={I18n.t('survey.text_placeholder')}
                numberOfLines={5}
                maxLength={Constants.SURVEY_TEXT_LIMIT}
                showLengthLimit
                returnKeyType={'done'}
                value={value}
                error={valueError}
                onChangeText={(value) => {
                    this.setState({
                        value,
                        valueError: isDisabled ? isEmpty(value) : false,
                    }, () => this._checkValue())
                }
                }
                onSubmitEditing={() => this._checkValue()}
                blurOnSubmit={!isEmpty(value)}
                editable={!isLoading}
            />
        )
    }

    render() {
        const { title, questionText } = this.props
        return (
            <View
                style={styles.container}>
                <Question
                    title={title}
                    questionText={questionText}
                    style={styles.questionContainer}
                />
                {this.renderAnswers()}
            </View>
        )
    }
}