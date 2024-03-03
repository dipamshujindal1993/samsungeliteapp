import '@config'
import DebugConfig from '@config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '@redux'
import SplashScreen from 'react-native-splash-screen'
import Orientation from 'react-native-orientation'

// create our store
const store = createStore()

class App extends Component {
  componentDidMount() {
    Orientation.lockToPortrait()
    SplashScreen.hide()
  }

  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
