function enableListeners() {
    signUp();
    //logIn();
    
  }

  function signUp() {
      let newUser = {}
    // submit new user Sign up information
    $(".signupbtn").on("click", event => {
        event.preventDefault();
      let newUser = {};
        let name = {
            userName: $("#firstName").val(),
            lastName: $("#lastName").val(),
        }
      
     newUser = {
        user: name,
        userName: $('#userName').val(),
        password: $('#password').val(),
        email: $('#email').val(),

     }
     
     $.post( "/users/signup", JSON.stringify(newUser))
     .done(function( data ) {
       alert( "Data Loaded: " + data );
     });
      console.log(newUser);
   });

     

   // return console.log("new users creatwed")
  }

  
 




  enableListeners();