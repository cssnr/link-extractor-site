// Service Worker

const cacheName = 'v1'

const cacheFirstResources = [
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

const preCacheResources = [
    '/',
    '/docs/',
    '/faq/',
    '/screenshots/',
    '/uninstall/',
]

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
    // console.debug('%c putInCache Success', 'color: Lime')
}

const cleanupCache = async (event) => {
    console.debug('%c cleanupCache:', 'color: Coral', event)
    const keys = await caches.keys()
    console.debug('keys:', keys)
    for (const key of keys) {
        if (key !== cacheName) {
            console.log('%c Removing Old Cache:', 'color: Yellow', key)
            try {
                await caches.delete(key)
            } catch (e) {
                console.error(`caches.delete error: ${e.message}`, e)
            }
        }
    }
}

// const setOffline = async (event) => {
//     console.debug('setOffline:', event.clientId)
//     if (!event.clientId) {
//         return
//     }
//     const client = await self.clients.get(event.clientId)
//     console.debug('client:', client)
//     if (!client) {
//         return
//     }
//
//     // Send a message to the client.
//     const message = { offline: true }
//     console.debug('client.postMessage:', message)
//     client.postMessage(message)
// }

const cacheFirst = async (event) => {
    console.debug('%c cacheFirst:', 'color: Aqua', event.request.url)

    const responseFromCache = await caches.match(event.request)
    if (responseFromCache?.ok) {
        return responseFromCache
    }

    try {
        const responseFromNetwork = await fetch(event.request)
        if (responseFromNetwork?.ok) {
            // noinspection ES6MissingAwait
            putInCache(event.request, responseFromNetwork.clone())
        }
        return responseFromNetwork
    } catch (e) {
        console.debug(`fetch error: %c ${e.message}`, 'color: OrangeRed')
    }

    console.debug('%c No Cache or Network:', 'color: Red', event.request.url)
    return new Response('No Cache or Network Available', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
    })
}

const networkFirst = async (event) => {
    console.debug('%c networkFirst:', 'color: Coral', event.request.url)

    try {
        const responseFromNetwork = await fetch(event.request)
        if (responseFromNetwork?.ok) {
            // noinspection ES6MissingAwait
            putInCache(event.request, responseFromNetwork.clone())
            return responseFromNetwork
        }
    } catch (e) {
        console.debug(`fetch error: %c ${e.message}`, 'color: OrangeRed')
    }

    const responseFromCache = await caches.match(event.request)
    if (responseFromCache?.ok) {
        return responseFromCache
    }

    console.debug('%c No Network or Cache:', 'color: Red', event.request.url)
    return new Response('No Network or Cache Available', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
    })
}

/**
 *
 * @param {URL} url
 * @return {boolean}
 */
function matchResource(url) {
    return cacheFirstResources.some((p) => url.pathname === p || url.href === p)
}

async function fetchResponse(event) {
    // console.debug('fetchResponse:', event.request)
    // console.debug('event.request.url:', event.request.url)
    const url = new URL(event.request.url)
    // console.debug('url:', url)
    // console.debug('url.pathname:', url.pathname)
    const match = matchResource(url)
    // console.debug('match:', match)
    if (
        event.request.method !== 'GET' ||
        (!match && self.location.origin !== url.origin)
    ) {
        console.debug('%c Excluded:', 'color: Yellow', event.request.url)
        return
    }
    if (match) {
        return event.respondWith(cacheFirst(event))
    }
    return event.respondWith(networkFirst(event))
}

self.addEventListener('fetch', fetchResponse)

self.addEventListener('install', (event) => {
    console.debug('%c install:', 'color: Cyan', event)
    const resources = [].concat(cacheFirstResources, preCacheResources)
    event.waitUntil(addResourcesToCache(resources))
    // noinspection JSIgnoredPromiseFromCall
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    console.debug('%c activate:', 'color: Cyan', event)
    event.waitUntil(cleanupCache(event))
})
