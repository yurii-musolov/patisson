/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'eventemitter3'

export type Config = {
  url: string
  protocols?: string | Array<string>
}

export class Connect {
  private cfg: Config
  private ee: EventEmitter
  private conn: WebSocket | null

  constructor(cfg: Config) {
    this.cfg = cfg
    this.ee = new EventEmitter()
    this.conn = null
  }

  public connect() {
    if (this.conn) return

    this.conn = new WebSocket(this.cfg.url, this.cfg.protocols)
    this.conn.addEventListener('open', this.openHandler.bind(this))
    this.conn.addEventListener('message', this.messageHandler.bind(this))
    this.conn.addEventListener('error', this.errorHandler.bind(this))
    this.conn.addEventListener('close', this.closeHandler.bind(this))
  }
  public disconnect() {
    this.conn?.close()
  }

  public send<T>(message: T) {
    if (!this.conn) {
      // TODO: log.
      return
    }

    this.conn.send(JSON.stringify(message))
  }
  public on<T>(topic: string, cb: (d: T) => void, context?: any): Cb {
    this.ee.on(topic, cb, context)
    return () => this.ee.off(topic, cb, context)
  }
  public off<T>(topic: string, cb: (d: T) => void, context?: any): void {
    this.ee.off(topic, cb, context)
  }

  private openHandler(event: Event) {
    console.log('openHandler', event)
  }
  private messageHandler(message: MessageEvent) {
    const data = JSON.parse(message.data) as { topic: string }
    this.ee.emit(data.topic, data)
  }
  private errorHandler(error: Event) {
    console.log('errorHandler', error)
  }
  private closeHandler(event: CloseEvent) {
    console.log('closeHandler', event)
  }
}

export const makeConnect = (url: string) => new Connect({ url })

export type Cb = () => void
