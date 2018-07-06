<template>
  <div>
    Update Attrinutes:<br/>
    <b-table striped hover :items="attributesToUpdate"></b-table><br/>
    <select v-model="selectedAttributeToUpdate" v-on:change="attributeValueToUpdate=undefined">
      <option v-for="option in updateAttributeOptions" v-bind:value="option.value">
      {{option.text}}
      </option>
    </select>
    <input v-model="attributeValueToUpdate"></input>
    <button v-on:click='addAttributeToUpdate'>Add</button>
    <button v-on:click='attributesToUpdate=[]'>Reset</button>
    <button v-on:click='updateAttribute'>Update Attributes</button>
    <hr/>
    Verify Attributes:<br/>
    <select v-model="selectAttributeToVerify">
      <option v-for="option in verifyAttributeOptions" v-bind:value="option.value">
      {{option.text}}
      </option>
    </select>
    <button v-on:click='requestAttributeVerificationCode'>Send/Resend Verification Code</button>
    <input v-model="attributeVerificationCode"></input>
    <button v-on:click='verifyAttribute'>Verify Attribute</button>
    <hr/>
    <button v-on:click='fetchAttributes'>Get User Attributes</button>
    <button v-on:click='fetchDevices'>List Devices</button>
    <button v-on:click='getUser'>Call getUser</button>
    <hr/>
    User Attributes:<b-table striped hover :items="userAttributes"></b-table><hr/>
    User Devices:<b-table striped hover :items="userDevicesAsArray"></b-table><hr/>
    AWS.CognitoIdentityServiceProvider.getUser Result:<br/>
    {{JSON.stringify(getUserResult)}}
  </div>
</template>

<script>

var {getResultToStateSuccessFailureHandlerObj,getResultToStateHandler} = require('../utils')

export default {
  data () {
    return {
      attributesToUpdate:[],
      selectedAttributeToUpdate:undefined,
      attributeValueToUpdate:undefined,
      updateAttributeOptions:[
        { text: 'Name', value: 'name'},
        { text: 'Address', value: 'address'},
        { text: 'Phone (+xx xxx)', value: 'phone_number'},
        { text: 'Email', value: 'email'},
        { text: 'Birth Date', value: 'birthdate'},
        { text: 'Preferred Username', value: 'preferred_username'},
        { text: 'Family Name', value: 'family_name'},
        { text: 'Given Name', value: 'given_name'},
        { text: 'Gender', value: 'gender'},
        { text: 'Middle Name', value: 'middle_name'},
      ],
      verifyAttributeOptions:[
        { text: 'Phone (+xx xxx)', value: 'phone_number'},
        { text: 'Email', value: 'email'},
      ],
      userAttributes:undefined,
      userDevices:undefined,
      getUserResult:undefined,
      selectAttributeToVerify:undefined,
      attributeVerificationCode: undefined,
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

    addAttributeToUpdate: function(event) {
      this.attributesToUpdate.push(
        {Name:this.selectedAttributeToUpdate, Value:this.attributeValueToUpdate}
      );
      this.selectedAttributeToUpdate = undefined;
      this.attributeValueToUpdate = undefined;
    },

    updateAttribute: function(event) {
      this.appStore.doUpdateAttribute(this.attributesToUpdate);
      this.attributesToUpdate = [];
    },

    requestAttributeVerificationCode: function(event) {
      this.appStore.doRequestVerifyAttributeCode(this.selectAttributeToVerify);
    },

    verifyAttribute: function(event) {
      this.appStore.doVerifyAttribute(
        this.selectAttributeToVerify,
        this.attributeVerificationCode);
      this.selectAttributeToVerify = undefined;
      this.attributeVerificationCode = undefined;
    },

    getUser: function(event) {
      var provider = new window.AWS.CognitoIdentityServiceProvider();
      var accessToken = this.appStore.state.cognitoUser.signInUserSession.accessToken.jwtToken;
      var params = {
        AccessToken: accessToken
      };
      var handler = getResultToStateHandler("Call getUser",this,'getUserResult');
      provider.getUser(params,handler);
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
