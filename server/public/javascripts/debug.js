/**
 * Created by huchunbo on 2017/7/23.
 */
var deviceData = [
    {
        "key": "WorkMode",
        "value": "0"
    },
    {
        "key": "WorkStatus",
        "value": "1"
    }
];

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        deviceData: deviceData,
        debugMode: false
    },
    methods: {
        uploadDeviceStatus: function () {
            console.log("run -> uploadDeviceStatus");
            sendObject(this.packagedData);
        },
        addRow: function () {
            this.deviceData.push({
                "key": "",
                "value": ""
            })
        },
        toggleDebugMode: function () {
            this.debugMode = !this.debugMode;
        }
    },
    computed: {
        packagedData: function () {
            var result = {};
            for (var i=0,len=this.deviceData.length; i<len; i++) {
                var item = this.deviceData[i];
                if (item.key.length===0 || item.value.length===0) {continue;}
                result[item.key] = {
                    value: item.value
                }
            }
            return result;
        }
    }
});

var ws = new WebSocket("ws://localhost:8080");

ws.onopen = function(evt) {
    console.log("Connection open ...");
    ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
    console.log( "Received Message: " + evt.data);
    // ws.close();
};

ws.onclose = function(evt) {
    console.log("Connection closed.");
};

var sendObject = function (data) {
    var packageData = {
        from: "device",
        data: data
    }
    var dataToString = JSON.stringify(packageData);
    console.log(">>> send: " + dataToString);
    ws.send(dataToString);
}



