###Installation

Install the smart package using meteorite:

    $ mrt add users-online

###Quick Start

Publish to user:
    
    UsersOnline.setUserIdFilter(function(userId){
        if(isAnonymous(userId))
            return false;
        return true;
    });

Find user is online :

    UsersOnline.find()

Set transformation function:

    UsersOnline.setUserTransform(function(user){
        return {
            _id: user._id,
            profile: user.profile,
            username: user.username,
            emails : user.emails,
            updated: user.updated
        };
    });
