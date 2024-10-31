// https://bybit-exchange.github.io/docs/v5/intro

type Enum<T> = Record<keyof T, number | string> & { [key: number]: string }
type ValueOf<T> = T[keyof T]
type Lookup<T> = Record<number | string, ValueOf<T>>

const lookup = <T extends Enum<T>>(e: T): Lookup<T> =>
  Object.entries(e).reduce(
    (map, [k, v]) => ((map[v] = <ValueOf<T>>k), map),
    <Lookup<T>>{},
  )

export enum Category {
  Inverse = 'inverse',
  Linear = 'linear',
  Option = 'option',
  Spot = 'spot',
}
export const lookupCategory = lookup(Category)
export const categoryFromStr = (str: string): Category | null =>
  lookupCategory[str] ?? null

export enum OrderType {
  Market = 'Market',
  Limit = 'Limit',
  Unknown = 'UNKNOWN',
}
export const lookupOrderType = lookup(OrderType)
export const orderTypeFromStr = (str: string): OrderType | null =>
  lookupOrderType[str] ?? null

export enum TickDirection {
  PlusTick = 'PlusTick',
  ZeroPlusTick = 'ZeroPlusTick',
  MinusTick = 'MinusTick',
  ZeroMinusTick = 'ZeroMinusTick',
}
export const lookupTickDirection = lookup(TickDirection)
export const tickDirectionFromStr = (str: string): TickDirection | undefined =>
  lookupTickDirection[str] ?? undefined

export enum Interval {
  Minute1 = '1',
  Minute3 = '3',
  Minute5 = '5',
  Minute15 = '15',
  Minute30 = '30',
  Minute60 = '60',
  Minute120 = '120',
  Minute240 = '240',
  Minute360 = '360',
  Minute720 = '720',
  Day = 'D',
  Week = 'W',
  Mouth = 'M',
}
export const lookupInterval = lookup(Interval)
export const intervalFromStr = (str: string): Interval | null =>
  lookupInterval[str] ?? null

export enum IntervalTime {
  Minute5 = '5min',
  Minute15 = '15min',
  Minute30 = '30min',
  Hour1 = '1h',
  Hour4 = '4h',
  Day = '1d',
}
export const lookupIntervalTime = lookup(IntervalTime)
export const intervalTimeFromStr = (str: string): IntervalTime | null =>
  lookupIntervalTime[str] ?? null

export enum AccountType {
  Contract = 'CONTRACT',
  Fund = 'FUND',
  Spot = 'SPOT',
  Unified = 'UNIFIED',
}
export const lookupAccountType = lookup(AccountType)
export const accountTypeFromStr = (str: string): AccountType | null =>
  lookupAccountType[str] ?? null

export enum TransferStatus {
  Success = 'SUCCESS',
  Pending = 'PENDING',
  Failed = 'FAILED',
}
export const lookupTransferStatus = lookup(TransferStatus)
export const transferStatusFromStr = (str: string): TransferStatus | null =>
  lookupTransferStatus[str] ?? null

export enum AccountMode {
  ClassicAccount = 1,
  Uta1 = 3,
  Uta1Pro = 4,
  Uta2 = 5,
  Uta2Pro = 6,
}
export const accountModeFromNum = (num: number): AccountMode | null =>
  AccountMode[num as unknown as keyof typeof AccountMode] ?? null

export enum Side {
  Buy = 'Buy',
  Sell = 'Sell',
}
export const sideFromStr = (str: string): Side | null =>
  Side[str as unknown as keyof typeof Side] ?? null

export enum ActionType {
  Snapshot = 'snapshot',
  Insert = 'insert',
  Update = 'update',
  Delete = 'delete',
  Reset = 'reset',
}
export const actionTypeFromStr = (str: string): ActionType =>
  ActionType[str as unknown as keyof typeof ActionType] ?? null

export type KLine = {
  startTime: number
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
  turnover: number
}

export type Ticker = {
  symbol: string
  lastPrice: number
  indexPrice: number
  markPrice: number
  prevPrice24h: number
  price24hPcnt: number
  highPrice24h: number
  lowPrice24h: number
  prevPrice1h: number
  openInterest: number
  openInterestValue: number
  turnover24h: number
  volume24h: number
  fundingRate: number
  nextFundingTime: number
  predictedDeliveryPrice: number
  basisRate: number
  basis: number
  deliveryFeeRate: number
  deliveryTime: number
  ask1Size: number
  bid1Price: number
  ask1Price: number
  bid1Size: number
  preOpenPrice: number
  preQty: number
  curPreListingPhase: number
}

export type Trade = {
  execId: string
  symbol: string
  price: number
  size: number
  side: Side
  time: number
  isBlockTrade: boolean
  markPrice?: number
  indexPrice?: number
  mIv?: string
  iv?: string
}

export type Message<T> = {
  id?: string
  type: ActionType
  crossSequence?: number
  timestamp: number
  data: Array<T> | T
}

export type TradeMsg = {
  timestamp: number
  symbol: string
  side: Side
  size: number
  price: number
  tickDirection: TickDirection
  tradeID: string
  isBlockTrade: boolean
  markPrice?: number
  indexPrice?: number
  mIv?: string
  iv?: string
}

export type TickerLinearInverseMsg = {
  symbol: string
  tickDirection?: TickDirection
  price24hPcnt?: number
  lastPrice?: number
  prevPrice24h?: number
  highPrice24h?: number
  lowPrice24h?: number
  prevPrice1h?: number
  markPrice?: number
  indexPrice?: number
  openInterest?: number
  openInterestValue?: number
  turnover24h?: number
  volume24h?: number
  nextFundingTime?: number
  fundingRate?: number
  bid1Price?: number
  bid1Size?: number
  ask1Price?: number
  ask1Size?: number
  deliveryTime?: string
  basisRate?: number
  deliveryFeeRate?: number
  predictedDeliveryPrice?: number
  preOpenPrice?: number
  preQty?: number
  curPreListingPhase?: string
}

export type TickerOptionMsg = {
  symbol: string
  bidPrice?: number
  bidSize?: number
  bidIv?: number
  askPrice?: number
  askSize?: number
  askIv?: number
  lastPrice?: number
  highPrice24h?: number
  lowPrice24h?: number
  markPrice?: number
  indexPrice?: number
  markPriceIv?: number
  underlyingPrice?: number
  openInterest?: number
  turnover24h?: number
  volume24h?: number
  totalVolume?: number
  totalTurnover?: number
  delta?: number
  gamma?: number
  vega?: number
  theta?: number
  predictedDeliveryPrice?: number
  change24h?: number
}

export type TickerSpotMsg = {
  symbol: string
  lastPrice?: number
  highPrice24h?: number
  lowPrice24h?: number
  prevPrice24h?: number
  volume24h?: number
  turnover24h?: number
  price24hPcnt?: number
}
export type TickerMsg = TickerLinearInverseMsg | TickerOptionMsg | TickerSpotMsg

export type KlineMsg = {
  start: number
  end: number
  interval: Interval
  open: number
  close: number
  high: number
  low: number
  volume: number
  turnover: number
  confirm: boolean
  timestamp: number
}
