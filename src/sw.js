// Service Worker

const resources = [
    '/',
    '/docs/',
    '/screenshots/',

    '/css/docs.css',
    '/css/main.css',
    '/css/screenshots.css',
    '/css/uninstall.css',
    '/css/bootstrap.css',

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
    '/dist/fontawesome/webfonts/fa-solid-900.woff2 ',
]

const addResourcesToCache = async (resources) => {
    console.debug('resources:', resources)
    const cache = await caches.open('v1')
    await cache.addAll(resources)
}

const putInCache = async (request, response) => {
    console.debug('%c putInCache:', 'color: yellow', request, response)
    const cache = await caches.open('v1')
    await cache.put(request, response)
}

self.addEventListener('install', (event) => {
    console.debug('install:', event)
    event.waitUntil(addResourcesToCache(resources))
})

self.addEventListener('fetch', async (event) => {
    // console.debug('fetch:', event.request.url)

    const responseFromCache = await caches.match(event.request)
    if (responseFromCache) {
        console.debug(
            `%c responseFromCache:`,
            'color: green',
            `${event.request.url}`,
            responseFromCache
        )
        return responseFromCache
    }

    const responseFromNetwork = await fetch(event.request)
    // console.debug('event.request:', event.request)
    // const url = new URL(event.request.url)
    console.debug(
        `%c responseFromNetwork:`,
        'color: red',
        `${event.request.url}`,
        responseFromNetwork
    )
    if (event.request.url.includes('/smashedr/logo-icons/master/browsers/')) {
        await putInCache(event.request, responseFromNetwork.clone())
    }
    return responseFromNetwork
})

// self.addEventListener('push', async (event) => {
//     console.debug('push:', event)
//     const body = event.data.text()
//     console.debug('body:', body)
//     let notification = await self.registration.showNotification('Title', {
//         body: body,
//     })
//     console.debug('notification:', notification)
// })
