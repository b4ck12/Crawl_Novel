// ==UserScript==
// @name         STV DLD
// @namespace    https://your-namespace.com
// @version      1.0
// @description  Script to send a request and get the response
// @match        https://sangtacviet.com/truyen/fanqie/1/7144984768625511460/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var runButton = document.createElement('button');
    runButton.innerText = 'Download';
    runButton.style.position = 'fixed';
    runButton.style.top = '50%';
    runButton.style.right = '10px';
    runButton.style.transform = 'translateY(-50%)';
    runButton.onclick = function() {
         var urls = [
            "https://sangtacviet.com/truyen/fanqie/1/7158752613117201419/7356964470213919294/",
            "https://sangtacviet.com/truyen/fanqie/1/7158752613117201419/7387065557914223128/",
            "https://sangtacviet.com/truyen/fanqie/1/7158752613117201419/7387066203522482712/"
        ]

    var responses = [];

    function sendRequest(url) {
        var parts = url.split('/');
        var lastPart = parts[parts.length - 2]; // -2 because the URL ends with a '/', so the last element is an empty string
        var url_content = 'https://sangtacviet.com/index.php?bookid=7144984768625511460&h=fanqie&c=' + lastPart + '&ngmar=readc&sajax=readchapter&sty=1&exts=';

        var xhttp = new XMLHttpRequest();
        var payload = {
            initiator: 'https://sangtacviet.com',
            method: 'POST',
            url: url_content,
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'vi',
            'Content-type': 'application/x-www-form-urlencoded',
            'Origin': 'https://sangtacviet.com',
            'Referer': url,
            'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        };

        var queryString = Object.keys(payload).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
        }).join('&');

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                console.log('Response of url', url);
                responses.push(xhttp.responseText);

                if (responses.length === urls.length) {
                    saveResponses();
                }
            }
        };

        xhttp.open(payload.method, payload.url, true);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send(queryString);
    }

    function saveResponses() {
        var combinedResponse = responses.join('\n\n');

        var blob = new Blob([combinedResponse], { type: "text/plain" });
        var url_txt = window.URL.createObjectURL(blob);

        var link = document.createElement("a");
        link.href = url_txt;
        link.download = "combined_responses.txt";
        link.click();

        window.URL.revokeObjectURL(url_txt);
    }

    // Gửi các yêu cầu
        for (var i = 0; i < urls.length; i++) {
            sendRequest(urls[i]);
        }

        // Thay đổi trạng thái và văn bản của nút
        runButton.disabled = true;
        runButton.innerText = 'Downloading...';
    };

    // Thêm nút vào trang web
    document.body.appendChild(runButton);
})();