<template>
<div>
<h1>{{ msg }}</h1></br>
<button v-on:click="gotoPage('/')"> Home </button> |
<button v-on:click="gotoPage('/SignUp')"> Sign Up </button> |
<button v-on:click="gotoPage('/Login')"> Login In </button> <br/>
<template v-if="notAuthenticated">(Not Authenticated)</template>
<button v-on:click="gotoPage('/CognitoUser')"> CognitoUser Obj </button> | 
<button v-on:click="gotoPage('/IDPool')"> ID Pool </button> |
<button v-on:click="gotoPage('/Attribute')"> Attributes </button> |
<button v-on:click="gotoPage('/MFA')"> MFA </button>

<hr/>
Hi, {{userName}} <button v-on:click="signOut"> Logout </button><br/>
<hr/>
</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to VSC Ecosystem',
      appStore : window.appStore
    }
  },
  methods: {
    gotoPage:function(url) {
      this.$router.push(url);
    },
    signOut:function() {
      this.appStore.doLogout();
      this.$router.push("/");
    }
  },
  computed : {
    notAuthenticated : function() {
      return ((!this.appStore.state.cognitoUser) ||
        (!this.appStore.state.cognitoUser.signInUserSession));
    },
    userName : function() {
      return (this.appStore.state.cognitoUser && this.appStore.state.cognitoUser.username) || 'guest';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
