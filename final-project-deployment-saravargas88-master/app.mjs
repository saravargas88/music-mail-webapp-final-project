import './config.mjs'
import './db.mjs';
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import hbs from 'hbs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import * as auth from './auth.mjs';
import sanitize from 'mongo-sanitize';

//import { passportConfig } from './passport.js';
import LoveLetterFormatter from './LoveLetterFormatter.js';

dotenv.config();
const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//set up hbs and the static files 
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

//Parses incoming form data from HTML forms
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 

//enabling session handling 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));


//set mongoose model: 
const LoveLetter = mongoose.model('LoveLetter');
const LoveLetterList = mongoose.model('LoveLetterList');
const User = mongoose.model('User');
const authRequiredPaths = ['/letter/add'];
const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short"};

app.use((req, res, next) => {
  if(authRequiredPaths.includes(req.path)) {
    if(!req.session.user) {
      res.redirect('/login'); 
    } else {
      next(); 
    }
  } else {
    next(); 
  }
});

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  console.log(req.path.toUpperCase(), req.body);
  next();
});


function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}


app.get('/', requireLogin , async (req, res) => {

  const letterList = await LoveLetterList.findOne({ user: req.session.user._id }).populate('loveLetters');
  const allLetters = letterList?.loveLetters ?? [];

  const currentUserId = req.session.user._id;

  const pending = allLetters.filter(letter =>
  !letter.sent && letter.sender.equals(currentUserId));

  const sent = allLetters.filter(letter =>
    letter.sent && letter.sender.equals(currentUserId)
  );

  const received = allLetters.filter(letter =>
    letter.sent && letter.recipient?.equals(currentUserId)
  );

    res.render('index', {
      user: req.session.user,
      


      pendingLetters: pending,
      sentLetters: sent,
      received: received,


      pendingCount: pending.length,
      sentCount: sent.length,
      receivedCount: received.length
    });
  });

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).send('Could not log out.');
      }
      res.redirect('/login'); // redirect after logout
    });
});

app.get('/letter/add', (req, res) => {
  res.render('letter-add');
});

function generateSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '-') 
  .replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').trim();                   
}

app.post('/letter/add', async (req, res) => {
  try {


    //CHECK FOR INSPUTS: 

    const title = sanitize(req.body.title);
    const recipient_username = sanitize(req.body.recipient_username);
    const message = sanitize(req.body.message);
    const songTitle = sanitize(req.body.songTitle);
    const songArtist = sanitize(req.body.songArtist);
    const songPreviewUrl = sanitize(req.body.songPreviewUrl);
    const songArtUrl = sanitize(req.body.songArtUrl);


    if (!title || title.trim() === '') {
      return res.render('letter-add', { message: "Please give your letter a title." });
    }
    if (!recipient_username || recipient_username.trim() === '') {
      return res.render('letter-add', { message: "Please enter a recipient username." });
    }

    if (!message || message.trim() === '') {
      return res.render('letter-add', { message: "Please write a message in your letter." });
    }

    const recipient = await User.findOne({ username: recipient_username });
    if (!recipient) return res.redirect('/letter/add?error=recipient');

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    console.log('all good')

    const newLetter = new LoveLetter({
      title: title,
      slug: slug,
      message: message,
      recipient_username: recipient_username,
      sender: req.session.user._id, 
      sender_username: req.session.user.username,
      song: {
        title: songTitle,
        artist: songArtist,
        previewUrl: songPreviewUrl,
        artworkUrl: songArtUrl, 
      },
      sent: false
    });



    await newLetter.save();


    let senderList = await LoveLetterList.findOne({ user: req.session.user._id });
    if (!senderList) {
      senderList = new LoveLetterList({
        user: req.session.user._id,
        loveLetters: []
      });
      }
    senderList.loveLetters.push(newLetter._id);
    await senderList.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error adding letter:', err);
    res.status(500).render('letter-add', { message: 'There was an error submitting your letter.' });
  }
});



app.get('/letter/view/:slug', async (req, res) => {
  const slug = req.params.slug;
  const aletter = await LoveLetter.findOne({ slug }).exec();

  if (!aletter) {
    return res.status(404).send("Letter not found");
  }

const formatted = new LoveLetterFormatter(aletter);
res.render('letter-detail', {
  aletter,
  formattedTitle: formatted.formatTitle(),

  fullMessage: formatted.messageWithSignature()
});
  

});

app.post('/letter/delete/:slug', async (req, res) => {
  console.log("Deleting letter with slug:", req.params.slug); 

  try {
 
    const letter = await LoveLetter.findOne({ slug: req.params.slug });
    if (!letter) {
      return res.status(404).send("Letter not found.");
    }

    if (!letter.sender.equals(req.session.user._id)) {
      return res.status(403).send("Not authorized.");
    }
    console.log("Found letter:", letter);

    // remove  letter from the user  list
    await LoveLetterList.updateOne(
      { user: req.session.user._id },
      { $pull: { letters: letter._id } }
    );
     // delete letter from the loveletter collection
     await LoveLetter.findOneAndDelete({ slug: req.params.slug });

    console.log(`Deleted letter: ${letter.title}`);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting letter:', err);
    res.status(500).send('Error deleting letter.');
  }
});

app.get('/letter/edit/:slug', async(req,res)=>{

    //the letter : we are looking at
    const letter = await LoveLetter.findOne({slug:req.params.slug});

    if(!letter){
      return res.status(404).send('not found');
    }

    //check if authorized to delete
    if (!letter.sender.equals(req.session.user._id)) {
      return res.status(403).send("Not authorized.");
    }
    //render the edit form 
    res.render('letter-edit', {letter});
  });


  app.post('/letter/edit/:slug', async (req, res) => {
    try {


      const letter = await LoveLetter.findOne({ slug: req.params.slug });

      if (!letter) {
        return res.status(404).send("Letter not found.")};
      if (!letter.sender.equals(req.session.user._id)) {
        return res.status(403).send("Not authorized.");
      }

    
      const updatedLetter = await LoveLetter.findOneAndUpdate(
        { slug: req.params.slug },
        {
          title: sanitize(req.body.title),
          recipient_username: sanitize(req.body.recipient_username),
          sender_username: req.session.user.username,
          message: sanitize(req.body.message),
          song: {
            title: sanitize(req.body.songTitle),
            artist: sanitize(req.body.songArtist),
            previewUrl: sanitize(req.body.songPreviewUrl),
            artworkUrl: sanitize(req.body.songArtUrl)
          }
        },
        { new: true }
      );
  
      if (!updatedLetter) {
        return res.status(404).send('Letter not found.');
      }
  
      res.redirect('/');
    } catch (err) {
      console.error('Error updating letter:', err);
      res.status(500).render('letter-edit', {
        letter: req.body,
        message: 'There was an error updating your letter.',
      });
    }
  });


  

app.get('/register', (req, res) => {
  res.render('register');
});



app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.render('register', { message: "That username is already taken." });
    }
    const newUser = await auth.register(
      sanitize(req.body.username), 
      req.body.password
    );
    await auth.startAuthenticatedSession(req, newUser);
    const letterList = new LoveLetterList({
      user: newUser._id,  
      loveLetters: [],
    });
    await letterList.save();

    res.redirect('/'); 
  } catch(err) {
    console.log(err);
    res.render('register', {message: err.message}); 
  }
});
        
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const user = await auth.login(
      sanitize(req.body.username), 
      req.body.password
    );
    await auth.startAuthenticatedSession(req, user);
    res.redirect('/'); 
  } catch(err) {
    res.render('login', {message: loginMessages[err.message] ?? 'Login unsuccessful'}); 
  }
});

app.get('/letter/send/:slug', requireLogin, async (req, res) => {
  const slug = req.params.slug;

  try {
    const letter = await LoveLetter.findOne({ slug });
    if (!letter) return res.status(404).send("Letter not found");

    // Mark letter as sent and assign recipient
    letter.sent = true;

    const recipientUser = await User.findOne({ username: letter.recipient_username });
    if (!recipientUser) return res.status(404).send("Recipient not found");

    letter.recipient = recipientUser._id;
    await letter.save(); 

    let recipientList = await LoveLetterList.findOne({ user: recipientUser._id });
    if (!recipientList) {
      recipientList = new LoveLetterList({ user: recipientUser._id, loveLetters: [] });
    }
    if (!recipientList.loveLetters.includes(letter._id)) {
      recipientList.loveLetters.push(letter._id);
      await recipientList.save();
    }

    // Add to sender's list
    const senderId = letter.sender; // already ObjectId
    let senderList = await LoveLetterList.findOne({ user: senderId });
    if (!senderList) {
      senderList = new LoveLetterList({ user: senderId, loveLetters: [] });
    }
    if (!senderList.loveLetters.includes(letter._id)) {
      senderList.loveLetters.push(letter._id);
      await senderList.save();
    }

    res.redirect('/');
  } catch (err) {
    console.error('Error sending letter:', err);
    res.status(500).send("Error sending letter");
  }
});


app.post('/letter/send/:slug', async (req, res) => {

  const User = mongoose.model('User');
  const LoveLetter = mongoose.model('LoveLetter');
  const LoveLetterList = mongoose.model('LoveLetterList');

  try {
    const slugletter = req.params.slug;
    const letter = await LoveLetter.findOne({ slug: slugletter });

    if (!letter) {
      return res.status(404).send("Letter not found.");
    }

    letter.sent = true;

    const recipientUser = await User.findOne({ username: letter.recipient_username });

    console.log(recipientUser.username)
    
    if (recipientUser) {
      letter.recipient = recipientUser._id;

      let recipientList = await LoveLetterList.findOne({ user: recipientUser._id });
      if (!recipientList) {
        recipientList = new LoveLetterList({
          user: recipientUser._id,
          loveLetters: [],
        });
      }

      recipientList.loveLetters.push(letter._id);
      await recipientList.save();
    }

    await letter.save();

    // Get the sender's list and populate letters
    const letterList = await LoveLetterList.findOne({ user: req.session.user._id }).populate('loveLetters');

    const pending = letterList.loveLetters.filter(l => !l.sent);
    const sent = letterList.loveLetters.filter(l => l.sent);

    const received = await LoveLetter.find({ recipient: req.session.user._id }).populate('sender');

    res.render('index', {
      user: req.session.user,
      home: true,
      pendingLetters: pending,
      sentLetters: sent,
      received: received,
      pendingCount: pending.length,
      sentCount: sent.length,
      receivedCount: received.length
    });

  } catch (err) {
    console.error("Error sending letter:", err);
    res.status(500).send("Server error");
  }
});




const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
