import React, { Component } from 'react'
import {
  SafeAreaView,
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'

import { Constants } from '@resources'
import I18n from '@i18n'
import AppInfo from '@components/AppInfo'
import Button from '@components/Button'
import QuarternaryButton from '@components/QuaternaryButton'
import LinkHandler from '@services/LinkHandler'

import {
  findConfig,
} from '@utils/CommonUtils'

import styles from './Styles/ErrorScreenStyles'

class ErrorScreen extends Component {
  renderAppInfo() {
    const { type } = this.props
    switch (type) {
      case Constants.ERROR_TYPES.NETWORK:
      case Constants.ERROR_TYPES.MAINTENANCE:
      case Constants.ERROR_TYPES.GEOFENCING:
        return <AppInfo />
    }
  }

  getContentStyle() {
    const { type } = this.props
    switch (type) {
      case Constants.ERROR_TYPES.NETWORK:
      case Constants.ERROR_TYPES.MAINTENANCE:
      case Constants.ERROR_TYPES.GEOFENCING:
        return styles.contentContainer

      default:
        return styles.fullContentContainer
    }
  }

  renderIcon() {
    const {
      type,
      icon,
    } = this.props
    switch (type) {
      case Constants.ERROR_TYPES.NETWORK:
      case Constants.ERROR_TYPES.MAINTENANCE:
      case Constants.ERROR_TYPES.GEOFENCING:
        return null

      default:
        if (icon) {
          return icon
        } else {
          return <Text style={styles.icon}>!</Text>
        }
    }
  }

  renderTitle() {
    const {
      userAudiences,
      geofencing,
      type,
    } = this.props

    switch (type) {
      case Constants.ERROR_TYPES.NETWORK:
        return <Text style={styles.title}>{I18n.t('network_error.title')}</Text>

      case Constants.ERROR_TYPES.MAINTENANCE:
        return <Text style={styles.title}>{I18n.t('maintenance.title')}</Text>

      case Constants.ERROR_TYPES.GEOFENCING:
        const geofencingConfig = findConfig(userAudiences, geofencing)
        return <Text style={styles.title}>{geofencingConfig && geofencingConfig.title ? geofencingConfig.title : 'Access Restricted'}</Text>

      default:
        var { title } = this.props
        if (title) {
          return (
            <Text style={styles.errorTitle}>{title}</Text>
          )
        }
    }
  }

  renderMessage() {
    const {
      userAudiences,
      geofencing,
      type,
      messageStyles,
    } = this.props

    switch (type) {
      case Constants.ERROR_TYPES.NETWORK:
        return <Text style={styles.message}>{I18n.t('network_error.message')}</Text>

      case Constants.ERROR_TYPES.MAINTENANCE:
        return <Text style={styles.message}>{I18n.t('maintenance.message')}</Text>

      case Constants.ERROR_TYPES.GEOFENCING:
        const geofencingConfig = findConfig(userAudiences, geofencing)
        if (geofencingConfig) {
          return <Text style={styles.message}>{geofencingConfig.message}</Text>
        }

      default:
        var { message } = this.props
        if (message) {
          return (
            <Text style={[styles.errorMessage, messageStyles]}>{message}</Text>
          )
        }
    }
  }

  renderCTA() {
    const { type } = this.props
    switch (type) {
      case Constants.ERROR_TYPES.NETWORK:
        return (
          <QuarternaryButton
            title={I18n.t('network_error.cta')}
            style={styles.button}
            onPress={() => LinkHandler.openSettings()}
          />
        )

      default:
        const {
          cta,
          ctaOnPress,
        } = this.props
        if (cta) {
          return (
            <Button
              style={styles.cta}
              title={cta}
              onPress={ctaOnPress}
            />
          )
        }
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderAppInfo()}
        <View style={this.getContentStyle()}>
          {this.renderIcon()}
          {this.renderTitle()}
          {this.renderMessage()}
          {this.renderCTA()}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  userAudiences: state.user.audiences,
  geofencing: state.remoteConfig.featureConfig.geofencing,
})

export default connect(mapStateToProps)(ErrorScreen)