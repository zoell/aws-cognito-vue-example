<template>
  <div>
    Name: <input v-model="name"></input></br>
    Address: <input v-model="address"></input></br>
    Phone Number:<input v-model="phone"></input></br>
    <hr/>
    <button v-on:click='fetchAttributes'>See User Info</button>
    <button v-on:click='fetchDevices'>List Devices</button>
    <button v-on:click='updateAttribute'>Update Attributes</button>
    </br>
    <button v-on:click='requestCodeForPhone'>Send SMS Code</button>
    <input v-model="smsCode"></input>
    <button v-on:click='verifyPhone'>Verify Phone</button>
    <hr/>
    <b-table striped hover :items="userAttributes"></b-table>
  </div>
</template>

<script>

export default {
  data () {
    return {
      attributeName:undefined,
      name:undefined,
      address: undefined,
      phone: undefined,
      userAttributes:[],
      smsCode: undefined,
      appStore:window.appStore,
    }
  },

  methods: {

    fetchAttributes: function (event) {
    // see https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
    // use case 5. retrieve user attributes for authenticated user
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
    },

    fetchDevices: function (event) {
      // see https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
      // use case 18. retrieve user devices
      this.appStore.state.cognitoUser.listDevices(55,null,{
        onSuccess: function(componentData){
          return function(result) {
            componentData.userAttributes.splice(0);
            for (var i=0; i<result.Devices.length; i++) {
              componentData.userAttributes.push(result.Devices[i]);
            }
          }
        }(this),
        onFailure: function(err){
          alert(err.message);
          console.log("List devices failed: "+JSON.stringify(err));
        }
      });
    },

    updateAttribute: function(event) {
      var attributes =
      [
        {
          Name: 'name',
          Value: this.name
        },
        {
          Name: 'address',
          Value: this.address
        },
        {
          Name: 'phone_number',
          Value: this.phone
        }
      ];
      this.appStore.doUpdateAttribute(attributes);
    },

    requestCodeForPhone: function(event) {
      this.appStore.doRequestVerifyAttributeCode('phone_number');
    },

    verifyPhone: function(event) {
      this.appStore.doVerifyAttribute('phone_number', this.smsCode);
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
