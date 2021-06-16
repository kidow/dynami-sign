import core from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'
import { ChromeOptions } from 'types'

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
  _page = await browser.newPage()
  return _page
}

export const getScreenshot = async (html: string) => {
  const page = await getPage()
  await page.setViewport({ width: 1200, height: 600 })
  await page.setContent(html)
  const file = await page.screenshot({ type: 'png' })
  return file
}

export const getHtml = () => {
  return `<!DOCTYPE html>
    <html>
        <meta charset="utf-8">
        <title>Generated Image</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
        </style>
        <body>
            <div>
                <div class="spacer">
                <div class="logo-wrapper">
                    Logo Wrapper
                </div>
                <div class="spacer">
                <div class="heading">
                    Heading
                </div>
            </div>
        </body>
    </html>`
}
