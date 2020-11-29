var postNewJobData;
var deleteJobUrl;
var tableJobs = [];
var hideUrls = true;
var LastEvaluatedKey;
var sortOrder = "URL";

function getUserJobs() {
    getUserJobs(undefined, undefined);
}

function getUserJobsNext() {
    getUserJobs(tableJobs[tableJobs.length -1].url, undefined);
    document.getElementById("jobPreviousButton").style[DISPLAY] = INLINE;
}

function getUserJobsPrevious() {
    let urlHash = tableJobs[0].url;
    let url = apiGatewayJobByUsername + encodeURI(username) 
            + (urlHash !== undefined ? "&urlHash=" + urlHash : "");

    if (sortOrder !== undefined) {
        url += "&sortOrder=" + sortOrder.toLowerCase();
    }

    let headers = {};

    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);

    makeRestCall(url, GET, headers, null, loadJobsTableReverse, toConsole);
}

function loadJobsTableReverse(result) {
    toConsole(result);
    let jobs = result["Items"];

    LastEvaluatedKey = result["LastEvaluatedKey"] === undefined ? undefined : result["LastEvaluatedKey"].urlHash;

    document.getElementById("jobNextButton").style[DISPLAY] = INLINE;

    if (LastEvaluatedKey !== undefined) {
        document.getElementById("jobPreviousButton").style[DISPLAY] = INLINE;
    } else {
        document.getElementById("jobPreviousButton").style[DISPLAY] = NONE;
    }

    if (jobs.length === 0) {
        return;
    }

    tableJobs = [];
    for (i = jobs.length - 1; i >= 0; i--) {
        let job = jobs[i];
        pushTableJob(job["urlHash"], job.company, job.position, job.description, job.date, job.cooldown, job.status);
    }

    clearTableJob();
    updateTableJob();
}

function getUserJobs(lastEvaluatedKey, urlHash) {
    let url = apiGatewayJobByUsername + encodeURI(username)
            + (lastEvaluatedKey !== undefined ? "&ExclusiveStartKey=" + lastEvaluatedKey : "");

    if (sortOrder !== undefined) {
        url += "&sortOrder=" + sortOrder.toLowerCase();
    }

    let headers = {};

    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);

    makeRestCall(url, GET, headers, null, loadJobsTable, toConsole);
}

function loadJobsTable(result) {
    toConsole(result);
    let jobs = result["Items"];

    LastEvaluatedKey = result["LastEvaluatedKey"] === undefined ? undefined : result["LastEvaluatedKey"].urlHash;

    if (LastEvaluatedKey !== undefined) {
        document.getElementById("jobNextButton").style[DISPLAY] = INLINE;
    } else {
        document.getElementById("jobNextButton").style[DISPLAY] = NONE;
    }

    if (jobs.length === 0) {
        return;
    }

    tableJobs = [];
    for(i = 0; i < jobs.length; i++) {
        let job = jobs[i];
        pushTableJob(job["urlHash"], job.company, job.position, job.description, job.date, job.cooldown, job.status);
    }

    clearTableJob();
    updateTableJob();
}

function postNewJob() {
    let data = new Object();

    data.username = username;
    data.url = getId("formUrl").value;
    data.company = getId("formCompany").value;
    data.position = getId("formPosition").value;
    data.description = getId("formDescription").value;
    data.date = new Date(getId("formDate").value).toISOString();
    data.cooldown = getId("formCooldown").value;
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

    let url = apiGatewayJob;
    let headers = {};
    
    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);
    headers[CONTENT_TYPE] = APP_JSON;

    makeRestCall(url, PUT, headers, JSON.stringify(data), postNewJobSuccessful, postNewJobError);
}

function postNewJobSuccessful(result) {
    pushTableJob(postNewJobData.url, postNewJobData.company, postNewJobData.position, postNewJobData.description, postNewJobData.date, postNewJobData.cooldown, postNewJobData.status);
    clearTableJob();
    updateTableJob();
}

function postNewJobError(result) {
    alert(result.responseJSON.errorCode + ": " + result.responseJSON.errorMessage);
}

function deleteJob() {
    let url = apiGatewayJob;
    let urlHash = document.getElementById("formUrl").value;

    let data = new Object();

    data.username = username;
    data.url = urlHash;
    deleteJobUrl = urlHash;

    let headers = {};
    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);
    headers[CONTENT_TYPE] = APP_JSON;

    makeRestCall(url, DELETE, headers, JSON.stringify(data), deleteJobSuccessful, deleteJobError);
}

function deleteJobSuccessful(result) {
    for(i = 0; i < tableJobs.length; i++) {
        let job = tableJobs[i];

        if (job.url === deleteJobUrl) {
            tableJobs.splice(i, 1);
            break;
        }
    }

     clearTableJob();
     updateTableJob();
}

function deleteJobError(result) {
    alert(result.responseJSON.errorCode + ": " + result.responseJSON.errorMessage);
}

function clearValue(...ele) {
    let i;

    for(i = 0; i < ele.length; i++) {
        ele[[i]].value = "";
    }
}

function pushTableJob(urlHash, company, position, description, date, cooldown, status) {
    var job = new Object();
    job.url = urlHash;
    job.company = company;
    job.position = position;
    job.description = description;
    job.date = date;
    job.cooldown = cooldown;
    job.status = status;

    var subTableJobs = [];

    //During an update we check if the job is already there and if it is, replace it.
    let i;
    for (i = 0; i < tableJobs.length; i++) {
        if (job.url === tableJobs[i].url) {

            for (j = 0; j < tableJobs.length; j++) {
                if (i === j) {
                    subTableJobs.push(job);
                } else {
                    subTableJobs.push(tableJobs[j]);
                }
            }

            break;
        }
    }

    if (subTableJobs.length === 0) {
        tableJobs.push(job);    
    } else {
        tableJobs = subTableJobs;
    }
}

function updateTableJob() {
    let i;
    for (i = 0; i < tableJobs.length; i++) {
        createJobRow(tableJobs[i], i);
    }

    $('[data-toggle="popover"]').popover();
}

function clearTableJob() {
    let jobsBody = document.getElementById("jobsBody");

    while(jobsBody.childNodes.length > 0) {
        jobsBody.childNodes[0].remove();
    }
}

function createJobRow(job, count) {
    let jobsBody = document.getElementById("jobsBody");

    let tr = document.createElement("tr");
    let number = createEleWithTxt("th", count);
    let url= document.createElement("td");
    let company = createEleWithTxt("td", job.company);
    let position = createEleWithTxt("td", job.position);
    let description = createEleWithTxt("td", job.description);

    let dateObj = new Date(job.date);
    let dateText = 
            ((dateObj.getUTCMonth() + 1) < 10 ? "0" + (dateObj.getUTCMonth() + 1) : (dateObj.getUTCMonth() + 1))
            + "/" + (dateObj.getUTCDate() < 10 ? "0" + dateObj.getUTCDate() : dateObj.getUTCDate())
            + "/" +  dateObj.getFullYear() ;

    let date = createEleWithTxt("td", dateText);
    let cooldown = createEleWithTxt("td", job.cooldown);
    let status = createEleWithTxt("td", job.status);
    let updateJob = document.createElement("td");

    if (compareDays(job.date, job.cooldown)) {
        tr.setAttribute("class", "table-warning");
    }

    number.scope = "col";
    let urlButton = createEleWithTxt("button", "Copy URL");
    urlButton.style["min-width"] = "100px";
    urlButton.setAttribute("data-toggle", "popover");
    urlButton.setAttribute("type", "button");
    urlButton.setAttribute("class", "btn btn-info");
    urlButton.setAttribute("data-content", "Copied url to clipboard!");
    urlButton.setAttribute("data-delay", 100);
    urlButton.setAttribute("onclick", "copyJobUrlToClipBoard(" + count + ")");

    urlButton.onmouseout = function(event) {
        $(event.target).popover('hide');
    }

    appendChildren(updateJob, createJobRowButtonUpdate(count));
    appendChildren(url, urlButton);
    appendChildren(tr, number, url, company, position, description, date, cooldown, status, updateJob);
    appendChildren(jobsBody, tr)
}

function createJobRowButtonUpdate(rowNumber) {
    let changeButton = createEleWithTxt("button", "Update");

    changeButton.setAttribute("type", "button");
    changeButton.setAttribute("class", "btn btn-light");
    changeButton.setAttribute("data-toggle", "modal");
    changeButton.setAttribute("data-target", "#jobModal");
    changeButton.setAttribute("data-title", "Update Job");
    changeButton.setAttribute("data-job-row", rowNumber);
    changeButton.setAttribute("data-active-url", false);

    return changeButton;
}

$('#jobModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let title = button.data('title');
    let jobRow = button.data('job-row');
    let activeUrl = button.data('active-url');

    let modal = $(this);
    modal.find('.modal-title').text(title)

    let job = tableJobs[jobRow];

    let formUrl;
    let formCompany;
    let formPosition;
    let formDescription;
    let formDate;
    let formCooldown;
    let formStatus;
    let jobDeleteDisplay;

    if(jobRow !== undefined) {
        formUrl = job.url;
        formCompany = job.company;
        formPosition = job.position;
        formDescription = job.description;
        formDate = new Date(job.date);
        formCooldown = job.cooldown;
        formStatus = job.status;

        jobDeleteDisplay = INLINE;

    } else {
        formUrl = "";
        formCompany = "";
        formPosition = "";
        formDescription = "";
        formDate = new Date();
        formCooldown = 90;
        formStatus = "";

        jobDeleteDisplay = NONE;
    }

    if (activeUrl === false) {
        document.getElementById("formUrl").disabled = true;
    } else {
        document.getElementById("formUrl").disabled = false;
    }

    formDate = formDate.getFullYear() + "-" + ((formDate.getUTCMonth() + 1) < 10 ? "0" + (formDate.getUTCMonth() + 1) : (formDate.getUTCMonth() + 1)) + "-" + (formDate.getUTCDate() < 10 ? "0" + formDate.getUTCDate() : formDate.getUTCDate());
    document.getElementById("jobModalDeleteButton").style[DISPLAY] = jobDeleteDisplay;

    modal.find('#formUrl')[0].value = formUrl;
    modal.find('#formCompany')[0].value = formCompany;
    modal.find('#formPosition')[0].value = formPosition;
    modal.find('#formDescription')[0].value = formDescription;
    modal.find('#formDate')[0].value = formDate;
    modal.find('#formCooldown')[0].value = formCooldown;
    modal.find('#formStatus')[0].value = formStatus;
});


function copyJobUrlToClipBoard(jobNumber) {
    let job = tableJobs[jobNumber];

    navigator.clipboard.writeText(job.url).then(function() {
    }, function(err) {
        toConsole(err);
    });
}

$(".job-dropdown-item").on('click', function () {
    sortOrder = this.innerText;
    document.getElementById("jobSortOrderButton").innerText = this.innerText;

    getUserJobs();
})
