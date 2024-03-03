import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import UserActions from '@redux/UserRedux'
import { isEmpty } from '@utils/TextUtils'

import styles from './Styles/BadgesTabStyles'

class BadgesTab extends Component {
  constructor(props) {
    super(props)

    const { badgeDescriptions } = this.props
    let descriptions = {}
    if (badgeDescriptions) {
      const descriptionsArray = JSON.parse(badgeDescriptions)
      for (let description of descriptionsArray) {
        descriptions = { ...descriptions, ...description }
      }
    }
    this.state = {
      descriptions
    }
  }

  componentDidMount() {
    this.props.getGamificationOverview()
  }

  render() {
    const { gamificationOverview } = this.props
    if (!gamificationOverview) {
      return <LoadingSpinner />
    } else if (gamificationOverview.badges) {
      return (
        <View style={styles.container}>
          {this.renderBadgesList(gamificationOverview.badges)}
        </View>
      )
    }
    return null
  }

  renderBadgesList(badges) {
    return (
      <FlatList
        data={badges}
        ItemSeparatorComponent={() => this.renderSeparator()}
        keyExtractor={(item, index) => item.name || index.toString()}
        renderItem={({ item, index }) => this.renderItem(item, index)}
      />
    )
  }

  renderSeparator() {
    return <Separator style={styles.separator} />
  }

  renderItem(item, index) {
    const { descriptions } = this.state
    const itemDescription = descriptions[item.translationId]
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <ImageEx
            style={styles.image}
            source={{ uri: item.image }}
            opacity={item.unlocked ? 1 : 0.2}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={[styles.badgeNameText, { opacity: item.unlocked ? 1 : 0.2 }]} numberOfLines={1}>{item.name}</Text>
          {!isEmpty(itemDescription) && <Text style={styles.badgeDescriptionText} numberOfLines={2}>{itemDescription}</Text>}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  gamificationOverview: state.user.gamificationOverview,
  badgeDescriptions: state.remoteConfig.badge_descriptions,
})

const mapDispatchToProps = (dispatch) => ({
  getGamificationOverview: () => dispatch(UserActions.getGamificationOverview())
})

export default connect(mapStateToProps, mapDispatchToProps)(BadgesTab)
