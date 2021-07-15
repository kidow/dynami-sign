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

export const getScreenshot = async (html: string, fileType?: Params['y']) => {
  try {
    const page = await getPage()
    await page.setViewport({ width: 1200, height: 600 })
    await page.setContent(html, { waitUntil: 'domcontentloaded' })
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll('img'))
      await Promise.all([
        document.fonts.ready,
        ...selectors.map((img) => {
          if (img.complete) {
            if (img.naturalHeight !== 0) return
            throw new Error('Image failed to load')
          }
          return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve)
            img.addEventListener('error', reject)
          })
        })
      ])
    })
    const file = await page.screenshot({ type: fileType })
    return file
  } catch (err) {
    console.error(err)
  }
}

const getCss = (theme: Params['m']) => {
  return `
    @font-face {
      font-family: 'Pretendard';
      font-weight: 300;
      font-display: swap;
      src: local('Pretendard Light'),
        url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff2/Pretendard-Light.woff2') format('woff2'),
        url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff/Pretendard-Light.woff') format('woff');
    }
    @font-face {
      font-family: 'Pretendard';
      font-weight: 600;
      font-display: swap;
      src: local('Pretendard SemiBold'),
        url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2') format('woff2'),
        url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff/Pretendard-SemiBold.woff') format('woff');
    }
    * {
      font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo',
        Pretendard, Roboto, 'Noto Sans KR', 'Segoe UI', 'Malgun Gothic',
        sans-serif;
      background: ${theme === 'light' ? '#fff' : '#181818'};
      color: ${theme === 'light' ? '#121212' : '#c0c0c0'};
    }
    .title {
      color: ${theme === 'light' ? '#121212' : '#fff'};
    }
  `
}

export const getHtml = (props?: Omit<Params, 'y'>) => {
  const title = props ? props.t : 'DynamiSign'
  const description = props
    ? props.d
    : '이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.'
  const theme = props ? props.m : 'light'
  return `<!DOCTYPE html>
  <html>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      ${getCss(theme)}
      body {
        text-align: center;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        word-break: keep-all;
      }
      .container {
        padding: 4rem;
        max-width: 768px;
        margin: 0 auto;
      }
      .title {
        font-size: 5rem;
        font-weight: bold;
        line-height: 1.2;
        margin-bottom: 3rem;
      }
      .description {
        font-size: 2.5rem;
        line-height: 1.5;
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
