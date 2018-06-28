<template>
  <div>
  <button v-on:click="getMFAOptions">Get MFA Options</button><br/>
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
    }
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
