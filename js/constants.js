var cognitoBaseUrl = "https://job-tracker.auth.us-west-2.amazoncognito.com/"
var cognitoTokenUrl = cognitoBaseUrl + "oauth2/token";
var cognitoClientId = "4qgue6k8qbkrq1qt7bgf5ajt8v";
var cognitoRedirectUri = encodeURI(window.location.origin + window.location.pathname.replace("index.html", "loading.html"));
var cognitoLoginUrl = cognitoBaseUrl + "login?client_id=" + cognitoClientId + "&response_type=code&scope=openid&redirect_uri=" + cognitoRedirectUri;
var apiGateway = "https://2q8vgan9uj.execute-api.us-west-2.amazonaws.com/prod/job";

var POST = "POST";
var GET = "GET";
var PUT = "PUT";

var APP_X_FORM = "application/x-www-form-urlencoded";

var CLIENT_ID = "client_id";
var REDIRECT_URI = "redirect_uri";
var CODE = "code";
var GRANT_TYPE = "grant_type";
var LOCAL_HOST = "http://localhost:8080/";
var AUTH_CODE = "authorization_code";
var CONTENT_TYPE = "Content-Type";
var ACCESS_TOKEN = "access_token";
var ID_TOKEN = "id_token";
var REFRESH_TOKEN = "refresh_token";
var ACCESS_TOKEN_EXP = "access_token_exp";
var ID_TOKEN_EXP = "id_token_exp";
var REFRESH_TOKEN_EXP = "refresh_token_exp";

var toLog = true;
