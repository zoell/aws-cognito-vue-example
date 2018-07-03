<template>
  <div>
  <template v-if="!appStore.isAuthenticated()">
    Username:<input v-model="username" placeholder="username"><br/>
    Password:<input v-model="password"><br/>
    <button v-on:click="loginCognito">Login</button>
    <MFAChallengeResponse ref="mfaChaRes"
      actionDesc="Login with possible MFA"
      :onSuccessHandler="getOnSuccessHandler()"></MFAChallengeResponse>
  </template>
  <template v-else>You have already loged in. Logout first.
  </template>
  <hr/>
  Last Authentication Result Object - ID Token: <br/>
  {{appStore.getIdTokenFromAuthenticationResult(false)}}<br/>
  ID Token Decoded: <br/>
  <pre>{{appStore.getIdTokenFromAuthenticationResult(true)}}</pre><br/>
  <hr/>
  Last Authentication Result Object - Access Token: <br/>
  {{appStore.getAccessTokenFromAuthenticationResult(false)}}<br/>
  Access Token Decoded: <br/>
  <pre>{{appStore.getAccessTokenFromAuthenticationResult(true)}}</pre><br/>
  <hr/>
  Last Authentication Result Object - Refresh Token: <br/>
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
    getOnSuccessHandler: function(){
      var thisObj = this;
      return (result)=>{
        thisObj.appStore.state.authenticationResult = result;
      }
    },
    loginCognito: function (event) {
      this.appStore.doLogin(
        this.username,
        this.password,
        this.$refs.mfaChaRes.handler);
    },
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
