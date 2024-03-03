import { Platform } from 'react-native'
import Colors from './Colors'
import Fonts from './Fonts'

const ApplicationStyles = {
    screen: {
        mainContainer: {
            flex: 1,
            backgroundColor: Colors.white,
        },
    },

    // used for Pro Device Tracking, Dashboard Reports cards
    cardStyle1: {
        container: {
            flexDirection: 'row',
            marginTop: 5,
            marginBottom: 13,
            marginHorizontal: 24,
            minHeight: 116,
        },

        title: {
            ...Fonts.style.bold_16,
            color: Colors.rgb_4a4a4a,
        },
    },

    // used for Learning, Promos, News cards
    noBoxCard: {
        container: {
            marginTop: 5,
            marginBottom: 13,
        },

        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        title: {
            flex: 1,
            ...Fonts.style.bold_16,
            color: Colors.rgb_4a4a4a,
            marginLeft: 24,
        },

        btnSeeAll: {
            paddingHorizontal: 23,
            paddingVertical: 8,
        },

        btnSeeAllText: {
            ...Fonts.style.bold_14,
            color: Colors.rgb_4297ff,
        },
    },

    // used for Spot Rewards, Merchandising cards
    shadowBoxCard: {
        container: {
            marginTop: 5,
            marginBottom: 13,
            marginHorizontal: 24,
            borderRadius: 8,
            backgroundColor: Colors.rgb_f9f9f9,
            shadowColor: Colors.rgb_b9b9b9,
            shadowOpacity: 1,
            shadowRadius: 4,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            ...Platform.select({
                android: {
                    elevation: 4,
                },
            }),
            minHeight: 116,
        },

        title: {
            ...Fonts.style.bold_16,
            color: Colors.rgb_4a4a4a,
        },
    },

    widget: {
        container: {
            height: 146,
            marginTop: 13,
            marginBottom: 13,
            marginHorizontal: 24,
            borderRadius: 8,
            backgroundColor: Colors.rgb_f9f9f9,
            shadowColor: Colors.rgb_b9b9b9,
            shadowOpacity: 1,
            shadowRadius: 4,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            ...Platform.select({
                android: {
                    elevation: 4,
                },
            }),
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 15,
            paddingHorizontal: 24,
        }
    },

    backIcon: {
        ...Platform.select({
            ios: {
                margin: 12,
            },
        }),
    },

    titleStyle: {
        ...Platform.select({
            android: {
                paddingLeft: 24,
            }
        }),
    },

    noShadowHeaderStyle: {
        ...Platform.select({
            ios: {
                borderBottomWidth: 0,
            },
            android: {
                elevation: 0,
            }
        }),
    },

    tabBarStyle: {
        marginHorizontal: 24,
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                shadowColor: Colors.transparent,
            },
            android: {
                elevation: 0,
            }
        }),
    },

    tabBarIndicatorStyle: {
        backgroundColor: Colors.transparent,
    },

    tabStyle: {
        minWidth: 81,
        height: 27,
        borderRadius: 13.5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    activeTabStyle: {
        backgroundColor: Colors.rgb_4297ff,
    },

    labelStyle: {
        ...Fonts.style.regular_12,
    },

    activeLabelStyle: {
        color: Colors.white,
    },

    inactiveLabelStyle: {
        color: Colors.rgb_9b9b9b,
    },
}

export default ApplicationStyles