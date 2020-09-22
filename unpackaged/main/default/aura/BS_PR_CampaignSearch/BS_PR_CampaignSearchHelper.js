({
    serverCall : function(component,serverMethod,paramsObj,callback) {
        component.set('v.loaded', false);
        let action = component.get("c."+serverMethod);
        if(paramsObj){
            action.setParams(paramsObj);
        }
        action.setCallback(this,function(response){
            component.set('v.loaded', true);
            callback.call(null,response);
        });
        $A.enqueueAction(action);
    },
    getRowActions: function (cmp, row, doneCallback) {
        var actions = [ {
            label: 'View',
            name:'View'
        }];
        
        // simulate a trip to the server
        setTimeout($A.getCallback(function () {
            doneCallback(actions);
        }), 200);
    },
    searchData:function(component, event, helper,searchKey){
        let recordId = component.get("v.recordId");
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
        });    
    },
    columnData:function(component, event, helper){
        var searchNameText = component.get('v.searchName');
        var searchTypeText = component.get('v.searchType');
        var searchBrandText = component.get('v.searchBrand');
        var searchTerritoryText = component.get('v.searchTerritory');
        var searchIOCodeText = component.get('v.searchIOCode');
        var searchGLCodeText = component.get('v.searchGLCode');
        var searchBalanceText = component.get('v.searchBalance');
        var searchErrmsg = '';
        var filterSeachData=component.get("v.data");
        component.set("v.recordsFiltered",false);
        component.set('v.filterData',filterSeachData);
        if(!$A.util.isEmpty(searchNameText)){                                    
            component.set("v.recordsFiltered",true);
            filterSeachData = filterSeachData.filter(rec =>(rec.Name.toLowerCase().includes(searchNameText.toLowerCase())));
        }
        if(!$A.util.isEmpty(searchTypeText)){                                    
            component.set("v.recordsFiltered",true);
            filterSeachData = filterSeachData.filter(rec =>(rec.CampaignType__c.toLowerCase().includes(searchTypeText.toLowerCase())));
        }
        if(!$A.util.isEmpty(searchBrandText)){                                    
            component.set("v.recordsFiltered",true);
            filterSeachData = filterSeachData.filter(rec =>(rec.Brand__c.toLowerCase().includes(searchBrandText.toLowerCase())));
        }
        if(!$A.util.isEmpty(searchTerritoryText)){                                    
            component.set("v.recordsFiltered",true);
            filterSeachData = filterSeachData.filter(rec =>(rec.Territory__c.toLowerCase().includes(searchTerritoryText.toLowerCase())));
        }
        if(!$A.util.isEmpty(searchIOCodeText)){                                    
            component.set("v.recordsFiltered",true);
            filterSeachData = filterSeachData.filter(rec =>(rec.IOCode__c.toLowerCase().includes(searchIOCodeText.toLowerCase())));
        }
        if(!$A.util.isEmpty(searchGLCodeText)){                                    
            component.set("v.recordsFiltered",true);
            filterSeachData = filterSeachData.filter(rec =>(rec.GLCode__c.toLowerCase().includes(searchGLCodeText.toLowerCase())));
        }
        if(!$A.util.isEmpty(searchBalanceText)){                                    
            component.set("v.recordsFiltered",true);
            filterSeachData = filterSeachData.filter(rec =>(rec.CampaignBalance__c.toString().toLowerCase().includes(searchBalanceText.toLowerCase())));
        }
        if(!$A.util.isEmpty(filterSeachData)){                                    
            component.set("v.searchData",filterSeachData);
            let fulldata=filterSeachData;
            let pagesize = parseInt(component.get("v.pagesize"))
            let recordCount = fulldata.length;
            let totalPages = Math.ceil(recordCount/pagesize);
            component.set("v.totalPages",totalPages);
            component.set("v.recordCount",recordCount);
            component.set("v.start",0);
            if(fulldata.length>=pagesize){
                component.set("v.end",pagesize);
            }
            else{
                component.set("v.end",fulldata.length);  
            }
            var startindex=component.get("v.start");
            var endindex=component.get("v.end");
            component.set("v.disablefirst",false);
            component.set("v.disableprev",false);
            component.set("v.disablelast",false);
            component.set("v.disablenext",false);
            
            if(startindex==0){
                component.set("v.disablefirst",true);
                component.set("v.disableprev",true);            
            } 
            if(fulldata.length==0){
                component.set("v.disablelast",true);
                component.set("v.disablenext",true);            
            }
            let filterData = fulldata.slice(startindex,endindex);
            component.set('v.filterData',filterData);
        }
    }
})