// handler for token input form submission
document.getElementById('tokenForm').onsubmit = function(evt) {
    // prevent the default behavior of a page reload on submit
    evt.preventDefault();
    // check to make sure an actual value has been submitted for the token
    var token = document.getElementById('token').value;
    if (token != null && token != '') {
        // naively set the global token variable, assuming the user-specified token is valid.
        // if any future API request fails due to authentication, the token popup will open again. 
        window.TOKEN = token;
        // initiate API calls
        handle_submitted_token();
    }
};

// handler for token input value change
document.getElementById('token').onchange = function(evt) {
    // as long as there is a real value in the input field when the DOM element loses focus,
    // we handle the value change as if it were an explicit form submission.
    // this has the side effect of submitting the autofilled form on any mouse or key event after page load.
    if (this.value != null) {
        // set the global token value which we will later use
        // to pass in to every API request
        window.TOKEN = this.value;
        // initiate API calls
        handle_submitted_token();
    }
};

function handle_submitted_token() {
    // hide the token popup form
    document.getElementById('tokenPopup').style.display = 'none';
    // hide the page overlay
    document.getElementById('pageOverlay').style.display = 'none';
    document.getElementById('pageOverlay').style.animation = 'none';
    document.getElementById('pageOverlay').style.background = 'none';
    // show the Fly button
    document.getElementById('fly').style.display = 'block';
    // start it up
    if (window.GUI_STATE == null) {
        loadMap();
        loadControls();
    }
}