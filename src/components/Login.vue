<template>
  <div>

  Username:<input v-model="username" placeholder="username"></br>
  Password:<input v-model="password"></br>
  <button v-on:click="loginCognito">Login</button></br>
  Result:{{result}}</br>
  Detail:{{detail}}</br>
  Token: <textarea v-model="appStore.state.userToken"></textarea>
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
      result:'',
      detail:'',
      appStore:window.appStore
    }
  },
  methods: {
    loginCognito: function (event) {
      this.appStore.doLogin(this.username, this.password, function(componentData){ return function(result, detail) {
        componentData.result = result;
        componentData.detail = detail;
      };}(this))
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
