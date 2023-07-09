Video Drive Link - https://drive.google.com/file/d/1VoeDi6VqcP7jJo9_j12TmSDT22Xh8WTX/view?usp=sharing


# Gmail API Features using node.js

The API is built on reference with the documentation of Google Developers API for Gmail.



## Features Completed

- Authorization using Google Account

- List down the Labels 

- Send Email Reply to specific Mail / Thread

- Schedule the above features to be performed at 60 seconds / 120 seconds

## Features in Progress

- Move a mail to a specific label


## Libraries Used

Google API

file-stream

@google-cloud/local-auth

path


### npm Packages Installation

```bash
  npm install googleapis fs @google-cloud/local-auth path node-cron
```

## Prerequisites / Setup
Google Cloud Console

Oauth2/playground



## Development Methodology

The Project is capable of doing the core tasks associated with Gmal API and minimal use of third party packages is done. 

The Development Logic is Straight Forward and easily understandable.

The Google Cloud Console consists of test users for the nodejs application which includes my email address:

'developer.mayurkukreja@gmail.com'

## Areas of Improvement

Authorization could have been one time auth process, but the application authorizes every time when a function call is executed.

Use of refresh token and better execution of the Source code can be done.

The Features as developed are done correctly referring the Gmail API documentation only. 
The app can be developed in a better way possibly.

