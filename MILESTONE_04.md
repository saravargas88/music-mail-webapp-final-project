Milestone 04 - Final Project Documentation
===

NetID
---
sv2279

Name
---
Sara Vargas 

Repository Link
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88

URL for deployed site 
---
https://improved-train-vx6r77jx5g43xw5j-3000.app.github.dev/


URL for form 1
---
https://improved-train-vx6r77jx5g43xw5j-3000.app.github.dev/login

Special Instructions for Form 1
---
This is the login page, I have made 2 users that show how you can send eachother letters. If you send a letter to someone who isnt registered it will show an error. 

    Username: test
    Password: 1234567890

    Username: recipient_test
    Password: 1234567890


URL for form 2  IMPROVED!
---
https://improved-train-vx6r77jx5g43xw5j-3000.app.github.dev/letter/add?

Special Instructions for Form 2
---
This page allows you to add a letter to pending letters. 
It allows you to attach a song to the letter and it also allows you to write a message and translate it into fancy shakesperean english. These are dynamically retrieved API searches in the add form. 
If the user you are sending the letter to doesnt exist it will show an error. 
You are able to write a letter without attaching a song but all the other fields must be filled. 

---

URL for form 3 (from previous milestone) 
---
https://improved-train-vx6r77jx5g43xw5j-3000.app.github.dev/letter/edit/hello-back?

Special Instructions for Form 3
---
This is the editing form. Here you can change the contents of your letter. Only if you are the sender of the letter. You can reselect a song. 


First link to github line number(s) for constructor, HOF, etc.
---
JS CLASS LOVELETTERFORMATTER
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/LoveLetterFormatter.js#L1-L28




Second link to github line number(s) for constructor, HOF, etc.
---
FILTER: 
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/app.mjs#L84-L93

FOR EACH: 
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/letter-add.hbs#L88-L101

Short description for links above
---
FIRST LINK: 
    LoveLetterFormatter is a custom ES6 class that formats a letter's title and appends a signature to the message for display using its instance methods.
SECOND LINK: 
    .filter() is used to extract all letters that are pending, sent, or received by checking properties of each letter object in the array.
THIRD LINK: 
    .forEach() is used in the frontend script to loop through the list of songs from the iTunes API response and dynamically render them as HTML elements.


---
SCHEMAS: 

LOVELETTER SCHEMA: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/db.mjs#L42-L60


USER SCHEMA: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/db.mjs#L17-L22

LOVELETTERLIST SCHEMA: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/db.mjs#L29-L32

Description of research topics above with points
---
2 points – Applied and customized the "Clean Blog" Bootstrap theme
    Integrated the clean-blog.min.css theme into the project via CDN, customized header, buttons, layout styling, and incorporated consistent branding and layout across pages using the theme’s Bootstrap classes.

6 points – Implemented external iTunes Search API for song search and embedding
    Used itunes.apple.com/search to let users search for music. Extracted metadata (track name, artist, preview audio, artwork) and dynamically populated search results. Used form integration to attach a selected song to each love letter.

4 points – Integrated the Fun Translations Shakespearean API for enhanced UX
    Allowed users to convert their message into Shakespearean English with a single button click. Used fetch() to call the funtranslations.com/translate/shakespeare.json endpoint and updated the form textarea dynamically with the translated content.

Links to github line number(s) for research topics described above (one link per line)
---
Bootstrap: In each file I use some Bootstrap specific classes 


    https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/letter-detail.hbs#L4-L8

    https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/letter-add.hbs#L4-L6

    https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/layout.hbs#L6-L10

iTunes API: 

    https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/letter-add.hbs#L81-L115

    https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/letter-add.hbs#L40-L56

Shakesperean Translator API: 

    https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/letter-add.hbs#L34-L38

    https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-saravargas88/blob/0b5c95819692c8c4fa8074819dc2319c165a7df0/views/letter-add.hbs#L60-L78


Optional project notes 
--- 

Attributions
---
iTunes API : 
https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html

Shakesperean API: 
https://funtranslations.com/api/shakespeare

Bootstrap classes: 
https://www.w3schools.com/bootstrap/bootstrap_ref_all_classes.asp

Authentication: 
I based my authentication from the resources provided in class by professor Versoza. 







