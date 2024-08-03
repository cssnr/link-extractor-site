// Service Worker

const resources = [
    '/',
    '/docs/',
    '/screenshots/',

    '/css/bootstrap.css',
    '/css/docs.css',
    '/css/main.css',
    '/css/screenshots.css',
    '/css/uninstall.css',

    '/js/docs.js',
    '/js/main.js',
    '/js/screenshots.js',
    '/js/theme.js',
    '/js/uninstall.js',
    '/js/vars.js',

    '/favicon.ico',
    '/apple-touch-icon.png',
    '/media/logo.png',
    '/media/images/chrome-omnibox.jpg',
    '/media/images/chrome-pin.jpg',
    '/media/images/edge-pin.jpg',
    '/media/images/firefox-pin.jpg',

    '/screenshots/01.jpg',
    '/screenshots/02.jpg',
    '/screenshots/03.jpg',
    '/screenshots/04.jpg',
    '/screenshots/05.jpg',
    '/screenshots/06.jpg',

    '/dist/animate/animate.min.css',
    '/dist/bootstrap/bootstrap.bundle.min.js',
    '/dist/clipboard/clipboard.min.js',

    '/dist/swiper/swiper-bundle.min.css',
    '/dist/swiper/swiper-bundle.min.js',

    '/dist/fontawesome/css/all.min.css',
    '/dist/fontawesome/webfonts/fa-brands-400.woff2',
    '/dist/fontawesome/webfonts/fa-regular-400.woff2',
    '/dist/fontawesome/webfonts/fa-solid-900.woff2',

    'https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/chrome_48.png',
    'https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/firefox_48.png',
    'https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/edge_48.png',
    'https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/opera_48.png',
    'https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/brave_48.png',
    'https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/chromium_48.png',
    'https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/yandex_48.png',
]

const addResourcesToCache = async (resources) => {
    console.debug('%c addResourcesToCache:', 'color: Cyan', resources)
    const cache = await caches.open('v1')
    await cache.addAll(resources)
}

const putInCache = async (request, response) => {
    console.debug('%c putInCache:', 'color: Yellow', request, response)
    const cache = await caches.open('v1')
    await cache.put(request, response)
}

const fetchResponse = async (event) => {
    const responseFromCache = await caches.match(event.request)
    if (responseFromCache) {
        console.debug(
            `%c responseFromCache:`,
            'color: LimeGreen',
            `${event.request.url}`,
            responseFromCache
        )
        return responseFromCache
    }

    const responseFromNetwork = await fetch(event.request)
    console.debug(
        `%c responseFromNetwork:`,
        'color: OrangeRed',
        `${event.request.url}`,
        responseFromNetwork
    )
    if (event.request.url.includes('/smashedr/logo-icons/')) {
        await putInCache(event.request, responseFromNetwork.clone())
    }
    return responseFromNetwork
}

self.addEventListener('fetch', (event) => {
    event.respondWith(fetchResponse(event))
})

self.addEventListener('install', (event) => {
    console.debug('%c install:', 'color: Cyan', event)
    event.waitUntil(addResourcesToCache(resources))
})
