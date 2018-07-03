// the singleton source of truth for this demo app
var rtConfig = require('./rt-config')
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var jwt_decode = require('jwt-decode');
var {getResultToCallbackHandler,getResultToStateSuccessFailureHandlerObj,getResultToStateHandler} = require('./utils')

var poolData = {
  UserPoolId: rtConfig.cognito_user_pool_id,
  ClientId: rtConfig.cognito_client_id
};

var cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var AWS = require('aws-sdk');
AWS.config.region = rtConfig.cognito_region;

export default {
  state: {
    authenticationResult: undefined,
    cognitoUser: undefined,
    mfaOptions: undefined,
  },
  config: rtConfig,

  isAuthenticated() {
    return this.state.cognitoUser &&
      this.state.cognitoUser.signInUserSession &&
      this.state.cognitoUser.signInUserSession.isValid();
  },

  getAccessTokenFromAuthenticationResult(decode) {
    if (this.state.authenticationResult !== undefined) {
      return decode ?
        jwt_decode(this.state.authenticationResult.accessToken.jwtToken):
        this.state.authenticationResult.accessToken.jwtToken;
    } else
      return undefined;
  },

  getIdTokenFromAuthenticationResult(decode) {
    if (this.state.authenticationResult !== undefined) {
      return decode ?
        jwt_decode(this.state.authenticationResult.idToken.jwtToken):
        this.state.authenticationResult.idToken.jwtToken;
    } else
      return undefined;
  },

  getRefreshTokenFromAuthenticationResult(decode) {
    if (this.state.authenticationResult !== undefined) {
      return decode ?
        jwt_decode(this.state.authenticationResult.refreshToken.token):
        this.state.authenticationResult.refreshToken.token;
    } else
      return undefined;
  },

  // See https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
  // Use case 1
  doSignUp(username, email, password) {
    var attributeList = [];
    var dataEmail = {
      Name: 'email',
      Value: email
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    cognitoUserPool.signUp(username, password, attributeList, null,
      getResultToCallbackHandler(
        'Sign up',
        function(state){
          return function(result){state.cognitoUser = result.user;}
        }(this.state)
      )
    );
  },

  // See https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
  // Use case 4
  // callback will receive {result:..., detail:...}
  doLogin(username, password, handler) {
    // prepare cognito user for authentication
    var userData = {
      Username: username,
      Pool: cognitoUserPool
    };
    this.state.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    // prepare authenticatioin details for authentication
    var authenticationData = {
      Username: username,
      Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    // do authentication
    this.state.cognitoUser.authenticateUser(authenticationDetails, handler);
  },

  doCognitoUserRefresh() {
    var callback = getResultToCallbackHandler("CognitoUser.refreshSession",result=>{});
    this.state.cognitoUser.refreshSession(this.state.cognitoUser.signInUserSession.refreshToken,callback);
  },

  doIdRefresh() {
    var loginMap = {};
    var providerKey = 'cognito-idp.' +
      this.config.cognito_region +
      '.amazonaws.com/' +
      this.config.cognito_user_pool_id;
    loginMap[providerKey] = this.state.authenticationResult.idToken.jwtToken;
    // see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#getId-property
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.config.cognito_identity_pool_id,
      Logins: loginMap
    });
    //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
    AWS.config.credentials.refresh(
      getResultToStateHandler('ID Pool Refresh',this.state,'idRefreshResult')
    );
  },

  doLogout() {
    this.state.cognitoUser.signOut();
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
    this.state.cognitoUser.updateAttributes(
      attributeList,
      getResultToStateHandler('Update user attribute',{},'result')
    );
  },

  doRequestVerifyAttributeCode(attributeName) {
    var handler = getResultToStateSuccessFailureHandlerObj("Request verification code for "+attributeName);
    // 'inputVerificationCode' handler is required to set but can be "null"
    // in that case, success handler will be called after verification code is sent
    handler['inputVerificationCode'] = null;
    this.state.cognitoUser.getAttributeVerificationCode(attributeName, handler);
  },

  doVerifyAttribute(attributeName, verificationCode) {
    this.state.cognitoUser.verifyAttribute(
      attributeName, verificationCode,
      getResultToStateSuccessFailureHandlerObj("Verify attribute "+attributeName));
  },
}
