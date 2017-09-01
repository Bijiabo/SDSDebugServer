/**
 * Created by huchunbo on 2017/7/23.
 */
var deviceData = [];



var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        deviceData: deviceData, // 设备上报数据
        debugMode: false,
        // deviceType: deviceType,
        currentDeviceType: '',
        ws: undefined,
        difference: []
    },
    methods: {
        setupWebSocket: function () {
            this.ws = new WebSocket("ws://localhost:8000");
    
            var self = this;
    
            this.ws.onopen = function(evt) {
                console.log("Connection open ...");
                self.ws.send("Hello WebSockets!");
            };
    
            this.ws.onmessage = function(evt) {
                console.log(new Date() + " Received Message: " + evt.data);
        
                try {
                    var data = JSON.parse(evt.data);
                    // 若收到 app 消息，且为所需设备上报数据，则保存并计算
                    if (data.from == 'app' && data.type == 'deviceUploadData') {
                        data.data.time = (new Date()).toLocaleString();
                        self.deviceData.push(data.data);
                        self.computeDifference();
                    }
                    
                } catch (error) {
            
                }
        
                // ws.close();
            };
    
            this.ws.onclose = function(evt) {
                console.log("Connection closed.");
            };
        },
        toggleDebugMode: function () {
            this.debugMode = !this.debugMode;
        },
        clearData: function () {
            this.deviceData = [];
        },
        computeDifference: function () {
            var result = [];
            var deviceUploadData = this.deviceData;
            for (var i=0,len=deviceUploadData.length; i<len; i++) {
                if (i===0) {continue}
                var currentDefference = {};
                var currentItem = deviceUploadData[i],
                    previousItem = deviceUploadData[i-1];
        
                for (var key in currentItem) {
                    var currentItemKeyValue = currentItem[key].value,
                        previousItemKeyValue = previousItem[key].value;
                    if (currentItemKeyValue != previousItemKeyValue) {
                        currentDefference[key] = {}
                        currentDefference[key][i] = currentItem[key]
                        currentDefference[key][i-1] = previousItem[key]
                    }
                }
                result.push({
                    description: "对照 ["+i+"]",
                    result: currentDefference
                })
            }
            
            this.difference = result;
        }
    },
    computed: {
        
    },
    mounted: function () {
        console.log('on mount');
        
        // setup websocket
        this.setupWebSocket();
    }
});

// var ws = new WebSocket("ws://localhost:8000");




