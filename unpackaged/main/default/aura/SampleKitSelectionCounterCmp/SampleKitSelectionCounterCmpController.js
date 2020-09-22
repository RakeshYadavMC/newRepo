({
    doInit : function(component, event, helper) {
        
    },
    recordLoaded : function(component, event, helper){
        var objSampleKit = component.get('v.simpleRecord');
        var today = new Date();  
        if(objSampleKit.Kit_Selection_Last_Day__c != null){
            var kitSelectionLastDate = new Date(objSampleKit.Kit_Selection_Last_Day__c);
            var noOfDaysLeft = Math.round((kitSelectionLastDate-today)/8.64e7);
            console.log('Remaining Days:::',noOfDaysLeft);
            component.set('v.noOfDaysLeft',noOfDaysLeft);         
        }    
        component.set('v.showSpinner',false);
    }
})