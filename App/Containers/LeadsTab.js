import React, { Component } from 'react'
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { HeaderBackButton } from 'react-navigation-stack';
import LeadsActions, { defaultLeadsFilter } from '@redux/LeadsRedux'
import ErrorScreen from '@containers/ErrorScreen'
import EndlessFlatList from '@components/EndlessFlatList'
import HeaderInput from '@components/HeaderInput'
import HeaderTitle from '@components/HeaderTitle'
import HeaderRight from '@components/HeaderRight'
import LeadItem from '@components/LeadItem'
import LoadingSpinner from '@components/LoadingSpinner'
import I18n from '@i18n'
import { Colors } from '@resources'
import { isEmpty } from '@utils/TextUtils'
import styles from './Styles/LeadsTabStyles'
import LeadsIcon from '@svg/icon_phone'

class LeadsTab extends Component {

  static navigationOptions = ({ navigation }) => {

    const { params } = navigation.state;
    const isSearchEnable = params && params.isShowSearch
    const searchLead = navigation.getParam('searchLead')

    const headerLeft = !isSearchEnable ? null : <HeaderBackButton onPress={params.backEvent} />

    const headerTitle = !isSearchEnable ? 
      <HeaderTitle title={I18n.t('lead_gen.header_title')} style={styles.headerTitle}/> 
      :
      <HeaderInput
        placeholder={I18n.t('lead_gen.search_leads')}
        onSubmitEditing={searchLead}
        returnKeyType={'send'}
      />

    const headerRight = !isSearchEnable ? 
      <HeaderRight showSearchInScreen={ params && params.handleSearchAction}/> : null

    return {
        headerLeft: headerLeft,
        headerTitle: headerTitle,
        headerRight: headerRight,
    };
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      showFilterModal : false,
      selectedLeadStatusId: defaultLeadsFilter.Id,
      leadsFilterByOptions: [defaultLeadsFilter],
    }  
    this.pageNumber = 1
  }

  showSearchBar = () => {
    this.props.navigation.setParams({ 
      isShowSearch: true,
    });
  }

  searchBackHandler = () => {
    this.props.navigation.setParams({ 
      isShowSearch: false,
    });
    const { searchText } = this.state
    if(searchText){
      this.pageNumber = 1
      this.setState({
        Items: [],
        isLoading: true,
        searchText: ""
      },() => this._getLeads())
    }
  }

  componentDidMount() {
    const { getLeadsFilterByOptions, getLeadsResolutions, navigation } = this.props
    navigation.setParams({ 
      handleSearchAction: this.showSearchBar,
      backEvent: this.searchBackHandler,
      searchLead: this.searchLead,
    });
    getLeadsFilterByOptions()
    getLeadsResolutions()
    this._getLeads()
  }

  searchLead = (text) => {
    if (!isEmpty(text)) {
      this.pageNumber = 1
      this.setState({
        Items: [],
        isLoading: true,
        searchText: text
      },() => this._getLeads())
    }
  }

  _getLeads() {
    const { getLeads } = this.props
    const { selectedLeadStatusId, searchText } = this.state
    let selectedFilterId = selectedLeadStatusId
    let body = {}
    let leadStatusId = selectedFilterId === defaultLeadsFilter.Id ? undefined : selectedFilterId
    if (leadStatusId) {
        body.LeadStatusId = leadStatusId
    }
    if (searchText) {
      body.customerName = searchText
    }
    getLeads(this.pageNumber, body)
  }

  componentDidUpdate(prevProps, prevState) {
    const {allLeads, isLeadsFetchingError, shouldRefreshLeads} = this.props

    if (shouldRefreshLeads === true) {
      this.props.shouldRefreshLeadsAction(false)
      this._onRefresh()
    }

    if (prevProps.allLeads != allLeads && prevState.isLoading) {
      const { Items, Total } = allLeads
      this.total = Total
      this.setState((prevState) => ({
        isLoading: false,
        Items: this.pageNumber > 1 ? prevState.Items.concat(Items) : Items,
      }))
    }
    
    if ((prevProps.isLeadsFetchingError != isLeadsFetchingError) && isLeadsFetchingError && prevState.isLoading) {
      this.setState({
        isLoading: false,
        Items: []
      })
    }
  }

  render () {
    const {isLeadsFetchingError} = this.props
    const { isLoading, showFilterModal} = this.state
    if (isLoading) {
      return <LoadingSpinner />
    } else if (isLeadsFetchingError) {
      return <ErrorScreen
          title={I18n.t('lead_gen.error_loading_leads')}
      />
    } else {
      return (
        <View style={styles.container}>
          {this.renderLeadsFilterSection()}
          {this.renderLeads()}
          {showFilterModal && this.renderFiltersModal()}
        </View>
      )
    }
  }

  getCurrentFilter() {
    return this.props.leadsFilterByOptions.find((option) => {
        return option.Id === this.state.selectedLeadStatusId
    })
  }

  renderLeadsFilterSection() {
    let filterName = this.getCurrentFilter().Name.trim()
      if (!filterName || filterName === '') {
          return
    }
    return(
        <TouchableOpacity 
            style={styles.filterView}
            onPress={() => this.showFilterModal()}>
              <Text style={styles.filterValueText}>{filterName}</Text>
              <Text style={styles.filterCTAText}>{I18n.t('lead_gen.filter')}</Text>
        </TouchableOpacity>
    )
  }

  showFilterModal() {
    this.setState({
        showFilterModal: !this.state.showFilterModal
    })
  }

  renderFiltersModal() {
    return(
        <Modal
            animationType='slide'
            presentationStyle='overFullScreen'
            transparent
            visible={this.state.showFilterModal}
            onRequestClose={() => this.showFilterModal()}
            >
            <View style={styles.sortOverlay}>
                <TouchableWithoutFeedback onPress={() => this.showFilterModal()}>
                    <View style={styles.sortTransparentView} />
                </TouchableWithoutFeedback>
                {this.renderFilterList()}
            </View>
        </Modal>
    )
  }

  getFilterListToRender() {
    const { leadsFilterByOptions } = this.props
    return leadsFilterByOptions && leadsFilterByOptions.map(filterItem => filterItem.Name)
  }

  renderFilterList() {
    if (this.state.showFilterModal) {
    const filterList = this.getFilterListToRender()
      return (
        <View style={styles.sortLayoutView}>
          <FlatList
            data={filterList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => this.renderFilterItems(item, index)}
          />               
         </View>
      )
    }
  }

  renderFilterItems(item, index){
    return  (
      <TouchableOpacity 
        key={index} 
        style={styles.sortItemView} 
        onPress={() => this.onFilterItemTapped(index, item)}> 
          <Text style={styles.sortTypeText}>{item}</Text>
      </TouchableOpacity>
    )
  }

  onFilterItemTapped(index, value) {
    const { leadsFilterByOptions, } = this.props
    const { showFilterModal } = this.state
    if (leadsFilterByOptions[index].Id === this.getCurrentFilter().Id) {
        return
    }
    this.pageNumber = 1
    this.setState({
      showFilterModal: !showFilterModal,
      selectedLeadStatusId: leadsFilterByOptions[index].Id,
      Items: [],
      isLoading: true,
    }, () => {
        this._getLeads()
    });
  }

  renderLeads() {
    const { Items, isLoading } = this.state
    if (Items && Items.length > 0) {
      return (
        <EndlessFlatList
          style={styles.communitiesContainer}
          data={Items}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          refreshing={isLoading}
          onRefresh={() => {
            this.setState({
              isLoading: true,
              Items: [],
            })
            this.pageNumber = 1
            this._getLeads()
          }}
          loadMore={() => {
            this.pageNumber++
            this._getLeads()
          }}
          loadedAll={Items.length >= this.total}
          ItemSeparatorComponent={() => <View />}
        />
      )
    }
    else if (!isLoading) {
      return (
        <ErrorScreen
          icon={<LeadsIcon width={42} height={42} fill={Colors.rgb_4a4a4a}/>}
          title={I18n.t('lead_gen.no_leads_found')}
        />
      )
    }
  }

  renderItem = lead => {
    return <LeadItem lead={lead} onLeadSelection={this.onLeadSelection} />
  }

  onLeadSelection = (lead) => {
    //this.cancelSearchMode()
    //Keyboard.dismiss()
    this.props.navigation.navigate('LeadDetailsScreen', { leadDetails: { Id: lead.Id } })
  };

  _onRefresh = () => {
    this.pageNumber = 1
    this.setState({
      Items: [],
      isLoading: true
    },() => this._getLeads())
  } 
}

const mapStateToProps = (state) => ({
  leadsFilterByOptions: state.leads.leadsFilterByOptions,
  allLeads: state.leads.allLeads,
  isLeadsFetchingError: state.leads.isLeadsFetchingError,
  shouldRefreshLeads: state.leads.shouldRefreshLeads,
})

const mapDispatchToProps = (dispatch) => ({
  getLeads: (pageNumber, body) => dispatch(LeadsActions.getLeads(pageNumber, body)),
  getLeadsFilterByOptions: () => dispatch(LeadsActions.getLeadsFilterByOptions()),
  getLeadsResolutions: () => dispatch(LeadsActions.getLeadsResolutions()),
  shouldRefreshLeadsAction: (shouldRefresh) => dispatch(LeadsActions.shouldRefreshLeads(shouldRefresh))
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadsTab)
