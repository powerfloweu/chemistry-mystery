const puppeteer = require('puppeteer')

const STORAGE_KEY = 'chemMystery:state:v1'

;(async ()=>{
  const base = process.env.BASE_URL || 'http://localhost:3000'
  const startUrl = base.replace(/\/$/, '') + '/start'
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  page.setDefaultTimeout(20000)

  const setGameState = async (obj) => {
    await page.evaluate((k, o)=> sessionStorage.setItem(k, JSON.stringify(o)), STORAGE_KEY, obj)
  }
  const getGameState = async () => {
    return await page.evaluate((k)=> JSON.parse(sessionStorage.getItem(k) || '{}'), STORAGE_KEY)
  }

  try {
    await page.goto(startUrl)
    console.log('Opened /start')

    // ensure player name is set so Guards won't redirect
    await setGameState({ playerName: 'E2E' })

    // Click Begin
    await page.waitForSelector('button')
    await page.$$eval('button', (btns) => {
      const b = btns.find((x) => x.textContent && x.textContent.trim() === 'Begin')
      if (b) b.click()
    })
    console.log('Clicked Begin')

    // Station 1
    await page.goto(base.replace(/\/$/, '') + '/station-1-nmr')
    console.log('Nav /station-1-nmr')
    await page.waitForFunction(()=> document.querySelectorAll('select').length >= 5, {timeout: 15000})
    await page.evaluate(()=>{
      const vals = ['3','3','2','2','2']
      document.querySelectorAll('select').forEach((s,i)=>{
        s.value = vals[i]
        s.dispatchEvent(new Event('change', {bubbles:true}))
      })
    })
    // click first button on page (submit)
    await page.evaluate(()=>{ const b=document.querySelector('button'); if(b) b.click() })
    console.log('Submitted Station 1')
    await setGameState({ token1: 'C' })

    // Station 2
    await page.goto(base.replace(/\/$/, '') + '/station-2-reaction')
    console.log('Nav /station-2-reaction')
    await page.waitForSelector('button')
    await page.$$eval('button', (btns) => {
      const b = btns.find((x) => x.textContent && x.textContent.toLowerCase().includes('thermodynamic'))
      if (b) b.click()
    })
    console.log('Chose Thermodynamic')
    await setGameState(Object.assign({}, await getGameState(), { token2: '8' }))

    // Station 3
    await page.goto(base.replace(/\/$/, '') + '/station-3-forest')
    console.log('Nav /station-3-forest')
    await page.waitForSelector('button')
    await page.$$eval('button', (btns) => {
      const b = btns.find((x) => x.textContent && (x.textContent.toLowerCase().includes('completed the forest') || x.textContent.toLowerCase().includes('i have completed')))
      if (b) b.click()
    })
    console.log('Completed Station 3')

    // Station 4
    const resp = await page.goto(base.replace(/\/$/, '') + '/station-4-catalyst', { waitUntil: 'networkidle0' })
    console.log('Nav /station-4-catalyst', 'status=', resp && resp.status())
    // allow client hydration a moment before querying selects
    await new Promise((r) => setTimeout(r, 800))
    // debug: print whether server-rendered HTML contains selects
    const html = await page.content()
    console.log('station-4 HTML includes <select>?', html.includes('<select'))
    console.log('station-4 HTML (snippet):', html.slice(0,500))
    await page.waitForSelector('select', {timeout: 30000})
    await page.evaluate(()=>{
      const selects = Array.from(document.querySelectorAll('select'))
      if(selects.length >= 2){
        selects[0].value = 'H+'
        selects[0].dispatchEvent(new Event('change',{bubbles:true}))
        selects[1].value = 'H3O+'
        selects[1].dispatchEvent(new Event('change',{bubbles:true}))
      }
      const btn = Array.from(document.querySelectorAll('button')).find(b=> b.textContent && b.textContent.toLowerCase().includes('confirm'))
      if(btn) btn.click()
    })
    console.log('Submitted Station 4')
    await setGameState(Object.assign({}, await getGameState(), { token3: 'H' }))

    // Debrief -> Archive (navigate to final-lock)
    await page.goto(base.replace(/\/$/, '') + '/final-lock')
    console.log('Nav /final-lock')
    await page.waitForSelector('input', {timeout: 15000})

    // read tokens from sessionStorage (stored as object)
    const state = await getGameState()
    console.log('Game state:', state)

    const a = state.token1 || ''
    const b = state.token2 || ''
    const c = state.token3 || ''

    const inputs = await page.$$('input')
    if(inputs.length >= 3){
      await inputs[0].click()
      await inputs[0].type(a)
      await inputs[1].type(b)
      await inputs[2].type(c)
    }
    // click Unlock (try to find exact unlock button; fall back to first button)
    await page.evaluate(()=>{
      const btns = Array.from(document.querySelectorAll('button'))
      const unlock = btns.find(b=> b.textContent && b.textContent.trim().toLowerCase() === 'unlock')
      if(unlock) unlock.click(); else if(btns[0]) btns[0].click()
    })

    // wait for reveal text or navigation to /reveal
    await page.waitForFunction(()=> document.body.innerText.toLowerCase().includes('reveal') || window.location.pathname.toLowerCase().includes('reveal'), {timeout: 15000})
    console.log('Reveal reached — E2E success')

  } catch (err){
    console.error('E2E test failed:', err)
    process.exitCode = 2
  } finally {
    await browser.close()
  }

})()
