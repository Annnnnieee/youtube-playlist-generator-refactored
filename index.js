let authorize = require('./Authorization');

(async function(){
    var auth = await authorize(); 
    console.log(auth);

})();