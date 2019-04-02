import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

class GoogleAuth extends React.Component {
  state = { isSignedIn : null }; //We need to INIT our StateObject- Because we don't know if is TRUE or FALSE we set it to null the first time it renders

  componentDidMount() { // We need to loadUp a part of the GAPI library when the component is first Rendered, because it takes time we need to setUp a CallBack
    window.gapi.load('client:auth2', () => { //After we succesfully load the library, we INIT our App with the clientID we got before 
      window.gapi.client.init({
        clientId: '237202383371-o3kuaf9ar9eqaqijl60aj3uklr5mhehn.apps.googleusercontent.com',
        scope: 'email' //here we list the different scopes we want to have access to (location, list of contacts, email...etc)
        //we want to get some NOTICE when the INIT is done -> .then(()=>{}) this callBack will be automatically invoked when our library has loaded itself
      })
      .then(() => {
        this.auth = window.gapi.auth2.getAuthInstance();//will be executed ONLY WHEN the library has loaded completely
        this.setState({ isSignedIn: this.auth.isSignedIn.get()}) //this will update our ComponentLevelState with the current UserStatus/calling .get() will return a boolean
        this.auth.isSignedIn.listen(this.onAuthChange)
      });
    });//We want to figure out if our user is SignedIN and show status on the screen
  }

  //This callBack will be called whenever the AuthStatus changes - and UpdateState accordingly
  onAuthChange = (isSignedIn) => { 
    if (isSignedIn) {
      this.props.signIn();
    }
    else {
      this.props.signOut();
    }
  };


  //Helper methods - to handle OnClick events
  onSignInClick = () => {
    this.auth.signIn(); 
  };
  onSignOutClick = () => {
    this.auth.signOut(); 
  };


  //HelperMethod- print out the correct text SignedIN: true // SignedIN: false
  renderAuthButton() {
    if (this.state.isSignedIn === null) {
      return null;
    } else if (this.state.isSignedIn === true) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      );
    }
  }

  render () {
    return <div>{this.renderAuthButton()}</div>;
  }
};

export default connect(
  null, 
  { signIn, signOut }
  )(GoogleAuth);