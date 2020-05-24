function postNewJob() {
    let url = "https://2q8vgan9uj.execute-api.us-west-2.amazonaws.com/prod/job";
    let data = new Object();

    data.username = getId("formUsername").value;
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
    let url = "https://2q8vgan9uj.execute-api.us-west-2.amazonaws.com/prod/job?username=testMolina";

    $.ajax({
        url: url,
        type: "GET",
        success: function (result) {
            console.log("200");
            console.log(result);
        },
        error: function (error) {
            console
            .log("500");
            console.log(error);
        }
    });
}

function getId(id) {
    return document.getElementById(id);
}