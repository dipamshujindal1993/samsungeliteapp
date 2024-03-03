import {
    PermissionsAndroid
} from 'react-native'

/**
   * @param permission - Permissions that require prompting the user
   * @param rationale - The optional rationale argument will show a dialog prompt only if necessary - otherwise the normal permission prompt will appear.
   * @return {bool} result of permission
**/
export async function checkOrRequestPermission(permission, rationale) {
    try {
        const grantedCheck = await PermissionsAndroid.check(permission)
        if (grantedCheck) {
            return true
        }
        const grantedAsk = await PermissionsAndroid.request(permission)
        if (grantedAsk === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}