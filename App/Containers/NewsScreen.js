import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import EndlessFlatList from '@components/EndlessFlatList'
import ErrorScreen from '@containers/ErrorScreen'
import I18n from '@i18n'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import ProTag from '@components/ProTag'
import UserActions from '@redux/UserRedux'
import { open } from '@services/LinkHandler'
import { Constants } from '@resources'

import styles from './Styles/NewsScreenStyles'

class NewsScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      errorLoading: false,
      data: [],
    }
    this.pageNumber = 0
  }

  componentDidMount() {
    this.getBanners()
  }

  componentDidUpdate(prevProps, prevState) {
    const { banners } = this.props
    if (banners !== prevProps.banners) {
      if (banners === null) {
        this.setState({ 
          isLoading: false,
          errorLoading: true,
        })
      } else {
        const { pagination, data } = banners
        this.total = pagination.total
        this.setState({ 
          isLoading: false,
          data: this.pageNumber > 0 ? prevState.data.concat(data) : data,
        })
      }
    }
  }

  getBanners() {
    this.props.getBanners(this.pageNumber)
  }

  render() {
    const { isLoading, errorLoading } = this.state
    if (isLoading) {
      return <LoadingSpinner />
    } else if (errorLoading) {
      return (
        <ErrorScreen
          title={I18n.t('news.unable_load_title')}
        />
      )
    } else{
      return (
        <View style={styles.container}>
          {this.renderList()}
        </View>
      )
    }
  }

  renderList() {
    const { data } = this.state
    if (data.length > 0) {
      return (
        <EndlessFlatList 
          data={data}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ItemSeparatorComponent={this.renderSeparator}
          loadMore={() => {
            this.pageNumber++
            this.getBanners()
          }}
          loadedAll={data.length >= this.total}
        />
      )
    } else {
      return (
        <ErrorScreen
          title={I18n.t('news.no_news_title')}
        />
      )
    }
  }

  renderSeparator() {
    return <View style={styles.separator} />
  }

  renderItem(item, index) {
    const { employeeType } = this.props
    const showProTag = employeeType === Constants.EMPLOYEE_TYPES.ADVOCATE
        && (item.category == Constants.NEWS_CATEGORIES.PRO || item.optionalInteger1 == Constants.PRO_CONTENT)
    return (
      <TouchableOpacity onPress={() => this.openBannerLink(item.bannerLink)}>
        <View style={styles.itemContainer}>
          {showProTag && <ProTag style={styles.proTag}/>}
          <ImageEx 
            style={styles.itemImage}
            source={{uri: item.bannerimageUrl}}
          />
          <View style={styles.itemDetailContainer}>
            <Text numberOfLines={2} style={styles.itemTitle}>{item.bannerName}</Text>
            <Text numberOfLines={2} style={styles.itemDescription}>{item.bannerDescription}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  openBannerLink(bannerLink) {
    open({url: bannerLink})
  }
}

const mapStateToProps = (state) => ({
  banners: state.user.banners,
  employeeType: state.user.summary ? state.user.summary.employeeType : undefined,
})

const mapDispatchToProps = (dispatch) => ({
  getBanners: (pageNumber) => dispatch(UserActions.getBanners(pageNumber)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen)
