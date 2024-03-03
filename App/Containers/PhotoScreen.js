import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import AppActions from '@redux/AppRedux'
import ImageEx from '@components/ImageEx'
import { Constants } from '@resources'

import styles from './Styles/PhotoScreenStyles'

class PhotoScreen extends Component {

      componentDidMount() {
        this.startTimer()
      }
    
      startTimer() {
        this.timer = setInterval(() => this.shouldPrompAppRating = true, this.props.timeSpent * 1000)
      }

      componentWillUnmount() {
        clearInterval(this.timer);
        this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true);
      }

      render()
      {
        const { photoUrl } = this.props.navigation.state.params
        return (
            <View style={styles.container}>
                <ImageEx
                    style={styles.image}
                    source={{ uri: photoUrl }}
                />
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
  
  export default connect(mapStateToProps,mapDispatchToProps)(PhotoScreen)