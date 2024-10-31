import {
  ActionType,
  Interval,
  Side,
  TickDirection,
  actionTypeFromStr,
  intervalFromStr,
  sideFromStr,
  tickDirectionFromStr,
} from './model'
import type {
  Category,
  KLine,
  KlineMsg,
  Message,
  Ticker,
  TickerLinearInverseMsg,
  TickerOptionMsg,
  TickerSpotMsg,
  Trade,
  TradeMsg,
} from './model'

export type Response<T> = {
  retCode: number
  retMsg: string
  result: T
  retExtInfo: RetExtInfo
  time: number // timestamp (milliseconds)
}

export type ResultList<T> = {
  symbol?: string
  category: Category
  list: Array<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RetExtInfo = Record<string, any>

export type ServerTime = {
  timeSecond: string // Bybit server timestamp (sec)
  timeNano: string // Bybit server timestamp (nano)
}

export type KLineRaw = [
  string, // `startTime` Start time of the candle (ms)
  string, // `openPrice` Open price
  string, // `highPrice` Highest price
  string, // `lowPrice` Lowest price
  string, // `closePrice` Close price. Is the last traded price when the candle is not closed
  string, // `volume` Trade volume. Unit of contract: pieces of contract. Unit of spot: quantity of coins
  string, // `turnover` Turnover. Unit of figure: quantity of quota coin
]
export const toKLine = (raw: KLineRaw): KLine => ({
  startTime: +raw[0],
  openPrice: +raw[1],
  highPrice: +raw[2],
  lowPrice: +raw[3],
  closePrice: +raw[4],
  volume: +raw[5],
  turnover: +raw[6],
})

export type TickerRaw = {
  symbol: string //	Symbol name
  lastPrice: string //	Last price
  indexPrice: string //	Index price
  markPrice: string //	Mark price
  prevPrice24h: string //	Market price 24 hours ago
  price24hPcnt: string //	Percentage change of market price relative to 24h
  highPrice24h: string //	The highest price in the last 24 hours
  lowPrice24h: string //	The lowest price in the last 24 hours
  prevPrice1h: string //	Market price an hour ago
  openInterest: string //	Open interest size
  openInterestValue: string //	Open interest value
  turnover24h: string //	Turnover for 24h
  volume24h: string //	Volume for 24h
  fundingRate: string //	Funding rate
  nextFundingTime: string //	Next funding time (ms)
  predictedDeliveryPrice: string //	Predicated delivery price. It has value when 30 min before delivery
  basisRate: string //	Basis rate
  basis: string //	Basis
  deliveryFeeRate: string //	Delivery fee rate
  deliveryTime: string //	Delivery timestamp (ms)
  ask1Size: string //	Best ask size
  bid1Price: string //	Best bid price
  ask1Price: string //	Best ask price
  bid1Size: string //	Best bid size
  preOpenPrice: string //	Estimated pre-market contract open price. The value is meaningless when entering continuous trading phase.
  preQty: string //	Estimated pre-market contract open qty. The value is meaningless when entering continuous trading phase.
  curPreListingPhase: string //	The current pre-market contract phase
}
export const toTicker = (raw: TickerRaw): Ticker => ({
  symbol: raw.symbol,
  lastPrice: +raw.lastPrice,
  indexPrice: +raw.indexPrice,
  markPrice: +raw.markPrice,
  prevPrice24h: +raw.prevPrice24h,
  price24hPcnt: +raw.price24hPcnt,
  highPrice24h: +raw.highPrice24h,
  lowPrice24h: +raw.lowPrice24h,
  prevPrice1h: +raw.prevPrice1h,
  openInterest: +raw.openInterest,
  openInterestValue: +raw.openInterestValue,
  turnover24h: +raw.turnover24h,
  volume24h: +raw.volume24h,
  fundingRate: +raw.fundingRate,
  nextFundingTime: +raw.nextFundingTime,
  predictedDeliveryPrice: +raw.predictedDeliveryPrice,
  basisRate: +raw.basisRate,
  basis: +raw.basis,
  deliveryFeeRate: +raw.deliveryFeeRate,
  deliveryTime: +raw.deliveryTime,
  ask1Size: +raw.ask1Size,
  bid1Price: +raw.bid1Price,
  ask1Price: +raw.ask1Price,
  bid1Size: +raw.bid1Size,
  preOpenPrice: +raw.preOpenPrice,
  preQty: +raw.preQty,
  curPreListingPhase: +raw.curPreListingPhase,
})

export type TradeRaw = {
  execId: string //	Execution ID
  symbol: string //	Symbol name
  price: string //	Trade price
  size: string //	Trade size
  side: string //	Side of taker Buy, Sell
  time: string //	Trade time (ms)
  isBlockTrade: boolean //	Whether the trade is block trade
  mP?: string //	Mark price, unique field for option
  iP?: string //	Index price, unique field for option
  mIv?: string //	Mark iv, unique field for option
  iv?: string //	iv, unique field for option
}
export const toTrade = (raw: TradeRaw): Trade => ({
  execId: raw.execId,
  symbol: raw.symbol,
  price: +raw.price,
  size: +raw.size,
  side: sideFromStr(raw.side) ?? Side.Buy, // TODO: Ignore and log not valid data.
  time: +raw.time,
  isBlockTrade: raw.isBlockTrade,
  markPrice: raw.mP ? +raw.mP : undefined, // TODO: No write undefined fields.
  indexPrice: raw.iP ? +raw.iP : undefined,
  mIv: raw.mIv ? raw.mIv : undefined,
  iv: raw.iv ? raw.iv : undefined,
})

export type MessageRaw<T> = {
  id?: string //	Message id. Unique field for option
  topic: string // Topic name
  type: string //	Data type. `snapshot`
  cs?: number // Cross sequence
  ts: number //	The timestamp (ms) that the system generates the data
  data: Array<T> | T
}
export const toMessage = <V, M>(
  raw: MessageRaw<V>,
  mapper: (v: V) => M,
): Message<M> => ({
  id: raw.id, // TODO: Check optionality.
  type: actionTypeFromStr(raw.type) ?? ActionType.Reset,
  crossSequence: raw.cs, // TODO: Check optionality.
  timestamp: raw.ts,
  data: Array.isArray(raw.data) ? raw.data.map(mapper) : mapper(raw.data),
})

export type TradeMsgRaw = {
  T: number //	The timestamp (ms) that the order is filled
  s: string //	Symbol name
  S: string //	Side of taker. Buy,Sell
  v: string //	Trade size
  p: string //	Trade price
  L: string //	Direction of price change. Unique field for future
  i: string //	Trade ID
  BT: boolean //	Whether it is a block trade order or not
  mP: string //	Mark price, unique field for option
  iP: string //	Index price, unique field for option
  mIv: string //	Mark iv, unique field for option
  iv: string //	iv, unique field for option
}
export const toTradeMsg = (raw: TradeMsgRaw): TradeMsg => ({
  timestamp: raw.T,
  symbol: raw.s,
  side: sideFromStr(raw.S) ?? Side.Buy,
  size: +raw.v,
  price: +raw.p,
  tickDirection: tickDirectionFromStr(raw.L) ?? TickDirection.ZeroPlusTick, // TODO: Rewrite. Ignore and log invalid message.
  tradeID: raw.i,
  isBlockTrade: raw.BT,
  markPrice: raw.mP ? +raw.mP : undefined, // TODO: No write undefined fields.
  indexPrice: raw.iP ? +raw.iP : undefined,
  mIv: raw.mIv ? raw.mIv : undefined,
  iv: raw.iv ? raw.iv : undefined,
})

export type TickerLinearInverseMsgRaw = {
  symbol: string // Symbol name
  tickDirection?: string // Tick direction
  price24hPcnt?: string // Percentage change of market price in the last 24 hours
  lastPrice?: string // Last price
  prevPrice24h?: string // Market price 24 hours ago
  highPrice24h?: string // The highest price in the last 24 hours
  lowPrice24h?: string // The lowest price in the last 24 hours
  prevPrice1h?: string // Market price an hour ago
  markPrice?: string // Mark price
  indexPrice?: string // Index price
  openInterest?: string // Open interest size
  openInterestValue?: string // Open interest value
  turnover24h?: string // Turnover for 24h
  volume24h?: string // Volume for 24h
  nextFundingTime?: string // Next funding timestamp (ms)
  fundingRate?: string // Funding rate
  bid1Price?: string // Best bid price
  bid1Size?: string // Best bid size
  ask1Price?: string // Best ask price
  ask1Size?: string // Best ask size
  deliveryTime?: string // Delivery date time (UTC+0). Unique field for inverse futures & USDC futures
  basisRate?: string // Basis rate. Unique field for inverse futures & USDC futures
  deliveryFeeRate?: string // Delivery fee rate. Unique field for inverse futures & USDC futures
  predictedDeliveryPrice?: string // Predicated delivery price. Unique field for inverse futures & USDC futures
  preOpenPrice?: string // Estimated pre-market contract open price.  The value is meaningless when entering continuous trading phase.  USDC Futures and Inverse Futures do not have this field
  preQty?: string // Estimated pre-market contract open qty.  The value is meaningless when entering continuous trading phase.  USDC Futures and Inverse Futures do not have this field
  curPreListingPhase?: string // The current pre-market contract phase.  USDC Futures and Inverse Futures do not have this field
}
export const toTickerLinearInverseMsg = (
  raw: TickerLinearInverseMsgRaw,
): TickerLinearInverseMsg => {
  const msg: TickerLinearInverseMsg = {
    symbol: raw.symbol,
  }

  if (raw.tickDirection)
    msg.tickDirection = tickDirectionFromStr(raw.tickDirection)
  if (raw.price24hPcnt) msg.price24hPcnt = +raw.price24hPcnt
  if (raw.lastPrice) msg.lastPrice = +raw.lastPrice
  if (raw.prevPrice24h) msg.prevPrice24h = +raw.prevPrice24h
  if (raw.highPrice24h) msg.highPrice24h = +raw.highPrice24h
  if (raw.lowPrice24h) msg.lowPrice24h = +raw.lowPrice24h
  if (raw.prevPrice1h) msg.prevPrice1h = +raw.prevPrice1h
  if (raw.markPrice) msg.markPrice = +raw.markPrice
  if (raw.indexPrice) msg.indexPrice = +raw.indexPrice
  if (raw.openInterest) msg.openInterest = +raw.openInterest
  if (raw.openInterestValue) msg.openInterestValue = +raw.openInterestValue
  if (raw.turnover24h) msg.turnover24h = +raw.turnover24h
  if (raw.volume24h) msg.volume24h = +raw.volume24h
  if (raw.nextFundingTime) msg.nextFundingTime = +raw.nextFundingTime
  if (raw.fundingRate) msg.fundingRate = +raw.fundingRate
  if (raw.bid1Price) msg.bid1Price = +raw.bid1Price
  if (raw.bid1Size) msg.bid1Size = +raw.bid1Size
  if (raw.ask1Price) msg.ask1Price = +raw.ask1Price
  if (raw.ask1Size) msg.ask1Size = +raw.ask1Size

  if (raw.deliveryTime) msg.deliveryTime = raw.deliveryTime
  if (raw.basisRate) msg.basisRate = +raw.basisRate
  if (raw.deliveryFeeRate) msg.deliveryFeeRate = +raw.deliveryFeeRate
  if (raw.predictedDeliveryPrice)
    msg.predictedDeliveryPrice = +raw.predictedDeliveryPrice
  if (raw.preOpenPrice) msg.preOpenPrice = +raw.preOpenPrice
  if (raw.preQty) msg.preQty = +raw.preQty
  if (raw.curPreListingPhase) msg.curPreListingPhase = raw.curPreListingPhase

  return msg
}

export type TickerOptionMsgRaw = {
  symbol: string // Symbol name
  bidPrice?: string // Best bid price
  bidSize?: string // Best bid size
  bidIv?: string // Best bid iv
  askPrice?: string // Best ask price
  askSize?: string // Best ask size
  askIv?: string // Best ask iv
  lastPrice?: string // Last price
  highPrice24h?: string // The highest price in the last 24 hours
  lowPrice24h?: string // The lowest price in the last 24 hours
  markPrice?: string // Mark price
  indexPrice?: string // Index price
  markPriceIv?: string // Mark price iv
  underlyingPrice?: string // Underlying price
  openInterest?: string // Open interest size
  turnover24h?: string // Turnover for 24h
  volume24h?: string // Volume for 24h
  totalVolume?: string // Total volume
  totalTurnover?: string // Total turnover
  delta?: string // Delta
  gamma?: string // Gamma
  vega?: string // Vega
  theta?: string // Theta
  predictedDeliveryPrice?: string // Predicated delivery price. It has value when 30 min before delivery
  change24h?: string // The change in the last 24 hous
}
export const toTickerOptionMsg = (raw: TickerOptionMsgRaw): TickerOptionMsg => {
  const msg: TickerOptionMsg = {
    symbol: raw.symbol,
  }

  if (raw.bidPrice) msg.bidPrice = +raw.bidPrice
  if (raw.bidSize) msg.bidSize = +raw.bidSize
  if (raw.bidIv) msg.bidIv = +raw.bidIv
  if (raw.askPrice) msg.askPrice = +raw.askPrice
  if (raw.askSize) msg.askSize = +raw.askSize
  if (raw.askIv) msg.askIv = +raw.askIv
  if (raw.lastPrice) msg.lastPrice = +raw.lastPrice
  if (raw.highPrice24h) msg.highPrice24h = +raw.highPrice24h
  if (raw.lowPrice24h) msg.lowPrice24h = +raw.lowPrice24h
  if (raw.markPrice) msg.markPrice = +raw.markPrice
  if (raw.indexPrice) msg.indexPrice = +raw.indexPrice
  if (raw.markPriceIv) msg.markPriceIv = +raw.markPriceIv
  if (raw.underlyingPrice) msg.underlyingPrice = +raw.underlyingPrice
  if (raw.openInterest) msg.openInterest = +raw.openInterest
  if (raw.turnover24h) msg.turnover24h = +raw.turnover24h
  if (raw.volume24h) msg.volume24h = +raw.volume24h
  if (raw.totalVolume) msg.totalVolume = +raw.totalVolume
  if (raw.totalTurnover) msg.totalTurnover = +raw.totalTurnover
  if (raw.delta) msg.delta = +raw.delta
  if (raw.gamma) msg.gamma = +raw.gamma
  if (raw.vega) msg.vega = +raw.vega
  if (raw.theta) msg.theta = +raw.theta
  if (raw.predictedDeliveryPrice)
    msg.predictedDeliveryPrice = +raw.predictedDeliveryPrice
  if (raw.change24h) msg.change24h = +raw.change24h

  return msg
}

export type TickerSpotMsgRaw = {
  symbol: string //	Symbol name
  lastPrice?: string //	Last price
  highPrice24h?: string //	The highest price in the last 24 hours
  lowPrice24h?: string //	The lowest price in the last 24 hours
  prevPrice24h?: string //	Percentage change of market price relative to 24h
  volume24h?: string //	Volume for 24h
  turnover24h?: string //	Turnover for 24h
  price24hPcnt?: string //	Percentage change of market price relative to 24h
}
export const toTickerSpotMsg = (raw: TickerSpotMsgRaw): TickerSpotMsg => {
  const msg: TickerSpotMsg = {
    symbol: raw.symbol,
  }

  if (raw.lastPrice) msg.lastPrice = +raw.lastPrice
  if (raw.highPrice24h) msg.highPrice24h = +raw.highPrice24h
  if (raw.lowPrice24h) msg.lowPrice24h = +raw.lowPrice24h
  if (raw.prevPrice24h) msg.prevPrice24h = +raw.prevPrice24h
  if (raw.volume24h) msg.volume24h = +raw.volume24h
  if (raw.turnover24h) msg.turnover24h = +raw.turnover24h
  if (raw.price24hPcnt) msg.price24hPcnt = +raw.price24hPcnt

  return msg
}

export type TickerMsgRaw = TickerLinearInverseMsgRaw &
  TickerOptionMsgRaw &
  TickerSpotMsgRaw

export type KlineMsgRaw = {
  start: number // The start timestamp (ms)
  end: number // The end timestamp (ms)
  interval: string // Kline interval
  open: string // Open price
  close: string // Close price
  high: string // Highest price
  low: string // Lowest price
  volume: string // Trade volume
  turnover: string // Turnover
  confirm: boolean // Weather the tick is ended or not
  timestamp: number // The timestamp (ms) of the last matched order in the candle
}
export const toKlineMsg = (raw: KlineMsgRaw): KlineMsg => ({
  start: raw.start,
  end: raw.end,
  interval: intervalFromStr(raw.interval) ?? Interval.Minute1,
  open: +raw.open,
  close: +raw.close,
  high: +raw.high,
  low: +raw.low,
  volume: +raw.volume,
  turnover: +raw.turnover,
  confirm: raw.confirm,
  timestamp: raw.timestamp,
})
