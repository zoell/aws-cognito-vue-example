<template>
<div>
<h1>{{ msg }}</h1></br>
<button v-on:click="gotoPage('/')"> Home </button> |
<button v-on:click="gotoPage('/SignUp')"> Sign Up </button> |
<button v-on:click="gotoPage('/Login')"> Login In </button> |
<template v-if="notAuthenticated">(Use after login)</template>
<button v-on:click="gotoPage('/Attribute')"> User's Home </button>
<button v-on:click="signOut"> Logout </button>
Hi, {{userName}}
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
      return !this.appStore.state.authenticated;
    },
    userName : function() {
      if (this.appStore.state.userToken)
        return this.appStore.getDecodedUserToken().username;
      else
        return 'guest';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
