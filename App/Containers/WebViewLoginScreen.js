import React, { Component } from 'react'
import {
  View,
} from 'react-native'
import Config from 'react-native-config'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import Url from 'url-parse'

import { Constants } from '@resources'
import AppActions from '@redux/AppRedux'
import LoadingSpinner from '@components/LoadingSpinner'

import styles from './Styles/LoginScreenStyles'

class WebViewLoginScreen extends Component {
  state = {}

  componentDidUpdate(prevProps) {
    if (this.props.access_token != prevProps.access_token) {
      this.props.signInSuccess()
    }
  }

  onLoadStart = (event) => {
    this.setState({
      isLoading: true,
    })

    const url = new Url(event.nativeEvent.url, true)
    if (url.query && url.query.code) {
      this.props.getAccessToken(Constants.GRANT_TYPE.AUTHORIZATION_CODE, url.query.code)
    }
  }

  onLoadEnd = (event) => {
    const { apiConfig } = this.props
    if (!event.nativeEvent.url.startsWith(apiConfig.st_redirect_uri)) {
      this.setState({
        isLoading: false,
      })
    }
  }

  render() {
    const { apiConfig } = this.props
    return (
      <View style={styles.webViewContainer}>
        <WebView
          startInLoadingState={true}
          source={{ uri: `${apiConfig.st_base_url}/apisecurity/connect/authorize?response_type=code&client_id=${apiConfig.st_client_id_authorization_code}&redirect_uri=${apiConfig.st_redirect_uri}&scope=${apiConfig.st_scopes}` }}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
        />

        {this.state.isLoading && <LoadingSpinner style={styles.spinner} />}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  access_token: state.app.access_token,
  apiConfig: state.remoteConfig.apiConfig,
})

const mapDispatchToProps = (dispatch) => ({
  getAccessToken: (grantType, code) => dispatch(AppActions.getAccessToken(grantType, code)),
  signInSuccess: () => dispatch(AppActions.signInSuccess()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WebViewLoginScreen)
