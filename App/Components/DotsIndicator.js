import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
} from 'react-native'

import { Colors } from '@resources'

import styles from './Styles/DotsIndicatorStyles'

export default class DotsIndicator extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeIndex: props.activeDotIndex
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.activeDotIndex != prevProps.activeDotIndex) {
            this.setState({
                activeIndex: this.props.activeDotIndex,
            })  
        }
    }

    _onDotPress = (index) => {
        this.setState({activeIndex: index})
        if (this.props.onDotPress) {
            this.props.onDotPress(index)
        }
    }

    render () {
        const { activeIndex } = this.state
        const { dotsData, onDotPress, style} = this.props
        return (
            <View style={[styles.container, style]}>
                {dotsData.map((dot, idx) => {
                    let dotBGColor =  { backgroundColor : idx === activeIndex ? Colors.rgb_4297ff : Colors.rgb_d8d8d8 }
                    return (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.dotsIndicator, dotBGColor]}
                            disabled={!onDotPress}
                            onPress={()=> this._onDotPress(idx) }
                        />
                    )
                })}
            </View>
        )
    }
}
