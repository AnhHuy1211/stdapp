$(document).ready(function(){
    function generatePass() {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 1; i <= 8; i++) {
            let char = Math.floor(Math.random()
                * str.length + 1);
            pass += str.charAt(char)
        }
        return pass;
    }

    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }

    $('#p-generate').click(function() {
        $('#pass').attr('value', generatePass())
        $('#p-generate').prop('disabled', 'true')
    })
});