

function enableListeners() {
    signUp();
    logIn();
    uploadImage();
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

        console.log(login);
        $.ajax({
            type: 'POST',
            url: "/users/login",
            data: JSON.stringify(login),
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
            // dataType: "json",
            success: function (data) { alert("You are now loged in") },
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
        console.log("Button is working ")
    //    // let formdata = $('#image').val();
    //     console.log(formdata);

    let form = $('#fileUploadForm')[0];
console.log(form);
		// Create an FormData object 
        let formdata = new FormData(form);
//console.log(formdata);

        $.ajax({
            url: "/uploads",
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

enableListeners();