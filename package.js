Package.describe({
    summary: "Keeps track of user connection state",
});

// cd /var/www/js/project/packages/users-online
// meteor test-packages ./

var both = ['client', 'server'];
var client = ['client'];
var server = ['server'];

Package.on_use(function (api) {
    api.use('accounts-base');

    // server
    api.add_files(["server.js"], server);
    // client
    api.add_files(["client.js"], client);
    
    if (typeof api.export !== 'undefined') {
        api.export('UsersOnline', both);
    }
});