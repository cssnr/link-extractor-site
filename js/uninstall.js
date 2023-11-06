// JS uninstall.html

const webhook =
    'https://discord.com/api/webhooks/242137648028712961/4xM7SXClH_i8we_epG6AXMaqhueg5L5oAVf1dnLw1_el05OxZ-JVfph-QrcQwPkOMJem'

const countEl = document.getElementById('inputCount')
const submitBtn = document.getElementById('submit')

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded')
})

document
    .getElementById('uninstallFeedback')
    .addEventListener('input', function (event) {
        countEl.innerHTML = this.value.length
    })

document.getElementById('uninstall').addEventListener('submit', formSubmit)

function formSubmit(event) {
    console.log('formSubmit:', event, this)
    event.preventDefault()
    if (!(this[0].checked || this[1].checked || this[2].value)) {
        console.warn('No Data to Send.')
    } else {
        submitBtn.classList.add('disabled')
        const lines = [
            'Uninstall Feedback.',
            `Not Used: **${this[0].checked}**`,
            `Not Working: **${this[1].checked}**`,
            '```\n' + `${this[2].value || 'No Reason Provided.'}` + '\n```',
        ]
        const xhr = new XMLHttpRequest()
        xhr.open('POST', webhook)
        xhr.setRequestHeader('Content-type', 'application/json')
        const params = {
            username: 'Link Extractor',
            avatar_url: 'https://link-extractor.cssnr.com/images/logo.png',
            content: lines.join('\n'),
        }
        xhr.onload = () => {
            console.log('xhr.status: ', xhr.status)
            submitBtn.classList.remove('disabled')
            if (xhr.status >= 200 && xhr.status <= 299) {
                console.log('SUCCESS')
                window.location = '/'
            } else {
                console.log(`ERROR: ${xhr.status}`)
                const errorEl = document.getElementById('error')
                errorEl.textContent = `Submission Error: ${xhr.status}`
                errorEl.style.display = 'block'
            }
        }
        xhr.send(JSON.stringify(params))
    }
}
