import { StyleSheet, Platform } from 'react-native'
import {
  Colors,
  Fonts
} from '@resources'

export default StyleSheet.create({
  
  background: {
    flex: 1,
    backgroundColor: Colors.rgba_0000008a,
    justifyContent: 'flex-end'
  },

  ViewContainer: {
    paddingTop: 24,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: Colors.white,
    shadowOffset: { width: 0, height: -2 },
    shadowColor: Colors.rgba_00000033,
    shadowOpacity: 0.8,
    shadowRadius: 4
  },

  inputContainer: {
    minHeight: 182,
  },

  messageContainer: {
    marginTop: 21,
    marginLeft: 4,
    maxHeight: 150
  },

  titleContainer: {
    flexDirection: "row",
    paddingLeft: 24,
    paddingRight: 28,
  },

  title: {
    flex: 1,
    ...Fonts.style.bold_14,
    color: Colors.rgb_4a4a4a,
  },

  hideModal: {
    alignSelf: 'flex-end',
    padding: 16,
    paddingRight:24
  },

  postView: {
    alignSelf: 'flex-end',
    paddingLeft: 16,
  },

  spinner: {
    backgroundColor: Colors.white,
  },

  attachmentIconContainer: {
    marginRight: 24, 
    marginTop: 14
  },

  bottomView: {
    flexDirection: 'row',
    minHeight: 48, 
    backgroundColor: Colors.rgb_fafafa,
    alignItems:'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  },

  insetImageContainer: {
    flexDirection: 'row'
  },

  insertImage: {
    marginLeft: 16,
    ...Fonts.style.regular_14,
    color: Colors.rgb_a3a3a3,
  },

  sizeLimit: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_4a4a4a,
  },

  sizeLimitContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  CTA: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_4297ff,
  },

  CTADisable: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_b9b9b9,
  },

  pickerBackground: {
    flex: 1,
    backgroundColor: Colors.rgba_252525CC,
    justifyContent: 'center',
  },

  pickerView: {
    marginLeft: 36,
    marginRight: 41,
    paddingTop: 29,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 14,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6
  },

  galleryPickerTitle: {
    ...Fonts.style.regular_20,
    color: Colors.rgb_4a4a4a,
    letterSpacing: 0.11,
    marginBottom: 15
  },

  galleryPickerOption: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_4a4a4a,
    textAlign: 'left',
    paddingVertical: 15
  },

  galleryPickerCancel: {
    ...Fonts.style.medium_14,
    color: Colors.rgb_4297ff,
    textAlign: 'right',
    paddingVertical: 15,
    letterSpacing: 1.25
  },

  thumbnailViewContainer: {
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: Colors.rgb_fafafa,
    minHeight: 76
  },

  thumbnailView: {
    justifyContent: 'center', 
    alignItems:'center',
  },

  itemImage: {
    height: 60,
    width: 60,
    marginHorizontal: 4,
    borderRadius: 12,
  },

  commonIcon: {
    position: "absolute", 
    top: -6, 
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },

  removeIconView: {
    backgroundColor: Colors.white,
    borderColor: Colors.rgb_0074d4,
    borderWidth: 1,
  },

  failedIconView: {
    backgroundColor: Colors.rgb_ff4339,
  },

  failed_upload: {
    ...Fonts.style.medium_11,
    color: Colors.rgb_ff4339,
    textAlign: 'center',
  },

})
