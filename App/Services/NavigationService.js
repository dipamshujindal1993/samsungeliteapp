import { NavigationActions, StackActions } from 'react-navigation'

var _navigator

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  )
}

function reset(routeName, params) {
  _navigator.dispatch(StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({
      routeName,
      params
    })],
  })
  )
}

function replace(routeName, params) {
  _navigator.dispatch(
    StackActions.replace({
      routeName,
      params,
    })
  )
}

export default {
  setTopLevelNavigator,
  navigate,
  reset,
  replace,
}