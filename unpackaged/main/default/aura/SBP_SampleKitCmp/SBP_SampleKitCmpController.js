({
    init: function(component, event, helper) { 
        helper.getDistributorAccountRecord(component,event,helper);	
    },
    
    showSpinner: function(component, event, helper) {
        component.set("v.spinnerFlag", true); 
    },
    
    hideSpinner : function(component,event,helper){
        component.set("v.spinnerFlag", false);
    },
    
    toggleYesNo: function(component, event, helper){
        var caseDistributorAccountRecord = component.get('v.caseDistributorAccountRecord');
        var buttonClicked = component.find('distributor_address').get('v.value');
        if(buttonClicked == 'Yes'){ 
            component.set('v.showDistributorAddress',true);
            component.set('v.showShippingAddress',false);
            component.set('v.distributorOfficeLocation', caseDistributorAccountRecord.Account.Name);
            component.set('v.sampleKitStreet', caseDistributorAccountRecord.Account.BillingStreet);
            component.set('v.sampleKitCity', caseDistributorAccountRecord.Account.BillingCity);
            component.set('v.sampleKitState', caseDistributorAccountRecord.Account.BillingState);
            component.set('v.sampleKitZip', caseDistributorAccountRecord.Account.BillingPostalCode);
            component.set('v.sampleKitPhone', caseDistributorAccountRecord.Account.Phone);
            component.set('v.disablePhone', false);
            component.set('v.disableAttention', false);
            component.find("shippingAddressSelectorId").set("v.value", '');
        } else if(buttonClicked == 'No'){
            component.set('v.showShippingAddress',true);
            component.set('v.showDistributorAddress',false);
            component.set('v.disablePhone', false);
            component.set('v.disableAttention', false);
        }
    },
    
    moveToNextScreen: function(component, event, helper) {
        var navigate = component.get("v.navigateFlow");
        var action = event.getParam("action");
        if (action == 'BACK') {
            navigate(event.getParam("action"));
            console.log('Back Button Clicked---');
            return;
        }
        var validateSampleKitInfo = helper.validateSampleKitInfo(component, event, helper);
        
        validateSampleKitInfo.then(
            $A.getCallback(function(result) {
                if (result) {
                    return helper.saveSampleKitDetails(component, event, helper);
                } else {
                    //helper.showToast('An error occurred please contact the support team', 'Error', 'error');
                    console.log('An error occurred please contact the support team');
                    return;
                }
            }),
            $A.getCallback(function(error) {
                // Something went wrong
                alert('An error occurred : ' + error.message);
                console.log('ERROR: ', error);
            })
        ).then(
            $A.getCallback(function(result) {
                console.log(result);
                component.set('v.SampleKitUpdated', result['responseMap']['SampleKit']);
                component.set('v.recordStatus', result['responseMap']['Status']);
                var rcdStat = component.get('v.recordStatus');
                console.log('Current Barrel Status:::',rcdStat);
                try{
                     if(rcdStat == 'Closed - Abandoned'){
                                component.find('Sample_Kit_prompt').showNotice({
                                    "variant": "Warning",
                                    "header": "Please note",
                                    "message": "NOTE: Due to inactivity, this barrel has been cancelled. Please return to the main page and re-enter the barrel.",
                                    closeCallback: function() {
                                       $A.get('e.force:refreshView').fire();
        							   window.location.reload();
                                    }	
                                }); 
                     }else{
                    helper.navigateFlow(component, event, helper);
                     }
                }catch(err){
                    console.log(err);
                }                
                
            }),
            $A.getCallback(function(error) {
                // Something went wrong
                var message = 'Please Contact Your System Administrator: \n\n';
                helper.showNotice(component, event, helper, 'error', message + error, 'An Error Occured');
            })
        ).catch(function(error) {
            $A.reportError("error message here", error);
        }
               );
    },
    
    handleKeyUp : function(component, event, helper){
        if (event.which == 13){
            var searchQuery = component.get("v.searchQuery");
            if(searchQuery.length < 2){
                console.log('Not Valid:::');
                return;
            }
            var action = component.get('c.getSampleKitShippingAddress');
            action.setParams({
                "searchKey" : searchQuery
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var retVal = response.getReturnValue();
					var sampleKitShippingAddressList = [];
                    for(var key in retVal){
                        sampleKitShippingAddressList.push(retVal[key]);
                    }
					if(sampleKitShippingAddressList.length == 0){
						console.log('Return Value 0:::',sampleKitShippingAddressList);
                        component.set("v.spinnerFlag", false);
                        helper.showToast('Shipping address not found. Please enter a valid State', 'Warning', 'Warning');                        
                        return;
					}
					else{
						console.log('Return Value 1:::',sampleKitShippingAddressList);
						component.set("v.mapShippingAddress",retVal);
                        component.set("v.sampleKitShippingAddressList",sampleKitShippingAddressList);
                        console.log('Returned Map:::',retVal);
					}
                    
                } else if (state === "ERROR") {    
                    var errors = response.getError();
                    console.log('Error Occured :::',errors);
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    handleAddressChange : function(component, event, helper){
        var selectedAddressId = component.find('shippingAddressSelectorId').get('v.value');
        console.log('---Print Address Id---',selectedAddressId);
        if(selectedAddressId != null && selectedAddressId != undefined && selectedAddressId != ''){
            var addressMap = component.get("v.mapShippingAddress");
            var selectedAddressRecord = addressMap[selectedAddressId];
            component.set('v.selectSampleKitShippingAddress',selectedAddressRecord);
            component.set('v.showDistributorAddress',true);
            component.set('v.distributorOfficeLocation', selectedAddressRecord.Name);
            component.set('v.sampleKitStreet', selectedAddressRecord.Street__c);
            component.set('v.sampleKitCity', selectedAddressRecord.City__c);
            component.set('v.sampleKitState', selectedAddressRecord.State__c);
            component.set('v.sampleKitZip', selectedAddressRecord.Zip_Code__c);
        }
        else{
            component.set('v.selectSampleKitShippingAddress',{});
            component.set('v.showDistributorAddress',false);
            component.set('v.distributorOfficeLocation', '');
            component.set('v.sampleKitStreet', '');
            component.set('v.sampleKitCity', '');
            component.set('v.sampleKitState', '');
            component.set('v.sampleKitZip', '');
        }
        console.log('Address Selected:::',component.get('v.selectSampleKitShippingAddress').Name);
    }
})