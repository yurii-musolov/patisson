/* eslint-disable @typescript-eslint/no-unused-vars */
import { toKLine, toTicker, toTrade } from './api'
import type {
  KLineRaw,
  Response,
  ResultList,
  ServerTime,
  TickerRaw,
  TradeRaw,
} from './api'
import type { Category, Interval, KLine, Ticker, Trade } from './model'

// Candlestick, orderbook, ticker, platform transaction data, underlying financial rules, risk control rules.
const PATH_MARKET_TIME = '/v5/market/time'
const PATH_MARKET_KLINE = '/v5/market/kline'
const PATH_MARKET_MARK_PRICE_KLINE = '/v5/market/mark-price-kline'
const PATH_MARKET_INDEX_PRICE_KLINE = '/v5/market/index-price-kline'
const PATH_MARKET_PREMIUM_INDEX_PRICE_KLINE =
  '/v5/market/premium-index-price-kline'
const PATH_MARKET_ORDERBOOK = '/v5/market/orderbook'
const PATH_MARKET_TICKERS = '/v5/market/tickers'
const PATH_MARKET_FUNDING_HISTORY = '/v5/market/funding/history'
const PATH_MARKET_RECENT_TRADE = '/v5/market/recent-trade'
const PATH_MARKET_OPEN_INTEREST = '/v5/market/open-interest'
const PATH_MARKET_HISTORICAL_VOLATILITY = '/v5/market/historical-volatility'
const PATH_MARKET_INSURANCE = '/v5/market/insurance'
const PATH_MARKET_INSTRUMENTS_INFO = '/v5/market/instruments-info'
const PATH_MARKET_RISK_LIMIT = '/v5/market/risk-limit'
const PATH_MARKET_DELIVERY_PRICE = '/v5/market/delivery-price'

export type Config = {
  baseUrl: string
}

export class Market {
  cfg: Config

  constructor(cfg: Config) {
    this.cfg = cfg
  }

  /**
   * getBybitServerTime
   */
  public async getBybitServerTime(): Promise<ServerTime> {
    // TODO: Add error handling.
    const response = await fetch(this.cfg.baseUrl + PATH_MARKET_TIME).then<
      Response<ServerTime>
    >(response => response.json())
    return response.result
  }

  /**
   * getKline
   *
   * Query for historical klines (also known as candles/candlesticks). Charts are returned in groups based on the requested interval.
   */
  public async getKline(params: GetKlineParameters): Promise<Array<KLine>> {
    // TODO: Use `qs` package.
    // TODO: Add error handling.
    let query = `?category=${params.category}`
    if (params.symbol) query += `&symbol=${params.symbol}`
    if (params.interval) query += `&interval=${params.interval}`
    if (params.start) query += `&start=${params.start}`
    if (params.end) query += `&end=${params.end}`
    if (params.limit) query += `&limit=${params.limit}`

    const response = await fetch(
      this.cfg.baseUrl + PATH_MARKET_KLINE + query,
    ).then<Response<ResultList<KLineRaw>>>(response => response.json())
    return response.result.list.map(toKLine)
  }

  /**
   * getTickers
   *
   * Query for the latest price snapshot, best bid/ask price, and trading volume in the last 24 hours.
   */
  public async getTickers(
    params: GetTickersParameters,
  ): Promise<Array<Ticker>> {
    // TODO: Use `qs` package.
    // TODO: Add error handling.
    let query = `?category=${params.category}`
    if (params.symbol) query += `&symbol=${params.symbol}`
    if (params.baseCoin) query += `&baseCoin=${params.baseCoin}`
    if (params.expDate) query += `&expDate=${params.expDate}`

    const response = await fetch(
      this.cfg.baseUrl + PATH_MARKET_TICKERS + query,
    ).then<Response<ResultList<TickerRaw>>>(response => response.json())
    return response.result.list.map(toTicker)
  }

  /**
   * getPublicRecentTradingHistory
   *
   * Query recent public trading data in Bybit.
   */
  public async getPublicRecentTradingHistory(
    params: GetPublicRecentTradingHistory,
  ): Promise<Array<Trade>> {
    // TODO: Use `qs` package.
    // TODO: Add error handling.
    let query = `?category=${params.category}`
    if (params.symbol) query += `&symbol=${params.symbol}`
    if (params.baseCoin) query += `&baseCoin=${params.baseCoin}`
    if (params.optionType) query += `&optionType=${params.optionType}`
    if (params.limit) query += `&limit=${params.limit}`

    const response = await fetch(
      this.cfg.baseUrl + PATH_MARKET_RECENT_TRADE + query,
    ).then<Response<ResultList<TradeRaw>>>(response => response.json())
    return response.result.list.map(toTrade)
  }
}

export type GetKlineParameters = {
  category?: Category // `linear` by default.
  symbol: string // Symbol name, like BTCUSDT, uppercase only.
  interval: Interval // Kline interval. 1,3,5,15,30,60,120,240,360,720,D,M,W.
  start?: number // The start timestamp (ms).
  end?: number // The end timestamp (ms).
  limit?: number //Limit for data size per page. [1, 1000]. Default: 200.
}

export type GetTickersParameters = {
  category: Category // Product type. spot,linear,inverse,option.
  symbol?: string // Symbol name, like BTCUSDT, uppercase only.
  baseCoin?: string // Base coin, uppercase only. Apply to option only.
  expDate?: string // Expiry date. e.g., 25DEC22. Apply to option only.
}

export type GetPublicRecentTradingHistory = {
  category: Category // Product type. spot,linear,inverse,option
  symbol?: string // Symbol name, like BTCUSDT, uppercase only. Required for spot/linear/inverse. Optional for option.
  baseCoin?: string // Base coin, uppercase only. Apply to option only.
  optionType?: string // Option type. Call or Put. Apply to option only.
  limit?: number // Limit for data size per page. (spot: [1,60], default: 60), (others: [1,1000], default: 500).
}
