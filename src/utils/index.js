export function getSuccessFailureHandlerObj(actionDesc, onSuccessCallback) {
  return {
      onSuccess: function (result) {
          alert(actionDesc+" :SUCCESS, result=" + JSON.stringify(result));
          console.log(actionDesc+' :Success, ' + JSON.stringify(result));
          if (onSuccessCallback)
            onSuccessCallback(result);
      },
      onFailure: function(err) {
          alert(actionDesc+" :FAILED, "+(err.message || JSON.stringify(err)));
          console.log(actionDesc+' :FAILED, ' + JSON.stringify(err));
      },
  };
};

export function getResultToStateSuccessFailureHandlerObj(actionDesc, stateObj, stateName) {
  return getSuccessFailureHandlerObj(
    actionDesc,
    result=>{
      if (stateObj)
        stateObj[stateName] = result;
    }
  );
};

export function getResultToCallbackHandler(actionDesc, callback) {
  return function(err, result) {
    if (err) {
        alert(actionDesc+": FAIL, "+err.message);
        console.log(actionDesc+": FAIL, "+JSON.stringify(err));
        return;
    }
    console.log(actionDesc+': SUCCESS, result=' + JSON.stringify(result));
    alert(actionDesc+": SUCCESS, result="+JSON.stringify(result));
    if (callback)
      callback(result);
  }
}

export function getResultToStateHandler(actionDesc, stateObj, stateName) {
  return getResultToCallbackHandler(
    actionDesc,
    result=>{
      if (stateObj)
        stateObj[stateName] = result;
    }
  )
}
