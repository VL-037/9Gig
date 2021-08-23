$(document).ready(function() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    
    $('.upvote-form').submit(function(e) {
        e.preventDefault();
        const postId = $(this).data('id').trim()
        const btnId = $(this).find("input[type=submit]:focus").prevObject[0][0].id
        const upSpan = $(this).find('span')
        const downSpan = $('.downvote-form').find(`span[id=${postId}downspan]`)

        let upvoteNum = parseInt(upSpan.text())
        let downvoteNum = parseInt(downSpan.text())
        
        if($('#' + postId + 'upbtn').hasClass('btn-primary')) upvoteNum--
        else upvoteNum++

        if($('#' + postId + 'downbtn').hasClass('btn-primary')){
            $('#' + postId + 'downbtn').toggleClass('btn-primary btn-secondary');
            downvoteNum--
        }

        $('#' + btnId).toggleClass('btn-primary btn-secondary')
        
        upSpan.text(upvoteNum)
        downSpan.text(downvoteNum)
        
        if((window.location.href).includes('posts/' + postId)){
            $.ajax({
                type: 'PUT',
                url: postId + '/vote-up'
            })
        } else {
            $.ajax({
                type: 'PUT',
                url: 'posts/' + postId + '/vote-up'
            })
        }
    })
    
    $('.downvote-form').submit(function(e) {
        e.preventDefault();
        const postId = $(this).data('id').trim()
        const btnId = $(this).find("input[type=submit]:focus").prevObject[0][0].id
        const upSpan = $('.upvote-form').find(`span[id=${postId}upspan]`)
        const downSpan = $(this).find('span')

        let upvoteNum = parseInt(upSpan.text())
        let downvoteNum = parseInt(downSpan.text())

        if($('#' + postId + 'downbtn').hasClass('btn-primary')) downvoteNum--
        else downvoteNum++

        if($('#' + postId + 'upbtn').hasClass('btn-primary')){
            $('#' + postId + 'upbtn').toggleClass('btn-primary btn-secondary');
            upvoteNum--
        }

        $('#' + btnId).toggleClass('btn-primary btn-secondary')

        upSpan.text(upvoteNum)
        downSpan.text(downvoteNum)

        if((window.location.href).includes('posts/' + postId)){
            $.ajax({
                type: 'PUT',
                url: postId + '/vote-down'
            })
        } else {
            $.ajax({
                type: 'PUT',
                url: 'posts/' + postId + '/vote-down'
            })
        }
    })
})