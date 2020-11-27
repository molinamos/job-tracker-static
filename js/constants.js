//AWS STUFF
var cognitoBaseUrl = "https://job-tracker.auth.us-west-2.amazoncognito.com/"
var cognitoTokenUrl = cognitoBaseUrl + "oauth2/token";
var cognitoClientId = "4qgue6k8qbkrq1qt7bgf5ajt8v";
var cognitoRedirectUri = encodeURI(window.location.origin + window.location.pathname.replace("index.html", "loading.html"));
var cognitoIndexUri = encodeURI(window.location.origin + window.location.pathname.replace("loading.html", "index.html"));
var cognitoLoginUrl = cognitoBaseUrl + "login?client_id=" + cognitoClientId + "&response_type=code&scope=openid&redirect_uri=" + cognitoRedirectUri;
var apiGatewayJob = "https://2q8vgan9uj.execute-api.us-west-2.amazonaws.com/prod/job";
var apiGatewayJobByUsername = apiGatewayJob + "?username=";

//WEB STUFF
var POST = "POST";
var GET = "GET";
var PUT = "PUT";
var DELETE = "DELETE";
var APP_X_FORM = "application/x-www-form-urlencoded";
var APP_JSON = 'application/json';

//TOKEN STUFF
var CLIENT_ID = "client_id";
var REDIRECT_URI = "redirect_uri";
var CODE = "code";
var GRANT_TYPE = "grant_type";
var AUTH_CODE = "authorization_code";
var CONTENT_TYPE = "Content-Type";
var ACCESS_TOKEN = "access_token";
var ID_TOKEN = "id_token";
var REFRESH_TOKEN = "refresh_token";
var EXPIRES_IN = "expires_in";
var ACCESS_TOKEN_EXP = "access_token_exp";
var ID_TOKEN_EXP = "id_token_exp";
var REFRESH_TOKEN_EXP = "refresh_token_exp";
var AUTHORIZATION = "Authorization";
var SEVEN_DAYS_EPOCH = 604800;

//USER STUFF
var USERNAME = "username";
var NOT_LOGGED_IN = "NOT LOGGED IN";

//HTML STUFF
var DISPLAY = "display";
var NONE = "none";
var INLINE = "inline";

//UTIL STUFF
var toLog = true;
