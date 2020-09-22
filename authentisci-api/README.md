# Mongodb api

Current address: `authentisci-api.herokuapp.com/`

## Available requests

```
/api/v1/demo - prints out 10 first entries for testing purposes

/api/v1/all - prints out all summarised entries

/api/v1/match?ad=<to-match> - matches entry from the field *match_website_field* (from app.py)

/api/v1/average?ad=<to-match> - computes average of key elements of entry from the field *match_website_field* (from app.py)

/api/v1/add - POST method for adding new entries; must have fields: 'url', 'score', 'clarity', 'bias'

/api/v1/request - POST method for adding new request entries; must have field: 'url'

```

## Running Locally

```sh
$ export MONGODB_US=<username>
$ export MONGODB_PASS=<password>

$ python app.py
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

New heroku app:

```sh
$ heroku create NAME_OF_HEROKUAPP
```

Existing heroku app:

```sh
$ git remote set-url heroku  https://git.heroku.com/<NAME_OF_EXISTING_HEROKUAPP>.git
```

(or just go to Herku panel and `git pull` the existing version of the app to a separate repo)

Next, you need to export env variables:

```sh
heroku config:set MONGODB_US=<username> MONGODB_PASS=<password>
```

Commit changes and deploy by pushing to heroku master

```sh
$ git push heroku master
```
