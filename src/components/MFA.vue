<template>
  <div>
  <button v-on:click="getMFAOptions">Get MFA Options</button>
  <button v-on:click="enableMFA">Enable MFA</button>
  <button v-on:click="disableMFA">Disable MFA</button><br/>

  Current MFA options: {{mfaOptionsStr}} <br/>

  </div>
</template>

<script>

export default {
  data () {
    return {
      appStore:window.appStore
    }
  },
  methods: {
    getMFAOptions: function (event) {
      this.appStore.getMFAOptions();
    },
    enableMFA: function(event){
      this.appStore.enableMFA();
    },
    disableMFA: function(event){
      this.appStore.disableMFA();
    },
  },

  computed: {
    mfaOptionsStr : function() {
      return JSON.stringify(this.appStore.state.mfaOptions)||'None';
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
