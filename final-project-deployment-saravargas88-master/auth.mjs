import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';


const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};
const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};

const register = async (username, password) => {
  if ( password.length <= 8) {
    throw { message: "PASSWORD TOO SHORT" };
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw { message: "USERNAME ALREADY EXISTS" };
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hash
  });

  await newUser.save();
  return newUser;
};

const login = async (username, password) => {

  const foundUser = await User.findOne({ username });
  if (!foundUser) {
        throw { message: "USER NOT FOUND" };
    }
   
    const match=bcrypt.compareSync(password, foundUser.password); 

      if(!match){
        throw { message:"PASSWORDS DO NOT MATCH" };
      }
      else{
        return foundUser;
      }
    };

export{
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
