({
    init: function(component, event, helper) {},
    selectPosItem: function(component, event, helper, textChange) {
        var selectedOptionValue = event.getParam("value");
        //alert('======selectedOptionValue====='+selectedOptionValue);
        var showTextOptions = component.get('v.showTextOptions');
        //Added by sripal on 08/02
        if(selectedOptionValue =='Include' || selectedOptionValue=='Account Name'){
           // if(component.get("v.AccontNameVal")=='' || component.get("v.AccontNameVal")==null){
            	helper.getAccountNamebyCase(component, event, helper);
           /* }else{
               component.set('v.textOptionselected', component.get("v.AccontNameVal"));
            }*/
        }else if(selectedOptionValue=='Bottle Label Text'){
            if(component.get('v.BottleTextval')!=undefined){
                component.set('v.textOptionselected', component.get('v.BottleTextval'));
            }else{
                component.set('v.textOptionselected', 'Bottle Label Text');
            }
        }
        
        //component.set('v.textOptionVal', component.get("v.AccontNameVal"));
        
        var insertText = component.get('v.textOptionVal');
        //alert('=====insertText in POSTITemcmp'+insertText);
        if (showTextOptions && (selectedOptionValue == 'Include' || selectedOptionValue == 'Insert Only') && insertText != '' && insertText != '') {
            helper.defaultTextOption(component, event, helper);
        } else if(!showTextOptions){
            helper.clearTextOption(component, event, helper);
        }
        
        var posId = component.get('v.posId');
        var action;
        var isInsert = false;
        var auraId = component.get("v.itemText");
        
        if (textChange) {
            action = 'INSERT';
        } else if (selectedOptionValue === 'Include') {
            action = 'INSERT';
        } else if (selectedOptionValue === 'Don\'t Include') {
            console.log('Dont Include');
            action = 'DELETE';
        } else if (selectedOptionValue === 'Insert Only') {
            console.log('Insert Only Selected');
            action = 'INSERT';
            isInsert = true;
        }
        
        var posObj = {
            isInsert: isInsert,
            getInsertTextFrom: component.get('v.textOptionVal'),
            action: action,
            auraId: auraId,
            posId: posId
        };
        
        
        console.log('----- ', posObj);
        
        
        // call the event   
        var compEvent = component.getEvent("includePosItem");
        // set the Selected item attribute
        compEvent.setParams({
            "auraId": auraId,
            "posId": posId,
            "action": action,
            "isInsert": isInsert,
            "insertText": insertText,
            "posMap": posObj
        });
        // fire the event  
        compEvent.fire();
        
    },
    
    toggleButton: function(component, event, helper) {
        var itemIncluded = component.get('v.itemIncluded');
        component.set('v.itemIncluded', !itemIncluded);
    },
    showToast: function(component, event, helper, type, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
        });
        toastEvent.fire();
    },
    defaultTextOption: function(component, event, helper) {
        component.set('v.textOptionVal', 'Account Name');
    },
    //Added by sripal on 08/02 
    getAccountNamebyCase :function(component,event, helper){
        var action = component.get("c.getAccountNamefromCase");
        //alert('====case in positem ==='+component.get("v.CaseIdval"));
        action.setParams({
            "CaseId": component.get("v.CaseIdval"),
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            //alert(state);
            if (state === "SUCCESS") {
                //alert(response.getReturnValue());  
                component.set("v.AccontNameVal",response.getReturnValue());
                component.set('v.textOptionselected', component.get("v.AccontNameVal"));
                //alert('accccc'+component.get("v.AccontNameVal"))
                
            }
        });
        $A.enqueueAction(action);
        
    },
    clearTextOption: function(component, event, helper) {
        component.set('v.textOptionVal', '');
    }
})