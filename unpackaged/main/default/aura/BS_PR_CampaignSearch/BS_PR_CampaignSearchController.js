({
    doInit : function(component,event, helper){
        let rowActions = helper.getRowActions.bind(this, component);
        let cols = [{fieldName: "IOCode__c", label: "IO Code", type: "String"},
                    {fieldName: "Name", label: "Name", type: "String"},
                    {fieldName: "CampaignBalance__c", label: "Balance", type: "currency"},
                    {fieldName: "Brand__c", label: "Brand", type: "String"},
                    {fieldName: "Territory__c", label: "Territory", type: "String"},
                    {fieldName: "GLCode__c", label: "GL Code", type: "String"},
                    //{fieldName: "CampaignType__c", label: "Type", type: "String"},
                    {type: 'action', typeAttributes: { rowActions: rowActions }}];
        component.set("v.columns",cols);
    },
    first : function(component, event, helper) { //Pagination
        var fulldata=[];
        //fulldata=component.get("v.data"); 
        var filterApplied = component.get("v.recordsFiltered"); 
        if(filterApplied){                                    
            fulldata=component.get("v.searchData");
        }
        else{
            fulldata=component.get("v.data");
        }
        var pagesize=component.get("v.pagesize");        
        component.set("v.start",0);
        if(fulldata.length>=pagesize){
            component.set("v.end",pagesize);
        }
        else{
            component.set("v.end",fulldata.length); 
        }
        var startindex=component.get("v.start");
        var endindex=component.get("v.end");
        if(startindex==0){
            component.set("v.disablefirst",true);
            component.set("v.disableprev",true);            
        }
        if(endindex!=fulldata.length){
            component.set("v.disablelast",false);
            component.set("v.disablenext",false);            
        }
        component.set("v.filterData",fulldata.slice(startindex,endindex));
    },
    next : function(component, event, helper) { //Pagination
        var startindex=component.get("v.start");
        var endindex=component.get("v.end");
        var pagesize=component.get("v.pagesize");
        var filterApplied=component.get("v.recordsFiltered");
        var fulldata=[];        
        if(filterApplied){      
            fulldata=component.get("v.searchData");
            //alert('in loop');
        }
        else{
            fulldata=component.get("v.data");
        }                
        if(endindex<fulldata.length){
            startindex=startindex+pagesize;
            component.set("v.start",startindex);
            
            if((endindex+pagesize)>fulldata.length){
                endindex=(endindex+(fulldata.length%pagesize));
                component.set("v.end",endindex);  
            }
            else{
                endindex= (endindex+pagesize); 
                component.set("v.end",endindex);
            }           
        }
        if(startindex!=0){
            component.set("v.disablefirst",false);
            component.set("v.disableprev",false);            
        }
        if(endindex>=fulldata.length){
            component.set("v.disablelast",true);
            component.set("v.disablenext",true);            
        } 
        component.set("v.filterData",fulldata.slice(startindex,endindex));
    },
    prev:function(component,event, helper){ //Pagination
        var startindex=component.get("v.start");
        if(startindex>0){
            var endindex=component.get("v.end");
            var pagesize=component.get("v.pagesize");  
            var fulldata=[];
            var filterApplied = component.get("v.recordsFiltered"); 
            //fulldata=component.get("v.data");
            if(filterApplied){                                    
                fulldata=component.get("v.searchData");
            }
            else{
                fulldata=component.get("v.data");
            }
            startindex=startindex-pagesize;
            component.set("v.start",startindex);
            if(fulldata.length%pagesize==0){     
                endindex=endindex-pagesize;
            }
            else{
                if((endindex%pagesize)!=0){
                    endindex=endindex-(fulldata.length%pagesize); 
                }
                else{
                    endindex=endindex-pagesize; 
                }
            }        
            component.set("v.end",endindex);
        }
        if(startindex==0){
            component.set("v.disablefirst",true);
            component.set("v.disableprev",true);            
        }
        if(endindex!=fulldata.length){
            component.set("v.disablelast",false);
            component.set("v.disablenext",false);            
        }
        component.set("v.filterData",fulldata.slice(startindex,endindex));
    },
    last:function(component,event, helper){ //Pagination
        var startindex=component.get("v.start");
        var endindex=component.get("v.end");        
        var pagesize=component.get("v.pagesize");  
        var fulldata=[];
        var filterApplied = component.get("v.recordsFiltered");
        //fulldata=component.get("v.data");
        if(filterApplied){                                    
            fulldata=component.get("v.searchData");
        }
        else{
            fulldata=component.get("v.data");
        }
        if(fulldata.length%pagesize==0){
            startindex=fulldata.length-pagesize;    
        }
        else{
            startindex=fulldata.length-(fulldata.length%pagesize);
        }           
        component.set("v.start",startindex);
        endindex=fulldata.length;
        component.set("v.end",endindex);
        
        if(startindex!=0){
            component.set("v.disablefirst",false);
            component.set("v.disableprev",false);            
        }
        if(endindex==fulldata.length){
            component.set("v.disablelast",true);
            component.set("v.disablenext",true);            
        }
        component.set("v.filterData",fulldata.slice(startindex,endindex));
    },
    filterData: function (component, evt,helper) {        
        helper.columnData(component, evt,helper);
    },
    clearSearch: function(component, evt, helper){
        //component.set("v.searchData",[]);        
        let searchText = component.get("v.campSearch");
        if($A.util.isUndefinedOrNull(searchText) ||searchText=="" || $A.util.isEmpty(searchText)){
            //helper.goToFirstPage(component, evt, helper);//D-21211
            component.set("v.searchClicked",false);
        }
    },
    handleRowAction: function(component, event, helper){
        let record = event.getParam('row');
        let recordId = record.Id;
        window.open('/' + recordId,'_blank');
    },
    handleKeyAction: function(component, event, helper){
        debugger;
        var isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            let searchKey = component.get("v.campSearch");
            if(searchKey!=null && searchKey.length>1) {
                helper.searchData(component, event, helper,searchKey);        
            }
            else{
                alert('You must enter a valid search key with at least 2 characters.');
            }
        }
    },
    searchCampaigns:function(component, evt, helper){  
        let searchKey = component.get("v.campSearch");
        if (true && searchKey!=null && searchKey.length>1) { 
            helper.searchData(component, event, helper,searchKey);
            /*let recordId = component.get("v.recordId");
            let cCode = component.get("v.simpleRecord").SAP_Company_Code_Value__c;
            helper.serverCall(component,"fetchCampaignWrapper",{searchKey:searchKey,PRID:recordId,companyCode:cCode},function(res){
                component.set("v.searchClicked",true);
                let state = res.getState();
                debugger;
                if(state=="SUCCESS"){
                    let respData = res.getReturnValue();
                    console.log(respData);
                    console.log(res.getState());
                    console.log(respData);
                    //let retData = res.getReturnValue();
                    //let records = retData.map(item=>{return item.objCampaign;});      
                    component.set("v.data",respData);
                    component.set("v.pagesize", parseInt(component.get("v.pagesize")));
                    var fulldata = component.get("v.data");
                    var pagesize = component.get("v.pagesize");
                    component.set("v.start",0);
                    if(fulldata.length>=pagesize){
                        component.set("v.end",pagesize);
                    }
                    else{
                        component.set("v.end",fulldata.length);  
                    }
                    var startindex=component.get("v.start");
                    var endindex=component.get("v.end");
                    
                    if(startindex==0){
                        component.set("v.disablefirst",true);
                        component.set("v.disableprev",true);            
                    } 
                    if(endindex>=fulldata.length){
                        component.set("v.disablelast",true);
                        component.set("v.disablenext",true);            
                    }
                    component.set('v.filterData',fulldata.slice(startindex,endindex));
                }
            });*/
        }
        else{
                alert('You must enter a valid search key with at least 2 characters.');
            }
    },
    addCampaigns: function(component, event, helper){        
        let recordId = component.get("v.recordId");
        let selectedRows = component.get("v.selectedRows");
        helper.serverCall(component,"insertPRDetails",{PRID:recordId,campIds:JSON.stringify(selectedRows)},function(res){
            let state = res.getState();
            if(state=="SUCCESS"){
                var toastEvent = $A.get("e.force:showToast");
                if(toastEvent){
                    toastEvent.setParams({
                        "type":"success",
                        "title": "Success!",
                        "message": "Campaign(s) added successfully."
                    });
                    toastEvent.fire();
                }
                else{                    
                    var tid = component.find('msgtheme');                                       
                    component.set("v.showErrors",false);
                    component.set("v.showSuccess",true);
                    component.set("v.errorMessage","Campaign(s) added successfully");
                    setTimeout(function(){
                        component.set("v.showSuccess",false);
                    }, 10000);
                }
                component.set("v.selectedRows",[]);
            }
            else{
                var toastEvent = $A.get("e.force:showToast");
                if(toastEvent){
                    toastEvent.setParams({
                        "type":"error",
                        "title": "Error!",
                        "message": "Failed to add campaigns.Please contact system Adminstrator."
                    });
                    toastEvent.fire();
                }
                else{                    
                    var errors = res.getError();
                    component.set("v.showSuccess",false);
                    component.set("v.showErrors",true);
                    component.set("v.errorMessage",errors[0].message);
                    setTimeout(function(){
                        component.set("v.showErrors",false);
                    }, 10000);
                }
            }
        });
    },
    updatedSelectedRows: function(component, event, helper){
        let selectedRows = event.getParam('selectedRows');
        component.set("v.selectedRows",selectedRows);
    },
    // function automatic called by aura:waiting event  
    showSpinner: function(component, event, helper) {
        // remove slds-hide class from mySpinner
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    // function automatic called by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
        // add slds-hide class from mySpinner    
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    }
})