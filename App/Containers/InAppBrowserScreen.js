import React, { Component } from 'react'
import {
  Platform,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import AppActions from '@redux/AppRedux'
import FileViewer from 'react-native-file-viewer'
import { WebView } from 'react-native-webview'

import ErrorScreen from '@containers/ErrorScreen'
import HeaderTitle from '@components/HeaderTitle'
import LoadingSpinner from '@components/LoadingSpinner'
import { isEmpty } from '@utils/TextUtils'
import { Constants } from '@resources'
import I18n from '@i18n'

import styles from './Styles/InAppBrowserScreenStyles'
class InAppBrowserScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      errorLoading: false,
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={navigation.state.params.headerTitle} />
    }
  }

  componentDidMount() {
    this.startTimer()
  }

  startTimer() {
    this.timer = setInterval(() => this.shouldPrompAppRating = true, this.props.timeSpent * 1000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isLoading != this.state.isLoading ||
      nextState.errorLoading != this.state.errorLoading
  }

  componentWillUnmount() {
    const { errorLoading } = this.state
    const { onClose } = this.props.navigation.state.params

    if (!errorLoading && onClose) {
      onClose()
    } else if (!errorLoading) {
      this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true)
    }
    clearInterval(this.timer)
  }

  onLoadStart = () => {
    this.setState({
      isLoading: true,
    })
  }

  onLoadEnd = () => {
    this.setState({
      isLoading: false,
    })
  }

  onContentProcessDidTerminate = () => {
    this.setState({
      errorLoading: true,
      isLoading: false
    })
  }

  onError = () => {
    this.setState({
      errorLoading: true,
      isLoading: false
    })
  }

  onHttpError = () => {
    this.setState({
      errorLoading: true,
      isLoading: false
    })
  }

  showFile() {
    const { navigation } = this.props
    const { isLoading, errorLoading } = this.state
    const { sourceObj } = navigation.state.params

    if (Platform.OS === 'android') {
      if (isLoading && !errorLoading) {
        FileViewer.open(sourceObj.uri)
          .then(() => {
            this.onLoadEnd()
            navigation.goBack()
          })
          .catch(error => this.onError())
      }
    } else {
      return this.renderWebview()
    }
  }

  renderWebview() {
    const {
      url,
      sourceObj,
    } = this.props.navigation.state.params

    return <WebView
      style={styles.webview}
      startInLoadingState={true}
      source={sourceObj ? sourceObj : {
        uri: url,
      }}
      onLoadStart={this.onLoadStart}
      onLoadEnd={this.onLoadEnd}
      onContentProcessDidTerminate={this.onContentProcessDidTerminate}
      onError={this.onError}
      onHttpError={this.onHttpError}
    />
  }

  renderContent() {
    const { navigation } = this.props
    const { contentType } = navigation.state.params
    switch (contentType) {
      case Constants.CONTENT_TYPES.PDF:
      case Constants.CONTENT_TYPES.DOCUMENT:
        return this.showFile()
      default:
        return this.renderWebview()
    }
  }

  renderError() {
    const { navigation } = this.props
    const { contentType } = navigation.state.params

    let errorTitle
    if (contentType == Constants.CONTENT_TYPES.PDF || contentType == Constants.CONTENT_TYPES.DOCUMENT) {
      errorTitle = I18n.t('courses.open_doc_error')
    } else {
      errorTitle = I18n.t('generic_error.title')
    }

    if (errorTitle && !isEmpty(errorTitle)) {
      return <ErrorScreen
        title={errorTitle}
      />
    }
    return null
  }

  render() {
    const { isLoading, errorLoading } = this.state
    return (
      <View style={styles.container}>
        {!errorLoading && this.renderContent()}
        {(!isLoading && errorLoading) && this.renderError()}
        {isLoading && <LoadingSpinner style={styles.spinner} />}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  timeSpent: state.remoteConfig.featureConfig.time_spent
})

const mapDispatchToProps = (dispatch) => ({
  showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(InAppBrowserScreen)
