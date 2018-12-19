<template>
<div>
<h1>{{ msg }}</h1><br/>
<button v-on:click="gotoPage('/')"> Home </button> |
<button v-on:click="gotoPage('/SignUp')"> Sign Up </button> |
<button v-on:click="gotoPage('/Login')"> Login In </button> |
<button v-on:click="gotoPage('/ForgotPassword')"> I Forgot... </button>
<br/>
<div v-bind:style="authenticatedUserOnlyStyle">
<template v-if="!appStore.isAuthenticated()">(Not Authenticated)</template>
<button v-on:click="gotoPage('/CognitoUser')"> CognitoUser Obj </button> |
<button v-on:click="gotoPage('/IDPool')"> ID Pool </button> |
<button v-on:click="gotoPage('/Attribute')"> Attributes </button> |
<button v-on:click="gotoPage('/MFA')"> MFA </button>
<button v-on:click="gotoPage('/PasswdDelAcc')"> Acc. Password/Del </button> |
<button v-on:click="gotoPage('/Greetings')"> Greetings </button> |
<button v-on:click="signOut"> Logout </button><br/>
</div>

<hr/>
Hi, {{userName}}
<hr/>
</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Bing\'s AWS Cognito Demo',
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
    userName : function() {
      return (this.appStore.state.cognitoUser && this.appStore.state.cognitoUser.username) || 'guest';
    },
    authenticatedUserOnlyStyle: function() {
      return {
        'background-color': appStore.isAuthenticated()?'white':'yellow'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
