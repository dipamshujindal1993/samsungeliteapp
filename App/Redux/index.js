import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import configureStore from './CreateStore'
import rootSaga from '@sagas/'
import ReduxPersist from '@config/ReduxPersist'

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  remoteConfig: require('./RemoteConfigRedux').reducer,
  nav: require('./NavigationRedux').reducer,
  app: require('./AppRedux').reducer,
  user: require('./UserRedux').reducer,
  rewards: require('./RewardsRedux').reducer,
  activities: require('./ActivitiesRedux').reducer,
  communities: require('./CommunitiesRedux').reducer,
  assessments: require('./AssessmentsRedux').reducer,
  notifications: require('./NotificationsRedux').reducer,
  search: require('./SearchRedux').reducer,
  leads: require('./LeadsRedux').reducer,
})

export default () => {
  var finalReducers = reducers
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig
    finalReducers = persistReducer(persistConfig, reducers)
  }

  var { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('@sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware(newYieldedSagas)
      })
    })
  }

  return store
}
