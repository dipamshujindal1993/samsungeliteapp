import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'
import {
  Colors,
  Constants,
} from '@resources'

import ImageIcon from '@svg/icon_image'

export default class ImageEx extends Component {
  state = {
    isValidSource: false,
  }

  componentDidMount() {
    this.mounted = true

    this.checkImageSource()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.source != this.props.source) {
      this.checkImageSource()
    }
  }

  checkImageSource() {
    const {
      source,
    } = this.props
    if (source && source.uri && (source.uri.match(Constants.URL_PATTERN) || source.uri.startsWith(Constants.DATA_SCHEME))) {
      Image.getSize(source.uri.replace('Learningdata', 'Learning/data'), (width, height) => {
        if (this.mounted) {
          this.setState({
            isValidSource: height > 0 && width > 0,
          })
        }
      }, (error) => console.log(error.message))
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    if (this.state.isValidSource && this.props.source) {
      return (
        <TouchableOpacity style={this.props.containerStyle} disabled={!this.props.onPress} onPress={this.props.onPress}>
          <Image resizeMethod='resize' {...this.props} source={{ uri: this.props.source.uri.replace('Learningdata', 'Learning/data') }} />
        </TouchableOpacity>
      )
    } else if (this.props.renderDefaultSource) {
      return (
        this.props.renderDefaultSource()
      )
    } else {
      return (
        <TouchableOpacity style={this.props.containerStyle} disabled={!this.props.onPress} onPress={this.props.onPress}>
          <View style={[this.props.style, styles.shimmer]}>
            <ImageIcon width={45} height='30%' fill={Colors.rgb_9b9b9b} />
          </View>
        </TouchableOpacity>
      )
    }
  }
}

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: Colors.rgb_f9f9f9,
    alignItems: 'center',
    justifyContent: 'center',
  },
})