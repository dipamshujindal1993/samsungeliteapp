import { StyleSheet } from 'react-native'
import {
    Colors,
  } from '@resources'

export default StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 26,
    right: 22,
    borderRadius: 28,
    backgroundColor: Colors.rgb_4297ff,
    elevation: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: Colors.rgb_000000,
    shadowOpacity: .2,
    shadowRadius: 2
  },
})
