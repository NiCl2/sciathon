# Mongodb api

## Requests

```
/api/v1/all - prints out the all entries

/api/v1/match?ad=<to-match> - matches entry from the field X
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

Next, you need to export env variables:

```sh
heroku config:set MONGODB_US=<username> MONGODB_PASS=<password>
```

Commit changes and deploy by pushing to heroku master

```sh
$ git push heroku master
```
