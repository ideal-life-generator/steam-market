import React from "react"
import { render } from "react-dom"
import { createStore, combineReducers, applyMiddleware } from "redux"
import fetch from "isomorphic-fetch"
import thunkMiddleware from "redux-thunk"
import createLogger from "redux-logger"
import Main from "./components/Main"
import common from "./styles/common.less"
import WsSession from "./ws-session"

// import { Router, Route, Link } from "react-router"
// import createHistory from "history/lib/createHashHistory"

// var history = createHistory({
//   queryKey: false
// })

// <Router history={history}>
//   <Route path="/" component={Main} />
// </Router>

const wsSession = new WsSession("ws://localhost:5001")

const REQUEST_USER = "REQUEST_USER"

function requestUser () {
  return {
    type: REQUEST_USER
  }
}

const RECEIVE_USER = "RECEIVE_USER"

function receiveUser (user) {
  return {
    type: RECEIVE_USER,
    user: user
  }
}

// {
//   user: {
//     isFetching: false,
//     isInvalid: false,
//     steamId: "76561198198917703",
//     token: "7rbg80Ulkfr5x7owBX0foQ=="
//   },
//   steamProfile: {
//     isFetching: false,
//     isInvalid: false,
//     avatarFullUrl: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"
//     avatarMediumUrl: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg"
//     avatarUrl: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
//     name: "Трансформер"
//     profileUrl: "http://steamcommunity.com/profiles/76561198198917703/"
//   }
// }

function user (
  state = {
    isFetching: false,
    isInvalid: false
  }
, action) {
  switch (action.type) {
    case REQUEST_USER:
      return Object.assign({ }, state, {
        isFetching: true
      })
    case RECEIVE_USER:
      return Object.assign({ }, state, {
        isFetching: false,
        user: action.user
      })
    default:
      return state
  }
}

const REQUEST_STEAM_PROFILE = "REQUEST_STEAM_PROFILE"

function requestSteamProfile () {
  return {
    type: REQUEST_STEAM_PROFILE
  }
}

const RECEIVE_STEAM_PROFILE = "RECEIVE_STEAM_PROFILE"

function receiveSteamProfile (steamProfile) {
  return {
    type: RECEIVE_STEAM_PROFILE,
    steamProfile: steamProfile
  }
}

function steamProfile (
  state = {
    isFetching: false,
    isInvalid: false
  }
, action) {
  switch (action.type) {
    case REQUEST_STEAM_PROFILE:
      return Object.assign({ }, state, {
        isFetching: true
      })
    case RECEIVE_STEAM_PROFILE:
      return Object.assign({ }, state, {
        isFetching: false,
        steamProfile: action.steamProfile
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user,
  steamProfile
})

let store = createStore(rootReducer)

store.subscribe(() => {
  console.log(store.getState())
})

wsSession.on("signin.resolve", () => {
  // console.log("signin.resolve")
})

wsSession.on("user.take", (user) => {
  store.dispatch(receiveUser(user))
})

wsSession.on("user.steam-profile.take", (steamProfile) => {
  store.dispatch(receiveSteamProfile(steamProfile))
})

// let appStore = createStore(appReducer)

// appStore.subscribe(() => {
//   console.log(appStore.getState())
// })

// appStore.dispatch(signedInUser({ name: "Vlad" }))

render(
  (
    <Main />
  )
  , document.getElementById("app")
)



// const SELECT_REDDIT = "SELECT_REDDIT"

// function selectReddit (reddit) {
//   return  {
//     type: SELECT_REDDIT,
//     reddit
//   }
// }

// const INVALIDATE_REDDIT = "INVALIDATE_REDDIT"

// function invalidateReddit (reddit) {
//   return {
//     type: INVALIDATE_REDDIT,
//     reddit
//   }
// }

// const REQUEST_POSTS = "REQUEST_POSTS"

// function requestPosts (reddit) {
//   return {
//     type: REQUEST_POSTS,
//     reddit
//   }
// }

// const RECEIVE_POSTS = "RECEIVE_POSTS"

// function receivePosts (reddit, json) {
//   return {
//     type: RECEIVE_POSTS,
//     reddit,
//     posts: json.data.children.map(child => child.data),
//     receiwedAt: Date.now()
//   }
// }

// function fetchPosts (reddit) {
//   return (dispatch) => {
//     dispatch(requestPosts(reddit))
//     return fetch(`http://www.reddit.com/r/${reddit}.json`)
//       .then(response => response.json())
//       .then(json => dispatch(receivePosts(reddit, json)))
//   }
// }

// function shouldFetchPosts (state, reddit) {
//   const posts = state.postsByReddit[reddit]
//   if (!posts) {
//     return true
//   }
//   else if (posts.isFetching) {
//     return false
//   }
//   else {
//     return posts.didInvalidate
//   }
// }

// function fetchPostsIfNeeded (reddit) {
//   return (dispatch, getState) => {
//     if (shouldFetchPosts(getState(), reddit)) {
//       return dispatch(fetchPosts(reddit))
//     }
//     else {
//       return Promise.resolve()
//     }
//   }
// }

// // {
// //   selectReddit: "frontend",
// //   postsByReddit: {
// //     frontend: {
// //       isFetching: true,
// //       didInvalidate: false,
// //       items: [ ]
// //     },
// //     reactjs: {
// //       isFetching: false,
// //       didInvalidate: false,
// //       lastUpdated: 1439478405547,
// //       items: [
// //         {
// //           id: 42,
// //           title: "Confusion about Flux and Relay"
// //         },
// //         {
// //           id: 500,
// //           title: "Creating a Simple Application Using React JS and Flux Architecture"
// //         }
// //       ]
// //     }
// //   }
// // }

// // {
// //   selectReddit: "frontend",
// //   entities: {
// //     users: {
// //       2: {
// //         id: 2,
// //         name: "Andrew"
// //       }
// //     },
// //     posts: {
// //       42: {
// //         id: 42,
// //         title: "Confusion about Flux and Relay",
// //         author: 2
// //       },
// //       100: {
// //         id: 100,
// //         title: "Creating a Simple Application Using React JS and Flux Architecture",
// //         author: 2
// //       }
// //     }
// //   },
// //   postsByReddit: {
// //     frontend: {
// //       isFetching: true,
// //       didInvalidate: false,
// //       items: [ ]
// //     },
// //     reactjs: {
// //       isFetching: false,
// //       didInvalidate: false,
// //       lastUpdated: 1439478405547,
// //       items: [ 42, 500 ]
// //     }
// //   }
// // }

// function selectedReddit (state = "reactjs", action) {
//   switch (action.type) {
//     case SELECT_REDDIT:
//       return action.reddit
//     default:
//       return state
//   }
// }

// function posts (state = {
//   isFetching: false,
//   didInvalidate: false,
//   items: [ ]
// }, action) {
//   switch (action.type) {
//     case INVALIDATE_REDDIT:
//       return Object.assign({ }, state, {
//         didInvalidate: true
//       })
//     case REQUEST_POSTS:
//       return Object.assign({ }, state, {
//         isFetching: true,
//         didInvalidate: false
//       })
//     case RECEIVE_POSTS:
//       return Object.assign({ }, state, {
//         isFetching: false,
//         didInvalidate: false,
//         items: action.posts,
//         lastUpdated: action.receiwedAt
//       })
//     default:
//       return state
//   }
// }

// function postsByReddit (state = { }, action) {
//   switch (action.type) {
//     case INVALIDATE_REDDIT:
//     case RECEIVE_POSTS:
//     case REQUEST_POSTS:
//       return Object.assign({ }, state, {
//         [action.reddit]: posts(state[action.reddit], action)
//       })
//     default:
//       return state
//   }
// }

// const rootReducer = combineReducers({
//   selectedReddit,
//   postsByReddit
// })

// const loggerMiddleware = createLogger()

// const createStoreWithMiddleware = applyMiddleware(
//   thunkMiddleware,
//   loggerMiddleware
// )(createStore)

// const store = createStoreWithMiddleware(rootReducer)

// store.dispatch(selectReddit("reactjs"))
// store.dispatch(fetchPostsIfNeeded("reactjs")).then(() => {
//   console.log(store.getState())
// })