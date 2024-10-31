/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  KlineMsgRaw,
  MessageRaw,
  TickerLinearInverseMsgRaw,
  TickerOptionMsgRaw,
  TickerSpotMsgRaw,
  TradeMsgRaw,
} from './api'
import type { Connect } from './connect'
import { Category } from './model'
import type { Interval, KlineMsg, Message, TickerMsg, TradeMsg } from './model'
import {
  toKlineMsg,
  toMessage,
  toTickerLinearInverseMsg,
  toTickerOptionMsg,
  toTickerSpotMsg,
  toTradeMsg,
} from './api'
import { makeConnect } from './connect'

const PATH_PUBLIC_INVERSE = '/v5/public/inverse'
const PATH_PUBLIC_LINEAR = '/v5/public/linear'
const PATH_PUBLIC_OPTION = '/v5/public/option'
const PATH_PUBLIC_SPOT = '/v5/public/spot'

const topicTrade = (symbol: string): string => `publicTrade.${symbol}`
const topicTicker = (symbol: string): string => `tickers.${symbol}`
const topicKline = (interval: Interval, symbol: string): string =>
  `kline.${interval}.${symbol}`

export type Config = {
  baseUrl: string
  makeConnect?: (baseUrl: string) => Connect
}

export class PublicStream {
  private cfg: Required<Config>
  private connects: Map<Category, Connect>
  private callbacks: Map<(param: any) => void, (param: any) => void>

  constructor(cfg: Config) {
    this.cfg = { makeConnect, ...cfg }
    this.connects = new Map()
    this.callbacks = new Map()

    // TODO: temporary.
    this.getConnect(Category.Linear)
    this.getConnect(Category.Inverse)
    this.getConnect(Category.Option)
    this.getConnect(Category.Spot)
  }

  private getConnect(category: Category): Connect {
    const connect = this.connects.get(category)
    if (connect) return connect

    let url = this.cfg.baseUrl
    switch (category) {
      case Category.Inverse:
        url += PATH_PUBLIC_INVERSE
        break
      case Category.Linear:
        url += PATH_PUBLIC_LINEAR
        break
      case Category.Option:
        url += PATH_PUBLIC_OPTION
        break
      case Category.Spot:
        url += PATH_PUBLIC_SPOT
        break

      default:
        // TODO: throw error.
        break
    }

    console.log('PublicStream ~ getConnect ~ url:', url)
    const conn = this.cfg.makeConnect(url)
    conn.connect()
    this.connects.set(category, conn)
    return conn
  }

  /**
   * subscribeTrade
   *
   * Subscribe to the recent trades stream.
   * After subscription, you will be pushed trade messages in real-time.
   * Push frequency: real-time
   */
  public subscribeTrade(subs: TradeSubscription, handler: TradeHandler): Cb {
    const connect = this.getConnect(subs.category)
    const topic = topicTrade(subs.symbol)
    const cb = (raw: MessageRaw<TradeMsgRaw>): void =>
      handler(toMessage(raw, toTradeMsg))
    const command = {
      req_id: Date.now().toString(),
      op: 'subscribe',
      args: [topic],
    }

    this.callbacks.set(handler, cb)
    connect.on(topic, cb)
    connect.send(command)

    return () => this.unsubscribeTrade(subs, handler)
  }

  public unsubscribeTrade(
    subs: TradeSubscription,
    handler: TradeHandler,
  ): void {
    const cb = this.callbacks.get(handler)
    if (!cb) return

    const connect = this.getConnect(subs.category)
    const topic = topicTrade(subs.symbol)
    const command = {
      req_id: Date.now().toString(),
      op: 'subscribe',
      args: [topic],
    }
    connect.send(command)

    connect.off(topic, cb)
    this.callbacks.delete(handler)
  }

  /**
   * subscribeTicker
   *
   * Subscribe to the ticker stream.
   * Push frequency: Derivatives & Options - 100ms, Spot - real-time
   */
  public subscribeTicker(subs: TickerSubscription, handler: TickerHandler): Cb {
    const connect = this.getConnect(subs.category)
    const topic = topicTicker(subs.symbol)

    const cb = {
      [Category.Linear]: (raw: MessageRaw<TickerLinearInverseMsgRaw>): void =>
        handler(toMessage(raw, toTickerLinearInverseMsg)),
      [Category.Inverse]: (raw: MessageRaw<TickerLinearInverseMsgRaw>): void =>
        handler(toMessage(raw, toTickerLinearInverseMsg)),
      [Category.Option]: (raw: MessageRaw<TickerOptionMsgRaw>): void =>
        handler(toMessage(raw, toTickerOptionMsg)),
      [Category.Spot]: (raw: MessageRaw<TickerSpotMsgRaw>): void =>
        handler(toMessage(raw, toTickerSpotMsg)),
    }[subs.category] as (param: any) => void
    const command = {
      req_id: Date.now().toString(),
      op: 'subscribe',
      args: [topic],
    }

    this.callbacks.set(handler, cb)
    connect.on(topic, cb)
    connect.send(command)

    return () => this.unsubscribeTicker(subs, handler)
  }
  public unsubscribeTicker(
    subs: TickerSubscription,
    handler: TickerHandler,
  ): void {
    const cb = this.callbacks.get(handler)
    if (!cb) return

    const connect = this.getConnect(subs.category)
    const topic = topicTrade(subs.symbol)
    const command = {
      req_id: Date.now().toString(),
      op: 'subscribe',
      args: [topic],
    }
    connect.send(command)

    connect.off(topic, cb)
    this.callbacks.delete(handler)
  }

  /**
   * subscribeKline
   *
   * Subscribe to the klines stream.
   * Push frequency: 1-60s
   */
  public subscribeKline(subs: KlineSubscription, handler: KlineHandler): Cb {
    const connect = this.getConnect(subs.category)
    const topic = topicKline(subs.interval, subs.symbol)
    const cb = (raw: MessageRaw<KlineMsgRaw>): void =>
      handler(toMessage(raw, toKlineMsg))
    const command = {
      req_id: Date.now().toString(),
      op: 'subscribe',
      args: [topic],
    }

    this.callbacks.set(handler, cb)
    connect.on(topic, cb)
    connect.send(command)

    return () => this.unsubscribeKline(subs, handler)
  }
  public unsubscribeKline(
    subs: KlineSubscription,
    handler: KlineHandler,
  ): void {
    const cb = this.callbacks.get(handler)
    if (!cb) return

    const connect = this.getConnect(subs.category)
    const topic = topicTrade(subs.symbol)
    const command = {
      req_id: Date.now().toString(),
      op: 'subscribe',
      args: [topic],
    }
    connect.send(command)

    connect.off(topic, cb)
    this.callbacks.delete(handler)
  }
}

export type Cb = () => void

export type TradeSubscription = {
  category: Category
  symbol: string
}
export type TradeHandler = (message: Message<TradeMsg>) => void

export type TickerSubscription = {
  category: Category
  symbol: string
}
export type TickerHandler = (message: Message<TickerMsg>) => void

export type KlineSubscription = {
  category: Category
  symbol: string
  interval: Interval
}
export type KlineHandler = (message: Message<KlineMsg>) => void
