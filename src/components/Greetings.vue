<template>
  <div>
    <button v-on:click='getGreetedAsAuthenticatedUser'>Get Greeting as Authenticated User</button><br/>
    <button v-on:click='getGreetedAsGuest'>Get Greeting without Authorization</button><br/>
    <button v-on:click='getGreetedAsMFAUser'>Greeted as MFA Authenticated User</button><br/>
    <hr/>
    Last Greeting Call: {{lastState}} </br>
    Last Greeting: {{lastGreeting}}  <br/>
    Last Greeting Result Obj: </br>
    {{lastResult}}
  </div>
</template>

<script>

import axios from 'axios';

export default {
  data () {
    return {
      lastGreeting: undefined,
      lastState: undefined,
      lastResult: undefined,
      appStore: window.appStore,
    }
  },

  methods: {
    getGreetedAsAuthenticatedUser: function(event) {
        // without ID token in authorization header, the response would be 401, and Lambda
        // not called - response directly from cloudfront
        var idToken = this.appStore.state.cognitoUser.signInUserSession.idToken.jwtToken;
        axios.get(this.appStore.config.api.greetUrl, {
          headers: {
            Authorization: idToken
          }
        })
        .then(response=>{
          this.lastState = 'SUCCESS';
          this.lastResult = response;
          this.lastGreeting = response.data.greeting;
        })
        .catch(e => {
          this.lastState = 'ERROR';
          console.log(e);
          this.lastResult = e.toString();
          this.lastGreeting = undefined;
        });
    },

    getGreetedAsGuest: function(event) {
        axios.get(this.appStore.config.api.greetUrl)
        .then(response=>{
          this.lastState = 'SUCCESS';
          this.lastResult = response;
          this.lastGreeting = response.data.greeting;
        })
        .catch(e => {
          this.lastState = 'ERROR';
          console.log(e);
          this.lastResult = e.toString();
          this.lastGreeting = undefined;
        });
    },


    getGreetedAsMFAUser: function (event) {
      alert("Not Implemented");
    },

  },



}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
