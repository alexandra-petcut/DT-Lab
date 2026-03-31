function users() {
    var get = function () {
        return axios.get("http://localhost:3000/users");
    }

    var add = function (user) {
        return axios.put("http://localhost:3000/users", user);
    };

    var update = function (index, user) {
        return axios.put("http://localhost:3000/users/" + index, user);
    };

    var remove = function (index) {
        return axios.delete("http://localhost:3000/users/" + index);
    };

    return {
        get: get,
        add: add,
        update: update,
        remove: remove
    };
}