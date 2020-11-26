
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
        pushTableJob(job["url-hash"], job.company, job.position, job.date, job.status);
    }
    updateTableJob();
}



function clearValue(...ele) {
    let i;
    for(i = 0; i < ele.length; i++) {
        ele[[i]].value = "";
    }
}


