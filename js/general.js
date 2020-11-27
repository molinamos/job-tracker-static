function getUserJobs() {
    let url = apiGatewayJobByUsername + encodeURI(username);
    let headers = {};
    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);
    makeRestCall(url, GET, headers, null, loadJobsTable, toConsole);
}

var postNewJobData;
function postNewJob() {
    let url = apiGatewayJob;

    let headers = {};
    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);
    headers[CONTENT_TYPE] = APP_JSON;

    let data = new Object();

    data.username = username;
    data.url = getId("formUrl").value;
    data.company = getId("formCompany").value;
    data.position = getId("formPosition").value;
    data.description = getId("formDescription").value;
    data.date = getId("formDate").value;
    data.status = getId("formStatus").value;

    postNewJobData = data;

    clearValue(
        getId("formUrl"),
        getId("formCompany"),
        getId("formPosition"),
        getId("formDescription"),
        getId("formDate"),
        getId("formStatus")
    );

    makeRestCall(url, PUT, headers, JSON.stringify(data), postNewJobSuccessful, toConsole);
}

function postNewJobSuccessful(result) {
    pushTableJob(postNewJobData.url, postNewJobData.company, postNewJobData.position, postNewJobData.description, postNewJobData.date, postNewJobData.status);
    clearTableJob();
    updateTableJob();
}


function loadJobsTable(result) {
    let jobs = result;

    let jobsBody = document.getElementById("jobsBody");
    while (jobsBody.firstChild) {
        jobsBody.removeChild(jobsBody.lastChild);
    }

    for(i = 0; i < jobs.length; i++) {
        let job = jobs[i];
        pushTableJob(job["url-hash"], job.company, job.position, job.description, job.date, job.status);
    }
    updateTableJob();
}



function clearValue(...ele) {
    let i;
    for(i = 0; i < ele.length; i++) {
        ele[[i]].value = "";
    }
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

function clearTableJob() {
    while(jobsBody.childNodes.length > 0) {
        jobsBody.childNodes[0].remove();
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
