// Array of connected users
var users = [];

// Remove user after the game ended
function deleteUser(id) {
    var usrs = users.findIndex(user => user.id == id);
    users.splice(usrs, 1);
}

// Add new user to the array
function joinUser(id, nickname, room) {
    const user = {id, nickname, room};
    users.push(user);
    return user;
}

// Get user from array by id
function getUserById(id) {
    return users.find(user => user.id == id);
}

// Get users from array by room
function getUsersByRoom(room) {
    return users.find(user => user.room == room);
}

exports.joinUser        = joinUser;
exports.getUserById     = getUserById;
exports.deleteUser      = deleteUser;
exports.getUsersByRoom  = getUsersByRoom;