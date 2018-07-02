<template>
  <div>
  <p>This page show tokens & their expiry time in cognitoUser.signInUserSession object. <br/>
  For more details, open developer tools.
  </p>
  <button v-on:click="idRefresh">ID Pool Refresh</button><br/>
  <hr/>
  <template v-if="AWS.config.credentials">
  AWS.config.credentials.identityId: {{AWS.config.credentials.identityId}} <br/>
  AWS.config.credentials.expired: {{AWS.config.credentials?JSON.stringify(AWS.config.credentials.expired):'N/A'}} <br/>
  AWS.config.credentials.expireTime: {{AWS.config.credentials?JSON.stringify(AWS.config.credentials.expireTime):'N/A'}} <br/>
  </template>
  <template v-else>
  AWS.config.credentials not available. First login, then click ID Pool Refresh to initialize ID pool credential.
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
      AWS:window.AWS,
    }
  },
  methods: {
    idRefresh: function(event) {
      this.appStore.doIdRefresh();
    },
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
