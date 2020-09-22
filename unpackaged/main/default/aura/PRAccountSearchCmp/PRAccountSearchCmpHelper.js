({
    init: function(component, event, helper) {
        console.log("Child Component Called:::");
        helper.showSpinner(component, event, helper);
        helper.setDataTableColumns(component, event, helper);
        helper.hideSpinner(component, event, helper);
    },
    showSpinner: function(component, event, helper) {
        console.log("Show Spinner Component Called:::");
        var spinner = component.find("loadingSpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner: function(component, event, helper) {
        console.log("Hide Spinner Component Called:::");
        var spinner = component.find("loadingSpinner");
        $A.util.addClass(spinner, "slds-hide");
    },  
    showToast: function(message, title, type, mode) {
        var toastEvent = $A.get("e.force:showToast");
        
        if (this.isNullOrEmpty(toastEvent)) {
            //alert(message);
        } else {
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type,
                "mode": mode || "dismissible"
            });
            toastEvent.fire();
        }
    },
    setDataTableColumns: function(component, event, helper) {
        console.log('Table Method Called---');
        component.set('v.columns', [{
            label: '',
            type: 'button-icon',
            initialWidth: 50,
            typeAttributes: {
                label: 'Select',
                iconName: 'utility:add',
                variant: 'brand',
                name: 'select_account',
                title: 'Select Account'
            }
        }, {
            label: 'Name',
            fieldName: 'Name',
            type: 'text',
            sortable: true
            
        }, {
            label: 'SAP DBA',
            fieldName: 'SAP_DBA__c',
            type: 'text',
            sortable: true
            
        },{
            label: 'Sap Vendor Id',
            fieldName: 'SAP_Vendor_ID__c',
            type: 'text',
            sortable: true
        }
                                    ,{
                                        label: 'Street',
                                        fieldName: 'BillingStreet',
                                        type: 'text',
                                        sortable: true
                                    },{
                                        label: 'City',
                                        fieldName: 'BillingCity',
                                        type: 'text',
                                        sortable: true
                                    },{
                                        label: 'State',
                                        fieldName: 'BillingState',
                                        type: 'text',
                                        sortable: true
                                    },{
                                        label: 'Country',
                                        fieldName: 'BillingCountry',
                                        type: 'text',
                                        sortable: true
                                    },{
                                        label: 'Zip Code',
                                        fieldName: 'BillingPostalCode',
                                        type: 'text',
                                        sortable: true
                                    }
                                   ]);
        console.log('Column Value:::',component.get('v.columns'));
    },
    clearFilterValues: function(component, event, helper) {
        var fieldApiMap = component.get('v.fieldApiMap');
        var apiNames = Object.keys(fieldApiMap);
        for (var i in apiNames) {
            var apiName = apiNames[i];
            component.set('v.' + fieldApiMap[apiName], '');
        }
    },
    clearSearchResults: function(component, event, helper) {
        component.set('v.filteredData', null);
        component.set('v.data', null);
    },
    
    search: function(component, event, helper) {
        component.set('v.resultFlag', false);
        var isInputValid = helper.isInputValid(component, event, helper);
        console.log('Returned Input Valid:::',isInputValid);
        var helper = this;
        if(isInputValid){
            helper.showSpinner(component, event, helper);
            helper.buildSOQLQuery(component, event, helper);
            var getRecordsPromise = helper.getRecords(component, event, helper);
            getRecordsPromise.then(
                $A.getCallback(function(result) {
                    if (result.length == 0) {
                        helper.showToast('No Results Found', 'Please Modify Your Search Query', 'info');
                        component.set('v.data', {});
                        component.set('v.filteredData', {});
                        helper.hideSpinner(component, event, helper);
                        component.set('v.resultFlag', true);
                    } else {
                        component.set('v.data', result);
                        component.set('v.filteredData', result);
                        helper.hideSpinner(component, event, helper);
                        component.set('v.resultFlag', false);
                    }
                })
            ).catch(
                function(error) {
                    var errorDetail;
                    if (error.hasOwnProperty('message')) {
                        errorDetail = error.message;
                    } else {
                        errorDetail = error;
                    }
                    console.log('Error ', error);
                    console.log('Error Message ', errorDetail);
                    helper.showToast(errorDetail, 'Error', 'error', 'sticky');
                }
            ).finally(
                function() {
                    helper.hideSpinner(component, event, helper);
                }
            )
            
            
        }
        
    },
    
    isInputValid: function(component, event, helper, fieldType) {
        var fieldApiMap = component.get('v.fieldApiMap');
        var apiNames = Object.keys(fieldApiMap);
        var isValid = false;
        
        for (var i in apiNames) {
            console.log('Inside:::');
            var apiName = apiNames[i];
            var fieldVal = component.get('v.' + fieldApiMap[apiName]);
            
            if (!helper.isNullOrEmpty(fieldVal)) {
                isValid = true;
                break;
            }
        }
        console.log('Value1:::',isValid);
        return isValid;
    },
    buildSOQLQuery: function(component, event, helper) {
        var searchTerm = helper.setSOQLQueryString(component, event, helper);
        var recordType = 'Vendor';
        var query = "SELECT Id" +
            ",Name" +
            ",SAP_DBA__c,SAP_Vendor_ID__c,SAP_Vendor_Status__c,BillingCity,BillingStreet,BillingState,BillingCountry,BillingPostalCode FROM Account Where (" + searchTerm + ") AND " + "RecordType.DeveloperName = 'Vendor' AND RecordType.Description = 'Vendor Accounts' " + " LIMIT 1000";
        
        console.log(query);
        
        component.set('v.searchQueryString', query);
        return searchTerm;
    },
    setSOQLQueryString: function(component, event, helper) {
        var fieldApiMap = component.get('v.fieldApiMap');
        var apiNames = Object.keys(fieldApiMap);
        var queryString = '';
        console.log('fieldApiMap::',fieldApiMap);
        console.log('apiNames::',apiNames);
        
        for (var i in apiNames) {
            var apiName = apiNames[i];
            var fieldVal = component.get('v.' + fieldApiMap[apiName]);
            fieldVal = fieldVal.replace("'", "\\\'");
            console.log('fieldVal::',fieldVal);
            if (!helper.isNullOrEmpty(fieldVal)) {
                var fieldQuery;
                if (queryString.length >= 1) {
                    console.log('inside if::queryString');  
                    queryString += ' OR ';
                    fieldQuery = apiName + ' LIKE ' + '\'' +'%'+ fieldVal.trim().replace(/\*/g).toLowerCase() + '%' + '\'';
                    queryString += fieldQuery;
                    console.log('inside if::queryString',queryString);  
                } else {
                    fieldQuery = apiName + ' LIKE ' + '\'' +'%'+ fieldVal.trim().replace(/\*/g).toLowerCase() + '%' + '\'';
                    queryString += fieldQuery;
                }
            }
            console.log('inside for::queryString',queryString);
        }
        console.log('end if::queryString',queryString);
        return queryString;
    },
    
    isNullOrEmpty: function(data) {
        if (data == '' || data == null || data == undefined) {
            return true;
        }
        return false;
    },
    
    getRecords: function(component, event, helper) {
        var action = component.get("c.searchForRecordsSOQL");
        
        action.setParams({
            "searchQuery": component.get('v.searchQueryString')
        });
        
        return helper.callAction(component, action);
    },
    
    callAction: function(component,action,helper){
        return new Promise(function(resolve, reject) {
            action.setCallback(this, function(response) {
                var state = response.getState();
                var retVal = response.getReturnValue();
                if (state === "SUCCESS") {
                    console.log('Results from Apex: ', retVal);
                    
                    // check for error from Apex Class
                    if (retVal.hasOwnProperty('success')) {
                        if (!retVal['success']) {
                            reject("Error message: " + retVal['message']);
                        }
                    }
                    resolve(retVal);
                    
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            reject("Error message: " + errors[0].message);
                        }
                    } else {
                        reject("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        });
    },
    
    filterCurrentListOfRecords: function(component, event, helper) {
        var data = component.get('v.data');
        var records;
        var filteredRecordAttribute;
        var searchTerm = component.get('v.searchTerm');
        searchTerm = searchTerm.trim().replace(/\*/g).toLowerCase();
        var filteredRecords = [];
        //var selectedTab = component.get('v.selectedTab');
        var recordAttribute;
        var numOfRecords;
        console.log('search term ', searchTerm);
        console.log('data:::', data);
        helper.showLoadingIcon(component, event, helper);
        helper.showSpinner(component, event, helper);
        if (!helper.isSearchInputValid(component, event, helper)) {
            helper.hideSpinner(component, event, helper);
            return;
        }
        
        // Cancel previous timeout if any
        var searchTimeout = component.get('v.searchTimeout');
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // find active tab
        /*if (selectedTab == 'My Recent Accounts') {
            recordAttribute = 'recentRecords';
            filteredRecordAttribute = 'filteredRecentRecords';
        } else if (selectedTab == 'All Accounts') {
            recordAttribute = 'data';
            filteredRecordAttribute = 'filteredData';
        }*/
        recordAttribute = 'data';
        console.log('recordAttribute',recordAttribute);
        filteredRecordAttribute = 'filteredData';
        console.log('filteredRecordAttribute',filteredRecordAttribute);
        records = component.get('v.' + filteredRecordAttribute);
        numOfRecords = records.length;
        console.log('records',records);
        console.log('numOfRecords',numOfRecords);
        // if searchTerm is blank then pull in previously queried records
        if (searchTerm == '' || searchTerm == null || searchTerm.length < 2) {
            component.set('v.searchTimeout', null);
            component.set('v.' + filteredRecordAttribute, records);
            helper.hideSpinner(component, event, helper);
            return;
        }
        // Set new timeout
        searchTimeout = window.setTimeout(
            $A.getCallback(() => {
                // filter recent records
                console.log('In Set Timeout');
                console.time('search time');
                
                for (var i = 0; i < numOfRecords; i++) {
                
                var name;
                var sapDBA;
                var sapVendor;
                var street;
                var city;
                var state;
                var country;
                var zipcode;
 
                if (records[i].Name == null || records[i].Name == undefined){
                name ='';
                }else{
                    name = records[i].Name;
                } 
                
                if(records[i].SAP_DBA__c == null || records[i].SAP_DBA__c == undefined){
                sapDBA = '';
                }else{
                    sapDBA = records[i].SAP_DBA__c;
                }
                
                if(records[i].SAP_Vendor_ID__c == null || records[i].SAP_Vendor_ID__c == undefined){
                sapVendor = '';
                }else{
                    sapVendor = records[i].SAP_Vendor_ID__c;
                }
                
                if(records[i].BillingStreet == null || records[i].BillingStreet == undefined){
                street = '';
                }else{
                    street = records[i].BillingStreet;
                }
                
                if(records[i].BillingCity == null || records[i].BillingCity == undefined){
                city ='';
                }else{
                    city = records[i].BillingCity;
                }
                
                if(records[i].BillingState == null || records[i].BillingState == undefined){
                state ='';
                }else{
                    state = records[i].BillingState;
                }
                
				if(records[i].BillingCountry == null || records[i].BillingCountry == undefined){
                country ='';
                }else{
                    country = records[i].BillingCountry;
                }

				if(records[i].BillingPostalCode == null || records[i].BillingPostalCode == undefined){
                zipcode = [];
                }else{
                    zipcode = records[i].BillingPostalCode;
                }
                
                var lowerCaseVal = name.trim().replace(/\*/g).toLowerCase();
                var lowerCasesapDBAVal = sapDBA.trim().replace(/\*/g).toLowerCase();
                var lowerCasesapVendorVal = sapVendor.trim().replace(/\*/g).toLowerCase();
                var lowerCaseStreetVal = street.trim().replace(/\*/g).toLowerCase();
                var lowerCaseCityVal = city.trim().replace(/\*/g).toLowerCase();
            	var lowerCaseStateVal = state.trim().replace(/\*/g).toLowerCase();
                var lowerCaseCountryVal = country.trim().replace(/\*/g).toLowerCase();
                
                if (lowerCaseVal.indexOf(searchTerm) !== -1){
                filteredRecords.push(records[i]);
                continue;
            	}
                
                if (lowerCasesapDBAVal.indexOf(searchTerm) !== -1){
                filteredRecords.push(records[i]);
                continue;
            	}
                
                if (lowerCasesapVendorVal.indexOf(searchTerm) !== -1){
                filteredRecords.push(records[i]);
                continue;
            	}
                
                if (lowerCaseStreetVal.indexOf(searchTerm) !== -1){
                    filteredRecords.push(records[i]);
                    continue;
                }
                
                if (lowerCaseCityVal.indexOf(searchTerm) !== -1){
                    filteredRecords.push(records[i]);
                    continue;
                }
                
            
                if (lowerCaseStateVal.indexOf(searchTerm) !== -1){
                    filteredRecords.push(records[i]);
                    continue;
                } 
                
                if (lowerCaseCountryVal.indexOf(searchTerm) !== -1){
                filteredRecords.push(records[i]);
                continue;
            	}
                
                if (zipcode.indexOf(searchTerm) !== -1){
                filteredRecords.push(records[i]);
                continue;
            	}
            }
                
                console.log('filteredRecords are::',filteredRecords);
                component.set('v.' + filteredRecordAttribute, filteredRecords);
                console.timeEnd('search time');
                
                helper.hideSpinner(component, event, helper);
                // Clear timeout
                component.set('v.searchTimeout', null);
            }),
                500 // Wait for 500 ms before sending search request
                );
                component.set('v.searchTimeout', searchTimeout);
            },
                
                isSearchInputValid: function(component, event, helper) {
                    var searchCmp = component.find('enter_search');
                    var isValid = true;
                    if (searchCmp) {
                        searchCmp.showHelpMessageIfInvalid();
                        isValid = searchCmp.get('v.validity').valid;
                    }
                    
                    return isValid;
                },
                showLoadingIcon: function(component, event, helper) {
                    component.set('v.isSearching', true);
                },
                
            })