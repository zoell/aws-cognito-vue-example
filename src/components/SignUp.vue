<template>
  <div>
  Username:<input v-model="username" placeholder="username"></br>
  Email: <input v-model="email" placeholder="email"></br>
  Password:<input v-model="password"></br>
  <button v-on:click="signUpCognito">Sign Up</button></br>
  Result: {{result}}</br>
  Detail: {{detail}}
  </div>
</template>

<script>

export default {
  data () {
    return {
      username:'',
      email: '',
      password: '',
      result:"",
      detail:"",
      appStore:window.appStore
    }
  },
  methods: {
    signUpCognito: function() {
      appStore.doSignUp(
        this.username, this.email, this.password,
        function(componentData) {
          return function(result, detail) {
            componentData.result = result;
            componentData.detail = detail;
          }
        }(this)
      );
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
