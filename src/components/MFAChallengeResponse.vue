<template>
  <div>
    <template v-if="mode === 'associateSecretCode'">
    Use secret code below to add an item into your Google Authenticator<br/>
    Secret code is: {{secretCode}}<br>
    <qrcode v-bind:value="secretCodeUri" :options="{size:200}"></qrcode><br/>
    Name your Authenticator decice: <input v-model="deviceName"><br/>
    Code from your Authenticator: <input v-model="mfaAnswer"><br/>
    <button v-on:click="verifySoftwareToken">Verify Authenticator Code & Complete TOTP Setup</button>
    </template>

    <template v-if="mode === 'selectMFAType'">
    challengeName: {{challengeName}}<br/>
    challengeParameters: {{challengeParameters}}<br/>
    <button v-on:click="sendMFASelectionAnswer('SMS_MFA')">Select SMS MFA</button> |
    <button v-on:click="sendMFASelectionAnswer('SOFTWARE_TOKEN_MFA')">Select Authenticator MFA</button>
    </template>

    <template v-if="mode === 'mfaRequired'">
    You are sent an SMS with a verification code, input it below:<br/>
    <input v-model="mfaAnswer">
    <button v-on:click="sendMFACode('SMS_MFA')">Verify</button>
    </template>

    <template v-if="mode === 'totpRequired'">
    Open your Authenticator & input the verification code below:<br/>
    Secret code (should be empty): {{secretCode}}<br/>
    <input v-model="mfaAnswer">
    <button v-on:click="sendMFACode('SOFTWARE_TOKEN_MFA')">Verify</button>
    </template>
  </div>
</template>

<script>

var {getSuccessFailureHandlerObj} = require('../utils');

export default {
  data () {
    return {
      mode:undefined,
      secretCode:undefined,
      deviceName:undefined,
      challengeName:undefined,
      challengeParameters:undefined,
      mfaAnswer:undefined,
      appStore: window.appStore,
      handler: undefined,
    }
  },

  props: ['actionDesc', 'onSuccessHandler'],

  mounted: function(){
    // get the handler for login or set up software token
    var handler = getSuccessFailureHandlerObj(this.actionDesc, this.onSuccessHandler);
    // just initiate TOTP when challenged to do MFA setup
    handler['mfaSetup'] = function(thisObj){return function(){
      // this is not tested...
      thisObj.appStore.state.cognitoUser.associateSoftwareToken(thisObj.handler);
    }}(this);
    // be given a secret code from server, shall request an answer from user to
    // finalise software token setup, so clear the input
    handler['associateSecretCode'] = function(thisObj){return function(secretCode){
      thisObj.mode = 'associateSecretCode';
      thisObj.secretCode = secretCode;
      thisObj.mfaAnswer = undefined;
    }}(this);
    // not sure when this will be called but just put it there
    handler['selectMFAType'] = function(thisObj){return function(challengeName, challengeParameters){
      thisObj.mode = 'selectMFAType';
      thisObj.challengeName = challengeName;
      thisObj.challengeParameters = challengeParameters;
    }}(this);
    // when being challenged of SMS or TOTP MFA, set the mode and clear the input
    handler['mfaRequired'] = function(thisObj){return function(){
      thisObj.mode='mfaRequired';
      this.mfaAnswer = undefined;
    }}(this);
    handler['totpRequired'] = function(thisObj){return function(secretCode){
      thisObj.mode = 'totpRequired';
      this.secretCode = secretCode;
      this.mfaAnswer = undefined;
    }}(this);
    this.handler = handler;
  },

  methods: {
    verifySoftwareToken(){
      this.appStore.state.cognitoUser.verifySoftwareToken(
        this.mfaAnswer, this.deviceName, this.handler
      );
    },
    sendMFASelectionAnswer(mfaType) {
      this.appStore.state.cognitoUser.sendMFASelectionAnswer(mfaType, this.handler);
    },
    sendMFACode(mfaType){
      this.appStore.state.cognitoUser.sendMFACode(this.mfaAnswer, this.handler, mfaType);
    },
  },
  computed: {
    secretCodeUri: function() {
      return "otpauth://totp/Bings%20Cognito%20Example:"+
      this.appStore.state.cognitoUser.username+
      "?secret="+
      this.secretCode+
      "&issuer=Bings%20Cognito%20Example";
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
