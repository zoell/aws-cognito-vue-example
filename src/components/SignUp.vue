<template>
  <div>
  Username:<input v-model="username" placeholder="username"></br>
  Email: <input v-model="email" placeholder="email"></br>
  Password:<input v-model="password"></br>
  <button v-on:click="signUpCognito">Sign Up</button></br>
  <hr/>
  Last Sign Up Result:<br/>
  {{JSON.stringify(appStore.state.lastSignUpResult)}}
  </div>
</template>

<script>

export default {
  data () {
    return {
      username:'',
      email: '',
      password: '',
      appStore:window.appStore,
      signUpResult: undefined,
    }
  },
  methods: {
    signUpCognito: function() {
      appStore.doSignUp(
        this.username, this.email, this.password
      );
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
