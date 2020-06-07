function setStyle(htmlEle, prop, value) {
    htmlEle.style[prop] = value;
}

function getStyle(htmlEle, prop) {
    return htmlEle.style[prop];
}

function getId(id) {
    return document.getElementById(id);
}

function toggleButtons(ele1, ele2) {
    if (!ele1 || !ele2) {
        return;
    }

    let ele1Display = getStyle(ele1, "display") == "none" ? "inline" : "none";
    let ele2Display = ele1Display == "none" ? "inline" : "none";

    setStyle(ele1, "display", ele1Display);
    setStyle(ele2, "display", ele2Display);
}

function getEpoch() {
    return Math.round(Date.now() / 1000)
}

function signIn() {
    saveToLocal(REDIRECT_URI, cognitoRedirectUri);
    window.location.href = cognitoLoginUrl;
}

function signOut() {
   localStorage.clear();
   window.location.href = window.location.origin + window.location.pathname;
}

function createEleWithTxt(type, text) {
    let ele = document.createElement(type);
    ele.innerText = text;
    return ele;
}

function appendChildren(parent, ...children) {
    let i;
    for(i = 0; i < children.length; i++) {
        parent.appendChild(children[i]);
    }
}

function toConsole(text) {
    if (toLog) {
        console.log(text);
    }
}

function makeRestCall(url, method, headers, data, successCall, errorCall) {
    $.ajax({
        url: url,
        type: method,
        headers: headers,
        data: data,
        success: function (result) {
            successCall(result)
        },
        error: function (error) {
            errorCall(error);
        }
    });
}
