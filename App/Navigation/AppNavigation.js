import React, { Component } from 'react'
import {
  Platform,
  Dimensions,
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import {
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import hoistNonReactStatics from 'hoist-non-react-statics'

import NavigationService from '@services/NavigationService'
import I18n from '@i18n'
import HeaderTitle from '@components/HeaderTitle'
import HeaderRight from '@components/HeaderRight'
import SearchInput from '@components/SearchInput'
import SearchSuggestions from '@containers/SearchSuggestions'
import SearchResultTab from '@containers/SearchResultTab'
import NotificationsInboxScreen from '@containers/NotificationsInboxScreen'
import TaskAndMissionDetailScreen from '@containers/TaskAndMissionDetailScreen'

import SplashScreen from '@containers/SplashScreen'
import ErrorScreen from '@containers/ErrorScreen'
import ForceUpdateScreen from '@containers/ForceUpdateScreen'

import StartScreen from '@containers/StartScreen'
import LoginScreen from '@containers/LoginScreen'
import ForgotPasswordScreen from '@containers/ForgotPasswordScreen'
import NewPasswordScreen from '@containers/NewPasswordScreen'
import WebViewLoginScreen from '@containers/WebViewLoginScreen'
import SignUpStep1 from '@containers/SignUpStep1'
import SignUpStep2 from '@containers/SignUpStep2'
import SignUpStep3 from '@containers/SignUpStep3'

import HomeTab from '@containers/HomeTab'
import SalesTrackingTab from '@containers/SalesTrackingTab'
import RewardsTab from '@containers/RewardsTab'
import CommunityTab from '@containers/CommunityTab'
import LeadsTab from '@containers/LeadsTab'
import HelpTab from '@containers/HelpTab'

import BackIcon from '@svg/icon_arrowleft'
import HomeIcon from '@svg/icon_home'
import SalesTrackingIcon from '@svg/icon_bar_chart'
import LearnIcon from '@svg/icon_skills'
import RewardsIcon from '@svg/icon_star'
import CommunityIcon from '@svg/icon_group'
import LeadsIcon from '@svg/icon_user'
import HelpIcon from '@svg/icon_get_help'

import ActivitiesTab from '@containers/ActivitiesTab'
import CoursesTab from '@containers/CoursesTab'
import DemosTab from '@containers/DemosTab'
import ResourcesTab from '@containers/ResourcesTab'

import TransactionHistoryTab from '@containers/TransactionHistoryTab'

import RewardDetailScreen from '@containers/RewardDetailScreen'
import RedemptionScreen from '@containers/RedemptionScreen'
import SpinTheWheelScreen from '@containers/SpinTheWheelScreen'
import CarouselDetailScreen from '@containers/CarouselDetailScreen'
import ArticleDetailScreen from '@containers/ArticleDetailScreen'
import CoursesScreen from '@containers/CoursesScreen'
import InAppBrowserScreen from '@containers/InAppBrowserScreen'
import LeaderboardScreen from '@containers/LeaderboardScreen'
import ProfileScreen from '@containers/ProfileScreen'
import EditProfileScreen from '@containers/EditProfileScreen'
import AssessmentQuestionScreen from '@containers/AssessmentQuestionScreen'
import BonusPointScreen from '@containers/BonusPointScreen'
import NewsScreen from '@containers/NewsScreen'
import FeedbackFormScreen from '@containers/FeedbackFormScreen'
import TNCUpdateScreen from '@containers/TNCUpdateScreen'
import TNCDetailScreen from '@containers/TNCDetailScreen'
import SurveyScreen from '@containers/SurveyScreen'
import LookUpScreen from '@containers/LookUpScreen'
import AwardScreen from '@containers/AwardScreen'
import PollScreen from '@containers/PollScreen'
import CourseDetailScreen from '@containers/CourseDetailScreen'
import AssessmentScreen from '@containers/AssessmentScreen'
import CommunityPostList from '@containers/CommunityPostList'
import PostDetailScreen from '@containers/PostDetailScreen'
import CommunityCreatePost from '@containers/CommunityCreatePost'
import TopicActivitiesScreen from '@containers/TopicActivitiesScreen'
import MerchandisingScreen from '@containers/MerchandisingScreen'
import SettingsScreen from '@containers/SettingsScreen'
import AdvocateDevicesScreen from '@containers/AdvocateDevicesScreen'
import VideoActivityScreen from '@containers/VideoActivityScreen'
import ResourcesDetailScreen from '@containers/ResourcesDetailScreen'
import ActivityDetailScreen from '@containers/ActivityDetailScreen'
import HybridActivityScreen from '@containers/HybridActivityScreen'
import PhotoScreen from '@containers/PhotoScreen'
import VideoScreen from '@containers/VideoScreen'
import LeadDetailsScreen from '@containers/LeadDetailsScreen'
import LeadStatusUpdateScreen from '@containers/LeadStatusUpdateScreen'
import LeadStatusHelpScreen from '@containers/LeadStatusHelpScreen'
import ScormScreen from '@containers/ScormScreen'

import SearchActions from '@redux/SearchRedux'
import {
  hasAccessTo,
  isFeatureSupported,
} from '@utils/CommonUtils'

import {
  Colors,
  Constants,
} from '@resources'

import { ApplicationStyles } from '@resources'
import styles from './Styles/AppNavigationStyles'

const { width } = Dimensions.get('window')

const AuthFlow = createStackNavigator({
  StartScreen,
  LoginScreen,
  WebViewLoginScreen,
  ForgotPasswordScreen,
  NewPasswordScreen,
  SignUpStep1,
  SignUpStep2,
  SignUpStep3,
  InAppBrowserScreen,
  TNCDetailScreen: {
    screen: TNCDetailScreen,
    navigationOptions: {
      headerTitle: () => <HeaderTitle title={I18n.t('tnc.tnc')} />
    }
  },
}, {
  headerBackTitleVisible: false,
  defaultNavigationOptions: {
    headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
    headerStyle: ApplicationStyles.noShadowHeaderStyle,
  },
})

const UpdateTNCStack = createStackNavigator({
  TNCUpdateScreen: {
    screen: TNCUpdateScreen,
    navigationOptions: {
      header: null,
    }
  },
  TNCDetailScreen: {
    screen: TNCDetailScreen,
    navigationOptions: {
      headerTitle: () => <HeaderTitle title={I18n.t('tnc.tnc')} />
    }
  },
}, {
  headerBackTitleVisible: false,
  defaultNavigationOptions: {
    headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
  },
})

class AppNavigation extends Component {
  getSearchResultTabs() {
    const {
      userAudiences,
      articles,
      learnTabs,
    } = this.props
    const articlesEnabled = userAudiences && isFeatureSupported(articles, userAudiences.data)

    var searchTabs = []
    if (articlesEnabled) {
      searchTabs.push(Constants.TAB_ARTICLES)
    }
    if (hasAccessTo(Constants.TAB_COURSES, learnTabs)) {
      searchTabs.push(Constants.TAB_COURSES)
    }
    if (hasAccessTo(Constants.TAB_RESOURCES, learnTabs)) {
      searchTabs.push(Constants.TAB_RESOURCES)
    }
    if (hasAccessTo(Constants.TAB_ACTIVITIES, learnTabs)) {
      searchTabs.push(Constants.TAB_ACTIVITIES)
    }
    if (searchTabs.length == 0) {
      searchTabs = Constants.DEFAULT_SEARCH_TABS
    }
    return searchTabs
  }

  createSearchResultTabs() {
    const searchTabs = this.getSearchResultTabs()
    const tabWidth = { width: (width - 48) / searchTabs.length }

    var RouteConfigs = {}
    searchTabs.map(tab => {
      if (tab == Constants.TAB_ARTICLES) {
        RouteConfigs.Articles = {
          screen: SearchResultTab,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('search.articles')}</Text>
              </View>
            )
          },
        }
      } else if (tab == Constants.TAB_COURSES) {
        RouteConfigs.Courses = {
          screen: () => <SearchResultTab tab={Constants.TAB_COURSES} />,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('search.courses')}</Text>
              </View>
            )
          },
        }
      } else if (tab == Constants.TAB_RESOURCES) {
        RouteConfigs.Resources = {
          screen: () => <SearchResultTab tab={Constants.TAB_RESOURCES} />,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('search.resources')}</Text>
              </View>
            )
          },
        }
      } else if (tab == Constants.TAB_ACTIVITIES) {
        RouteConfigs.Activities = {
          screen: () => <SearchResultTab tab={Constants.TAB_ACTIVITIES} />,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('search.activities')}</Text>
              </View>
            )
          },
        }
      }
    })
    return createMaterialTopTabNavigator(RouteConfigs, {
      tabBarOptions: {
        style: ApplicationStyles.tabBarStyle,
        indicatorStyle: ApplicationStyles.tabBarIndicatorStyle,
      },
    })
  }

  createSearchScreen() {
    const SearchResultTabs = this.createSearchResultTabs()
    const SearchScreen = (props) => {
      return (
        <>
          <SearchResultTabs {...props} />
          <SearchSuggestions />
        </>
      )
    }
    hoistNonReactStatics(SearchScreen, SearchResultTabs)
    return SearchScreen
  }

  getTransactionHistoryTabWidth() {
    var numTab = 1
    const {
      homeTabs,
      learnTabs,
      userAudiences,
      rewardsTransaction,
    } = this.props

    if (hasAccessTo(Constants.TAB_ACTIVITIES, learnTabs)) {
      numTab++
    }
    if (hasAccessTo(Constants.TAB_COURSES, learnTabs)) {
      numTab++
    }
    const rewardsTransactionEnabled = userAudiences && isFeatureSupported(rewardsTransaction, userAudiences.data)
    if (hasAccessTo(Constants.TAB_REWARDS, homeTabs) || rewardsTransactionEnabled) {
      numTab++
    }
    return { width: (width - 48) / numTab }
  }

  createTransactionHistoryScreen() {
    const {
      homeTabs,
      learnTabs,
      userAudiences,
      rewardsTransaction,
    } = this.props
    const tabWidth = this.getTransactionHistoryTabWidth()
    const rewardsTransactionEnabled = userAudiences && isFeatureSupported(rewardsTransaction, userAudiences.data)

    var RouteConfigs = {}
    if (hasAccessTo(Constants.TAB_ACTIVITIES, learnTabs)) {
      RouteConfigs.Activities = {
        screen: () => <TransactionHistoryTab tab={Constants.TAB_ACTIVITIES} />,
        navigationOptions: {
          tabBarLabel: ({ focused }) => (
            <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
              <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('transaction_history.activities')}</Text>
            </View>
          )
        },
      }
    }
    if (hasAccessTo(Constants.TAB_COURSES, learnTabs)) {
      RouteConfigs.Courses = {
        screen: () => <TransactionHistoryTab tab={Constants.TAB_COURSES} />,
        navigationOptions: {
          tabBarLabel: ({ focused }) => (
            <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
              <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('transaction_history.courses')}</Text>
            </View>
          )
        },
      }
    }
    if (hasAccessTo(Constants.TAB_REWARDS, homeTabs) || rewardsTransactionEnabled) {
      RouteConfigs.Rewards = {
        screen: () => <TransactionHistoryTab tab={Constants.TAB_REWARDS} />,
        navigationOptions: {
          tabBarLabel: ({ focused }) => (
            <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
              <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('transaction_history.rewards')}</Text>
            </View>
          )
        },
      }
    }
    RouteConfigs.Admin = {
      screen: TransactionHistoryTab,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
            <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('transaction_history.admin')}</Text>
          </View>
        )
      },
    }
    return createMaterialTopTabNavigator(RouteConfigs, {
      tabBarOptions: {
        style: ApplicationStyles.tabBarStyle,
        indicatorStyle: ApplicationStyles.tabBarIndicatorStyle,
      },
    })
  }

  createLearnScreen() {
    return createMaterialTopTabNavigator(this.getLearnTabs('LearnScreen'), {
      tabBarOptions: {
        style: ApplicationStyles.tabBarStyle,
        indicatorStyle: ApplicationStyles.tabBarIndicatorStyle,
      },
    })
  }

  getAppStack() {
    return {
      SearchScreen: {
        screen: this.createSearchScreen(),
        navigationOptions: ({ navigation }) => (Platform.OS === 'ios' ? {
          headerLeft: null,
          headerTitle: <SearchInput navigation={navigation} />,
        } : {
            headerTitle: <SearchInput navigation={navigation} />,
          }),
      },
      NotificationsInboxScreen,
      TaskAndMissionDetailScreen,
      CoursesScreen,
      CourseDetailScreen: {
        screen: CourseDetailScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('courses.courses')} />,
        },
      },
      AssessmentScreen: {
        screen: AssessmentScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('assessment.assessment')} />,
        },
      },
      ArticleDetailScreen,
      InAppBrowserScreen,
      ScormScreen,
      PhotoScreen,
      BonusPointScreen: {
        screen: BonusPointScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('bonus.header_title')} />,
        },
      },
      LeaderboardScreen: {
        screen: LeaderboardScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('leaderboards.leaderboards')} />,
        },
      },
      ProfileScreen: {
        screen: ProfileScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('profile.header_title')} />,
        },
      },
      EditProfileScreen: {
        screen: EditProfileScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('edit_profile.header_title')} />,
        },
      },
      SettingsScreen: {
        screen: SettingsScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('settings.settings')} />,
        },
      },
      SignUpStep2,
      SignUpStep3,
      AssessmentQuestionScreen: {
        screen: AssessmentQuestionScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('assessment.header_title')} />,
        },
      },
      NewsScreen: {
        screen: NewsScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('news.header_title')} />,
        },
      },
      CarouselDetailScreen: {
        screen: CarouselDetailScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('carousel.activity')} />,
        },
      },
      SurveyScreen: {
        screen: SurveyScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('survey.survey')} />,
        },
      },
      PollScreen: {
        screen: PollScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('poll.poll')} />,
        },
      },
      MerchandisingScreen: {
        screen: MerchandisingScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('merchandising.merchandising')} />,
        },
      },
      TopicActivitiesScreen,
      TransactionHistoryScreen: {
        screen: this.createTransactionHistoryScreen(),
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('transaction_history.header_title')} />,
        },
      },
      LookUpScreen,
      AwardScreen: {
        screen: AwardScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('rewards.spot_reward')} />,
        },
      },
      RewardDetailScreen: {
        screen: RewardDetailScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('rewards.reward')} />,
        },
      },
      SpinTheWheelScreen: {
        screen: SpinTheWheelScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('rewards.spin_the_wheel_title')} />,
        },
      },
      RedemptionScreen,
      CommunityPostList,
      CommunityCreatePost: {
        screen: CommunityCreatePost,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      PostDetailScreen,
      TNCDetailScreen: {
        screen: TNCDetailScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('tnc.tnc')} />
        }
      },
      FeedbackFormScreen: {
        screen: FeedbackFormScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('feedback_form.header_title')} />,
        },
      },
      AdvocateDevicesScreen: {
        screen: AdvocateDevicesScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('advocate_devices.page_title')} />,
        },
      },
      LearnScreen: {
        screen: this.createLearnScreen(),
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('learn.header_title')} />,
          headerRight: () => <HeaderRight hideNotification={true} />,
        },
      },
      VideoActivityScreen: {
        screen: VideoActivityScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('activity.activity')} />
        }
      },
      ResourcesDetailScreen,
      ActivityDetailScreen,
      HybridActivityScreen: {
        screen: HybridActivityScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('activity.activity')} />
        }
      },
      VideoScreen,
      LeadDetailsScreen,
      LeadStatusUpdateScreen,
      LeadStatusHelpScreen: {
        screen: LeadStatusHelpScreen,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={I18n.t('lead_gen.lead_help_title')} />,
        },
      },
    }
  }

  createHomeStack(title, appStack) {
    return createStackNavigator({
      HomeTab: {
        screen: HomeTab,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={title} style={ApplicationStyles.titleStyle} />,
          headerRight: () => <HeaderRight />,
        },
      },
      ...appStack,
    }, {
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
        headerStyle: ApplicationStyles.noShadowHeaderStyle,
      },
      navigationOptions: ({ navigation }) => {
        return {
          tabBarVisible: navigation.state.routes[navigation.state.index].routeName != 'ScormScreen',
        }
      },
    })
  }

  createSalesTrackingStack(title, appStack) {
    return createStackNavigator({
      SalesTrackingTab: {
        screen: SalesTrackingTab,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={title} style={ApplicationStyles.titleStyle} />,
          headerRight: () => <HeaderRight />,
        },
      },
      ...appStack,
    }, {
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
        headerStyle: ApplicationStyles.noShadowHeaderStyle,
      },
    })
  }

  getLearnTabWidth() {
    var numTab = 0
    const { learnTabs } = this.props
    learnTabs.map(tab => {
      if (tab.id == Constants.TAB_ACTIVITIES
        || tab.id == Constants.TAB_COURSES
        || tab.id == Constants.TAB_DEMOS
        || tab.id == Constants.TAB_RESOURCES) {
        numTab++
      }
    })
    return { width: (width - 48) / numTab }
  }

  getLearnTabs(container) {
    const tabWidth = this.getLearnTabWidth()
    const { learnTabs } = this.props
    var RouteConfigs = {}
    learnTabs.map(tab => {
      if (tab.id == Constants.TAB_ACTIVITIES) {
        RouteConfigs[`ActivitiesIn${container}`] = {
          screen: ActivitiesTab,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('learn.activities')}</Text>
              </View>
            )
          },
        }
      } else if (tab.id == Constants.TAB_COURSES) {
        RouteConfigs[`CoursesIn${container}`] = {
          screen: CoursesTab,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('learn.courses')}</Text>
              </View>
            )
          },
        }
      } else if (tab.id == Constants.TAB_DEMOS) {
        RouteConfigs.Demos = {
          screen: DemosTab,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('learn.demos')}</Text>
              </View>
            )
          },
        }
      } else if (tab.id == Constants.TAB_RESOURCES) {
        RouteConfigs.Resources = {
          screen: ResourcesTab,
          navigationOptions: {
            tabBarLabel: ({ focused }) => (
              <View style={[ApplicationStyles.tabStyle, tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('learn.resources')}</Text>
              </View>
            )
          },
        }
      }
    })
    return RouteConfigs
  }

  createLearnTabNavigator(title, appStack) {
    return createStackNavigator({
      LearnTab: createMaterialTopTabNavigator(this.getLearnTabs('LearnTab'), {
        tabBarOptions: {
          style: ApplicationStyles.tabBarStyle,
          indicatorStyle: ApplicationStyles.tabBarIndicatorStyle,
        },
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={title} style={ApplicationStyles.titleStyle} />,
          headerRight: () => <HeaderRight />,
        },
      }),
      ...appStack,
    }, {
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
        headerStyle: ApplicationStyles.noShadowHeaderStyle,
      },
    })
  }

  createRewardsStack(title, appStack) {
    return createStackNavigator({
      RewardsTab: {
        screen: RewardsTab,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={title} style={ApplicationStyles.titleStyle} />,
          headerRight: () => <HeaderRight />,
        },
      },
      ...appStack,
    }, {
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
        headerStyle: ApplicationStyles.noShadowHeaderStyle,
      },
    })
  }

  createCommunityStack(title, appStack) {
    return createStackNavigator({
      CommunityTab: {
        screen: CommunityTab,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={title} style={ApplicationStyles.titleStyle} />,
          headerRight: () => <HeaderRight />,
        },
      },
      ...appStack,
    }, {
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
        headerStyle: ApplicationStyles.noShadowHeaderStyle,
      },
    })
  }

  createLeadsStack(title, appStack) {
    return createStackNavigator({
      LeadsTab: {
        screen: LeadsTab,
      },
      ...appStack,
    }, {
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
        headerStyle: ApplicationStyles.noShadowHeaderStyle,
      },
    })
  }

  createHelpStack(title, appStack) {
    return createStackNavigator({
      HelpTab: {
        screen: HelpTab,
        navigationOptions: {
          headerTitle: () => <HeaderTitle title={title} style={ApplicationStyles.titleStyle} />,
          headerRight: () => <HeaderRight />,
        },
      },
      ...appStack,
    }, {
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerBackImage: Platform.OS === 'ios' ? <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_4a4a4a} /> : null,
        headerStyle: ApplicationStyles.noShadowHeaderStyle,
      },
    })
  }

  createHomeScreenNavigator() {
    const appStack = this.getAppStack()
    const { homeTabs } = this.props
    var RouteConfigs = {}
    homeTabs.map(tab => {
      if (tab.id == Constants.TAB_HOME) {
        RouteConfigs.Home = {
          screen: this.createHomeStack(tab.title, appStack),
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <HomeIcon width={21} height={21} fill={tintColor} />
            ),
            tabBarLabel: <Text style={styles.bottomTabLabelStyle}>{tab.title}</Text>,
          },
        }
      } else if (tab.id == Constants.TAB_SALES_TRACKING) {
        RouteConfigs.SalesTracking = {
          screen: this.createSalesTrackingStack(tab.title, appStack),
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <SalesTrackingIcon width={21} height={21} fill={tintColor} />
            ),
            tabBarLabel: <Text style={styles.bottomTabLabelStyle}>{tab.title}</Text>,
          },
        }
      } else if (tab.id == Constants.TAB_LEARN) {
        RouteConfigs.Learn = {
          screen: this.createLearnTabNavigator(tab.title, appStack),
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <LearnIcon width={21} height={21} fill={tintColor} />
            ),
            tabBarLabel: <Text style={styles.bottomTabLabelStyle}>{tab.title}</Text>,
          },
        }
      } else if (tab.id == Constants.TAB_REWARDS) {
        RouteConfigs.Rewards = {
          screen: this.createRewardsStack(tab.title, appStack),
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <RewardsIcon width={21} height={21} fill={tintColor} />
            ),
            tabBarLabel: <Text style={styles.bottomTabLabelStyle}>{tab.title}</Text>,
          },
        }
      } else if (tab.id == Constants.TAB_COMMUNITY) {
        RouteConfigs.Community = {
          screen: this.createCommunityStack(tab.title, appStack),
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <CommunityIcon width={21} height={21} fill={tintColor} />
            ),
            tabBarLabel: <Text style={styles.bottomTabLabelStyle}>{tab.title}</Text>,
          },
        }
      } else if (tab.id == Constants.TAB_LEADS) {
        RouteConfigs.Leads = {
          screen: this.createLeadsStack(tab.title, appStack),
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <LeadsIcon width={21} height={21} fill={tintColor} />
            ),
            tabBarLabel: <Text style={styles.bottomTabLabelStyle}>{tab.title}</Text>,
          },
        }
      } else if (tab.id == Constants.TAB_HELP) {
        RouteConfigs.Help = {
          screen: this.createHelpStack(tab.title, appStack),
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <HelpIcon width={21} height={21} fill={tintColor} />
            ),
            tabBarLabel: <Text style={styles.bottomTabLabelStyle}>{tab.title}</Text>,
          },
        }
      }
    })
    return createMaterialBottomTabNavigator(RouteConfigs, {
      shifting: false,
      activeColor: Colors.rgb_4297ff,
      inactiveColor: Colors.rgb_b9b9b9,
      barStyle: styles.bottomTabBarStyle,
    })
  }

  render() {
    const {
      rehydrated,
      signedIn,
      homeTabs,
      maintMode,
      forceUpdate,
      showError,
      errorType,
      hasNewTermsConditions,
    } = this.props

    if (maintMode) {
      return <ErrorScreen type={Constants.ERROR_TYPES.MAINTENANCE} />
    } else if (forceUpdate) {
      return <ForceUpdateScreen />
    } else if (showError) {
      return <ErrorScreen type={errorType} />
    } else if (rehydrated) {
      var AppContainer = undefined
      if (signedIn) {
        if (hasNewTermsConditions) {
          AppContainer = createAppContainer(UpdateTNCStack)
        } else if (homeTabs && homeTabs.length > 0) {
          AppContainer = createAppContainer(this.createHomeScreenNavigator())
        }
      } else {
        AppContainer = createAppContainer(AuthFlow)
      }
      if (AppContainer) {
        return (
          <>
            <AppContainer
              ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
              enableURLHandling={false}
            />
          </>
        )
      }
    }

    return (
      <SplashScreen />
    )
  }
}

const mapStateToProps = (state) => ({
  userAudiences: state.user.audiences,
  articles: state.remoteConfig.featureConfig.articles,
  rewardsTransaction: state.remoteConfig.featureConfig.rewards_transaction,
  rehydrated: state.app.rehydrated,
  signedIn: state.app.signedIn,
  homeTabs: state.nav.homeTabs,
  learnTabs: state.nav.learnTabs,
  maintMode: state.nav.maintMode,
  forceUpdate: state.nav.forceUpdate,
  showError: state.nav.showError,
  errorType: state.nav.errorType,
  hasNewTermsConditions: state.user.hasNewTermsConditions,
})

const mapDispatchToProps = (dispatch) => ({
  updateSearchTerm: (searchTerm) => dispatch(SearchActions.updateSearchTerm(searchTerm)),
  showHideSearchSuggestions: (isVisible) => dispatch(SearchActions.showHideSearchSuggestions(isVisible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation)
