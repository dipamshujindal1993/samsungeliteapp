import firebase from 'react-native-firebase'
import Config from 'react-native-config'

export function getRemoteConfigValues() {
  try {
    if (Config.ENV !== 'prod') {
      firebase.config().enableDeveloperMode()
    }

    return firebase.config().fetch()
      .then(() => firebase.config().activateFetched())
      .then(() => firebase.config().getValues([
        'badge_descriptions',
        'otp_expiration_time',
        'w9_info',
        'lead_status_help',
        'lead_sms_text',
        'lead_product_categories',
      ]))
      .then((remoteConfigValues) => {
        var remoteConfigs = {}
        Object.keys(remoteConfigValues).forEach(key => {
          remoteConfigs[key] = remoteConfigValues[key].val()
        })
        return remoteConfigs
      })
  } catch (error) {
    // failed to get remote config
  }
}

export async function queryDb(key) {
  try {
    const snapshot = await firebase.database().ref(key).once('value')
    return snapshot.val()
  } catch (error) {
    // failed to query firebase database
  }
}