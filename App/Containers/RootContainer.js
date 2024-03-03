import React, { Component } from 'react'
import {
  StatusBar,
} from 'react-native'
import { connect } from 'react-redux'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

import StartupActions from '@redux/StartupRedux'

import AppNavigation from '../Navigation/AppNavigation'
import ReduxPersist from '@config/ReduxPersist'
import { MenuProvider } from 'react-native-popup-menu'

import AppStateHandler from '@components/AppStateHandler'

class RootContainer extends Component {
  componentDidMount() {
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render() {
    return (
      <>
        <StatusBar />
        <ActionSheetProvider>
          <MenuProvider>
            <AppNavigation />
          </MenuProvider>
        </ActionSheetProvider>
        <AppStateHandler />
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
})

export default connect(null, mapDispatchToProps)(RootContainer)