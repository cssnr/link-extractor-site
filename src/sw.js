// Service Worker

const cacheName = 'v1'

const resources = [
    '/',
    '/docs/',
    '/faq/',
    '/screenshots/',

    '/css/bootstrap.css',
    '/css/docs.css',
    '/css/main.css',
    '/css/screenshots.css',
    '/css/uninstall.css',

    '/js/docs.js',
    '/js/faq.js',
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
    '/dist/ua-parser-js/ua-parser.min.js',

    '/config/tsparticles.json ',
    '/dist/tsparticles/tsparticles.bundle.min.js',

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
    try {
        const cache = await caches.open(cacheName)
        await cache.addAll(resources)
    } catch (e) {
        console.error(`cache.addAll error: ${e.message}`, e)
    }
}

const putInCache = async (request, response) => {
    console.debug(
        '%c putInCache:',
        'color: Yellow',
        `${request.url}`,
        request,
        response
    )
    try {
        const cache = await caches.open(cacheName)
        await cache.put(request, response)
    } catch (e) {
        console.error(`cache.put error: ${e.message}`, e)
    }
}

const cleanupCache = async (event) => {
    console.debug('%c cleanupCache:', 'color: Magenta', event)
    const keys = await caches.keys()
    console.debug('keys:', keys)
    for (const key of keys) {
        if (key !== cacheName) {
            console.log('%c Removing Old Cache:', 'color: Yellow', `${key}`)
            try {
                await caches.delete(key)
            } catch (e) {
                console.error(`caches.delete error: ${e.message}`, e)
            }
        }
    }
}

const fetchResponse = async (event) => {
    const responseFromCache = await caches.match(event.request)
    if (responseFromCache?.ok) {
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
    if (responseFromNetwork.ok) {
        const url = new URL(event.request.url)
        console.debug('%c checking url:', 'color: Magenta', url)
        if (resources.some((p) => p === url.pathname)) {
            await putInCache(event.request, responseFromNetwork.clone())
        }
    }
    return responseFromNetwork
}

self.addEventListener('fetch', (event) => {
    event.respondWith(fetchResponse(event))
})

self.addEventListener('install', (event) => {
    console.debug('%c install:', 'color: Cyan', event)
    self.skipWaiting()
    event.waitUntil(addResourcesToCache(resources))
})

self.addEventListener('activate', (event) => {
    console.debug('%c activate:', 'color: Cyan', event)
    event.waitUntil(cleanupCache(event))
})
