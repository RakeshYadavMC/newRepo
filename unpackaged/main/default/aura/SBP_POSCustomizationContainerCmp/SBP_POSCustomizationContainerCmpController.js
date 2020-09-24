({

    markStepsAsCompleted: function(component, event, helper) {
    
        component.set('v.disableFinish', true);
        component.set('v.disableNext', true);
        // disable buttons 
        setTimeout(function() {
            component.set('v.disableFinish', false);
            component.set('v.disableNext', false);
        }, 4000);
        var action = event.getParam("action");
        console.log(action);

        if (action != 'BACK') {
            // update case or split barrel record
            var validatePOSItemsHaveBeenSelectedPromise = helper.validatePOSItemsHaveBeenSelected(component, event, helper);
            validatePOSItemsHaveBeenSelectedPromise.then(
                    $A.getCallback(function(result) {
                        console.log('result from pos item validation ===============================', result);
                        component.set('v.posItemsValid', result);
                        return helper.validateBottleTextHasBeenEntered(component, event, helper);

                    }),
                    $A.getCallback(function(error) {
                        // Something went wrong
                        alert('An error occurred: ' + error.message);
                        console.log('ERROR: ', error);
                    })
                ).then(
                    $A.getCallback(function(result) {
                        var isPosValid = component.get('v.posItemsValid');
                        console.log('result from bottle text validation ===============================', result);
                        component.set('v.bottleTextValid', result);
                        if (result && isPosValid) {
                            return helper.markStepsAsCompleted(component, event, helper);
                        } else {
                            helper.showToast('An error occurred please contact the support team', 'Error', 'error');
                        }
                    }),
                    $A.getCallback(function(error) {
                        // Something went wrong
                        alert('An error occurred : ' + error.message);
                        console.log('ERROR: ', error);
                    })
                ).then(
            
            /*//added for SR_183564 - Issue With Closed-Abandoned Cases by ajeeta soni */
      
            $A.getCallback(function(result) {
           console.log('result from markStepsAsCompleted validation ===============================', result);
                var recordId = component.get('v.recordId');
       		    console.log('RECORDID', recordId);
        		var currentBrand = component.get('v.currentBrand');
        		var getRecordInfoStatus = helper.getCaseRecordInfo(component, event, helper);
                console.log('record info 1 ', result);
               // return helper.getCaseRecordInfo(component, event, helper) ;     

            }),
            $A.getCallback(function(error) {
                // Something went wrong
                alert('An error occurred getting events : ' + error.message);
            })
        )
            /*.then(	
                         $A.getCallback(function(result) {
                             
                        var currBrand = component.get('v.currentBrand');
                        var currProgram = component.get('v.programType');
                        var rcdStat = component.get('v.recordStatus');
                        console.log('Current Brand:::',currBrand);
                        console.log('Current Flavour:::',currProgram);
                     
                             if (result['success']) {
                      if(currBrand == 'Knob Creek' && currProgram == 'Sample Kit' && rcdStat != 'Closed - Abandoned'){
                                component.find('knobCreek_sample_prompt').showNotice({
                                    "variant": "Warning",
                                    "header": "Please note",
                                    "message": "NOTE: Due to limited allocations of Knob Creek liquid, this barrel will be cancelled if a sample is not selected within 30 days of the sample kit being delivered to the address listed on the order.",
                                    closeCallback: function() {
                                        helper.handleNavigate(component, event, helper);
                                    }	
                                }); 
                            } 
                            else {
                                helper.handleNavigate(component, event, helper); 
                            }
                            
                        }

                    }),
                    $A.getCallback(function(error) {
                        // Something went wrong
                        alert('An error occurred : ' + error.message);
                        console.log('ERROR: ', error);
                    })
                ) */
                .catch(function(error) {
                    $A.reportError("error message here", error);
                });
        
                           }          else {
            helper.handleNavigate(component, event, helper);
        }
    
    }
    
       
})