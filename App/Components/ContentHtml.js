import React, { Component } from 'react'
import {
  View,
  Platform,
} from 'react-native'
import AutoHeightWebView from 'react-native-autoheight-webview'
import LoadingSpinner from '@components/LoadingSpinner'
import { open } from '@services/LinkHandler'
import styles from './Styles/ContentHtmlStyles'
export default class ContentHtml extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }
  onLoadStart = (event) => {
    this.setState({
      isLoading: true,
    })
  }

  onLoadEnd = (event) => {
    this.setState({
      isLoading: false,
    })
  }

  onError = (e) => {
    if (e) {
      const event = e.nativeEvent;
      console.log(`WebView error : ${event}`);
    }
  }

  render() {
    const { isLoading } = this.state
    const { style, customStyle, webViewStyle, spinnerEnable, htmlContent } = this.props
    let webViewPropsAndroid = {
      scalesPageToFit: false
    }

    let webViewPropsIOS = {
      scrollEnabled: false
    }

    return (
      <View style={[styles.container, style]}>
        <AutoHeightWebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
          style={[styles.webview, webViewStyle]}
          startInLoadingState={true}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          onError={this.renderOnError}
          onShouldStartLoadWithRequest={open}
          {...Platform.select({
            android: webViewPropsAndroid,
            ios: webViewPropsIOS
          })}
          customStyle={customStyle}
        />
        {isLoading && spinnerEnable && <LoadingSpinner style={styles.spinner} />}
      </View>
    )
  }
}