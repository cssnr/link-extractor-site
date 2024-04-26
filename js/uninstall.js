// JS uninstall.html

const uninstallMessage = 'Uninstall Feedback for Link Extractor.'
const discordUsername = 'Link Extractor'
const discordAvatar = 'https://link-extractor.cssnr.com/media/logo.png'

const uninstallForm = document.getElementById('uninstall-form')
const uninstallResponse = document.getElementById('uninstall-response')
const inputCount = document.getElementById('input-count')
const submitBtn = document.getElementById('submit-btn')
const errorAlert = document.getElementById('error-alert')

uninstallForm.addEventListener('submit', formSubmit)
uninstallResponse.addEventListener('input', function (e) {
    inputCount.textContent = this.value.length
})

async function formSubmit(event) {
    console.debug('formSubmit:', event, this)
    event.preventDefault()
    errorAlert.style.display = 'none'
    const url = this[0].value
    const notUsed = this[1].checked
    const notExpected = this[2].checked
    const notWorking = this[3].checked
    const feedbackText = this[4].value
    if (!(notUsed || notExpected || notWorking || feedbackText)) {
        return console.warn('No Data to Send.')
    }
    submitBtn.classList.add('disabled')
    const lines = [
        uninstallMessage,
        `\`${navigator.userAgent}\``,
        `${getBoolIcon(notUsed)} Not Used`,
        `${getBoolIcon(notExpected)} Not as Expected`,
        `${getBoolIcon(notWorking)} Not Working`,
    ]
    if (feedbackText) {
        lines.push(`\`\`\`\n${feedbackText}\n\`\`\``)
    }
    // console.debug('lines:', lines)
    const response = await sendDiscord(url, lines.join('\n'))
    console.debug('response:', response)
    submitBtn.classList.remove('disabled')
    if (response.status >= 200 && response.status <= 299) {
        console.debug('Success')
        window.location = '/'
    } else {
        console.warn(`Error ${response.status}`, response)
        errorAlert.textContent = `Error ${response.status}: ${response.statusText}`
        errorAlert.style.display = 'block'
    }
}

async function sendDiscord(url, content) {
    // console.debug('sendDiscord', url, content)
    const body = {
        username: discordUsername,
        avatar_url: discordAvatar,
        content: content,
    }
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
    return await fetch(url, opts)
}

function getBoolIcon(value) {
    if (value) {
        return '✅'
    } else {
        return '🔳'
    }
}
