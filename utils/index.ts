import puppeteer from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'
import { Params } from 'types'

let _page: puppeteer.Page | null
const isDev = process.env.NODE_ENV === 'development'
const exePath =
  process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'linux'
    ? '/usr/bin/google-chrome'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const getOptions = async () => {
  let options: any = {
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

  await chrome.font(
    'https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-ExtraLight-subset.woff'
  )
  const options = await getOptions()
  const browser = await puppeteer.launch(options)
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
      @font-face {
        font-family: 'Noto Serif KR';
        font-style: normal;
        font-weight: 100;
        src: local('Noto Serif CJK KR'), local('Source Han Serif K'), local('Source Han Serif'), local('Noto Serif CJK'), local('Noto Serif'), url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-ExtraLight-subset.woff) format('woff'),url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-ExtraLight-subset.woff2) format('woff2'), url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-ExtraLight-subset.otf) format('otf');
      }
      @font-face {
          font-family: 'Noto Serif KR';
          font-style: normal;
          font-weight: 300;
          src: local('Noto Serif CJK KR'), local('Source Han Serif K'), local('Source Han Serif'), local('Noto Serif CJK'), local('Noto Serif'), url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-Regular-subset.woff) format('woff'),url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-Regular-subset.woff2) format('woff2'), url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-Regular-subset.otf) format('otf');
      }
      @font-face {
          font-family: 'Noto Serif KR';
          font-style: normal;
          font-weight: 600;
          src: local('Noto Serif CJK KR'), local('Source Han Serif K'), local('Source Han Serif'), local('Noto Serif CJK'), local('Noto Serif'), url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-Bold-subset.woff) format('woff'),url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-Bold-subset.woff2) format('woff2'),  url(https://cdn.rawgit.com/kattergil/NotoSerifKR-Katter/7392ea08/fonts/NotoSerifCJKkr-Bold-subset.otf) format('otf');
      }
      * {
        font-family: 'Noto Serif KR';
      }
      body {
        text-align: center;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        padding: 4rem;
        max-width: 768px;
        margin: 0 auto;
      }
      .logo-box {
        margin-bottom: 2.5rem;
      }
      .logo {
        width: 120px;
      }
      .title {
        font-size: 5rem;
        font-weight: bold;
        color: #2f363d;
        line-height: 1.2;
        margin-bottom: 2rem;
      }
      .description {
        font-size: 2rem;
        color: #6e7681;
        line-height: 1.5;
      }
    </style>
    <body>
      <div class="container">
        <div class="logo-box">
          <img
            src="https://cdn.jsdelivr.net/gh/remojansen/logo.ts@master/ts.svg"
            alt="logo"
            class="logo"
          />
        </div>
        <div class="title">${title}</div>
        <div class="description">
          ${description}
        </div>
      </div>
    </body>
  </html>
  `
}
