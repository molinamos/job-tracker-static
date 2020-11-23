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

function getUserJobs() {
    let url = apiGatewayJobByUsername + encodeURI(username);
    let headers = {};
    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);
    makeRestCall(url, GET, headers, null, loadJobsTable, toConsole);
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

var tableJobs = [];
function pushTableJob(urlHash, company, position, description, date, status) {
    var job = new Object();
    job.url = urlHash;
    job.company = company;
    job.position = position;
    job.description = description;
    job.date = date;
    job.status = status;

    tableJobs.push(job);
}

function updateTableJob() {
    for (i = 0; i < tableJobs.length; i++) {
        createJobRow(tableJobs[i], i);
    }
}

function createJobRow(job, count) {
    let tr = document.createElement("tr");

    let number = createEleWithTxt("th", count);
    let url= createEleWithTxt("td", job.url);
    let company = createEleWithTxt("td", job.company);
    let position = createEleWithTxt("td", job.position);
    let description = createEleWithTxt("td", job.description);
    let date = createEleWithTxt("td", job.date);
    let status = createEleWithTxt("td", job.status);

    number.scope = "col";

    appendChildren(tr, number, url, company, position, description, date, status)
    let jobsBody = document.getElementById("jobsBody");
    appendChildren(jobsBody, tr)
}