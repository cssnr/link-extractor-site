// JS for faq.html

document.addEventListener('DOMContentLoaded', domContentLoaded)

const container = document.getElementById('faq')
const collapses = container.querySelectorAll('.collapse')
// console.log('collapses:', collapses)

const expandAll = document.getElementById('expand-all')
expandAll.addEventListener('click', (el) => {
    const expand = el.currentTarget.dataset.expand
    const span = el.currentTarget.querySelector('span')
    const icon = el.currentTarget.querySelector('i')
    const up = 'fa-arrow-up-short-wide'
    const down = 'fa-arrow-down-short-wide'
    let show
    if (expand === 'true') {
        show = true
        el.currentTarget.dataset.expand = 'false'
        span.textContent = 'Collapse All'
        icon.classList.remove(down)
        icon.classList.add(up)
    } else {
        show = false
        el.currentTarget.dataset.expand = 'true'
        span.textContent = 'Expand All'
        icon.classList.remove(up)
        icon.classList.add(down)
    }
    collapses.forEach((collapseElement) => {
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: false,
        })
        if (show) {
            bsCollapse.show()
        } else {
            bsCollapse.hide()
        }
    })
})

collapses.forEach((el) => {
    // console.log('el:', el.previousElementSibling)
    const icon = el.previousElementSibling.querySelector('i')
    // console.log('icon:', icon)
    el.addEventListener('show.bs.collapse', (event) => {
        // console.log('event:', event)
        // window.location.hash = `#${el.id}`
        icon.classList.add('fa-rotate-90')
    })
    el.addEventListener('hide.bs.collapse', (event) => {
        // console.log('event:', event)
        icon.classList.remove('fa-rotate-90')
    })
})

function domContentLoaded() {
    // console.debug('DOMContentLoaded')
    const url = new URL(window.location)
    if (url.searchParams.has('feedback')) {
        history.pushState(null, '', location.href.split('?')[0])
        document.getElementById('feedback').classList.remove('d-none')
    }
    processBrowser()
    if (url.hash) {
        console.log('url.hash:', url.hash)
        const bsCollapse = new bootstrap.Collapse(url.hash, {
            toggle: false,
        })
        // console.log('bsCollapse:', bsCollapse)
        bsCollapse.show()
    }
}
