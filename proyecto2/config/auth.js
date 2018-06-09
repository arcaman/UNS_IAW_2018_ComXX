// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '252739447282-tqd4po0n8gntlbum2m4ts02qfhgkrb2c.apps.googleusercontent.com',
        'clientSecret'  : 'YCyhKvtbmvmA5L75JekKyEsP',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
