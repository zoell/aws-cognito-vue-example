<template>
  <div>
  Call cognitoUser.getMFAOptions, enableMFA, disableMFA API:<br/>
  <button v-on:click="getMFAOptions">Get MFA Options</button>
  <button v-on:click="enableMFA">Enable MFA</button>
  <button v-on:click="disableMFA">Disable MFA</button><br/>
  Current MFA options: {{mfaOptionsStr}} <br/>
  <hr/>
  Call cognitoUser.setUserMfaPreference API:<br/>
  <input type="checkbox" v-model="smsEnable">Enable SMS</input>
  <input type="checkbox" v-model="smsPrefer">Prefer SMS</input><br/>
  <input type="checkbox" v-model="totpEnable">Enable TOTP</input>
  <input type="checkbox" v-model="totpPrefer">Prefer TOTP</input><br/>
  <button v-on:click="setUserMfaPreference">Set MFA Preference</button>
  <hr/>
  <button v-on:click="associateSoftwareToken">Associate Software Token (Google Authenticator)</button>
  <MFAChallengeResponse
    ref="mfaChaRes" actionDesc="Associate Software Token"
    :onSuccessHandler="undefined"
  ></MFAChallengeResponse>
  </div>
</template>

<script>
var {getResultToCallbackHandler,getResultToStateHandler} = require('../utils');

export default {
  data () {
    return {
      smsEnable:false,
      totpEnable:false,
      smsPrefer:false,
      totpPrefer:false,
      appStore:window.appStore
    }
  },
  methods: {
    getMFAOptions: function (event) {
      this.appStore.state.cognitoUser.getMFAOptions(
        getResultToStateHandler('Get MFA Options',this.appStore.state,'mfaOptions')
      );
    },
    enableMFA: function(event){
      this.appStore.state.cognitoUser.enableMFA(
        getResultToCallbackHandler('Enable MFA')
      );
    },
    disableMFA: function(event){
      this.appStore.state.cognitoUser.disableMFA(
        getResultToCallbackHandler('Disable MFA')
      );
    },
    setUserMfaPreference: function(event) {
      var handler = getResultToCallbackHandler('Set User MFA Preference');
      var smsMfaSettings = this.smsEnable ? {
        PreferredMfa : this.smsPrefer,
        Enabled : this.smsEnable
      } : null;
      var totpMfaSettings = this.totpEnable? {
        PreferredMfa : this.totpPrefer,
        Enabled : this.totpEnable
      } : null;
      this.appStore.state.cognitoUser.setUserMfaPreference(
        smsMfaSettings, totpMfaSettings, handler);
    },
    associateSoftwareToken: function(event){
      this.appStore.state.cognitoUser.associateSoftwareToken(
        this.$refs.mfaChaRes.handler
      );
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
