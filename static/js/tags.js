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

    var checkedTagId =[]
    const tagLimit = 5
    $('input.tag-form').on('change', function () {
        $('#empty-tag').css("display", "none")
        if ($(this).siblings(':checked').length >= tagLimit) {
            this.checked = false;
            $('#max-tag').css("display", "block")
        } else {
            $('#max-tag').css("display", "none")
            var tagId = $(this).attr('id')
            var label = $("label[for='" + tagId + "']");
            $(label).toggleClass('btn-primary btn-outline-dark')

            if (this.checked) {
                checkedTagId.push($(this).val())
                console.log(checkedTagId)
            } else {
                checkedTagId.splice($(this).val(), 1)
            }
        }
    });

    $('#create-form').submit(function (e) {
        if (checkedTagId.length === 0) {
            e.preventDefault()
            $('#empty-tag').css("display", "block")
        } else {
            checkedTagId = []
        }
    })
    
    $('#tags-table').DataTable( {
        "order": [[ 0, "asc" ]]
    } );
})