import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
import dotenv from 'dotenv';
const { Schema } = mongoose;
import slugify from 'slugify';



mongoose.connect(process.env.DSN);
/*
 * 
 * Site requires authentication 
 * user has username and password
 * they need a spotifyId to use API
 * List of loveletters
*/
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  loveLetterList: { type: mongoose.Schema.Types.ObjectId, ref: "LoveLetterList" },
  slug:{ type: String, unique: true }
});



/**
 * List of love letters sent from the user 
 */
const LoveLetterListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    loveLetters: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoveLetter" }]
  });

  /*
   * Love letters are sent from one user to someone
    * It contains: 
    * A reference to the user document who is sending the love letter.
    * The email address of the person receiving the love letter.
    * The content of the love letter written by the sender.
    * The URL of the Spotify playlist shared
   */
  const LoveLetterSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender_username: {type: String, required:true},

    title: { type: String, required: true },
    
    slug: { type: String, unique: true },
    recipient_username: { type: String, required: true},
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    message: { type: String, required: true },
    song: {
        title: String,
        artist: String,
        previewUrl: String,
        artworkUrl: String
      },
    sent: { type: Boolean, default: false },
  }, { timestamps: true });
  
  // automatically generate slug from title before saving
LoveLetterSchema.pre('save', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

mongoose.model('User', UserSchema);
mongoose.model('LoveLetter', LoveLetterSchema);
mongoose.model('LoveLetterList', LoveLetterListSchema);







