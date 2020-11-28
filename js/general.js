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

var deleteJobUrl;
function deleteJob() {
    let url = apiGatewayJob;
    let urlHash = document.getElementById("formUrl").value;

    let headers = {};
    headers[AUTHORIZATION] = getFromLocal(ID_TOKEN);
    headers[CONTENT_TYPE] = APP_JSON;

    let data = new Object();

    data.username = username;
    data.url = urlHash;

    deleteJobUrl = urlHash;

    makeRestCall(url, DELETE, headers, JSON.stringify(data), deleteJobSuccessful, toConsole);
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

    var subTableJobs = [];

    //During an update we check if the job is already there and if it is, replace it.
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
    for (i = 0; i < tableJobs.length; i++) {
        createJobRow(tableJobs[i], i);
    }
}

function clearTableJob() {
    let jobsBody = document.getElementById("jobsBody");

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

    let updateJob = document.createElement("td");
    appendChildren(updateJob, createJobRowButtonUpdate(count));


    number.scope = "col";

    appendChildren(tr, number, url, company, position, description, date, status, updateJob);
    let jobsBody = document.getElementById("jobsBody");
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

    return changeButton;
}

function createJobRowEditButton() {
    let editButton = createEleWithTxt("button", "edit");
    editButton.setAttribute("onclick", "editJobRow(this)");
    editButton.setAttribute("class", "btn btn-light");
    return editButton;
}

function createJobRowConfirmButton() {
    let confirmButton = createEleWithTxt("button", "✓")
    confirmButton.setAttribute("class", "btn btn-primary");
    return confirmButton;
}

function createJobRowCancelButton() {
    let cancelButton = createEleWithTxt("button", "✗");
    cancelButton.setAttribute("class", "btn btn-secondary");
    return cancelButton;
}

function createJobRowDeleteButton() {
    let deleteButton = createEleWithTxt("button", "delete");
    deleteButton.setAttribute("class", "btn btn-light");
    return deleteButton;
}

function editJobRow (editButton) {
    let row = editButton.parentElement.parentElement;

    row.setAttribute("class", "table-light");
    row.childNodes[row.childNodes.length - 1].remove();

    let buttonTd = document.createElement("td");
    appendChildren(buttonTd, createJobRowConfirmButton(), createJobRowCancelButton());
    appendChildren(row, buttonTd);
}

$('#jobModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var title = button.data('title');
  var jobRow = button.data('job-row');

  var modal = $(this);
  modal.find('.modal-title').text(title)

  if(jobRow !== undefined) {
    let jobsBody = document.getElementById('jobsBody');
    let row = jobsBody.childNodes[jobRow];
    modal.find('#formUrl')[0].value = row.childNodes[1].innerText;
    modal.find('#formCompany')[0].value = row.childNodes[2].innerText;
    modal.find('#formPosition')[0].value = row.childNodes[3].innerText;
    modal.find('#formDescription')[0].value = row.childNodes[4].innerText;
    modal.find('#formDate')[0].value = row.childNodes[5].innerText;
    modal.find('#formStatus')[0].value = row.childNodes[6].innerText;
  }
});


