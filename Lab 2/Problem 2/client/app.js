var app = new Vue ({
    el: '#app',
    data: {
        users: [],
        usersService: null,
        newUser: {
            name: '',
            city: ''
        },
        editIndex: -1,
        editUser: {
            name: '',
            city: ''
        },
        statusMessage: ''
    },
    created: function () {
        this.usersService = users();
        this.loadUsers();
    },

    methods: {
        loadUsers: function () {
            this.usersService.get().then(response => {this.users = response.data;});
        },

        addUser: function () {
            if (!this.newUser.name || !this.newUser.city) {
                alert('Please complete both fields.');
                return;
            }

            this.usersService.add({
                name: this.newUser.name,
                city: this.newUser.city
            }).then(() => {
                this.newUser.name = '';
                this.newUser.city = '';
                this.loadUsers();
            });
        },

        startEdit: function (index) {
            this.editIndex = index;
            this.editUser = {
                name: this.users[index].name,
                city: this.users[index].city
            };
        },
        cancelEdit: function () {
            this.editIndex = -1;
            this.editUser = {
                name: '',
                city: ''
            };
        },

        saveEdit: function () {
            if (this.editIndex === -1) {
                return;
            }

            if (!this.editUser.name || !this.editUser.city) {
                alert('Please complete both fields.');
                return;
            }

            this.usersService.update(this.editIndex, {
                name: this.editUser.name,
                city: this.editUser.city
            }).then(() => {
                this.cancelEdit();
                this.loadUsers();
            });
        },

        deleteUser: function (index) {
            this.usersService.remove(index).then(() => {
                this.loadUsers();
            });
        }
    }
});