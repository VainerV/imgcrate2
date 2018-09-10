

function enableListeners() {
    signUp();
    logIn();

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
            userName: $('#loginUserName').val(),
            password: $('#loginPassword').val(),
        }

        //console.log(login);
        $.ajax({
            type: 'POST',
            url: "/users/login",
            headers: {
                'Authorization': ""},
               
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




enableListeners();