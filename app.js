const WebSocket = require('ws');

const hostname = ''; //控えておいたHost
const ws = new WebSocket('ws://'+ hostname +':4035/websocket');
const sessionKey = 'test'; //sessionKeyはなんでもよい

ws.onopen = function () { //1.接続
    ws.send('{"sessionKey": "' + sessionKey+ '"}'); //2.sessionKeyを送信
    callWebAPI(sessionKey); //3.Web APIをコール
};

ws.onerror = function (error) {
    console.log(error);
};

ws.onmessage = function (message) { //4.イベントの受信

    try {
        var json = JSON.parse(message.data);
        var bpm = json['heart']['rate']['value'];
        console.log('BPM:' + bpm);
    } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ',
            message.data);
        return;
    }
};

const http = require('http');

function callWebAPI(sessionKey) {
    const resource = 'health/onheart';
    const serviceId = '';

    const options = {
        host: hostname,
        port: '4035',
        path: '/gotapi/' + resource + '?serviceId=' + serviceId + '&sessionKey=' + sessionKey,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, function (res) {
        var responseString = '';

        res.on('data', function (data) {
            responseString += data;

            try {
                var json = JSON.parse(data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ',
                    data);
                return;
            }

            console.log(json);
        });
        res.on('end', function () {
            return responseString;
        });
    });

    req.on('error', function (error) {
        console.log(error);
    });

    req.end();
}
