var userToken = null;
var username = null;

function finishLoading() {

    if(getUserTokenFromCache() || getUserTokenFromLocation()) {
        toggleSignOut();
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

function postNewJob() {
    let data = new Object();

    data.username = username;
    data.url = getId("formUrl").value;
    data.company = getId("formCompany").value;
    data.position = getId("formPosition").value;
    data.description = getId("formDescription").value;
    data.date = getId("formDate").value;
    data.status = getId("formStatus").value;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function getUserJobs() {
    if(username == null) {
        return;
    }

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

function loadJobsTable(jobs) {
    let jobsBody = document.getElementById("jobsBody");
    while (jobsBody.firstChild) {
        jobsBody.removeChild(jobsBody.lastChild);
    }

    for(i = 0; i < jobs.length; i++) {
        let jobRow = createElementJobRow(jobs[i], i + 1);
        jobsBody.appendChild(jobRow);
    }
}

function createElementJobRow(job, count) {
    let tr = document.createElement("tr");
    let number = document.createElement("th");
    let url= document.createElement("td");
    let company = document.createElement("td");
    let position = document.createElement("td");
    let description = document.createElement("td");
    let date = document.createElement("td");
    let status = document.createElement("td");

    tr.appendChild(number);
    tr.appendChild(url);
    tr.appendChild(company);
    tr.appendChild(company);
    tr.appendChild(position);
    tr.appendChild(description);
    tr.appendChild(date);
    tr.appendChild(status);

    number.scope = "col";
    number.innerText = count;
    url.innerText = job.url;
    company.innerText = job.company;
    position.innerText = job.position;
    description.innerText = job.description;
    date.innerText = job.date;
    status.innerText = job.status;

    return tr;
}

