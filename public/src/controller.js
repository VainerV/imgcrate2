function enableListeners() {
    signUp();
    //logIn();
    
  }

  function signUp() {
      
    // submit new user Sign up information
    $(".signupbtn").on("click", event => {
        event.preventDefault();

     
        let name = {
            userName: $("#firstName").val(),
            lastName: $("#lastName").val(),
        }
      
   let  newUser = {
        user: name,
        userName: $('#userName').val(),
        password: $('#password').val(),
        email: $('#email').val(),

     }
     
//console.log(newUser)
      $.ajax({
        type: 'POST',
        url: "http://localhost:8080/users/signup",
        data: newUser, //JSON.stringify(newUser),
        dataType: "json",
        success: function(data) { alert("Save Complete"),  console.log(data)},
        error: function(error) {
            console.log("New user wasnt created");
          }
  });
  


    //  //console.log(JSON.stringify(newUser));
    //  $.post( "/users/signup", JSON.stringify(newUser))
    //  .done(function( data ) {
    //    alert( "Data Loaded: " + data );
    //  });
      //console.log(newUser);
   });

     

   // return console.log("new users creatwed")
  }

  
 




  enableListeners();