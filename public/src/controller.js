

$(document).ready(function () {
    enableListeners();

})


// Listeners
function enableListeners() {
   
    uploadImage();
    fileUploadCheck();
    addComment();
    showAllPictures();
    showOnePicture();



}


// empty file submition check
function fileUploadCheck() {
    $('#addPictureBtn').on('click', event => {
        event.preventDefault();
        file = $('input[type="file"]').val();
        if (!file) {
            alert("Please select the file first")
        }

    })
}

// New Image upload
function uploadImage() {
    // extesion check
    $('input[type="file"]').change(function (e) {
        fileName = e.target.files[0].name;
        $('.submitbtn').on('click', event => {
            event.preventDefault();

            let form = $('#fileUploadForm')[0];
            // Create an FormData object 
            let formdata = new FormData(form);

            if (!fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
                alert('File is not an image');
            }
            else {

                $.ajax({
                    url: "/pictures",
                    type: "POST",
                    headers: { "Authorization": Cookies.get('token') },
                    data: formdata,
                    mimeTypes: "multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function () {
                        alert("file successfully submitted");

                        $('#fileUploadForm').val("");
                        location.reload();
                    }, error: function () {
                        alert("error");
                    }
                });
            }

        });

    });

}


// New comment add
function addComment(pictureid) {
    $('.combtn').on('click', event => {
        event.preventDefault();
        console.log("current user is:");
        let comment = {
            comment: $('#respondcomment').val(),
            pictureId: pictureid,
        }
        $('#respondcomment').val('');

        $.ajax({
            url: "/comments",
            type: "POST",
            headers: { "Authorization": Cookies.get('token') },
            data: JSON.stringify(comment),
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                JSON.stringify(comment)
                commentsForOnePicture(pictureid)
            }, error: function () {
                alert("error");
            }
        });
    });


}


// Displaying all images with related comments

function showAllPictures() {

    $.ajax({
        url: "/pictures",
        type: "GET",
        headers: { "Authorization": Cookies.get('token') },
        beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },

        dataType: "json",
        success: function (data) {
            let userName = Cookies.get('email');

            let pictureData = data.map(picture => {
                return {
                    url: picture.url,
                    id: picture.id,
                    comments: picture.comments

                }
            })


            let displayPictures = pictureData.map(data => {
                return `
                <div role="link"> 
                    <a class="singlePicture" href="pictures/${data.id}" id="${data.id}" data-picture-id="${data.id}"> 
                        <div class="photo" style="background-image:url('${data.url}')"></div>
                    </a>
                    <p>Comments:${data.comments.length}</p>
                </div>`;
            })

            $("#displayPictures").html(displayPictures);

            $('.user').html(`User: ${userName} &nbsp&nbsp`);
            showOnePicture();


        }, error: function () {
            alert("error");
        }
    });

}



// Showing individual comments

function showComments() {
    $.ajax({
        url: "/comments",
        type: "GET",
        headers: { "Authorization": Cookies.get('token') },
        beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
        dataType: "json",
        success: function (data) {

            let commentData = data.map(comment => {

                return {
                    comment: comment.comment
                }
            })

            let displyComments = commentData.map(data => {

                return `${data.comment}`

            })

        }, error: function () {
            alert("error");
        }

    });


}

// Displaying a single picture

function showOnePicture() {

    $('.singlePicture').on('click', event => {
        event.preventDefault();
        let pictureId = event.currentTarget.id;
        let jqueryImageUrl = { id: pictureId };
        let singleImageUrl = "?" + jQuery.param(jqueryImageUrl);

        $.ajax({
            url: `/pictures/${pictureId}`,
            type: "GET",
            headers: { "Authorization": Cookies.get('token') },
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            dataType: "json",
            success: function (data) {
                let selectedImageDisplay = renderOnePictureHTML(data);
                $('.singlePicture').hide();
                $('.picture').html(selectedImageDisplay);
                addComment(pictureId);
                commentsForOnePicture(pictureId);
                findUserByPictureId(pictureId);
            }, error: function () {
                alert("error Vadim");
            }

        });

    });

}

// find userId by picture ID
function findUserByPictureId(pictureId) {
    $.ajax({
        url: `/pictures/${pictureId}`,
        type: "GET",
        headers: { "Authorization": Cookies.get('token') },
        beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
        dataType: "json",
        success: function (data) {
            deletePicture(pictureId, data.user.email);


        }
    })

}




function deletePicture(pictureId, email) {

    $(`.${pictureId}`).on('click', event => {
        event.preventDefault();
        if (email == Cookies.get('email')) {
            $.ajax({
                url: `/pictures/${pictureId}`,
                type: "DELETE",
                headers: { "Authorization": Cookies.get('token') },
                beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
                dataType: "json",
                success: function (data) {

                    window.location.reload();
                }
            })
        }
        else {
            alert("Picture can not be deleted! You are mot the owner");
        }

    })
}

function renderOnePictureHTML(props) {

    return `
    <div class="singlePicturePhoto" id="${props.id}" >
        <img src="${props.url}" target="new">
    </div> 
    <div class="singlePictureCommentArea">
        <div id="singlePictureComment"></div>
        <button class="${props.id} submitbtn" "type="button">Delete</button>
        <input placeholder="Add Comment" aria-label="Add Comment" type="text" name="comment" id="respondcomment">   
        <button type="submit" class="combtn " id="commentbtn">Submit</button>
        <div id="commentsSinglePic"></div>
        
    </div>`;


}


// Show comments for selected picture 
function commentsForOnePicture(pictureID) {
    $.ajax({
        url: `/pictures/${pictureID}/comments`,
        type: "GET",
        headers: { "Authorization": Cookies.get('token') },
        beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
        dataType: "json",
        success: function (data) {

            let comments = renderOneCommentHTML(data);

            $('#commentsSinglePic').html(comments);
        }
    })
}

function renderOneCommentHTML(props) {
    let editDeleteButtons = "";
    return props.map((comment) => {
        if (comment.user.email == Cookies.get('email')) {
            editDeleteButtons = "<button type='button' class='editCommentBtn'>Edit</button> <button type='button' class='deleteCommentBtn'>Delete</button>";
            // console.log(comment._id);
            deleteComment(comment._id);
            editComment(comment._id);
            editCommentField();
        }
        else {
            editDeleteButtons = "";
        }


        return "<div class='singleComment'><span class='commentEmail'>" + comment.user.email
            + "</span><span class='comment'>" + comment.comment
            + "</span> <span class='editComment'>" + "<input class='inputEdit' type='text' value='" + comment.comment + "'>"
            + "<button type='button' class='saveEditCommentBtn'>Save</button></span> <div>"
            + editDeleteButtons + "</div></div>"

    });

}


//Hide editable comment input
function editCommentField() {
    $(`body`).on('click', '.editCommentBtn', event => {
        event.preventDefault();
        $(event.target).parent().parent().find('.comment').hide();
        $(event.target).parent().parent().find('.editComment').show();
       
    
    })
}

// Edit existin comment
function editComment(commentId) {
    $(`body`).on('click', '.saveEditCommentBtn', event => {

            $.ajax({
                url: `/comments/${commentId}`,
                type: "PUT",
                headers: { "Authorization": Cookies.get('token') },
                beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
                dataType: "json",
                data: JSON.stringify({
                    "comment": $(event.target).parent().parent().find('.inputEdit').val()
                }),
                success: function (comment) {
                    
                    $(event.target).parent().parent().find('.editComment').hide();
                    $(event.target).parent().parent().find('.comment').show();
                    window.location.reload();

                }, error: function () {
                    alert("error");
                }

            })
        })
   
}

// delete existing comment
function deleteComment(commentId) {
    // console.log("Comment ID", commentId);
    $(`body`).on('click', '.deleteCommentBtn', event => {
        console.log("Comment ID", commentId);
        event.preventDefault();
        $.ajax({
            url: `/comments/${commentId}`,
            type: "DELETE",
            headers: { "Authorization": Cookies.get('token') },
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            dataType: "json",
            success: function (commentId) {
                window.location.reload();

            }, error: function () {
                alert("error");
            }

        });

    })
}
