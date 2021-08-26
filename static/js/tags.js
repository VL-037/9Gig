$(document).ready(function () {
    let tags = $('.tags')
    const maxLength = 16
    for (let tag of tags) {
        const tagLength = tag.innerText.length
        let displayTag = tag.innerText.substring(0, maxLength)

        if (tagLength > maxLength) {
            displayTag += '...'
        }
        tag.innerText = displayTag
    }
})