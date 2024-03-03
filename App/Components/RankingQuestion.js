import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native'

import DraggableFlatList from 'react-native-draggable-flatlist'

import Question from '@components/Question'
import { Colors } from '@resources'

import styles from './Styles/RankingQuestionStyles'

export default class RankingQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: props.options
        }
    }

    onDragEnd = (draggedData) => {
        const { from, to, data } = draggedData
        const { isDisabled, onAnswered } = this.props
        const { options } = this.state
        if (from != to && options != data) {
            if (isDisabled) {
                onAnswered({ isDisabled: false, options: data })
            } else {
                onAnswered({ isDisabled, options: data })
            }
            this.setState({ options: data })
        }
    }

    renderItem = ({ item, index, drag, isActive }) => {
        return (
            <TouchableOpacity
                style={[styles.rowItem, isActive && { backgroundColor: Colors.rgb_f9f9f9 }]}
                onLongPress={drag}
            >
                <Text style={styles.rowIndex}>{item.answerID}</Text>
                <Text style={styles.rowTitle}>{item.answerText}</Text>
                <View style={styles.rowSortView} />
            </TouchableOpacity>
        )
    }


    renderOptions() {
        const { options } = this.state
        return (
            <DraggableFlatList
                data={options}
                keyExtractor={(item, index) => item.answerID.toString() || index.toString()}
                renderItem={this.renderItem}
                onDragEnd={(draggedData) => this.onDragEnd(draggedData)}
            />
        )
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