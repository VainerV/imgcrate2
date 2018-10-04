$(document).ready(function () {
    signUp();
    logIn();
    logout();
    homebutton();

})


// Aplication sign up call
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
            success: function (data) {
                alert("Save Complete")
            },
            error: function (error) {
                console.log("New user wasnt created");
            }
        });

    });


}


// Login

function logIn() {
    $(".loginbtn").on('click', event => {
        event.preventDefault();
        let login = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val(),
        }
        $('#loginEmail').val("");
        $.ajax({
            type: 'POST',
            url: "/users/login",
            data: JSON.stringify(login),
            beforeSend: function (request) { request.setRequestHeader("Content-Type", "application/json"); },
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

// Application logout

function logout() {
    $('.logoutBtn').on('click', event => {
        event.preventDefault();
        console.log("Logout btn clicked");
        self.location = "../index.html";
        Cookies.remove('token');
    })
}

// Home button function 

function homebutton() {
    $('.homeBtn').on('click', event => {
        event.preventDefault();
        self.location = "../view.html";
    })
}