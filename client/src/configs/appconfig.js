export const APP_NAME = 'Shift a Life';
export const SEPARATOR = ' | ';
export const APP_SEP = APP_NAME + SEPARATOR;

// export const CONTRACT = "shiftalife.testnet" // Old contract,
export const CONTRACT = "mvua.testnet"

export const CONTRACT_TOKEN_VIEW_METHODS = []

export const CONTRACT_VIEW_METHODS = [
  "get_campaign",
  "get_campaigns",
  "filter_campaigns",
  "get_causes",
  "get_event", 
  "get_events",
  "filter_events",
  "get_tokens",
  "get_campaign_donations",
  "get_event_donations",
  "get_donations_stats"
].concat(CONTRACT_TOKEN_VIEW_METHODS);

export const CONTRACT_TOKEN_CHANGE_METHODS = []

export const CONTRACT_CHANGE_METHODS = [
  "add_token",
  "create_campaign",
  "add_campaign_partner",
  "campaign_vote",
  "create_cause",
  "create_event",
  "add_event_partner",
  "event_vote",
  "near_donation",
  "register_as_partner"
].concat(CONTRACT_TOKEN_CHANGE_METHODS);


export const WHITELISTEDTOKENS = ['usdn.testnet', 'usdt.testnet', 'wrap.testnet', 'dai.fakes.testnet']
export const WHITELISTEDTOKENS_ = [
  {
    name: 'USN',
    symbol: 'USN',
    decimals: 18,
    address: "usdn.testnet",
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    address: "usdt.testnet",
  },
  {
    name: 'WRAPPED NEAR',
    symbol: 'WRAPPED NEAR',
    decimals: 24,
    address: "wrap.testnet",
  },
  {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    address: "dai.fakes.testnet",
  }
]

export const TOKEN_DETAILS = {
  'usdn.testnet': {
    name: 'USN',
    symbol: 'USN',
    decimals: 18,
    address: "usdn.testnet",
  },
  'usdt.testnet': {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    address: "usdt.testnet",
  },
  'wrap.testnet': {
    name: 'WRAPPED NEAR',
    symbol: 'WRAPPED NEAR',
    decimals: 24,
    address: "wrap.testnet",
  },
  'dai.fakes.testnet': {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    address: "dai.fakes.testnet",
  }
}


export const NEAR_OBJECT = { name: 'Near', symbol: 'NEAR', address: 'near', icon: "/near/no_margin/icon_nm.png", decimals: 24 }
export const ANY_TOKEN = { name: 'Any', symbol: 'Any', address: 'any', icon: "any", decimals: 0 }
