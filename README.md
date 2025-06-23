Spotify Loveletter

Send your sweetheart a sweet playlist <3
Lovely words accompanied by a soundtrack to make anyone fall in love with you. 


## Data Model

The application will store 
- user information 
- love letters list 
- Each love letters will consist of a 
    - a message
    - details of mailing
    - recipient email 
    - spotify playlist url 

An Example User:

```javascript
{
  "_id": "user_12345",  
  "username": "musicLover",  
  "email": "musiclover@email.com", 
  "hash": "hashed_password_here",  
  "love_letters": [ 
    "letter_1",
    "letter_2"
  ],
  "createdAt": "2025-03-19T12:00:00Z" 
}

```

An Example LoveLetter Document
```javascript
{
  "_id": "letter_1",  
  "sender": "user_12345",  
  "recipient_email": "valentine@email.com",  
  "message": "I like you! Here is some music!", 
  "spotify_playlist_url": "https://open.spotify.com/playlist/some_url_", 
  //url to then use with Spotify API to embed
  "createdAt": "2025-03-19T12:00:00Z"  
}
```

## [Link to Commented First Draft Schema](db.mjs) 

<<<<<<< HEAD:README.md
=======
## Wireframes

/Welcome
![Welcome]
/Login 
![Login]
/Register 
![Register)

/create a love letter
![create love letter]()

/LetterList: showing the list of letters made
![list of letters]()

/LetterList/slug : showing each 
![Viewing a letter]

## Site map
/Site Map of the application!
![Site Map]()
>>>>>>> b706455cc13a43093a82a5cf7a7e3a1c41cb1df6:final-project-deployment-saravargas88-master/README.md

## User Stories or Use Cases
1. As a non-registered user, I can sign up using Spotify authentication so that I can access the app.
2. As a registered user, I can log in using my Spotify account to access my love letters and playlists.
3. As a user, I can create a new love letter that includes a personal message and a Spotify playlist.
4. As a user, I can send a love letter to a recipient via email so they can view it and listen to the playlist.
5. As a user, I can view all the love letters I have created in a list.
6. As a user, I can edit or delete an existing love letter before it is sent.


## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

Research Topics

(5 points) Integrate Spotify Authentication
- I will use OAuth 2.0 via passport-spotify to allow users to log in with their Spotify accounts.
- The app will fetch the user's Spotify profile information and store their Spotify ID in the database.

(3 points) Fetch and Display Spotify Playlists in the App

- After authentication, users are able to browse their Spotify playlists and select one to include in a love letter.
- The app will use the Spotify Web API to fetch playlists, track names, and images.

(2 points) Sending Love Letters via Email
- I will use Nodemailer to send emails containing the love letter message and a link to the Spotify playlist.
- The email will include a visually formatted preview of the playlist.

## [Link to Initial Main Project File](app.mjs) 
/spotify-loveletter
│
├── /views/                
├── /routes/                 
│   ├── auth.mjs    # spotify authentication routes
│   └── letters.mjs          
├── /config/                
│   └── passport.mjs # spotify Passport.js configuration
├── /documentation/          
├── .env                     
├── app.mjs                  
├── package.json             
└── README.md               


## Annotations / References Used
1. [nodemailer docs](https://www.nodemailer.com/) 
2. [spotify api tutorial](https://developer.spotify.com/documentation/web-api) 


/Note: Another idea I had which I might like more is making a playlist according to the location the person selects and what performers are performing that week around them. But I am unsure how I would look for shows around, but I would still use the spotify API. 
