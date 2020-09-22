({
    getBrandAllocations: function(component, Event, Helper) {
        const action = component.get('c.getBrandAllocation');
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstBrandAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                for(var i=0; i<lstBrandAllocation.length;i++){
                    var brandAllocation = lstBrandAllocation[0];
                    if(brandAllocation.Is_Active__c == true){
                        component.set('v.isActiveRecord',true);
                    }
                    component.set('v.isCarryForward',brandAllocation.Is_Carry_Forward__c);
                    component.set('v.brand',brandAllocation.Brand__c);
                    component.set('v.brandName',brandAllocation.Brand__r.Name);
                    component.set('v.programType',brandAllocation.Program_Type__c);
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    cloneNewBrandAllocation: function(component, Event, Helper) {
        const action = component.get('c.cloneBrandAllocation');
        action.setParams({
            BrandId: component.get('v.brand'),
            isCarryForward: component.get('v.isCarryForward'),
            programType: component.get('v.programType'),
            timePeriod: component.get('v.objDetail.timePeriod'),
            timeInterval: component.get('v.objDetail.timeInterval'),
            yearOfAllocation: component.get('v.objDetail.yearOfAllocation')
            
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstBrandAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                let url = "/" + lstBrandAllocation.Id;
                var workspaceAPI = component.find("workspace");
                workspaceAPI.openTab({
                    pageReference: {
                        "type": "standard__recordPage",
                        "attributes": {
                            "recordId":lstBrandAllocation.Id,
                            "actionName":"view"
                        },
                        "state": {}
                    },
                    focus: true
                }).then(function(response) {
                    workspaceAPI.getTabInfo({
                        tabId: response
                    }).then(function(tabInfo) {
                    });
                }).catch(function(error) {
                });
                
            } else if(state == "ERROR"){
                var errors = response.getError(); 
                component.set("v.error",errors[0].message);
            }
        });
        $A.enqueueAction(action);
        
    },
    fetchPicklistValues: function(component,objDetails,controllerField, dependentField) {
        var action = component.get("c.getDependentMap");
        action.setParams({
            'objDetail' : objDetails,
            'contrfieldApiName': controllerField,
            'depfieldApiName': dependentField 
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var StoreResponse = response.getReturnValue();
                component.set("v.dependentFieldMap",StoreResponse);
                
                var listOfkeys = []; // for store all map keys (controller picklist values)
                var ControllerField = []; // for store controller picklist value to set on lightning:select. 
                
                for (var singlekey in StoreResponse) {
                    listOfkeys.push(singlekey);
                }
                if (listOfkeys != undefined && listOfkeys.length > 0) {
                    ControllerField.push('--- None ---');
                }
                
                for (var i = 0; i < listOfkeys.length; i++) {
                    ControllerField.push(listOfkeys[i]);
                }  
                component.set("v.listControllingValues", ControllerField);
            }else{
                alert('Something went wrong..');
            }
        });
        $A.enqueueAction(action);
    },
    
    fetchDepValues: function(component, ListOfDependentFields) {
        var dependentFields = [];
        dependentFields.push('--- None ---');
        for (var i = 0; i < ListOfDependentFields.length; i++) {
            dependentFields.push(ListOfDependentFields[i]);
        }
        component.set("v.listDependingValues", dependentFields);
        
    },
    fetchTypePicklist : function(component){
        var action = component.get("c.getPicklistvalues");
        action.setParams({
            'objectName': 'Brand_Allocation__c',
            'field_apiname': 'Year_Of_Allocation__c',
            'nullRequired': true // includes --None--
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.TypePicklist", a.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
    } 
});