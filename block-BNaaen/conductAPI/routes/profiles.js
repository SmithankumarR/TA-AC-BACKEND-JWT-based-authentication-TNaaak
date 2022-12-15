
var express = require("express");
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");
var router = express.Router();

// get profile by username

router.get('/:username', auth.isLoggedIn, async (req,res,next) => {
    var username = req.params.username;
    try{
        var profile = await Profile.findOne({ username });
        if(!profile){
            return res.status(400).json({error:"invalid profile name"});
        }
        return res.json({ profile });
    } catch(error){
        next(error);
    }
})

// follow profile
router.post('/:username/follow', auth.isLoggedIn, async function(req,res,next) {
    var username = req.params.username;
  var  loggedUser = req.user;
    try{
        var targetProfile = await Profile.findOne({ username });
        if(!targetProfile){
            return res.json({ error : "Invalid profile username"});

        }
        if(username ==  loggedUser.username){
            return res.json({ error: "You can not follow yourself"});
        }
        var currentUser = await Profile.findOneAndUpdate(
            {username:loggedUser.username},
            {$push:{following:targetProfile.id }}
        )

        var updatedTarget = await Profile.findByIdAndUpdate(targetProfile.id, 
            {$push:{ followers: currentUser.id},
        
        })
        return res.json({ loggedUser:currentUser, followedUser: updatedTarget});

    } catch(error){
        next(error);
    }

});

//unFollow profile

router.delete("/:username/follow", auth.isLoggedIn, async (req, res, next) => {
    let username = req.params.username;
   var  loggedUser = req.user;
    try {
      let targetProfile = await Profile.findOne({ username });
      if (!targetProfile) {
        return res.json({ error: "Invalid profile username" });
      }
  
      if (username === loggedUser.username) {
        return res.json({ error: "You can not unFollow/follow yourself" });
      }
      let currentUser = await Profile.findOneAndUpdate(
        {
          username: loggedUser.username,
        },
        { $pull: { following: targetProfile.id } }
      );
  
      let updatedTarget = await Profile.findByIdAndUpdate(targetProfile.id, {
        $pull: { followers: currentUser.id },
      });
  
      return res.json({ loggedUser: currentUser, followedUser: updatedTarget });
    } catch (error) {
      next(error);
    }
  });
  
  module.exports = router;