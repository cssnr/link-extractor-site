// JS for docs.html

document.addEventListener('DOMContentLoaded', domContentLoaded)

function domContentLoaded() {
    // console.debug('DOMContentLoaded')
    if (window.location.search.includes('?feedback=yes')) {
        history.pushState(null, '', location.href.split('?')[0])
        document.getElementById('feedback').classList.remove('d-none')
    }
    if (window.location.search.includes('?install=new')) {
        history.pushState(null, '', location.href.split('?')[0])
        const pinNotice = document.getElementById('pin-notice')
        pinNotice.classList.remove('d-none')
        pinNotice.addEventListener('click', pinClick)
        document.getElementById('new-install').classList.remove('d-none')
        window.addEventListener('focus', () => setTimeout(pinClick, 5000), {
            once: true,
        })
        if (document.hasFocus()) {
            setTimeout(pinClick, 5000)
        }
    }
    if (navigator.userAgent.includes('Firefox/')) {
        console.log('Detected Browser: Firefox')
        document
            .querySelectorAll('.firefox')
            .forEach((el) => el.classList.remove('d-none'))
    } else if (navigator.userAgent.includes('Edg/')) {
        console.log('Detected Browser: Edge')
        document
            .querySelectorAll('.edge')
            .forEach((el) => el.classList.remove('d-none'))
    } else {
        console.log('Detected Browser: Chromium/Other')
        document
            .querySelectorAll('.chromium')
            .forEach((el) => el.classList.remove('d-none'))
    }
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
