// JS for docs.html

document.addEventListener('DOMContentLoaded', domContentLoaded)

function domContentLoaded() {
    // console.debug('DOMContentLoaded')
    const url = new URL(window.location)
    if (url.searchParams.has('install')) {
        history.pushState(null, '', location.href.split('?')[0])
        document.getElementById('new-install').classList.remove('d-none')
        const pinNotice = document.getElementById('pin-notice')
        pinNotice.classList.remove('d-none')
        pinNotice.addEventListener('click', pinClick)
        window.addEventListener('focus', () => setTimeout(pinClick, 6000), {
            once: true,
        })
        if (document.hasFocus()) {
            setTimeout(pinClick, 6000)
        }
    }
    processBrowser()
}

/**
 * Pin Animation Click Callback
 * @function pinClick
 */
function pinClick() {
    const pinNotice = document.getElementById('pin-notice')
    // console.debug('pinNotice:', pinNotice)
    pinNotice.classList.add('d-none')
}
