




function enableListeners() {
    signUp();
    logIn();
    uploadImage();
    addComment();
    showAllPictures();
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

    $(document).ready(function(){

      

        $.ajax({
            url: "/pictures",
            type: "GET",
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
               // console.log(data);
               let pictureUrls = data.map(picture => {
                    return picture.url;
               })
              // console.log(pictureUrls);
               // alert("pictures retreved");
               let displyPictures = pictureUrls.map(urls => {
                    //console.log(urls);
                   return `<div> <img src="${urls}"> </div>`;
                })
                
                $("#dispyPictures").html(displyPictures);

            }, error: function () {
                alert("error");
            }
           
        });
        
    });


}

enableListeners();