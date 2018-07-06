<template>
  <div>
    Change Password:<br/>
    Old Password: <input v-model="oldPassed"></input><br/>
    New Password: <input v-model="newPasswd"></input><br/>
    <button v-on:click="changePassword">Change Password</button>
    <hr/>
    <button v-on:click="deleteAccount">!!! DELETE ACCOUNT !!!</button>
  </div>
</template>

<script>

var {getResultToCallbackHandler} = require('../utils')

export default {
  data () {
    return {
      oldPassed:undefined,
      newPasswd:undefined,
      appStore:window.appStore,
    }
  },

  methods: {
    changePassword: function(event){
      this.appStore.state.cognitoUser.changePassword(
        this.oldPassed, this.newPasswd,
        getResultToCallbackHandler('Change Password')
      )
    },
    deleteAccount: function(event){
      this.appStore.state.cognitoUser.deleteUser(
        getResultToCallbackHandler('Delete User')
      )
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
