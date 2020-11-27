var username;

if (getFromLocal(ACCESS_TOKEN_EXP) && isStillValid(parseInt(getFromLocal(ACCESS_TOKEN_EXP)))) {
    hasToken();
} else if (getFromLocal(REFRESH_TOKEN_EXP) && isStillValid(parseInt(getFromLocal(REFRESH_TOKEN_EXP)))) {
    refreshUserTokens();
    hasToken();
} else {
    noToken();
}

function hasToken() {
    username = getFromLocal(USERNAME);
    updateUsername(username);

    toggleSignOut();
    getUserJobs();
}

function noToken() {
    updateUsername(NOT_LOGGED_IN);
    toggleSignIn();
}


function signIn() {
    saveToLocal(REDIRECT_URI, cognitoRedirectUri);
    window.location.href = cognitoLoginUrl;
}

function signOut() {
   localStorage.clear();
   window.location.href = window.location.origin + window.location.pathname;
}

function toggleSignIn() {
    let signIn = document.getElementById("signInButton");
    let signOut = document.getElementById("signOutButton");
    toggleButtons(signIn, signOut);
}

function toggleSignOut() {
    let signIn = document.getElementById("signInButton");
    let signOut = document.getElementById("signOutButton");
    toggleButtons(signOut, signIn);
}
