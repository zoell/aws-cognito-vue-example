<template>
  <div>
    Name: <input v-model="name"></input></br>
    Address: <input v-model="address"></input></br>
    Phone Number (+xx xxxxxxxxx): <input v-model="phone"></input></br>
    <hr/>
    <button v-on:click='fetchAttributes'>Get User Attributes</button>
    <button v-on:click='fetchDevices'>List Devices</button>
    <button v-on:click='updateAttribute'>Update Attributes</button>
    </br>
    <button v-on:click='requestCodeForPhone'>Send SMS Code</button>
    <input v-model="smsCode"></input>
    <button v-on:click='verifyPhone'>Verify Phone</button>
    <hr/>
    User Attributes:<b-table striped hover :items="userAttributes"></b-table><br/>
    User Devices:<b-table striped hover :items="userDevicesAsArray"></b-table>
  </div>
</template>

<script>

var {getResultToStateSuccessFailureHandlerObj,getResultToStateHandler} = require('../utils')

export default {
  data () {
    return {
      name:undefined,
      userAttributes:undefined,
      userDevices:undefined,
      address: undefined,
      phone: undefined,
      smsCode: undefined,
      appStore:window.appStore,
    }
  },

  methods: {

    fetchAttributes: function (event) {
      // see https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
      // use case 5. retrieve user attributes for authenticated user
      this.appStore.state.cognitoUser.getUserAttributes(
        getResultToStateHandler(
          'Get user attributes',this,'userAttributes'
        )
      );
    },

    fetchDevices: function (event) {
      // see https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js/
      // use case 18. retrieve user devices
      this.appStore.state.cognitoUser.listDevices(
        55,null,getResultToStateSuccessFailureHandlerObj('List user device',this,'userDevices')
      );
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
  },

  computed: {
    userDevicesAsArray: function() {
      // this is to flaten the DeviceAttributes array as attributes
      if (this.userDevices) {
        var res = [];
        this.userDevices.Devices.forEach(
          device=>{
            var dres = Object.assign({},device);
            device.DeviceAttributes.forEach(
              att=>{
                dres[att.Name]=att.Value;
              }
            );
            delete dres.DeviceAttributes;
            res.push(dres);
          }
        );
        return res;
      }
      else
        return undefined;
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
