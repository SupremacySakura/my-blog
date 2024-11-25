import 'marked'

declare module 'marked' {
  interface MarkedOptions {
    highlight?: (code: string, lang: string) => string
  }
}