// Service Worker

const cacheName = 'v1'

const resources = [
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

const live = ['/', '/docs/', '/faq/', '/uninstall/']

// const excludes = []

const addResourcesToCache = async (resources) => {
    console.debug('%c addResourcesToCache:', 'color: Cyan', resources)
    // for (const resource of resources) {
    //     let url
    //     if (resource.startsWith('http')) {
    //         url = resource
    //     } else {
    //         url = `${self.origin}${resource}`
    //     }
    //     console.log(`url: ${url}`)
    //     const response = await fetch(url)
    //     console.log(`status: ${response.status}`)
    // }
    try {
        const cache = await caches.open(cacheName)
        await cache.addAll(resources)
    } catch (e) {
        console.error(`cache.addAll error: ${e.message}`, e)
    }
}

const putInCache = async (request, response) => {
    console.debug('%c putInCache:', 'color: Khaki', `${request.url}`)
    try {
        const cache = await caches.open(cacheName)
        await cache.put(request, response)
    } catch (e) {
        console.error(`cache.put error: ${e.message}`, e)
    }
}

const cleanupCache = async (event) => {
    console.debug('%c cleanupCache:', 'color: Coral', event)
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

const cacheFirst = async (event) => {
    console.debug('%ccacheFirst:', 'color: Aqua', event.request.url)

    const responseFromCache = await caches.match(event.request)
    if (responseFromCache?.ok) {
        return responseFromCache
    }

    try {
        const responseFromNetwork = await fetch(event.request)
        if (responseFromNetwork?.ok) {
            // await putInCache(event.request, responseFromNetwork.clone())
            // noinspection ES6MissingAwait
            putInCache(event.request, responseFromNetwork.clone())
        }
        return responseFromNetwork
    } catch (e) {
        console.debug(`fetch error: ${e.message}`, 'color: OrangeRed')
    }

    console.debug('%cNo Cache or Network:', 'color: Red', event.request.url)
    return new Response('No Cache or Network Available', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
    })
}

const networkFirst = async (event) => {
    console.debug('%cnetworkFirst:', 'color: Coral', event.request.url)

    try {
        const responseFromNetwork = await fetch(event.request)
        if (responseFromNetwork?.ok) {
            // await putInCache(event.request, responseFromNetwork.clone())
            putInCache(event.request, responseFromNetwork.clone()).then()
            return responseFromNetwork
        }
    } catch (e) {
        console.debug(`fetch error: ${e.message}`, 'color: OrangeRed')
    }

    const responseFromCache = await caches.match(event.request)
    if (responseFromCache?.ok) {
        return responseFromCache
    }

    console.debug('%cNo Network or Cache:', 'color: Red', event.request.url)
    return new Response('No Network or Cache Available', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
    })
}

async function fetchResponse(event) {
    // console.debug('fetchResponse:', event.request)
    const url = new URL(event.request.url)
    // console.debug('url:', url)
    if (
        event.request.method !== 'GET' ||
        self.location.origin !== url.origin // || excludes.some((e) => url.pathname.startsWith(e))
    ) {
        console.debug('%cExcluded Request:', 'color: Yellow', event.request.url)
        return
    }
    // console.debug('pathname:', url.pathname)
    if (live.some((e) => url.pathname === e)) {
        return event.respondWith(networkFirst(event))
    }
    return event.respondWith(cacheFirst(event))
}

self.addEventListener('fetch', fetchResponse)

self.addEventListener('install', (event) => {
    console.debug('%c install:', 'color: Cyan', event)
    // noinspection JSIgnoredPromiseFromCall
    self.skipWaiting()
    event.waitUntil(addResourcesToCache([].concat(resources, live)))
})

self.addEventListener('activate', (event) => {
    console.debug('%c activate:', 'color: Cyan', event)
    event.waitUntil(cleanupCache(event))
})
