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
    toConsole(tokenObject);

    saveToLocal(ACCESS_TOKEN)
    decodeToken(tokenObject[ACCESS_TOKEN]);
    decodeToken(tokenObject[ID_TOKEN]);
    decodeToken(tokenObject[REFRESH_TOKEN]);
}

function decodeToken(tokenObject) {
    let splitToken = tokenObject.split(".");
    let head = decodeToObject(splitToken[0]);
    let body = decodeToObject(splitToken[1]);
}

function decodeToObject(tokenString) {
    return JSON.parse(jwt.base64urldecode(tokenString));
}

function saveToLocal(key, input) {
    localStorage[key] = input;
}

function getFromLocal(key) {
    return localStorage[key] || null;
}
