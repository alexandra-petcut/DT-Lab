var app = new Vue({
  el: '#app',
  data: {
    message: '',
    result: '',
  },
  methods: {
    process: function () {
      if (this.message.trim() === '123') {
        this.result = 'Message is equal to 123';
      } else {
        this.result = 'Message is not equal to 123';
      }
    }
  }
});