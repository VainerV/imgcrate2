$(document).ready(function () {
    enableListeners();

})



function enableListeners() {
    signUp();
    logIn();
    uploadImage();
    addComment();
    showAllPictures();
    showOnePicture();
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
                //Window.location = "../view.html";
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


function addComment() {


    $('.combtn').on('click', event => {
        event.preventDefault();

        let comment = {
            comment: $('#respondcomment').val(),
            //imageId: $('#imageId').val()
        }
        //  console.log(JSON.stringify(comment));

        $.ajax({
            url: "/comments",
            type: "POST",
            data: JSON.stringify(comment),
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                alert("comment submited submitted");
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
        beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },

        dataType: "json",
        success: function (data) {

            let pictureData = data.map(picture => {
                return {
                    url: picture.url,
                    id: picture.id
                }
            })

            let displyPictures = pictureData.map(data => {

                return `<div class="singlePicture" id="${data.id}" data-picture-id="${data.id}" > <a href="pictures/${data.id}"><img src="${data.url}" target="new"> </a></div>`;
            })

            $("#dispyPictures").html(displyPictures);
            
            showOnePicture();
            
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
                
             </div>
            <button type="submit" class="combtn" id="commentbtn">Submit</button>
         
           </div>


             <div> <a href="comments.html">Add comment</a></div>`;

                
                $('.singlePicture').hide();
                $('.picture').html(selectedImageDisplay);
                addComment();




            }, error: function () {
                alert("error");
            }

        });

    });

}

