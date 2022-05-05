import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  START_LOADING,
} from "../constants/actionTypes";

const initialStore = {
  loading: false,
  posts: [],
};
export default (store = initialStore, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...store, loading: true };
    case FETCH_ALL:
      return { loading: false, posts: action.payload };
    case LIKE:
      return {
        ...store,
        posts: store.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case CREATE:
      return { ...store, posts: [...store.posts, action.payload] };
    case UPDATE:
      return {
        ...store,
        posts: store.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case DELETE:
      return {
        ...store,
        posts: store.posts.filter((post) => post._id !== action.payload),
      };
    default:
      return { ...initialStore };
  }
};
