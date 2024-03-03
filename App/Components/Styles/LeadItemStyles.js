import { StyleSheet, Platform } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  leadContainer: {
    flex: 1,
    backgroundColor: Colors.rgb_fdfdfd,
    flexDirection: 'row',
    minHeight: 137, 
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    shadowColor: Colors.rgb_b9b9b9,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    ...Platform.select({
      android: {
          elevation: 4,
      },
    }),
  },
  leftBox: {
    flex: 7,
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 18,
    paddingBottom: 21,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  phoneNumber: {
    color: Colors.rgb_9b9b9b,
    ...Fonts.style.regular_12,
  },
  callView: {   
    width: 64, 
    height: 29, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 14.5,
    backgroundColor: Colors.rgb_4297ff 
  },
  call: {
    color: Colors.white,
    ...Fonts.style.regular_12,
  },
  smsView: { 
    width: 64, 
    height: 29, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 14.5, 
    marginLeft: 11, 
    borderWidth: 0.5, 
    borderColor: Colors.rgb_4a4a4a 
  },
  sms: {
    color: Colors.rgb_4a4a4a,
    ...Fonts.style.regular_12,
  },
  leadId: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_9b9b9b,
    paddingTop: 5,
  },
  name: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_2a2e32,
  },
  productName: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_4a4a4a,
    paddingBottom: 10,
    paddingTop: 3,
  },
  status: {
    ...Fonts.style.bold_11,
    color: Colors.rgb_4a4a4a,
    paddingRight: 10
  },
  statusContainer: {
    flexDirection: 'row-reverse',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
})
