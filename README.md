# recipesDB

## Website at : https://recipes-db.herokuapp.com/recipes

This is a project that is sort of a follow along with Colt Steel's course on udemy. His course is about camps mine is about recipes of food.

## The Stack

- "express": "^4.17.1",
- "mongoose": "^5.7.7",
- "express-session": "^1.17.0",
- "passport": "^0.4.0",
- "passport-local": "^1.0.0",
- "passport-local-mongoose": "^5.0.1"
- "ejs": "^2.7.1",
- "body-parser": "^1.19.0",
- "method-override": "^3.0.0",
- "node-fetch": "^2.6.0",
- "dotenv": "^8.2.0",
- "connect-flash": "^0.1.1",

## Model

### Recipe

- Name: String
- Desc: String
- Image: String, Default: A link to a picture
- Article: String
- YoutubeID: String,
- User: ID: Reference to User.ObjectId Model
  Username: String
- Comments[]: Reference to Comment.ObjectId Model

### Comment

- User: ID: Reference to User.ObjectId Model
  Username: String
  Profile Picture: String
- Text: String
- isYoutube: Boolean

### User

- Username: String
- Password: Hashed String
- ProfilePic: String, Default: A link to a picture
