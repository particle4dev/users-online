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