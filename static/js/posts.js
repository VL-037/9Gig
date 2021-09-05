$(document).ready(function () {
    alwaysOn()

    $(window).scroll(function () {
        var position = Math.floor($(window).scrollTop()+1)
        var height = $(document).height() - $(window).height()
        if (position >= height && (window.location.pathname === ('/posts') || window.location.pathname === ('/posts/'))) {
            getMorePost('/posts/more').then(function (d) {
                let posts = d.posts
                let currentUser = d.currUser
                for (let post of posts) {
                    let postsHTML = ""
                        postsHTML +=
                        `<div class="card mb-3 shadow-lg">` +
                            `<div class="row">` +
                                `<div class="col">` +
                                    `<div class="card-body">` +
                                        `<a href="${post.tags[0].url}"><div class="btn btn-dark btn-sm tags">${post.tags[0].body}</div></a>` +
                                        `<h5 class="card-title">` +
                                            `<b>` +
                                                `<a href="/posts/${post._id}" class="text-decoration-none text-dark" data-placement="top">${post.title}</a>` +
                                            `</b>` +
                                        `</h5>` +
                                        `<div id="${post._id}" class="carousel slide" data-bs-ride="carousel">` +
                                        `<div class="carousel-inner mb-3">`
                    post.images.forEach((img, i) => {
                        if (i === 0) {
                            postsHTML +=
                                `<div class="carousel-item active border border-secondary">`
                        } else {
                            postsHTML +=
                                `<div class="carousel-item border border-secondary">`
                        }
                        postsHTML +=
                            `<img src="${img.url}" class="d-block w-100" alt="..."></img></div>`
                    });

                    postsHTML += `</div>`

                    if (post.images.length > 1) {
                        postsHTML +=
                            `<a class="carousel-control-prev" href="#${post._id}" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#${post._id}" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>`
                    }

                    postsHTML += `</div>`

                    if (currentUser) {
                        if (post.upvote.includes(currentUser._id)) {
                            postsHTML +=
                                `<form class="upvote-form d-inline" data-id="${post._id}">` +
                                    `<button class="btn btn-primary btn-upvote" type="submit" id="${post._id}upbtn">&#10224;` +
                                        `<span class="upvote-value" id="${post._id}upspan">${post.upvoteNum}</span>` +
                                    `</button>` +
                                `</form>` +
                                `<form class="downvote-form d-inline" data-id="${post._id}">` +
                                    `<button class="btn btn-secondary btn-downvote" type="submit" id="${post._id}downbtn">&#10225;` +
                                        `<span class="downvote-value" id="${post._id}downspan">${post.downvoteNum}</span>` +
                                    `</button>` +
                                `</form>`
                        } else if (post.downvote.includes(currentUser._id)) {
                            postsHTML +=
                                `<form class="upvote-form d-inline" data-id="${post._id}">` +
                                    `<button class="btn btn-secondary btn-upvote" type="submit" id="${post._id}upbtn">&#10224;` +
                                        `<span class="upvote-value" id="${post._id}upspan">${post.upvoteNum}</span>` +
                                    `</button>` +
                                `</form>` +
                                `<form class="downvote-form d-inline" data-id="${post._id}">` +
                                    `<button class="btn btn-primary btn-downvote" type="submit" id="${post._id}downbtn">&#10225;` +
                                        `<span class="downvote-value" id="${post._id}downspan">${post.downvoteNum}</span>` +
                                    `</button>` +
                                `</form>`
                        } else {
                            postsHTML +=
                                `<form class="upvote-form d-inline" data-id="${post._id}">` +
                                    `<button class="btn btn-secondary btn-upvote" type="submit" id="${post._id}upbtn">&#10224;` +
                                        `<span class="upvote-value" id="${post._id}upspan">${post.upvoteNum}</span>` +
                                    `</button>` +
                                `</form>` +
                                `<form class="downvote-form d-inline" data-id="${post._id}">` +
                                    `<button class="btn btn-secondary btn-downvote" type="submit" id="${post._id}downbtn">&#10225;` +
                                        `<span class="downvote-value" id="${post._id}downspan">${post.downvoteNum}</span>` +
                                    `</button>` +
                                `</form>`
                        }
                    } else {
                        postsHTML +=
                            `<form class="upvote-form d-inline" data-id="${post._id}" data-toggle="tooltip" data-placement="bottom" title="gotta login to vote">` +
                                `<button class="btn btn-secondary btn-upvote disabled" type="submit">&#10224;` +
                                    `<span class="upvote-value" >${post.upvoteNum}</span>` +
                                `</button>` +
                            `</form>` +
                            `<form class="downvote-form d-inline" data-id="${post._id}" data-toggle="tooltip" data-placement="bottom" title="gotta login to vote">` +
                                `<button class="btn btn-secondary btn-downvote disabled" type="submit">&#10225;` +
                                    `<span class="downvote-value">${post.downvoteNum}</span>` +
                                `</button>` +
                            `</form>`
                    }

                    postsHTML +=
                        `<a class="btn btn-secondary" href="/posts/${post._id}"><i class="fa fa-comments-o"></i>`
                    if (post.comments) {
                        postsHTML +=
                            `${post.comments.length}</a>`
                    } else {
                        postsHTML +=
                            `${0}</a>`
                    }

                    postsHTML +=
                        `</div >` +
                        `</div >` +
                        `</div >` +
                        `</div >`
                    $('#posts').append(postsHTML)
                }
                alwaysOn()
            })
        }
    });
})

function alwaysOn() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $('.upvote-form').submit(function (e) {
        e.preventDefault();
        const postId = $(this).data('id').trim()
        const btnId = $(this).find("input[type=submit]:focus").prevObject[0][0].id
        const upSpan = $(this).find('span')
        const downSpan = $('.downvote-form').find(`span[id=${postId}downspan]`)

        let upvoteNum = parseInt(upSpan.text())
        let downvoteNum = parseInt(downSpan.text())

        if ($('#' + postId + 'upbtn').hasClass('btn-primary')) upvoteNum--
        else upvoteNum++

        if ($('#' + postId + 'downbtn').hasClass('btn-primary')) {
            $('#' + postId + 'downbtn').toggleClass('btn-primary btn-secondary');
            downvoteNum--
        }

        $('#' + btnId).toggleClass('btn-primary btn-secondary')

        upSpan.text(upvoteNum)
        downSpan.text(downvoteNum)

        if ((window.location.href).includes('posts/' + postId)) {
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

    $('.downvote-form').submit(function (e) {
        e.preventDefault();
        const postId = $(this).data('id').trim()
        const btnId = $(this).find("input[type=submit]:focus").prevObject[0][0].id
        const upSpan = $('.upvote-form').find(`span[id=${postId}upspan]`)
        const downSpan = $(this).find('span')

        let upvoteNum = parseInt(upSpan.text())
        let downvoteNum = parseInt(downSpan.text())

        if ($('#' + postId + 'downbtn').hasClass('btn-primary')) downvoteNum--
        else downvoteNum++

        if ($('#' + postId + 'upbtn').hasClass('btn-primary')) {
            $('#' + postId + 'upbtn').toggleClass('btn-primary btn-secondary');
            upvoteNum--
        }

        $('#' + btnId).toggleClass('btn-primary btn-secondary')

        upSpan.text(upvoteNum)
        downSpan.text(downvoteNum)

        if ((window.location.href).includes('posts/' + postId)) {
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
}

function getMorePost(ajaxUrl) {
    return $.ajax({
        url: ajaxUrl,
        type: 'GET'
    })
}