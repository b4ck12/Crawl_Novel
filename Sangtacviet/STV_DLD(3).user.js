// ==UserScript==
// @name         STV DLD (Yêu cầu của bạn + sleep 10s)
// @namespace    https://your-namespace.com
// @version      1.1_combined
// @description  Kết hợp code POST cũ và Keep Tab Alive, có sleep 10s giữa các request.
// @match        https://sangtacviet.com/truyen/fanqie/*/*/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    (function keepTabAlive() {
        if (window.__silentAudioStarted) return;
        window.__silentAudioStarted = true;
        const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAD//w==");
        audio.loop = true;
        audio.volume = 0;
        const btn = document.createElement('button');
        btn.textContent = 'Keep Tab Alive';
        btn.style.position = 'fixed';
        btn.style.top = '50px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '8px 12px';
        btn.style.background = '#2196F3';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = function() {
            audio.play().then(() => {
                btn.disabled = true;
                btn.textContent = 'Tab is Alive!';
                btn.style.background = '#4CAF50';
            }).catch(err => {
                alert('Không thể bật âm thanh. Vui lòng tương tác với trang trước (click chuột).');
            });
        };
        document.body.appendChild(btn);
    })();


    var runButton = document.createElement('button');
    runButton.innerText = 'Download';
    runButton.style.position = 'fixed';
    runButton.style.top = '50%';
    runButton.style.right = '10px';
    runButton.style.transform = 'translateY(-50%)';
    runButton.style.zIndex = '9998';
    runButton.onclick = function() {
        runButton.disabled = true;
        runButton.innerText = 'Downloading...';

        var urls = [
            "https://sangtacviet.com/truyen/fanqie/1/7158752613117201419/7356964470213919294/",
            "https://sangtacviet.com/truyen/fanqie/1/7158752613117201419/7387065557914223128/",
            "https://sangtacviet.com/truyen/fanqie/1/7158752613117201419/7387066203522482712/"
        ];

        var responses = [];

        function sendRequest(url, callback) {
            var parts = url.split('/');
            var bookId = parts[parts.length - 3];
            var lastPart = parts[parts.length - 2];
            var url_content = `https://sangtacviet.com/index.php?bookid=${bookId}&h=fanqie&c=${lastPart}&ngmar=readc&sajax=readchapter&sty=1&exts=`;

            var xhttp = new XMLHttpRequest();
            var payload = {
                method: 'POST',
                url: url_content,
                'Accept': '*/*',
                'Content-type': 'application/x-www-form-urlencoded',
                'Origin': 'https://sangtacviet.com',
                'Referer': url
            };
            var queryString = Object.keys(payload).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
            }).join('&');

            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        console.log('Response of url', url, xhttp.responseText);
                        responses.push(xhttp.responseText);
                    } else {
                        console.error('Failed to fetch url', url, 'Status:', xhttp.status);
                    }
                    if (responses.length === urls.length) {
                        saveResponses();
                        runButton.innerText = 'Download Complete!';
                        runButton.disabled = false;
                    }
                    // Gọi callback để tiếp tục vòng lặp
                    callback();
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

        // Hàm để gửi các yêu cầu tuần tự với độ trễ
        function processUrlsSequentially(index) {
            if (index >= urls.length) {
                console.log('Đã gửi tất cả các yêu cầu.');
                return;
            }

            console.log(`Đang gửi yêu cầu cho URL ${index + 1}/${urls.length}: ${urls[index]}`);
            // Gửi yêu cầu hiện tại
            sendRequest(urls[index], function() {
                // Sau khi yêu cầu hoàn tất (thành công hoặc thất bại), đợi 10 giây
                if (index + 1 < urls.length) {
                    console.log('Đợi 10 giây trước khi gửi yêu cầu tiếp theo...');
                    setTimeout(function() {
                        // Gửi yêu cầu tiếp theo
                        processUrlsSequentially(index + 1);
                    }, 10000); // 10000 milliseconds = 10 seconds
                }
            });
        }

        // Bắt đầu quá trình
        processUrlsSequentially(0);
    };

    document.body.appendChild(runButton);
})();