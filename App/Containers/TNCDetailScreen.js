import React, { Component } from 'react'
import {
  Text,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'

import UserActions from '@redux/UserRedux'
import ContentHtml from '@components/ContentHtml'
import ErrorScreen from '@containers/ErrorScreen'
import LoadingSpinner from '@components/LoadingSpinner'
import I18n from '@i18n'
import { Constants } from '@resources'

import styles from './Styles/TNCDetailScreenStyles'

class TNCDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    if (this.props.signedIn) {
      if (this.props.navigation.state.params && this.props.navigation.state.params.isChangeAffiliation) {
        this.props.getDomains(this.props.newAffiliationCode)
      } else if (this.props.domainCode != '-1') {
        this.props.getTermsConditions(this.props.domainCode)
      } else if (this.props.organizations) {
        const primaryOrganization = this.props.organizations.find(org => org.isPrimary)
        this.props.getOrganizationDetail(primaryOrganization.id)
      } else {
        this.setState({
          isLoading: false,
          isLoadingError: true,
        })
      }
    } else if (this.props.affiliationCode) {
      this.props.getDomains(this.props.affiliationCode)
    } else {
      this.setState({
        isLoading: false,
        isLoadingError: true,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.domains != this.props.domains && this.props.domains) {
      if (this.props.domains.data && this.props.domains.data.length > 0) {
        this.props.getTermsConditions(this.props.domains.data[0].code)
      } else {
        this.setState({
          isLoading: false,
          isLoadingError: true,
        })
      }
    }

    if (prevProps.organizationDetail != this.props.organizationDetail && this.props.organizationDetail) {
      if (this.props.organizationDetail.optionalInfo && this.props.organizationDetail.optionalInfo.text2) {
        this.props.getDomains(this.props.organizationDetail.optionalInfo.text2)
      } else {
        this.setState({
          isLoading: false,
          isLoadingError: true,
        })
      }
    }

    if (prevProps.isLoadingTnC != this.props.isLoadingTnC) {
      this.setState({
        isLoading: this.props.isLoadingTnC,
        isLoadingError: !this.props.tnc,
      })
    }
  }

  render() {
    const { isLoading, isLoadingError } = this.state
    const { tnc } = this.props
    if (isLoading) {
      return <LoadingSpinner />
    } else if (isLoadingError) {
      return <ErrorScreen
        title={I18n.t('generic_error.title')}
        message={I18n.t('generic_error.message')}
      />
    } else if (tnc) {
      const description = tnc.text
      const hasHTML = Constants.HTML_PATTERN.test(description)
      return (
        <ScrollView style={styles.container}>
          {!hasHTML && <Text style={styles.text}>{description}</Text>}
          {hasHTML && <ContentHtml htmlContent={description} />}
        </ScrollView>
      )
    }

    return null
  }
}

const mapStateToProps = (state) => ({
  isLoadingTnC: state.user.isLoadingTnC,
  signedIn: state.app.signedIn,
  domainCode: state.user.summary ? state.user.summary.primaryDomainCode : undefined,
  affiliationCode: state.user.userInfo ? state.user.userInfo.affiliationCode : undefined,
  newAffiliationCode: state.user.userInfoChangingAffiliationCode ? state.user.userInfoChangingAffiliationCode.affiliationCode : undefined,
  domains: state.user.domains,
  organizations: state.user.summary ? state.user.summary.organizations : undefined,
  organizationDetail: state.user.organizationDetail,
  tnc: state.user.tnc,
})

const mapDispatchToProps = (dispatch) => ({
  getDomains: (affiliationCode) => dispatch(UserActions.getDomains(1, null, affiliationCode)),
  getTermsConditions: (orgCode) => dispatch(UserActions.getTermsConditions(orgCode)),
  getOrganizationDetail: (organizationId) => dispatch(UserActions.getOrganizationDetail(organizationId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TNCDetailScreen)