/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category, Interval } from '@/libs/bybit_sdk'
import { Market } from '@/libs/bybit_sdk/market'
import { PublicStream } from '@/libs/bybit_sdk/public-stream'
import {
  BASE_URL_API_MAINNET_1,
  BASE_URL_STREAM_MAINNET,
} from '@/libs/bybit_sdk/url'

const delay = async (ms: number) => new Promise(res => setTimeout(res, ms))

export const debugInBrowser = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const G = window as Record<string, any>

  const market = new Market({ baseUrl: BASE_URL_API_MAINNET_1 })
  const publicStream = new PublicStream({ baseUrl: BASE_URL_STREAM_MAINNET })

  const rest = async () => {
    const time = await market.getBybitServerTime()
    console.log('~ time:', time)

    const kLines = await market.getKline({
      category: Category.Linear,
      symbol: 'BTCUSDT',
      interval: Interval.Minute1,
      limit: 3,
    })
    console.log('~ kLines:', kLines)

    const tickers = await market.getTickers({
      category: Category.Linear,
      // symbol: 'BTCUSDT',
    })
    console.log('~ tickers:', tickers)

    const trades = await market.getPublicRecentTradingHistory({
      category: Category.Linear,
      symbol: 'BTCUSDT',
      limit: 2,
    })
    console.log('~ trades:', trades)
  }

  const ws = async (category: Category, symbol: string) => {
    await delay(2000)
    publicStream.subscribeTicker({ category, symbol }, message => {
      // console.log('~ Ticker Linear BTCUSDT', message)
      if (G.count != null) G.count += 1
    })
    publicStream.subscribeKline(
      { category, symbol, interval: Interval.Minute1 },
      message => {
        // console.log('~ Kline Linear BTCUSDT', message)
        if (G.count != null) G.count += 1
      },
    )
    publicStream.subscribeTrade({ category, symbol }, message => {
      // console.log('~ Trade Linear BTCUSDT', message)
      if (G.count != null) G.count += 1
    })
  }

  rest()
  ws(Category.Linear, 'BTCUSDT')
  ws(Category.Linear, 'BNBUSDT')
  ws(Category.Linear, 'ETHUSDT')
  // ws(Category.Linear, 'GALAUSDT')
  ws(Category.Linear, 'SOLUSDT')
  ws(Category.Linear, 'DOGEUSDT')
  ws(Category.Linear, 'XRPUSDT')
  // ws(Category.Linear, 'LTCUSDT')
  // ws(Category.Linear, 'LINKUSDT')
  Object.assign(G, {
    count: 0,
    start: Date.now(),
    check: () => G.count / ((Date.now() - G.start) / 1000), // Chow message per second.
    publicStream,
  })
}
