const APP_SCHEME = 'samsungelite://'

const TAB_IDS = {
  TAB_HOME: 10,
  TAB_SALES_TRACKING: 20,
  TAB_LEADS: 30,
  TAB_LEARN: 40,
  TAB_REWARDS: 50,
  TAB_COMMUNITY: 60,
  TAB_HELP: 70,
  TAB_ACTIVITIES: 10,
  TAB_COURSES: 20,
  TAB_DEMOS: 30,
  TAB_RESOURCES: 40,
  TAB_ARTICLES: 50,
  TAB_POINTS: 10,
  TAB_REFERRALS: 20,
  TAB_BADGES: 30,
  TAB_SPAY: 40,
  TAB_LEADERBOARDS: 50,
}

const constants = Object.assign(TAB_IDS, {
  TERMS_CONDITIONS: 'Terms and Conditions',
  EMAIL_PATTERN: /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/,
  PASSWORD_PATTERN: /(?=.*\d).{8,}/,
  SPACES_PATTERN: /\s/g,
  PHONE_PATTERN: /^\d{10}$/,
  ZIP_PATTERN: /\d{5}/,
  ERROR_TYPES: {
    NETWORK: 'network',
    MAINTENANCE: 'maintenance',
    GEOFENCING: 'geofencing',
    ERROR_LOADING_HISTORY: 'Unable to load history. Try later',
  },
  S3_BASE_URL: 'https://s3.amazonaws.com/proelite-client-static',
  GRANT_TYPE: {
    AUTHORIZATION_CODE: 'authorization_code',
    CLIENT_CREDENTIALS: 'client_credentials',
    PASSWORD: 'password',
    REFRESH_TOKEN: 'refresh_token',
  },
  STORE_URLS: {
    APP_STORE: 'itms-apps://itunes.apple.com/us/app/id1339400116?mt=8',
    PLAY_STORE: 'https://play.google.com/store/apps/details?id=com.samsung.carrier.elite',
  },
  HOME_TABS: 'home_tabs',
  DEFAULT_HOME_TABS: [
    {
      id: TAB_IDS.TAB_HOME,
      title: 'Home',
    },
    {
      id: TAB_IDS.TAB_HELP,
      title: 'Help',
    },
  ],
  LEARN_TABS: 'learn_tabs',
  DEFAULT_LEARN_TABS: [
    {
      id: TAB_IDS.TAB_DEMOS,
      title: 'Demos',
    },
    {
      id: TAB_IDS.TAB_RESOURCES,
      title: 'Resources',
    },
  ],
  DEFAULT_SEARCH_TABS: [
    TAB_IDS.TAB_ARTICLES,
    TAB_IDS.TAB_RESOURCES,
    TAB_IDS.TAB_COURSES,
  ],
  REWARD_WARNFLAG: {
    LAST_CHANCE: 'rewards.last_chance',
    LIMITED_OFFER: 'rewards.limited_offer',
    OUT_OF_STOCK: 'rewards.out_of_stock',
  },
  REWARD_TYPES: {
    REDEMPTION: 'REDEMPTION',
    SWEEPSTAKES: 'SWEEPSTAKES',
    INSTANT_WHEEL: 'INSTANT_WIN_WHEEL',
    GIFT_CARD: "GIFT_CARD",
    BLUEDOOR: "BLUEDOOR",
  },
  REWARD_STATUS: {
    PENDING: 'PENDING'
  },
  REWARD_PARTICIPATION_RESULT: {
    WINNING: 'WINNING',
    NON_WINNING: 'NON_WINNING',
    COMPLETED: 'COMPLETED',
    PENDED: 'PENDED',
  },
  REWARD_PARTICIPATION_RESULT_TYPE: {
    PRODUCT: 'PRODUCT',
    POINT: 'POINT',
  },
  TRANSACTION_TYPE: {
    ACTIVITY: 'ACTIVITY',
    COURSES: 'COURSES',
    QUIZ_BONUS_POINTS: 'BONUS',
    REWARD_REDEMPTION: 'REWARD',
    SPAY_ACTIVATIONS: 'S_PAY',
    SPOT_REWARD: 'SPOT_REWARD',
    ADMIN_ADJUSTMENT: 'ADMIN',
    EXPIRED: 'EXPIRE',
  },
  TRANSACTION_SUB_TYPE: {
    ACTIVITY: {
      CAROUSEL: 'carousel',
      QUIZ: 'quiz',
      POLL: 'poll',
      VIDEO: 'video',
      SURVEY: 'survey',
      HYBRID: 'hybrid'
    }
  },
  ACTIVITY_STATUSES: {
    ATTENDED: 'Attended',
    IN_PROGRESS: 'Inprogress'
  },
  ACTIVITIES: [
    'Polls or Surveys',
    'Quick Assessment',
    'Simplified Curriculum',
    'Video'
  ],
  ACTIVITY_TYPES: {
    ARTICLE: 'SEA_Article',
    DOCUMENT: 'Document',
    FAQ: 'SEA_FAQ',
    GAME: 'SEA_Game',
    POLLS_OR_SURVEYS: 'Polls or Surveys',
    PROMO: 'SEA_Promo',
    QUICK_ASSESSMENT: 'Quick Assessment',
    SIMPLIFIED_CURRICULUM: 'Simplified Curriculum',
    VIDEO: 'Video',
    HYBRID: 'Hybrid'
  },
  FILE_EXTENSIONS: {
    DOCUMENT: 'docx',
    PDF: 'pdf'
  },
  QUESTION_TYPES: {
    TRUE_FALSE: 'TrueFalse',
    MULTIPLE_CHOICE: 'MultipleChoice',
    MULTIPLE_SELECT: 'MultipleSelect',
    DESCRIPTIVE: 'Descriptive',
    RANKING: 'Ranking',
  },
  PLAYER_STATES: {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    ENDED: 'ENDED',
  },
  VIDEO_CONFIG: {
    COOKIE_NAME: 'Authorization_Cookie',
    COOKIE_PATH: '/',
    FORWARD: 'FORWARD',
    REWIND: 'REWIND',
    VIDEO_FWD_RWD_SECS: 10,
    HIDE_CONTROLS_SECS: 5000,
    REGEX_VIMEO_ID: /\w\/(\d+)/,
    VIMEO: 'vimeo',
    MP4: 'mp4'
  },
  TOPIC_TYPES: {
    DEMOS: 'Demos',
    MERCHANDISING: 'Merchandising',
    RESOURCES: 'Resources',
    REWARDS: 'Rewards',
  },
  RESOURCE_TYPES: {
    DOCUMENT: 'Document',
    FOLDER: 'Folder',
    IMAGE: 'Image',
    PDF: 'PDF',
    PHOTO: 'Photo',
    VIDEO: 'Video',
  },
  COURSE_STATUSES: {
    NO_STATUS: -1,
    REGISTERED: 0,
    CANCELLED: 1,
    ON_WAITING: 2,
    COMPLETED: 4,
    NO_SHOW: 5,
    WAIVED: 9,
    IN_PROGRESS: 10
  },
  SWEEPSTAKES_MAX_ENTRIES: 10,
  HTML_PATTERN: /<[a-zA-Z][^<>]*>/,
  URL_PATTERN: /((([A-Za-z]{2,9}:(?:\/){2,3}?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi,
  DATA_SCHEME: 'data:',
  HREF_PATTERN: /href=(["'])(.*?)\1/g,
  DEEPLINK_PREFIX: 'https://elitesamsung.com/deeplink/',
  APP_SCHEME: APP_SCHEME,
  OPEN_EXTERNAL: `${APP_SCHEME}openexternal`,
  OPEN_WEBVIEW: `${APP_SCHEME}openwebview`,
  OPEN_SCREEN: `${APP_SCHEME}open`,
  HASH_URL: '#url=',
  HASH_SCREEN: '#screen=',
  LEADERBOARD_PERIOD: {
    THIS_MONTH: 'THIS_MONTH',
    THIS_WEEK: 'THIS_WEEK',
    ALL_TIME: 'ALL_TIME',
  },
  LEADERBOARD_FILTER: {
    ALL: 'ALL',
    REGION: 'REGION',
    DISTRICT: 'DISTRICT',
    TERRITORY: 'TERRITORY',
  },
  SURVEY_TEXT_LIMIT: 250,
  CONTEXT: {
    LEARNING: 'Learning',
  },
  FILE_MAX_SIZE_TO_UPLOAD: 15,
  CREATE_POST_MAX_FILE: 3,
  CREATE_COMMENT_MAX_FILE: 1,
  POST_COMMUNITY_MORE_OPTIONS: {
    EDIT_POST: 'EDIT',
    DELETE_POST: 'DELETE',
    EDIT_COMMENT: 'EDIT COMMENT',
    DELETE_COMMENT: 'DELETE COMMENT'
  },
  APP_STORE_ID: {
    IOS: '1339400116',
  },
  TASKS_TYPE: {
    TASK_DUE: "task_due",
    TASK_ASSIGNED: "task_assigned"
  },
  NOTIFICATIONS_TYPE: {
    TAX_COMPLIANCE: "tax_compliance",
    REWARD_REDEMPTION: "reward_redemption",
    EXPIRING_POINTS: "expiring_points",
    COURSE_DUE: "course_due",
    MISSION_DUE: "mission_due",
    MISSION_ASSIGNED: "mission_assigned",
    PRIZE_WON: "prize_won",
    NEW_REWARD_ADDED: "new_reward_added",
    COURSE_ASSIGNED: "course_assigned",
    FSM_SPOT_REWARD: "fsm_spot_reward",
    CAMPAIGN: "campaign"
  },
  PRIVACY_POLICY_URL: "https://www.samsung.com/us/account/privacy-policy/",
  SEARCH_TAB_TYPES: {
    ACTIVITIES: "Activities",
    COURSES: "Courses",
    ARTICLES: "Articles",
    RESOURCES: "Resources"
  },
  SPAY_HISTORY_TYPE: {
    CODE_ENTERED: "CODE_ENTERED",
    SPAY_CARD_ADDED: "SPAY_CARD_ADDED",
    SPAY_TXN_MADE: "SPAY_TXN_MADE",
  },
  POINTS_HISTORY_TABS: {
    ACTIVITIES: "Activities",
    COURSES: "Courses",
    REWARDS: "Rewards",
    Admin: "Admin",
  },
  POINTS_HISTORY_CATEGORIES: {
    ACTIVITY: "ACTIVITY",
    COURSES: "COURSES",
    QUIZ_BONUS_POINTS: "BONUS",
    SALES_TRACKING: "DEVICE_SALES",
    ENGAGEMENT: "ENGAGEMENT",
    REWARD_REDEMPTION: "REWARD",
    S_PAY_ACTIVIATIONS: "S_PAY",
    SPOT_REWARD: "SPOT_REWARD",
    ADMIN_ADJUSTMENT: "ADMIN",
    EXPIRED: "EXPIRE",
    STREAK_CAMPAIGN: "CAMPAIGN",
    REDEMPTION_CANCELLED: "CANCEL",
  },
  POINTS_HISTORY_TYPE: {
    EARN: "EARN",
    USE: "USE",
    CANCEL: "CANCEL",
    DEDUCT: "DEDUCT",
    EXPIRE: "EXPIRE",
    ADD: "ADD",
  },
  LEARNING_ACTIVITIES_STATUS: {
    IN_PROGRESS: "In Progress"
  },
  SORT_BY: {
    CREATED_DATE: "CreatedDate"
  },
  HOME_LEARNING_ITEM_COUNT: 3,
  SCREEN_NAMES: {
    REDEMPTION_SCREEN: "RedemptionScreen"
  },
  EMPLOYEE_TYPES: {
    ADVOCATE: 'SEA_Advocate',
  },
  CAROUSEL_TYPES: {
    GAME: 'Game',
    MISSION: 'Mission',
  },
  NEWS_CATEGORIES: {
    PRO: 'SEA_Pro',
  },
  PRO_CONTENT: 1,
  SALES_TRACKING: {
    TOTAL: 'total',
    WEEKLY: 'weekly',
    STATUS_PROGRESS: 'PROGRESS',
  },
  TASKS_ACTION_TYPES: {
    UPLOAD_DOCUMENT: "NEW_HIRE_FILE_UPLOAD",
    COMMENT_ON_A_POST: "NEW_HIRE_SOCIAL_ACTIVITY",
    ADHOC_ACTION_WITH_USER_CONFIRMATION: "NEW_HIRE_BLANK_ACTIVITY"
  },
  INITIATIVE_TYPES: {
    TASK: 'Task',
    MISSION: 'Mission',
  },
  INITIATIVE_STATUS: {
    COMPLETE: 2,
  },
  MODALITY_FILTERS: {
    ARTICLES: 'SEA_Articles',
    COURSES: 'SEA_Courses',
    ACTIVITY: 'SEA_Activity',
    RESOURCE: 'SEA_Resource',
  },
  CONTENT_TYPES: {
    SLIDE: 'SEA_Slide',
    CAROUSEL: 'SEA_Carousel',
    HYBRID: 'SEA_Hybrid',
    POLL: 'SEA_Poll',
    QUIZ: 'SEA_Quiz',
    VIDEO: 'SEA_Video',
    PDF: 'SEA_PDF',
    DOCUMENT: 'SEA_Document',
    PHOTO: 'SEA_Photo',
    SURVEY: 'SEA_Survey',
    SCORM: 'SEA_SCORM'
  },
  SCORM: {
    SCORM_TITLE: 'SCORM',
    EXIT_URL: '/learning/core/player/closecourse',
    CORE: 'core',
    SCORM_URL: '{0}/broker/Account/OAuthToBrowserSession.ashx?whr=urn:sumtotalsystems.com&wtrealm={1}&return_url={2}'
  }
})

export default constants