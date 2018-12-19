<template>
  <div>
    <button v-on:click='getGreetedAsAuthenticatedUser'>Get Greeting as Authenticated User (through API Gateway)</button><br/>
    <button v-on:click='getGreetedDirect'>Get Greeting (direct Lambda Call with Cognito ID Pool Credential)</button><br/>
    <button v-on:click='getGreetedAsMFAUser'>Greeted as MFA Authenticated User</button><br/>
    <hr/>
    Last Greeting Call: {{lastState}} <br/>
    Last Greeting: {{lastGreeting}}  <br/>
    Last Greeting Result Obj: <br/>
    {{lastResult}}
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      lastGreeting: undefined,
      lastState: undefined,
      lastResult: undefined,
      appStore: window.appStore
    };
  },

  methods: {
    getGreetedAsAuthenticatedUser: function(event) {
      // without ID token in authorization header, the response would be 401, and Lambda
      // not called - response directly from cloudfront
      var idToken = this.appStore.state.cognitoUser.signInUserSession.idToken
        .jwtToken;
      axios
        .get(this.appStore.config.api.greetUrl, {
          headers: {
            Authorization: idToken
          }
        })
        .then(response => {
          this.lastState = "SUCCESS";
          this.lastResult = response;
          this.lastGreeting = response.data.greeting;
        })
        .catch(e => {
          this.lastState = "ERROR";
          console.log(e);
          this.lastResult = e.toString();
          this.lastGreeting = undefined;
        });
    },

    getGreetedDirect: function(event) {
      const lambda = new window.AWS.Lambda();
      const payload = {
        foo: "bar"
      };
      const context = {
        "foo-ctx": "bar-ctx"
      };
      const params = {
        FunctionName: "GreetingToAuthenticatedUser",
        ClientContext: window.AWS.util.base64.encode(JSON.stringify(context)),
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(payload)
      };
      lambda
        .invoke(params)
        .promise()
        .then(response => {
          this.lastState = "SUCCESS";
          this.lastResult = response;
          try {
            const payload = JSON.parse(response.Payload);
            const body = JSON.parse(payload.body);
            this.lastGreeting = body.greeting;
          } catch (err) {
            this.lastGreeting = "error getting greeting";
          }
        })
        .catch(e => {
          this.lastState = "ERROR";
          console.log(e);
          this.lastResult = e.toString();
          this.lastGreeting = undefined;
        });
    },

    getGreetedAsMFAUser: function(event) {
      alert("Not Implemented");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
