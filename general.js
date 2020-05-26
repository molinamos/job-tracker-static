var userToken = null;
var username = null;

function finishLoading() {

    if(getUserTokenFromCache() || getUserTokenFromLocation()) {
        toggleSignOut();
        getUserJobs();
    }
    else {
        updateUsername("NOT LOGGED IN");
        toggleSignIn();
    }
}

function getUserTokenFromCache() {
    let raw = getFromLocal("userToken");

    if(raw == null) {
        return false;
    }

    return setToken(raw);
}

function getUserTokenFromLocation() {
    let raw = window.location.hash.substring(0, window.location.hash.indexOf("&"))
    if(raw == "") {
        return;
    }

    return setToken(raw);
}

function setToken(raw) {
    let token = new TokenHandler(raw);

    if(token.isValid) {
        saveToLocal("userToken", raw);
        userToken = token;
        updateUsername(token.username);

        return true;
    }

    return false;
}

function updateUsername(newName) {
    let boldUsername = document.getElementById("currentBoldUsername");
    boldUsername.innerText = newName;
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

function getUserJobs() {
    let url = "https://2q8vgan9uj.execute-api.us-west-2.amazonaws.com/prod/job?username=" + encodeURI(username);

    $.ajax({
        url: url,
        type: "GET",
        success: function (result) {
            loadJobsTable(result.jobs);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function postNewJob() {
    let data = new Object();

    data.username = username;
    data.url = getId("formUrl").value;
    data.company = getId("formCompany").value;
    data.position = getId("formPosition").value;
    data.description = getId("formDescription").value;
    data.date = getId("formDate").value;
    data.status = getId("formStatus").value;

    $.ajax({
        url: url,
        type: "PUT",
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        success: function (result) {
            window.location.reload();
        },
        error: function (error) {
            window.location.reload();
        }
    });
}

function loadJobsTable(jobs) {
    let jobsBody = document.getElementById("jobsBody");
    while (jobsBody.firstChild) {
        jobsBody.removeChild(jobsBody.lastChild);
    }

    for(i = 0; i < jobs.length; i++) {
        let jobRow = createJobRow(jobs[i], i + 1);
        jobsBody.appendChild(jobRow);
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

    return tr;
}


