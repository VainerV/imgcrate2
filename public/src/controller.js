$(document).ready(function () {
    enableListeners();

})


// Listeners
function enableListeners() {
    // signUp();
    //  logIn();

    // logout();
    uploadImage();
    addComment();
    showAllPictures();
    showOnePicture();
    // homebutton();

}





// New Image upload

function uploadImage() {
    // extesion check
    $('input[type="file"]').change(function(e){
        fileName = e.target.files[0].name;
       // alert('The file "' + fileName +  '" has been selected.');
    
    $('.submitbtn').on('click', event => {
        event.preventDefault();
        let form = $('#fileUploadForm')[0];
        // Create an FormData object 
        let formdata = new FormData(form);
       

        if (!fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
            alert('not an image');
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
                    comments: picture.comments,

                }
            })
            let displyPictures = pictureData.map(data => {
                return `<div class="singlePicture" id="${data.id}" data-picture-id="${data.id}"> 
                <a href="pictures/${data.id}"><img src="${data.url}" target="new"> </a>
                </div><p>Comments:${data.comments.length} &nbsp&nbsp
                </p><br>`;
            })

            // let displyPictures = pictureData.map(data => {
            //     return `<div class="singlePicture photo" 
            //     id="${data.id}" data-picture-id="${data.id}"> 
            //     <a href="pictures/${data.id}" style=“background-image:url(${data.url})"  >   </a>
            //     </div><p>Comments:${data.comments.length} &nbsp&nbsp
            //     </p><br>`;
            // })

            $("#dispyPictures").html(displyPictures);

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
                    comment: comment.comment,
                }
            })

            let displyComments = commentData.map(data => {

                return `${data.comment} &nbsp`

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
                deletePicture(pictureId);

            }, error: function () {
                alert("error Vadim");
            }

        });

    });

}

function deletePicture(pictureId) {
    $(`.${pictureId}`).on('click', event => {
        event.preventDefault();
        // console.log("delete button", pictureId);

        $.ajax({
            url: `/pictures/${pictureId}`,
            type: "DELETE",
            headers: { "Authorization": Cookies.get('token') },
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            dataType: "json",
            success: function (data) {

                alert("Picture deleted");
                window.location.reload();
            }
        })


    })
}

function renderOnePictureHTML(props) {
    //console.log(props);
    return `<div class="singlePicture" id="${props.id}" >
    <img src="${props.url}" target="new"> </a></div> 
<div>
<div id="singlePictureComment"></div>
Add comment:
<div>
<input type="text" name="comment" id="respondcomment">   
<button type="submit" class="combtn " id="commentbtn">Submit</button>
</div>
<div id="commentsSinglePic">  &nbsp</div><br>
<button class="${props.id} submitbtn" "type="button">Delete</button>
</div>`;
}



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
    return `<div> ${props.map((comment) => {
        return "<br>" + comment.user.email + ": " + comment.comment
    })}</div>`

}



