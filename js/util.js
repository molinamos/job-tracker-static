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

    let ele1Display = getStyle(ele1, DISPLAY) == NONE ? INLINE : NONE;
    let ele2Display = ele1Display == NONE ? INLINE : NONE;

    setStyle(ele1, DISPLAY, ele1Display);
    setStyle(ele2, DISPLAY, ele2Display);
}

function getEpoch() {
    return Math.floor(Date.now() / 1000)
}

function isStillValid(expiration) {
    return getEpoch() < expiration;
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

function saveToLocal(key, input) {
    localStorage[key] = input;
}

function getFromLocal(key) {
    return localStorage[key] || null;
}

function updateUsername(newName) {
    let boldUsername = document.getElementById("currentBoldUsername");
    if (boldUsername) {
        boldUsername.innerText = newName;
    }

    boldUsername.style.display = INLINE;
}