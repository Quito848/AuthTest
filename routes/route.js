const express = require('express'),
      router = express.Router(),
      db = require('..\\config\\database'),
      User = require('..\\models\\User');
router.get('/',(req,res) =>{
   User.findAll()
       .then(users => {console.log(users)
                       res.sendStatus(200);
       })
       .catch(err => console.log(err))
});

module.exports = router;