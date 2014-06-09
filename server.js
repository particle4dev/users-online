var Connections = (function(){
    var list_ = {};
    return {
        push: function(connection){
            list_[connection.id] = Meteor.server.sessions[connection.id];
        },
        pop: function(connectionId){
            list_[connectionId] = null;
            delete list_[connectionId];
        },
        sendMessage: function(connectionId, message){
            list_[connectionId].sendAdded('messageusersonline', Random.id(), message);
        }
    };
})();
/**
    {
        _id:
        connection: [
            connection1.id, connection2.id
        ],
        user: {...}
    }
*/

UsersOnline = new Meteor.Collection('usersonline', {
    connection: null
});

// wrapped logout method!!!
var logoutMethod = Meteor.server.method_handlers['logout'];
Meteor.server.method_handlers['logout'] = function () {
    removeWithUserId(this.userId);
    logoutMethod.call(this);
};

var insert = function (user, connectionId) {
    var u = UsersOnline.findOne({
        'user._id': user._id
    });
    if (!u) {
        // not found
        return UsersOnline.insert({
            connection: [connectionId],
            user: userTransform(user)
        });
    }
    UsersOnline.update(u._id, {
        $push: {
            connection: connectionId
        }
    });
    return u._id;
};
var remove = function (connectionId) {
    var u = UsersOnline.findOne({
        connection: connectionId
    });
    if (u) {
        if (u.connection.length > 1) {
            UsersOnline.update(u._id, {
                $pop: {
                    connection: connectionId
                }
            });
            return 1;
        } else {
            return UsersOnline.remove({
                connection: connectionId
            });
        }
    }
    return 0;
};
var removeWithUserId = function (userId) {
    return UsersOnline.remove({
        'user._id': userId
    });
};
Meteor.server.onConnection(function (connection) {
    Connections.push(connection);
    connection.onClose(function () {
        remove(connection.id);
        Connections.pop(connection.id);
    });
});
Accounts.onLogin(function (info) {
    return insert(info.user, info.connection.id);
});

//name String
//Name of the record set. If null, the set has no name, and the record set is automatically sent to all connected clients.
Meteor.publish(null, function () {
    var sub = this;
    if (!userIdFilter(this.userId)) {
        sub.ready();
        return;
    }
    return UsersOnline.find();
}, /*suppress autopublish warning*/ {
    is_auto: true
});

var userIdFilter = function (userId) {
    return !!Package.autopublish;
};
// XXX make this take effect at runtime too?
UsersOnline.setUserIdFilter = function (filter) {
    userIdFilter = filter;
};
var userTransform = function (user) {
    return {
        _id: user._id,
        profile: user.profile,
        username: user.username,
        emails : user.emails
    };
};
UsersOnline.setUserTransform = function (func) {
    userTransform = func;
};

/**
 *
 */
Meteor.methods({
    'sendMessageToUser': function(userId, message){
        var self = this;
        var sender = Meteor.users.findOne(self.userId);
        UsersOnline.find({'user._id': { $in: [userId, self.userId] }}).forEach(function(conn){
            Connections.sendMessage(conn.connection, {
                userId: sender._id,
                image: sender.profile.image,
                message: message,
                updated: new Date()
            });
        });
    }
});