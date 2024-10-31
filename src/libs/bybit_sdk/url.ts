// https://bybit-exchange.github.io/docs/v5/ws/connect

export const BASE_URL_API_MAINNET_1 = 'https://api.bybit.com'
export const BASE_URL_API_MAINNET_2 = 'https://api.bytick.com'
export const BASE_URL_API_MAINNET_3 = 'https://api.bybit.nl' // For Netherland users.
export const BASE_URL_API_MAINNET_4 = 'https://api.byhkbit.com' // For Hong Kong users.
export const BASE_URL_STREAM_MAINNET = 'wss://stream.bybit.com'

export const BASE_URL_API_TESTNET = 'https://api-testnet.bybit.com'
export const BASE_URL_STREAM_TESTNET = 'wss://stream-testnet.bybit.com'

export const BASE_URL_API_DEMO_TRADING = 'https://api-demo.bybit.com'
export const BASE_URL_STREAM_DEMO_TRADING = 'wss://stream-demo.bybit.com'

export const HEADER_X_BAPI_API_KEY = 'X-BAPI-API-KEY' // API key.
export const HEADER_X_BAPI_TIMESTAMP = 'X-BAPI-TIMESTAMP' // UTC timestamp in milliseconds.
export const HEADER_X_BAPI_SIGN = 'X-BAPI-SIGN' // A signature derived from the request's parameters.
export const HEADER_X_Referer = 'X-Referer' // The header for broker users only.
export const HEADER_Referer = 'Referer' // The header for broker users only.
