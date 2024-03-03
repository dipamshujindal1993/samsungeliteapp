import React, { Component } from 'react'
import {
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { MenuOption } from 'react-native-popup-menu'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'

import I18n from '@i18n'
import OptionsMenu from '@components/OptionsMenu'
import LeaderboardsList from '@containers/LeaderboardsList'
import NavigationActions from '@redux/NavigationRedux'
import { isFeatureSupported } from '@utils/CommonUtils'
import {
  ApplicationStyles,
  Constants,
} from '@resources'

import styles from './Styles/LeaderboardScreenStyles'

const TabNavigatorConfig = {
  tabBarOptions: {
    style: ApplicationStyles.tabBarStyle,
    indicatorStyle: ApplicationStyles.tabBarIndicatorStyle,
  }
}

const LeaderboardTabsConfig = {
  MyReps: {
    screen: () => <LeaderboardsList myRepsLeaderboards={true} />,
    navigationOptions: {
      tabBarLabel: ({ focused }) => (
        <View style={[ApplicationStyles.tabStyle, styles.tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
          <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('leaderboards.my_reps')}</Text>
        </View>
      )
    },
  },
  FSMs: {
    screen: () => <LeaderboardsList />,
    navigationOptions: {
      tabBarLabel: ({ focused }) => (
        <View style={[ApplicationStyles.tabStyle, styles.tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
          <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('leaderboards.fsms')}</Text>
        </View>
      )
    },
  }
}

const LeaderboardTabs = createMaterialTopTabNavigator(LeaderboardTabsConfig, TabNavigatorConfig)

const periodOptions = [
  {period: Constants.LEADERBOARD_PERIOD.THIS_WEEK, option: I18n.t('leaderboards.weekly'), selected: I18n.t('leaderboards.weekly_uppercase')},
  {period: Constants.LEADERBOARD_PERIOD.THIS_MONTH, option: I18n.t('leaderboards.monthly'), selected: I18n.t('leaderboards.monthly_uppercase')},
  {period: Constants.LEADERBOARD_PERIOD.ALL_TIME, option: I18n.t('leaderboards.all_time'), selected: I18n.t('leaderboards.all_time_uppercase')},
]

class LeaderboardScreen extends Component {
  static router = LeaderboardTabs.router

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (<OptionsMenu
        text={navigation.getParam('selectedPeriod') || periodOptions[2].selected}
      >
        {periodOptions.map((option, index) => (
          <MenuOption
            key={index}
            onSelect={() => navigation.getParam('onSelectPeriod')(index)}
          >
            <Text style={styles.period}>{option.option}</Text>
          </MenuOption>
          ))
        }
      </OptionsMenu>)
    }
  }

  componentDidMount() {
    this.props.updatePeriod(periodOptions[2].period)

    this.props.navigation.setParams({
      onSelectPeriod: this._onSelectPeriod,
    })
  }

  _onSelectPeriod = (index) => {
    this.props.navigation.setParams({
      selectedPeriod: periodOptions[index].selected,
    })

    if (this.props.period != periodOptions[index].period) {
      this.props.updatePeriod(periodOptions[index].period)
    }
  }

  render() {
    const {
      userAudiences,
      fsm,
    } = this.props
    const isFsm = userAudiences && isFeatureSupported(fsm, userAudiences.data)
    if (isFsm) {
      return (
        <View style={styles.container}>
          <LeaderboardTabs navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <LeaderboardsList />
      )
    }
  }
}

const mapStateToProps = (state) => ({
  period: state.nav.period,
  userAudiences: state.user.audiences,
  fsm: state.remoteConfig.featureConfig.fsm,
})

const mapDispatchToProps = (dispatch) => ({
  updatePeriod: (period) => dispatch(NavigationActions.updatePeriod(period)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardScreen)
