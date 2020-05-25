function postNewJob() {
    let url = "https://2q8vgan9uj.execute-api.us-west-2.amazonaws.com/prod/job";
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

function getId(id) {
    return document.getElementById(id);
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

function loadUsername() {
    let boldUsername = document.getElementById("currentBoldUsername");
    boldUsername.innerText = localStorage['username'] || 'NO USERNAME';
    username = localStorage['username'] || null;

    getUserJobs();
}

function setUsername() {
    let newUsernameEle = document.getElementById("newUsername");
    localStorage["username"] = newUsernameEle.value;
    newUsernameEle.value = "";
    loadUsername();
}

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-west-2_SezkXITZB',
  Logins: { // optional tokens, used for authenticated login
    'graph.facebook.com': 'FBTOKEN',
    'www.amazon.com': 'AMAZONTOKEN',
    'accounts.google.com': 'GOOGLETOKEN'
  }
});

var cognitoUrl = "https://job-tracker.auth.us-west-2.amazoncognito.com/signup?client_id=3t6mf6p7hog6nrdtk264vktphd&response_type=code&scope=email+openid&redirect_uri=" + encodeURI(window.location.origin + window.location.pathname);
function signIn() {
   window.location.href = cognitoUrl;
}