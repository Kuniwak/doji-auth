# Install

1. Install dependencies

       (On doji-auth root)
       $ googkit init
       $ googkit setup
       $ npm install

3. Setting a session secret

       (On doji-auth root)
       $ echo "exports.secret = 'YOUR_SECRET';" > secret.js

2. Run a web server

       (On doji-auth root)
       $ node server

3. Access to the server

   Open `https://localhost:3000` in your browser.


# Building 

## Build CSS
    (On doji-auth root)
    $ java -jar closure/stylesheets/closure-stylesheets.jar development/css/style.gss > development/css/style.min.css


## Build JS

    (On doji-auth root)
    $ googkit ready
    $ googkit build
