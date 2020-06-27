// this is the code which will be injected into a given page...
(function () {
  const removeAnnoyingAnnoyances = function () {

    /*
     * 1) Iterate every DOM element.
     * 2) Detect evil elements, to mark for removal.
     * 3) Remove them, or just hide. Not sure yet.
     */
    let elems = window.document.body.getElementsByTagName("*")
    let toFix = []
    let len = elems.length
    for (let i = 0; i < len; i++) {
      let el = elems[i]
      if ($(el).is(":hidden")) {
        continue
      }
      let el_css = window.getComputedStyle(el, null)
      let css_bottom = Number((el_css.getPropertyValue('bottom') || '').replace(/[^\d.]+/g, ''))
      let css_top = Number((el_css.getPropertyValue('top') || '').replace(/[^\d.]+/g, ''))
      // let css_zindex = Number((el_css.getPropertyValue('z-index') || '').replace(/[^\d.]+/g, ''))

      /*
       * make list of all elements to fix
       */
      let isBad = false
      //
      // position:fixed = annoying!
      //
      // if it's fixed to top:0, allow to stay
      if (el_css.getPropertyValue('position') == 'fixed' && css_top > 0) {
        // if <header /> or <div class="header">, allow to stay
        if (
          el.tagName === 'HEADER' ||
          el.className.toLowerCase().includes('head')
        ) {
        } else {
          // if data-something = header-something, allow to stay
          let isHeader = false
          let dataset = el.dataset
          if (dataset) {
            for (let key in dataset) {
              if (dataset[key].includes('head')) {
                isHeader = true
              }
            }
          }
          // if not header, then remove
          if (!isHeader) {
            isBad = true
          }
        }
      }
      //
      // absolute and -10000 = don't trust it!
      //
      if (el_css.getPropertyValue('position') == 'absolute' && (css_top <= -100 || css_bottom <= -100)) {
        console.log('remove position:sticky bottom: ', el)
        isBad = true
      }
      //
      // absolute and 50% = popup
      //
      // if (el_css.getPropertyValue('position') == 'absolute' && css_top >= 10) {
      //   console.log('remove position:sticky bottom: ', el)
      //   isBad = true
      // }
      //
      // full-page-height overlay
      //
      // if (
      //   (el_css.getPropertyValue('position') == 'fixed' || css_zindex) &&
      //   (css_bottom === 0 && css_top === 0)
      // ) {
      //   console.log('remove position:sticky bottom: ', el)
      //   isBad = true
      // }
      //
      // sticky bottom = nasty!
      //
      if (el_css.getPropertyValue('position') == 'sticky' && css_bottom) {
        console.log('remove position:sticky bottom: ', el)
        isBad = true
      }
      //
      // is advertisement!
      //
      if (
        // called "ad" in className
        (el.className && el.className.match && (el.className.match(/Ad[A-Z]+/) || el.className.includes('-ad-') || el.className.substring(0, 3) === 'ad-')) ||
        // called "ad" in id
        (el.id && el.id.match && (el.id.match(/Ad[A-Z]+/) || el.id.includes('-ad-') || el.id.includes('_ads_')))
      ) {
        isBad = true
      }

      /*
       * mark element to be removed
       */
      if (isBad) {
        toFix.push(el)
      }
    }

    /*
     * Fix - remove (or hide) all bad elements.
     * If only hiding - then make sure not to iterate over same element the next time.
     * That is inefficient.
     */
    for (let el of toFix) {
      $(el).hide()
    }

  }

// immediately
  removeAnnoyingAnnoyances()
// after couple seconds
  setTimeout(removeAnnoyingAnnoyances, 1000)
  setTimeout(removeAnnoyingAnnoyances, 2000)
// after a while
  setTimeout(removeAnnoyingAnnoyances, 3000)
  setTimeout(removeAnnoyingAnnoyances, 5000)
  setTimeout(removeAnnoyingAnnoyances, 10000)
})()

/*
 * Legacy
 */
// just place a div at top right
// let div = document.createElement('div')
// div.style.position = 'fixed'
// div.style.top = 0
// div.style.right = 0
// div.style.zIndex = 999999
// div.textContent = 'Injected!'
// document.body.appendChild(div)