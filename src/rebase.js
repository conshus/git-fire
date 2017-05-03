var Rebase = require('re-base');
var config = {
  apiKey: "AIzaSyBav7RX8z2EyZ9CYlIX7YV3dLyXe_pbIwI",
  authDomain: "friendlychat-ae6f5.firebaseapp.com",
  databaseURL: "https://friendlychat-ae6f5.firebaseio.com",
  projectId: "friendlychat-ae6f5",
  storageBucket: "friendlychat-ae6f5.appspot.com",
  messagingSenderId: "807852197648"
};
var base = Rebase.createClass(config);
export default base;
