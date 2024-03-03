import React, { Component } from 'react';
import {
    FlatList,
    Keyboard,
    Modal,
    Text, 
    TextInput, 
    TouchableOpacity,
    View,      
} from 'react-native'

import HeaderButton from '@components/HeaderButton'
import HeaderTitle from '@components/HeaderTitle'
import LeadStatus from '@components/LeadStatus'
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'
import { Colors } from '@resources'
import I18n from '@i18n'
import { connect } from 'react-redux'
import LeadsActions from '@redux/LeadsRedux'
import AddProduct from '@svg/icon_add'
import CheckBox from '@svg/icon_complete'
import styles from './Styles/LeadStatusUpdateScreenStyles'

class LeadStatusUpdateScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        const title = params.leadDetails.Name
        const headerRight = 
            <HeaderButton
                disabled={!params.isSubmitCTAEnabled}
                title={I18n.t('lead_gen.submit')}
                onPress={params.handleSubmitAction}
            />
        const headerTitle = <HeaderTitle title={title} />
        return {
            headerRight: headerRight,
            headerTitle: headerTitle,
        };
    };

    constructor(props){
        super(props)
        this.state = {
            showProductsModal: false,
            productSold: [],
            totalProducts: [],
            statusDescription: '',
            chosenProducts: [],
            selected: new Map(),
            isLoading: false
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ 
            handleSubmitAction: this.submitStatusDesc, 
            isSubmitCTAEnabled: false 
        });
        this.enableSubmitCTA()
        this.fetchStatusesfromRemoteConfig();
    }

    componentDidUpdate(prevProps) {
        const { 
            leadUpdateData, 
            shouldRefreshLeads, 
            isUpdatingLeadStatus, 
            isLeadUpdateStatusFailed 
        } = this.props

        if (prevProps.leadUpdateData != leadUpdateData) {
            if (leadUpdateData != null || leadUpdateData != undefined) {
                shouldRefreshLeads(true)
                isUpdatingLeadStatus(false)
                this.navigateToLeadList()
            }
        }
        if (prevProps.isLeadUpdateStatusFailed != isLeadUpdateStatusFailed && isLeadUpdateStatusFailed) {
            this.setState({
                isLoading: false
            })
            this.enableSubmitCTA(true)
            isUpdatingLeadStatus(false)
            ToastMessage(I18n.t('lead_gen.error_update_status'))
        }
    }

    async fetchStatusesfromRemoteConfig() {
        const { productsCategories } = this.props
        const products = JSON.parse(productsCategories)
        if (products && products.length > 0) {
            this.setState({
                totalProducts:  products
            })
        }
    }

    navigateToLeadList() {
        const { navigation } = this.props
        const { params } = navigation.state
        this.setState({
            isLoading: false
        })
        if (params.refreshLead) {
            params.refreshLead(params.leadDetails.Id)
        }
        setTimeout(() => navigation.goBack(), 1000)
    }

    submitStatusDesc = () => {
        const { isUpdatingLeadStatus, navigation, updateLeadStatus } = this.props
        const { productSold, statusDescription } = this.state
        Keyboard.dismiss()
        isUpdatingLeadStatus(true)
        this.enableSubmitCTA(false)
        this.setState({
            isLoading: true
        })
        const lead = navigation.getParam('leadDetails')
        const soldItemsWithQuantity = productSold.filter((item) => { return item.Quantity > 0})
        const bodyParams = {
            LeadId: lead.Id,
            LeadStatusId: lead.StatusID,
            Note: statusDescription.trim(),
            ProductsSold: [...soldItemsWithQuantity],
        }
        if (lead.ResolutionID) {
            bodyParams.ResolutionId = lead.ResolutionID
        }
        updateLeadStatus(bodyParams)
    }

    enableSubmitCTA(enable) {
        const { productSold } = this.state
        const { navigation } = this.props
        const { params } = navigation.state
        if (params.showProductsSold) {
            if (productSold && productSold.length > 0) {
                const sold = productSold.filter((item) => { return item.Quantity > 0})
                if (sold.length > 0) {
                    return navigation.setParams({ handleSubmitAction: this.submitStatusDesc, isSubmitCTAEnabled: true });
                }
            }
            return navigation.setParams({ handleSubmitAction: this.submitStatusDesc, isSubmitCTAEnabled: false });
        }
        if (enable === false) {
            return navigation.setParams({ handleSubmitAction: this.submitStatusDesc, isSubmitCTAEnabled: false });
        }
        return navigation.setParams({ handleSubmitAction: this.submitStatusDesc, isSubmitCTAEnabled: true });
    }

    handleTextChange = (value) => {
        this.setState({
          statusDescription: value,
        })
      }

    onAddProductTapped = () => {
        this.setState({
            showProductsModal: !this.state.showProductsModal
        }, () => this.enableSubmitCTA())
    }

    counterHandler = (counterType, index) => {
        const { totalProducts, chosenProducts } = this.state
        const newTotalProducts = totalProducts
        let product = newTotalProducts[index]
        let selectedProduct = chosenProducts.find((ele) => { return product.Category == ele.Category })
        if (counterType == I18n.t('lead_gen.lead_increment_counter')) {
            const quantity = selectedProduct.Quantity || 1      // intially the qunatity will be undefined, so for first increment assign default 1
            selectedProduct.Quantity = quantity + 1
        } else if (counterType == I18n.t('lead_gen.lead_decrement_counter')) {
            selectedProduct.Quantity = selectedProduct.Quantity - 1
        }
        newTotalProducts[index] = selectedProduct
        const soldItemsWithQuantity = chosenProducts.filter((item) => { return item.Quantity > 0})
        this.setState({ totalProducts: newTotalProducts, productSold: soldItemsWithQuantity  })
    }

    handleCheckUnCheckProduct = (index) => {
        const { totalProducts, chosenProducts, selected } = this.state
        const newTotalProducts = totalProducts
        let product = newTotalProducts[index]
        let productToAdd = chosenProducts
        if (!!selected.get(index)) {     // product getting selected
            product.Quantity = 1
            productToAdd.push(product)
        } else {                                    // product getting unselected
            productToAdd = productToAdd.filter((item) => { return item.Category != product.Category })
            product.Quantity = 0
        }
        this.setState({                             // update state data with new values
            totalProducts: newTotalProducts,
            chosenProducts: productToAdd,
            productSold: productToAdd
         })
    }

    onItemTapped(item, index) {
        this.setState((state) => {
            const selected = new Map(state.selected);
            state.selected.has(index) ? selected.delete(index, !selected.get(index))  : selected.set(index, !selected.get(index));
            return {selected};
          }, () => this.handleCheckUnCheckProduct(index));
    }

    renderProductWithCheckBox(item, index){
        const { selected } = this.state
        return(
            <TouchableOpacity style={styles.productCheckBoxRowView} onPress={() => this.onItemTapped(item, index)}>
                {!!selected.get(index) ? <CheckBox width={22} height={22} fill={Colors.rgb_4297ff} /> :
                 <View style={styles.checkBoxUnCheckedView}/>}
                <Text style={styles.productItemtext}>{item.Category}</Text>
            </TouchableOpacity>
        )
    }

    renderProductCount(item, index) {
        const { selected } = this.state
        if (!!selected.get(index)) {
            return(
                <View style={styles.productCounterView}>
                    <TouchableOpacity style={styles.counterViews} onPress={() => this.counterHandler(I18n.t('lead_gen.lead_decrement_counter'), index)} disabled={item.Quantity === 1}>
                        <View style={styles.minusHorizontalLine} />
                    </TouchableOpacity>
                    <Text style={styles.productCounterText}>{item.Quantity || 1}</Text>
                    <TouchableOpacity style={styles.counterViews} onPress={() => this.counterHandler(I18n.t('lead_gen.lead_increment_counter'), index)}>
                        <AddProduct width={16} height={16} fill={Colors.rgb_4a4a4a} />
                    </TouchableOpacity>
                </View>
            )
        }
        return null
    }

    productItemCell(item, index){
        return(
            <View style={styles.productItemView}>
                {this.renderProductWithCheckBox(item, index)}
                {this.renderProductCount(item, index)}
            </View>
        )
    }

    renderProductSoldModal() {
        const { totalProducts, showProductsModal,  } = this.state
        if (totalProducts.length === 0) return
        return (
            <Modal
                transparent
                hardwareAccelerated
                visible={showProductsModal}
                onRequestClose={this.onAddProductTapped}>
                <View style={styles.modal_scrim}>
                    <View style={styles.modal_window}>
                        <View style={styles.selectProductSoldModalText}>
                            <Text style={styles.selectProductTitle}>{I18n.t('lead_gen.select_products_sold')}</Text>
                        </View>
                        <View style={styles.separator}/>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={totalProducts}
                            renderItem={({ item, index}) => this.productItemCell(item, index)}
                            extraData={this.state}
                            ListHeaderComponent={<View style={styles.productListExtra} />}
                            ListFooterComponent={<View style={styles.productListExtra} />}/>
                        <View style={styles.separator}/>
                        <TouchableOpacity style={styles.button_container} onPress={this.onAddProductTapped}>
                            <Text style={styles.button}>{I18n.t('lead_gen.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    renderSoldProductItem(item, index){
        if (item.Quantity > 0) {
            const soldText = `${item.Quantity} - ${item.Category}`
            return (
                <Text style={styles.productSoldListItem}>{soldText}</Text>
            )
        }
    }

    renderProductSoldList() {
        return (
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                style={styles.productSoldListView}
                data={this.state.productSold}
                renderItem={({item, index}) => this.renderSoldProductItem(item, index)}
                extraData={this.state} />
        )
    }

    render() {
        const { statusDescription, isLoading } = this.state
        const { params } = this.props.navigation.state
        const lead = params.leadDetails
        const showProductSold = params.showProductsSold
        return(
        <View style={styles.baseView}>
            <View style={styles.textInputView}>
                <LeadStatus
                    lead={lead}
                    disabled
                    statusDotStyle={styles.statusDot}
                    statusTextStyle={styles.statusText}
                    isTextCapital={false}
                />
                <View style={styles.textInputOuterView}>
                    <TextInput 
                        style={styles.multilineTextInput} 
                        placeholder={I18n.t('lead_gen.lead_description_placeholder')} 
                        multiline={true}
                        maxLength={200}
                        value={statusDescription}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(val) => this.handleTextChange(val)}
                        placeholderTextColor={Colors.rgb_9b9b9b}/>
                </View>
            </View>
            { showProductSold ? <View style={styles.productSoldView}>
                <Text style={styles.productSoldText}>{I18n.t('lead_gen.products_sold')}</Text>
                <TouchableOpacity style={styles.addBtnView} onPress={this.onAddProductTapped}>
                    <Text style={styles.addText}>{I18n.t('lead_gen.add')}</Text>
                </TouchableOpacity>
            </View> : null}
            { showProductSold ? <View style={styles.productSoldSeparator}/> : null}
            {this.renderProductSoldModal()}
            {this.renderProductSoldList()}
            {isLoading ? <View style={styles.loading_spinner_container}><LoadingSpinner /></View> : null}
        </View>
        )
    }

}

const mapStateToProps = (state) => ({
    productsCategories: state.remoteConfig.lead_product_categories,
    leadUpdateData: state.leads.leadUpdateData,
    isLeadUpdateStatusFailed: state.leads.isLeadUpdateStatusFailed
})

const mapDispatchToProps = (dispatch) => ({
    updateLeadStatus: (form) => dispatch(LeadsActions.updateLeadStatus(form)),
    shouldRefreshLeads: (shouldRefresh) => dispatch(LeadsActions.shouldRefreshLeads(shouldRefresh)),
    isUpdatingLeadStatus: (isUpdating) => dispatch(LeadsActions.isUpdatingLeadStatus(isUpdating))
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadStatusUpdateScreen);