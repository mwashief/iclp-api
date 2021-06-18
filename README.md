# iclp-api

### Endpoints:

-   `/login`  
    Request body:

    ```javascript
    {
        "email": String,
        "password" : String,
    }
    ```

-   `/signup`  
    Request body:

    ```javascript
    {
        "name": String,
        "email": String,
        "password": String,
        "confirmed_password": String,
    }
    ```

-   `/mcq/find/:topicID`  
    Randomly gets a mcq challenge under this topic.<br/>
    Request body: _does not require_ <br/>
    Response body:

    ```javascript
    {
        "topicId": String,
        "topicName" : String,
        "challengeId" : String,
        "difficulty" : String,
        "score" : Number,
        "time" : Number
    }
    ```

-   `/mcq/start/:challengeId`  
    User starts a challenge with this challengeId. Timer starts as soon as user hits this endpoint.<br/>
    Request body: _does not require_ <br />
    Response body: Here, `questions` object does not contain answers.

    ```javascript
    {
        "title": String,
        "challengeId" : String,
        "difficulty" : String,
        "score" : Number,
        "time" : Number.
        "questions": Object,
        "resultId": Number
    }

    ```

-   `/mcq/submit/:resultId`  
    User submits a quiz. If submission is proper and within time limit, it gets accepted. 5 seconds of wiggle room is kept.<br/>
    Request body:

    ```javascript
    {
        "answers" : Array
    }

    ```

    Response body: This time, `questions` object contains correct answers.

    ```javascript
    {
        "title": String,
        "challengeId" : String,
        "difficulty" : String,
        "score" : Number,
        "time" : Number.
        "questions": Object,
        "resultId": Number
    }

    ```

-   `/mcq/start/:challengeId`
    Request body: _does not require_ <br/>
    User starts this challenge. Timer starts as soon as user hit this endpoint.

-   `/logout`
    Request body: _does not require_

-   `/public/best/:userid[?problemid=][?topicid=]`  
    get best score(s) for given user [and problem] [and topic]. best score means: highest score, earliest submission time.
    Also return problem's max*score to compare with this user's score. \_topicid=0 means all topics.*

-   `/public/rank[?userid=][?topicid=]`  
    get rank of user(s) [for given topic]. _topicid=0 means all topics._

    _This will be updated along with implementation._

### Project Info

-   Make sure that node version is 14 (latest stable).

-   Install all dependencies

    ```
    npm install
    ```

-   Run dev server

    ```
    npm run dev
    ```

### Read documentations

-   [express-validator](https://express-validator.github.io/docs/index.html)
-   [passport-local](https://www.passportjs.org/packages/passport-local/)
-   [node-postgres](https://node-postgres.com/)
-   [sql-template-strings](https://www.npmjs.com/package/sql-template-strings)
-   [app-root-path](https://www.npmjs.com/package/app-root-path)
-   [multer](https://www.npmjs.com/package/multer) for file upload

### Install new npm package

npm i --save whatever_package
