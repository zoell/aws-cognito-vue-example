// the singleton source of truth for this demo app
var rtConfig = require('./rt-config')
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var jwt_decode = require('jwt-decode');

var poolData = {
  UserPoolId: rtConfig.cognito_user_pool_id,
  ClientId: rtConfig.cognito_client_id
};

var cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var AWS = require('aws-sdk');
AWS.config.region = rtConfig.cognito_region;

function getGenericHandler(actionDesc) {
  return {
      onSuccess: function (result) {
          alert(actionDesc+" :SUCCESS");
          console.log(actionDesc+' :Success, ' + JSON.stringify(result));
      },
      onFailure: function(err) {
          alert(actionDesc+" :FAILED, "+(err.message || JSON.stringify(err)));
          console.log(actionDesc+' :FAILED, ' + JSON.stringify(err));
      },
  };
};


export default {
  state: {
    authenticated: false,
    userToken: undefined,
    cognitoUser: undefined
  },
  config: rtConfig,

  getDecodedUserToken() {
    if (this.state.userToken !== undefined) {
      return jwt_decode(this.state.userToken);
    } else
      return undefined;
  },

  // See https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
  // Use case 1
  doSignUp(username, email, password, callback) {
    var attributeList = [];
    var dataEmail = {
      Name: 'email',
      Value: email
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    cognitoUserPool.signUp(username, password, attributeList, null, function(callback) {
      return function(err, result) {
        if (err) {
          console.log("Sign up failed:" + JSON.stringify(err));
          callback('ERROR', err.message);
          return;
        }
        var cognitoUser = result.user;
        console.log("Sign up as " + cognitoUser.getUsername() + ", RESULT=" + JSON.stringify(result));
        callback("SUCCESS",
          "Username:" + cognitoUser.getUsername() + ", check verification email & console log"
        );
      };
    }(callback));
  },

  // See https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
  // Use case 4
  // callback will receive {result:..., detail:...}
  doLogin(username, password, callback) {
    // step 1: log in user with user pool & obtain token
    var authenticationData = {
      Username: username,
      Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    // using global userPool variable
    var userData = {
      Username: username,
      Pool: cognitoUserPool
    };
    this.state.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    this.state.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(store, callback) {
        return function(result) {
          var res = 'LOGIN SUCCESS';
          var detail = 'Decode token at https://jwt.io/';
          store.state.userToken = result.getAccessToken().getJwtToken();
          store.state.authenticated = true;

          console.log('Login Success: ' + JSON.stringify(result));
          console.log('Decoded token: ' + JSON.stringify(store.getDecodedUserToken()));

          // step 2: refresh credential with identity pool

          var loginMap = {};
          var providerKey = 'cognito-idp.' +
            store.config.cognito_region +
            '.amazonaws.com/' +
            store.config.cognito_user_pool_id;
          loginMap[providerKey] = result.getIdToken().getJwtToken();
          // see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#getId-property
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: store.config.cognito_identity_pool_id,
            Logins: loginMap
          });
          //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
          AWS.config.credentials.refresh((error) => {
            if (error) {
              res += "/REFRESH FAIL";
              detail = "Refresh error:" + error.message;
              console.log("Refresh error:" + JSON.stringify(error));
            } else {
              // Instantiate aws sdk service objects now that the credentials have been updated.
              // example: var s3 = new AWS.S3();
              res += "/REFRESH SUCCESS";
              console.log('Refresh success');
            }
          });
          callback(res, detail);
        } // return function (result) {
      }(this, callback),
      onFailure: function(callback) {
        return function(err) {
          console.log('Login Fail:' + JSON.stringify(err));
          callback('LOGIN FAIL', err.message);
        };
      }(callback)
    }); // cognitoUser.authenticateUser(authenticationDetails, {
  },

  doLogout() {
    this.state.cognitoUser.signOut();
    this.state.authenticated = false;
  },

  doUpdateAttribute(attributes) {
    // see https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html
    // updateAttribute
    var attributeList = [];
    attributes.forEach(
      element => {
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(element));
      }
    );
    this.state.cognitoUser.updateAttributes(attributeList, function(err, result) {
        if (err) {
            alert(err.message);
            console.log("Update user attribute failed:"+JSON.stringify(err));
            return;
        }
        console.log('call result: ' + JSON.stringify(result));
        alert("Attribute updated");
    });
  },

  doRequestVerifyAttributeCode(attributeName) {
    var handler = getGenericHandler("Request verification code for "+attributeName);
    handler['inputVerificationCode'] = undefined;
    this.state.cognitoUser.getAttributeVerificationCode(attributeName, handler);
  },

  doVerifyAttribute(attributeName, verificationCode) {
    this.state.cognitoUser.verifyAttribute(
      attributeName, verificationCode,
      getGenericHandler("Verify attribute "+attributeName));
  },
}
