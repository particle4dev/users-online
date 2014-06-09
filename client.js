UsersOnline = new Meteor.Collection('usersonline');
MessageUsersOnline = new Meteor.Collection('messageusersonline', {
	transform: function(doc) {return new MessageUsersOnlineDocument(doc);}
});
MessageUsersOnline.deny({
    insert: function() {return true;},
    update: function() {return true;},
    remove: function() {return true;}
});
MessageUsersOnlineDocument = function(doc){
    var self = this;
    _.extend(self, doc);
};
_.extend(MessageUsersOnlineDocument.prototype, {
    constructor: MessageUsersOnlineDocument,
    myChat: function(){
        return this.userId === Meteor.userId();
    }
});
Meteor.subscribe('messageusersonline', function(err){
    console.error('err', err);
});