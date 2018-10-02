$(document).ready(function () {
    enableListeners();

})



function enableListeners() {
    signUp();
    logIn();
    logout();
    uploadImage();
    addComment();
    showAllPictures();
    showOnePicture();
    homebutton();    
}

function signUp() {

    // submit new user Sign up information
    $(".signupbtn").on("click", event => {
        event.preventDefault();


        let name = {
            userName: $("#firstName").val(),
            lastName: $("#lastName").val(),
        }

        let newUser = {
            user: name,
            userName: $('#userName').val(),
            password: $('#password').val(),
            email: $('#email').val(),

        }


        $.ajax({
            type: 'POST',
            url: "/users/signup",
            data: JSON.stringify(newUser),
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            // dataType: "json",
            success: function (data) { alert("Save Complete"), console.log(data) },
            error: function (error) {
                console.log("New user wasnt created");
            }
        });

    });


}


function logIn() {
    $(".loginbtn").on('click', event => {
        event.preventDefault();
        let login = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val(),
        }

        // console.log(login);
        $.ajax({
            type: 'POST',
            url: "/users/login",
            data: JSON.stringify(login),
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            // dataType: "json",
            success: function (data) {
                Cookies.set('email', data.userEmail);
                Cookies.set('token', data.token);
                self.location = "../view.html";
               
                //alert("You are now loged in") 

            },
            error: function (error) {
                console.log("Login fail.");
            }

        });

    })

}


function uploadImage() {
    $('.submitbtn').on('click', event => {
        event.preventDefault();
        // let formdata = new FormData($(this)[0]);  
        // console.log("Button is working ")
        //    // let formdata = $('#image').val();
        //     console.log(formdata);

        let form = $('#fileUploadForm')[0];
        //console.log(form);
        // Create an FormData object 
        let formdata = new FormData(form);
        //console.log(formdata);

        $.ajax({
            url: "/pictures",
            type: "POST",
            headers: {"Authorization": Cookies.get('token')},
            data: formdata,
            mimeTypes: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function () {
                alert("file successfully submitted");
            }, error: function () {
                alert("error");
            }
        });
    });


}


function addComment(pictureid) {


    $('.combtn').on('click', event => {
        event.preventDefault();

        let comment = {
            comment: $('#respondcomment').val(),
            pictureId: pictureid,
        }
        //   console.log(JSON.stringify(comment));

        $.ajax({
            url: "/comments",
            type: "POST",
            headers: {"Authorization": Cookies.get('token')},
            data: JSON.stringify(comment),
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                JSON.stringify(comment)

            }, error: function () {
                alert("error");
            }
        });
    });


}



function showAllPictures() {

    $.ajax({
        url: "/pictures",
        type: "GET",
        headers: {"Authorization": Cookies.get('token')},
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
                return `<div class="singlePicture" id="${data.id}" data-picture-id="${data.id}" > 
                <a href="pictures/${data.id}"><img src="${data.url}" target="new"> </a></div><p>Comments:${data.comments.map(comment => {
                    return `<p>${comment.comment}</p>`;
                })}</p>`;
            })

            console.log(userName);
            $("#dispyPictures").html(displyPictures);
            $('.user').html(`User: ${userName} &nbsp&nbsp`);
          //  showComments();
            showOnePicture();

        }, error: function () {
            alert("error");
        }
    });

}

function showComments() {  //// retreaving comments but not visible on the page, probably headen some were.

    $.ajax({
        url: "/comments",
        type: "GET",
        headers: {"Authorization": Cookies.get('token')},
        beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },

        dataType: "json",
        success: function (data) {

            let commentData = data.map(comment => {

                return {
                    comment: comment.comment,
                }
            })

            let displyComments = commentData.map(data => {

                return `${data.comment}`

            })

            //console.log(displyComments);

         //   $("#displayComments").html(displyComments);


        }, error: function () {
            alert("error");
        }



    });


}



function showOnePicture() {

    $('.singlePicture').on('click', event => {
        event.preventDefault();


        let pictureId = event.currentTarget.id;

        let jqueryImageUrl = { id: pictureId };
        let singleImageUrl = "?" + jQuery.param(jqueryImageUrl);



        $.ajax({
            url: `/pictures/${pictureId}`,
            type: "GET",
            headers: {"Authorization": Cookies.get('token')},
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            dataType: "json",
            success: function (data) {

                let selectedImageDisplay = `<div class="singlePicture" id="${data.id}" >
                                    <img src="${data.url}" target="new"> </a></div> 
                   <div>
                    <div id="singlePictureComment"></div>
                       Add comment:
                   <div>
                      <input type="text" name="comment" id="respondcomment">   
                      <button type="submit" class="combtn" id="commentbtn">Submit</button>
                    </div>
                         
         
                     </div>`;


                $('.singlePicture').hide();
                $('.picture').html(selectedImageDisplay);
                addComment(pictureId);




            }, error: function () {
                alert("error");
            }

        });

    });

}

function logout(){
    $('.logoutBtn').on('click', event => {
        event.preventDefault();
        console.log("Logout btn clicked");
        Cookies.remove('token');
        self.location = "../index.html";
})
}

function homebutton(){
    $('.homeBtn').on('click', event => {
        event.preventDefault();
        self.location = "../view.html";
})
}

