$(document).ready(function() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    
    $('.upvote-form').submit(function(e) {
        e.preventDefault();
        const postId = $(this).data('id').trim()
        const btnId = $(this).find("input[type=submit]:focus").prevObject[0][0].id
        
        if($('#' + postId + 'downbtn').hasClass('btn-primary'))
            $('#' + postId + 'downbtn').toggleClass('btn-primary btn-secondary');

        $('#' + btnId).toggleClass('btn-primary btn-secondary')
        
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

        if($('#' + postId + 'upbtn').hasClass('btn-primary'))
            $('#' + postId + 'upbtn').toggleClass('btn-primary btn-secondary');

        $('#' + btnId).toggleClass('btn-primary btn-secondary')

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