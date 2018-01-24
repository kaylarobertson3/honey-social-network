# Redux

* Flux is also a thing

* Redux is a small JS library that helps manage state. Like a database, it keeps all of your stuff (what tab user is on, scroll position, isUploaderVisible, ect.)

* No need to pass things through so many files. There is a still a flow of data, but less so

* Anything a component needs lives there, and a component just needs to hook to it. 

* Don't need to use it for everything. Won't use it for social network.

* If we had been using it, this is what the state object would look like:

  ```javascript
  {
      user: {
          id: 1,
          firstName: 'Disco',
          lastName: 'Duck',
          image: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Disco_duck.jpg',
          bio: 'I was a number one hit in 1976'
      },
      imageUploadDialogIsVisible: false,
      bioEditorIsVisible: false,
      otherUser: {
          id: 2,
          firstName: 'Funky',
          lastName: 'Chicken',
          image: null,
          bio: null,
          isFriend: true,
          availableFriendActions: [ 'terminate' ]
      }
  }
  ```

  * Both app data (user objects) and ui stuff (uploadboxshowing) are both in here. It includes all state info. It's global

## Redux Concepts

* **Actions**
* **Reducers**
  * Reducers get passed an action and a current state object.
  * They return a new state object
* **ReduxPromise** - middleware
  * Allows an action creator that returns a promise, not an action. As long as promise eventually resolves as an action
  * allows asynchronous

### More Redux

* What is the difference between
  * this.props
  * this.state
  * redux state
* You never directly change the state. Only create a clone of state, change things on the clone, and return that clone
* If you need to talk to your server, it happens in action.
  * an action is an object with a type and a payload
* ​













