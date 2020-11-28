let cognitoCode = new URLSearchParams(window.location.search).get(CODE);

if (cognitoCode != null) {
    fetchUserTokens(cognitoCode);
}

function fetchUserTokens(code) {
    let getTokenUrl = cognitoTokenUrl;
    let headers = {};
    headers[CONTENT_TYPE] = APP_X_FORM;

    let body = {};
    body[CLIENT_ID] = cognitoClientId;
    body[REDIRECT_URI] = getFromLocal(REDIRECT_URI);
    body[CODE] = code;
    body[GRANT_TYPE] = AUTH_CODE;

    makeRestCall(cognitoTokenUrl, POST, headers, body, processToken, toConsole);
}

function processToken(tokenObject) {
    let accessToken = decodeToken(tokenObject[ACCESS_TOKEN]);

    saveToLocal(USERNAME, accessToken[USERNAME]);

    saveToLocal(ACCESS_TOKEN, tokenObject[ACCESS_TOKEN]);
    saveToLocal(ACCESS_TOKEN_EXP, getEpoch() + tokenObject[EXPIRES_IN]);

    saveToLocal(ID_TOKEN, tokenObject[ID_TOKEN]);
    saveToLocal(ID_TOKEN_EXP, getEpoch() + tokenObject[EXPIRES_IN]);

    if(tokenObject[REFRESH_TOKEN]) {
        saveToLocal(REFRESH_TOKEN, tokenObject[REFRESH_TOKEN]);
        saveToLocal(REFRESH_TOKEN_EXP, getEpoch() + SEVEN_DAYS_EPOCH);
    }

    hasToken();
    window.location.href = cognitoIndexUri;
}

function decodeToken(tokenObject) {
    let splitToken = tokenObject.split(".");
    let head = decodeToObject(splitToken[0]);
    let body = decodeToObject(splitToken[1]);

    return body;
}

function decodeToObject(tokenString) {
    return JSON.parse(atob(tokenString));
}

function refreshUserTokens() {
    let getTokenUrl = cognitoTokenUrl;
    let headers = {};
    headers[CONTENT_TYPE] = APP_X_FORM;

    let body = {};
    body[CLIENT_ID] = cognitoClientId;
    body[REDIRECT_URI] = cognitoRedirectUri;
    body[GRANT_TYPE] = REFRESH_TOKEN;
    body[REFRESH_TOKEN] = getFromLocal(REFRESH_TOKEN);

    makeRestCall(cognitoTokenUrl, POST, headers, body, processToken, refreshUserTokensError);
}

function refreshUserTokensError(result) {
    alert("Unable to refresh token, please sign out and relogin.");
    noToken();
}