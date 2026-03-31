var socket = io.connect('http://localhost:8000');

function checkBrowser() {
    var browser = 'Noname browser';
    if (navigator.userAgent.search("Chrome") > -1) {
        browser = "Chrome";
    }

    if (navigator.userAgent.search("Firefox") > -1) {
        browser = "Firefox";
    }

    return browser;
}

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        messages: []
    },
    mounted: function () {
        var self = this;

        socket.on('connect', function () {
            var text = 'Hello to everyone from ' + checkBrowser();
            self.messages.push('Me: ' + text);
            socket.emit('message-from-client', text);
        });

        socket.on('message-from-server', function (message) {
            self.messages.push('Other: ' + message);
        });
    },
    methods: {
        sendMessage: function () {
            if (this.message.trim() === '') return;

            this.messages.push('Me: ' + this.message);
            socket.emit('message-from-client', this.message);
            this.message = '';
        }
    }
});
