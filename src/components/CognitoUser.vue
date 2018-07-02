<template>
  <div>
  <p>This page show tokens & their expiry time in cognitoUser.signInUserSession object. <br/>
  For more details, open developer tools.
  </p>
  <button v-on:click='refreshSession'>Refresh Session(Tokens)</button>
  <hr/>
  <template v-if="appStore.state.cognitoUser && appStore.state.cognitoUser.signInUserSession">
  CognitoUser - signInUserSession.isValid:
  {{appStore.state.cognitoUser.signInUserSession.isValid()}}<br/>
  CognitoUser - Access Token Expire Time:
  {{new Date(appStore.state.cognitoUser.signInUserSession.accessToken.getExpiration()*1000)}}<br/>
  CognitoUser - ID Token Expire Time:
  {{new Date(appStore.state.cognitoUser.signInUserSession.idToken.getExpiration()*1000)}}<br/>
  CognitoUser - Access Token Decoded: <br/>
  <pre>{{accessTokenDecoded}}</pre><br/>
  CognitoUser - ID Token Decoded:
  <pre>{{idTokenDecoded}}</pre><br/>


  </template>
  <template v-else>
  CognitoUser Object or CognitoUser.signInUserSession Not Available. Authenticate First.
  </template>
  </div>
</template>

<script>
// Refer to use case 4 at https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var jwt_decode = require('jwt-decode');
export default {
  data () {
    return {
      appStore:window.appStore,
    }
  },
  methods: {
    refreshSession: function (event) {
      appStore.doCognitoUserRefresh();
    },
  },
  computed: {
    accessTokenDecoded: function() {
      return jwt_decode(this.appStore.state.cognitoUser.signInUserSession.accessToken.jwtToken);
    },
    idTokenDecoded: function() {
      return jwt_decode(this.appStore.state.cognitoUser.signInUserSession.idToken.jwtToken);
    },

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
