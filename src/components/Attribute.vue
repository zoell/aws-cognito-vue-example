<template>
  <div>
    <button v-on:click='fetchAttributes'>See User Info</button>
    <b-table striped hover :items="userAttributes"></b-table>
  </div>
</template>

<script>

export default {
  data () {
    return {
      userAttributes:[],
      appStore:window.appStore
    }
  },

  methods: {
    fetchAttributes: function (event) {

    this.appStore.state.cognitoUser.getUserAttributes(
      function(componentData) {
        return function(err, result) {
          if (err) {
              alert(err.message || JSON.stringify(err));
              return;
          }
          componentData.userAttributes.splice(0);
          for (var i=0; i<result.length; i++){
            componentData.userAttributes.push(result[i]);
          };
        };
      }(this));
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
