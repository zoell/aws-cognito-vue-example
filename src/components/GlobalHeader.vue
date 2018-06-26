<template>
<div>
<h1>{{ msg }}</h1></br>
<button v-on:click="gotoPage('/')"> Home </button> |
<template v-if="userLogedIn">
Oh hi, {{userName}}
<button v-on:click="gotoPage('/Attribute')"> User's Home </button>
</template>
<template v-else>
<button v-on:click="gotoPage('/SignUp')"> Sign Up </button> |
<button v-on:click="gotoPage('/Login')"> Login In </button> |
</template>

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
    }
  },
  computed : {
    userLogedIn : function() {
      return this.appStore.state.userToken !== undefined;
    },
    userName : function() {
      return this.appStore.getDecodedUserToken().username;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
