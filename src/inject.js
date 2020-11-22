/*
 * NOTES:
 * - do not hide full-width full-height overlays - instead, find the "x" button and click on it
 */

// this is the code which will be injected into a given page...
(function(){
  console.clear()

  const removeAA = function(el, el_css, because=''){
    //
    console.warn('REMOVE '+el_css.position, because ? 'because '+because : '', [el.id, el.className, el.style.display, el.innerText])
    console.log(el);
    el.remove()
  }
  const hideAA = function(el, el_css, because=''){
    //
    console.warn('HIDE '+el_css.position, because ? 'because '+because : '', [el.id, el.className, el.style.display, el.innerText])
    console.log(el);
    el.style.setProperty('display', 'none', 'important')
    el.style.setProperty('opacity', '0', 'important')
    el.style.setProperty('visibility', 'hidden', 'important')
    el.style.setProperty('pointer-events', 'none', 'important')
  }
  const invisibleAA = function(el, el_css, because=''){
    //
    console.warn('INVISIBLE '+el_css.position, because ? 'because '+because : '', [el.id, el.className, el.style.display, el.innerText])
    console.log(el);
    // el.style.setProperty('display', 'none', 'important')
    el.style.setProperty('opacity', '0', 'important')
    el.style.setProperty('visibility', 'hidden', 'important')
    el.style.setProperty('pointer-events', 'none', 'important')
  }

  const is_gif_image = function(i) {
    return /^(?!data:).*\.gif/i.test(i.src);
  }
  const freeze_gif = function(i) {
    let c = document.createElement('canvas');
    let w = c.width = i.width;
    let h = c.height = i.height;
    c.getContext('2d').drawImage(i, 0, 0, w, h);
    try {
      i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
    } catch(e) { // cross-domain -- mimic original with all its tag attributes
      for (let j = 0, a; a = i.attributes[j]; j++)
        c.setAttribute(a.name, a.value);
      i.parentNode.replaceChild(c, i);
    }
  }

  const removeAnnoyingAnnoyances = function () {
    if (!window.getelbyid) {
      window.getelbyid = function(selector) {
        window.el = document.querySelector(selector)
      }
    }
    if (!window.el) {
      window.el = window.getelbyid
    }
    console.warn(' -------------------------------------- running extension removeAnnoyingAnnoyances() -------------------------------------- ')

    /*
     * FREEZE GIFs
     */
      // ([]).slice.apply(document.images).filter(is_gif_image).map(freeze_gif);

    /*
     * Remove animated (gif) favicons
     */
    // let favicon = document.querySelector('link[rel*="icon"]')
    // console.log('favicon',favicon)
      // .href = "//placehold.it/32/F00"

    /*
     * body should always be scrollable
     */
    document.body.style.setProperty('overflow', 'auto', 'important')

    /*
     * 1) Iterate every DOM element.
     * 2) Detect evil elements, to mark for removal.
     * 3) Remove them, or just hide. Not sure yet.
     */
    let elems = window.document.body.getElementsByTagName("*")
    let len = elems.length
    for_each_element:
    for (let i = 0; i < len; i++) {
      let el = elems[i]
      if (!('className' in el) || !('innerText' in el)) {
        continue;
      }
      // let el = document.querySelector('')
      let el_css = window.getComputedStyle(el, null)
      let el_class = el.className.toLowerCase()

      /*
       * el already hidden: no need to hide again
       */
      if (el_css.display === 'none' || !el_css.height) {
        continue
      }

      /*
       * REMOVE GIPHY
       */
      if (el.tagName === 'IFRAME') {
        if (el.src.includes('giphy')) {
          invisibleAA(el, el_css, 'giphy iframe')
          continue;
        }
      }

      /*
       *
       * FIXED/STATIC
       *
       */
      if (el_class.includes('fancybox')) {
        hideAA(el, el_css, 'fancybox')
      }

        /*
         *
         * FIXED/STATIC
         *
         */
      if (el_css.position === 'fixed' || el_css.position === 'sticky') {

        let el_css = window.getComputedStyle(el, null)
        let el_class = el.className.toLowerCase()
        let el_innerText = el.innerText ? el.innerText.substr(0, 150).replace(/[^\w\d]+/g,'').toLowerCase() : ''
        let el_paddingSides = Number((el_css.paddingLeft || '').replace(/[^\d.]+/g, '')) + Number((el_css.paddingRight || '').replace(/[^\d.]+/g, ''))
        let el_paddingTop = Number((el_css.paddingTop || '').replace(/[^\d.]+/g, '')) + Number((el_css.paddingBottom || '').replace(/[^\d.]+/g, ''))
        let el_height = (el_css.height ? Number(el_css.height.replace(/[^0-9]/g, '')) : 0) + el_paddingTop
        let el_width = (el_css.width ? Number(el_css.width.replace(/[^0-9]/g, '')) : 0) + el_paddingSides
        let el_bottom = Number((el_css.getPropertyValue('bottom') || '').replace(/[^\d.]+/g, '')) + Number((el_css.marginBottom || '').replace(/[^\d.]+/g, ''))
        let el_right = Number((el_css.getPropertyValue('right') || '').replace(/[^\d.]+/g, '')) + Number((el_css.marginRight || '').replace(/[^\d.]+/g, ''))
        let el_top = Number((el_css.getPropertyValue('top') || '').replace(/[^\d.]+/g, '')) + Number((el_css.marginTop || '').replace(/[^\d.]+/g, ''))
        let el_buttons = [
          ...el.querySelectorAll('a'),
          ...el.querySelectorAll('button'),
          ...[...el.querySelectorAll('*')]
            .filter(el=>((el.className?el.className.toString():'').toLowerCase().includes('button')||(el.id||'').toLowerCase().includes('button')))
        ]
        let is_cookies = el_innerText.includes('cookies')
        let el_iframes = el.querySelectorAll('iframe')

        /*
         * ------------------------------------------- ALLOW HEADER AND NAV -------------------------------------------
         */

        /*
         *
         * ALLOW FIXED HEADER
         * ALLOW FIXED TO TOP 0 (LIKE HEADER MIGHT BE)
         *
         */
        if (!is_cookies) {
          if (
            el.tagName === 'HEADER' ||
            el_class.includes('head') ||
            (el_top === 0 && el_right === 0 && el_height<=200)
          ) {
            continue;
          }
          if (el.dataset) {
            for (let key in el.dataset) {
              if (el.dataset[key].includes('head')) {
                continue for_each_element;
              }
            }
          }
        }

        /*
         * ALLOW TOP NAV LINKS
         */
        if (el_top < 50 && el_width < 300) {
          continue
        }

        /*
         * ------------------------------------------ REMOVE GARBAGE - BELOW ------------------------------------------
         */

        /*
         * is an iframe less than 200px tall!
         * -
         * that is too sneaky. No external page < 200px is up to any good
         */
        if (el.tagName === 'IFRAME') {
          if (el_height < 200) {
            hideAA(el, el_css, 'element is or contains iframe < 200px tall')
            continue;
          }
        }

        /*
         * is advertisement!
         */
        if (
          // called "ad" in className or id
          el_class.substr(0, 3) === 'ad-' ||
          el_class.includes('-ad-') ||
          el.id.includes('-ad-') ||
          el.id.includes('_ad_') ||
          el.id.includes('_ads_') ||
          ((el.className.match && el.className.match(/Ad[A-Z]+/))) ||
          (el.id.match && (el.id.match(/Ad[A-Z]+/)))
        ) {
          // remove!
          hideAA(el, el_css, 'is advertisement className/id')
          continue;
        }

        /*
         * is notification!
         */
        if (el_class.includes('notification')) {
          // remove!
          hideAA(el, el_css, 'is notification className')
          continue;
        }

        /*
         * is notification!
         */
        if (el_class.includes('subscribe')) {
          // remove!
          hideAA(el, el_css, 'is subscribe className')
          continue;
        }

        /*
         *
         * IF (EL_CSS.POSITION === 'FIXED') {
         *
         */
        if (el_css.position === 'fixed') {

          /*
           * is google sign in - intrusive!
           */
          if (el.id === 'credential_picker_container') {
            // remove!
            hideAA(el, el_css, 'is credential_picker_container id')
            continue;
          }

          /*
           * site ad
           * -
           * if very narrow, and has some call to action
           */
          if (el_height < 100 && el_innerText.includes('$')) {
            // remove!
            hideAA(el, el_css, 'height < 100 and innerText includes "$"')
            continue;
          }

          /*
           * is ad popup
           */
          if (el_class.includes('popup')) {
            // remove!
            hideAA(el, el_css, 'is class="popup"')
            continue;
          }

          /*
           * is pay wall
           */
          if (el_class.includes('paywall')) {
            // remove!
            hideAA(el, el_css, 'is pay wall')
            document.body.style.overflow = 'auto'
            let body_children = [...document.body.querySelectorAll('> div')]
            if (body_children.length<5) {
              for (let elb of body_children) {
                elb.style.overflow = 'auto'
              }
            }
            continue;
          }

          /*
           * IFRAME
           * -
           * remove entire element if contains unwanted iframe
           */
          for (let elb of el_iframes) {
            let elb_height = (el_css.height ? Number(el_css.height.replace(/[^0-9]/g, '')) : 0)
            if (elb_height<300) {
              hideAA(el, el_css, 'contains shallow iframe')
            }
          }

          /*
           * CLICK NON-FIXED CHILD BUTTON of fixed banner/popup
           * -
           * "X", "continue", "accept", etc
           */
          for (let elb of el_buttons) {
            let nothanks = ["nothanks","continue","ok","accept",'allowcookies','acceptcookies','thanks','notnow','yesimhappy']
            let elb_class = elb.className.toLowerCase()
            let elb_innerText = (elb.innerText||elb.value||'').substring(0, 100).toLowerCase().replace(/[^\w\d]+/g, '')
            //
            // if cookies, accpept them
            if (is_cookies) {
              if (nothanks.includes(elb_innerText)) {
                elb.click()
                continue for_each_element
              }
            }
            // if [X] button
            if (elb_innerText === "close" || elb_innerText === "x" || elb_innerText === "×" || (elb.ariaLabel || '').toLowerCase().includes('close')) {
              elb.click()
              hideAA(el, el_css, '"X" "close" button')
              continue for_each_element
            }
            // if className mentions
            if (elb_class.includes('dismiss')||elb_class.includes('close')) {
              elb.click()
              hideAA(el, el_css, '"dismiss" button')
              continue for_each_element
            }
            // if innerText equals
            if (nothanks.includes(elb_innerText)) {
              hideAA(el, el_css, '"continue" "ok" "accept" button')
              continue for_each_element
            }
          }
        }
      }
    }

  }

  // on page load, as soon as elements are loaded, destroy them!
  setTimeout(removeAnnoyingAnnoyances.bind({timeout:0}), 0);
  setTimeout(removeAnnoyingAnnoyances.bind({timeout:1000}), 1000);
  setTimeout(removeAnnoyingAnnoyances.bind({timeout:2000}), 2000);
  setTimeout(removeAnnoyingAnnoyances.bind({timeout:4000}), 4000);
  setTimeout(removeAnnoyingAnnoyances.bind({timeout:6000}), 6000);
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