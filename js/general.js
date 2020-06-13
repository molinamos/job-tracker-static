
function postNewJob() {
    let data = new Object();

    data.username = username;
    data.url = getId("formUrl").value;
    data.company = getId("formCompany").value;
    data.position = getId("formPosition").value;
    data.description = getId("formDescription").value;
    data.date = getId("formDate").value;
    data.status = getId("formStatus").value;

    clearValue(
        getId("formUrl"),
        getId("formCompany"),
        getId("formPosition"),
        getId("formDescription"),
        getId("formDate"),
        getId("formStatus")
    );

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

function loadJobsTable(result) {
    let jobs = result;
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

function clearValue(...ele) {
    let i;
    for(i = 0; i < ele.length; i++) {
        ele[[i]].value = "";
    }
}


