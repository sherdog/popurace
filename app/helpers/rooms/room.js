function Room(username)
{
    this.users = [];
    if (username)
        this.users.push(username);
}

Room.prototype.addUser = function(username)
{
    this.users.push(username);
}

Room.prototype.getUsers = function()
{
    return this.users;
}

Room.prototype.removeUser = function(username)
{
    for(var i = 0; i < this.users.length; i++)
    {
        if (this.users[i] === username)
        {
            this.users.splice(i, 1);
            continue;
        }
    }
}

module.exports = Room;