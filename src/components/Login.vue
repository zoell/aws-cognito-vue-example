<template>
  <div>
  <template v-if="notAuthenticated">
    Username:<input v-model="username" placeholder="username"><br/>
    Password:<input v-model="password"><br/>
    <button v-on:click="loginCognito">Login</button>
    <template v-if="showSecondFactorInput">
    <br/>Second factor required: <input v-model="secondFactor">
    <button v-on:click="verifySecondFactor">Verify</button>
    </template>
  </template>
  <template v-else>You have already loged in. Logout first.
  </template>
  <hr/>
  Authentication Result Object - ID Token: <br/>
  {{appStore.getIdTokenFromAuthenticationResult(false)}}<br/>
  ID Token Decoded: <br/>
  <pre>{{appStore.getIdTokenFromAuthenticationResult(true)}}</pre><br/>
  <hr/>
  Authentication Result Object - Access Token: <br/>
  {{appStore.getAccessTokenFromAuthenticationResult(false)}}<br/>
  Access Token Decoded: <br/>
  <pre>{{appStore.getAccessTokenFromAuthenticationResult(true)}}</pre><br/>
  <hr/>
  Authentication Result Object - Refresh Token: <br/>
  {{appStore.getRefreshTokenFromAuthenticationResult(false)}}<br/>
  </div>
</template>

<script>
// Refer to use case 4 at https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
export default {
  data () {
    return {
      username:'',
      password: '',
      secondFactor: undefined,
      showSecondFactorInput:false,
      appStore:window.appStore,
    }
  },
  methods: {
    loginCognito: function (event) {
      this.appStore.doLogin(
        this.username,
        this.password,
        function(thisObj) {
          // return callback upon request of second factor
          return function() {
            thisObj.showSecondFactorInput = true;
          }
        }(this));
    },
    verifySecondFactor: function(event){
      this.appStore.doLoginSendMFACode(this.secondFactor);
    }
  },
  computed: {
    notAuthenticated : function() {
      return ((!this.appStore.state.cognitoUser) ||
        (!this.appStore.state.cognitoUser.signInUserSession));
    },
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
