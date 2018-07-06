<template>
    <div>
    Username or Email: <input v-model="username"></input>
    <button v-on:click="forgotPassword">Forgot Password</button>
    <hr/>
    <template v-if="showVerificationInput">
      Verification Code: <input v-model="verificationCode"></input><br/>
      New Password: <input v-model="newPasswd"></input><br/>
      <button v-on:click="confirmPassword">Reset Password</button>
    </template>
    </div>
</template>

<script>

var {getResultToStateSuccessFailureHandlerObj} = require('../utils')


export default {
  data () {
    return {
      username:undefined,
      verificationCode:undefined,
      newPasswd: undefined,
      appStore:window.appStore,
      showVerificationInput:undefined,
      result: undefined,
      handler : function(thisObj){
        var handler = getResultToStateSuccessFailureHandlerObj("Forgot Password", thisObj, 'result');
        handler['inputVerificationCode'] = function() {
          thisObj.showVerificationInput = true;
        };
        return handler;
      }(this),
    }
  },
  methods: {
    forgotPassword: function(){
      this.appStore.doForgotPassword(
        this.username,
        this.handler
      )
    },
    confirmPassword: function(){
      this.appStore.state.cognitoUser.
        confirmPassword(
          this.verificationCode,
          this.newPasswd,
          this.handler
        );
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
