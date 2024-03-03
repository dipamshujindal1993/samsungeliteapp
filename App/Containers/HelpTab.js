import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'
import LoadingSpinner from '@components/LoadingSpinner'
import List from '@components/List'
import I18n from '@i18n'
import { sendEmail } from '@services/LinkHandler'
import { isFeatureSupported } from '@utils/CommonUtils'
import MerchandisingCard from './MerchandisingCard'

import {
  Constants,
} from '@resources'

import styles from './Styles/HelpTabStyles'
class HelpTab extends Component {
  constructor(props) {
    super(props)

    const {
      userAudiences,
      faq,
    } = props
    this.faqEnabled = userAudiences && isFeatureSupported(faq, userAudiences.data)
  }

  componentDidMount() {
    this.props.getCourses(Constants.ACTIVITY_TYPES.FAQ)
  }

  contactUs = () => {
    sendEmail(
      I18n.t('help.contact_us_email'),
      I18n.t('help.contact_us_email_subject'),
    )
  }

  renderContactUs() {
    return (
      <TouchableOpacity onPress={this.contactUs} style={styles.contactUsContainer}>
        <Text style={styles.title}>{I18n.t('help.contact_us')}</Text>
      </TouchableOpacity>
    )
  }

  renderMerchandise() {
    const {
      userAudiences,
      fsm,
      merchandising,
    } = this.props
    const isFsm = userAudiences && isFeatureSupported(fsm, userAudiences.data)
    const merchandisingEnabled = userAudiences && isFeatureSupported(merchandising, userAudiences.data)
    if (!isFsm && merchandisingEnabled) {
      return (
        <MerchandisingCard />
      )
    }
  }

  _renderHeader = () => {
    const {
      faqs,
    } = this.props
    return (
      <>
        {this.renderContactUs()}
        {this.renderMerchandise()}
        {this.faqEnabled && faqs && faqs.length > 0 &&
          <Text style={styles.faqTitle}>{I18n.t('help.faq')}</Text>
        }
      </>
    )
  }

  onItemClick = (id) => {
    if (id) {
      this.props.navigation.navigate('ArticleDetailScreen', { activityId: id, headerTitle: I18n.t('help.faqs') })
    }
  }

  renderFAQ() {
    const {
      faqs,
      faqFailure,
    } = this.props
    return (
      <List
        style={styles.faqList}
        ListHeaderComponent={this._renderHeader}
        data={faqs}
        onItemPress={this.onItemClick}
        error={faqFailure ? I18n.t('help.faq_error') : ''}
      />
    )
  }

  render() {
    if (this.faqEnabled) {
      return (
        <View style={styles.container}>
          {this.renderFAQ()}
          {this.props.isLoadingFaq && <LoadingSpinner />}
        </View>
      )
    } else {
      return (
        <>
          {this._renderHeader()}
        </>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  userAudiences: state.user.audiences,
  fsm: state.remoteConfig.featureConfig.fsm,
  merchandising: state.remoteConfig.featureConfig.merchandising,
  faq: state.remoteConfig.featureConfig.faq,
  isLoadingFaq: state.activities.isLoadingFaq,
  faqs: state.activities.faqs,
  faqFailure: state.activities.faqFailure
})

const mapDispatchToProps = (dispatch) => ({
  getCourses: (activityType) => dispatch(ActivitiesActions.getCourses(activityType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HelpTab)