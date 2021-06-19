import core from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'
import { ChromeOptions, Params } from 'types'

let _page: core.Page | null
export const isDev = process.env.NODE_ENV === 'development'
const exePath =
  process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'linux'
    ? '/usr/bin/google-chrome'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const getOptions = async (): Promise<ChromeOptions> => {
  let options: ChromeOptions = {
    args: [],
    executablePath: exePath,
    headless: true
  }
  if (!isDev) {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    }
  }
  return options
}

const getPage = async () => {
  if (_page) return _page

  const options = await getOptions()
  const browser = await core.launch(options)
  const context = await browser.createIncognitoBrowserContext()
  _page = await context.newPage()
  return _page
}

export const getScreenshot = async (html: string) => {
  const page = await getPage()
  await page.setViewport({ width: 1200, height: 600 })
  await page.setContent(html)
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
  )
  const file = await page.screenshot({ type: 'png' })
  return file
}

export const getHtml = (props?: Params) => {
  const title = props ? props.title : 'DynamiSign'
  const description = props
    ? props.description
    : '이미지를 동적으로 만들어 주는 서비스입니다. \n이미지 클릭 시 주소가 복사됩니다.'
  return `<!DOCTYPE html>
  <html>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
          Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
      }
      .container {
        padding: 4rem;
        max-width: 768px;
      }
      .title {
        font-size: 4rem;
        font-weight: bold;
        color: #2f363d;
        line-height: 1.2;
        margin-bottom: 2rem;
      }
      .description {
        font-size: 2rem;
        color: #6e7681;
      }
    </style>
    <body>
      <div class="container">
        <div class="title">${title}</div>
        <div class="description">
          ${description}
        </div>
      </div>
    </body>
  </html>
  `
}
