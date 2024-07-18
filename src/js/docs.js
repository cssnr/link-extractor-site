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
    }
    if (navigator.userAgent.includes('Firefox/')) {
        console.log('Firefox')
        document
            .querySelectorAll('.firefox')
            .forEach((el) => el.classList.remove('d-none'))
    } else if (navigator.userAgent.includes('Edg/')) {
        console.log('Edge')
        document
            .querySelectorAll('.edge')
            .forEach((el) => el.classList.remove('d-none'))
    } else {
        console.log('Chromium/Other')
        document
            .querySelectorAll('.chromium')
            .forEach((el) => el.classList.remove('d-none'))
    }
}

/**
 * Pin Animation Click Callback
 * @function pinClick
 * @param {MouseEvent} event
 */
function pinClick(event) {
    const div = event.target.closest('div')
    console.log('div:', div)
    div.classList.add('d-none')
}
