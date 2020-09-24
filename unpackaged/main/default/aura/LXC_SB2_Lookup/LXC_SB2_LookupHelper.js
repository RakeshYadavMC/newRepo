({
    idIndexMap: {},
    cachedSearches: {},
    MAX_RETURNABLE: 1001,
    getFieldLabel: function(component) {
        var action = component.get("c.getFieldLabel");
       // action.setStorable();
        action.setParams({
            sObjectName: component.get('v.sObjectName'),
            lookupField: component.get('v.lookupField')
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.fieldLabel', response.getReturnValue());
            } else if (state === "ERROR") {
                
                this.processErrors(component, response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    search: function (component, searchString) {
        let searchParams = {
            referenceField : component.get('v.referenceField'),
            referenceSubField : component.get('v.referenceSubField'),
            sObjectName : component.get('v.sObjectName'),
            lookupField : component.get('v.lookupField'),
            searchString : searchString,
            fieldNamesToSearch : component.get('v.fieldNamesToSearch'),
            searchFromMultipleFields : component.get('v.searchFromMultipleFields')
        };
        
        var key = searchParams.sObjectName + searchParams.lookupField + searchParams.referenceField + searchParams.referenceSubField;
        key += this.hashString(component.get('v.filters'));
        var keyWithSearch = key + searchParams.searchString;
        if (typeof this.cachedSearches[keyWithSearch] != 'undefined') {
            component.set('v.recordList', this.cachedSearches[keyWithSearch]);
            component.set('v.isLoading', false);
        } else if (typeof this.cachedSearches[key + 'null'] != 'undefined' && this.cachedSearches[key + 'null'].length < this.MAX_RETURNABLE) {
            this.searchLocal(component, searchParams, this.cachedSearches[key + 'null'], keyWithSearch);
        } else {
            this.searchServer(component, searchParams, keyWithSearch);
        }
    },
    searchLocal: function(component, searchParams, cachedSearch, keyWithSearch) {
        var helper = this;
        window.setTimeout($A.getCallback(function () {
            let recordList = [];
            cachedSearch.forEach(function(record) {
                if (typeof record['referenceField'] != 'undefined'
                    && (~record['referenceField'].toLowerCase().indexOf(searchParams.searchString.toLowerCase())
                    || (record['referenceSubField'] && ~record['referenceSubField'].toLowerCase().indexOf(searchParams.searchString.toLowerCase())))
                ) {
                    recordList.push(helper.processRecord(record, searchParams));
                }
            });
            if(recordList.length == 0){
                helper.searchServer(component, searchParams, keyWithSearch);
            }
            else {
                component.set('v.recordList', recordList);
                component.set('v.isLoading', false);
            }
        }), 50, this);
    },
    searchServer: function(component, searchParams, key) {
        var action = component.get("c.getRecords");
        searchParams['filters'] = JSON.stringify(component.get('v.filters'));
        action.setParams(searchParams);
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let recordList = [];
                let results = response.getReturnValue();
                results.forEach(function (record) {
                    recordList.push(this.processRecord(record, searchParams));
                }, this);
                this.cachedSearches[key] = recordList;
                component.set('v.recordList', recordList);
                component.set('v.isLoading', false);
            } else if (state === "ERROR") {
                this.processErrors(component, response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    processRecord: function(record, searchParams) {
        let recordObject = {
            Id: record['Id'],
            data: record,
            referenceField: typeof record.referenceField != 'undefined' ? record.referenceField : this.getRecordValue(record, searchParams.referenceField, searchParams.searchFromMultipleFields),
        };
        if (searchParams.referenceSubField != null) {
            if (typeof record.referenceSubField != 'undefined') {
                recordObject.referenceSubField = record.referenceSubField;
            } else {
                recordObject.referenceSubField = this.getRecordValue(record, searchParams.referenceSubField, searchParams.searchFromMultipleFields);
            }
        }
        this.idIndexMap[record['Id']] = recordObject;
        return recordObject;
    },
    getRecordValue: function(record, fieldPath, searchFromMultipleFields) {
        if (typeof fieldPath == 'undefined') {
            return;
        }
        let reference = record, value;
        if (searchFromMultipleFields && (typeof record.AccountNumber != 'undefined' || typeof record.Name != 'undefined')) {
            return record.Name + (record.AccountNumber == undefined ? '' : ' (' + record.AccountNumber + ')');
        }
        if (fieldPath.toLowerCase() == 'name' && (typeof record.FirstName != 'undefined' || typeof record.LastName != 'undefined')) {
            if(typeof record.FirstName == 'undefined'){
                return record.LastName;
            }
            if (typeof record.LastName == 'undefined'){
                return record.FirstName;
            }
            return record.FirstName + ' ' + record.LastName;
        }
        fieldPath.split('\.').forEach(function(field) {
            value = reference[field];
            reference = value;
        });
        return value;
    },
    fetchRecordById: function(component) {
        let referenceField = component.get('v.referenceField');
        let referenceSubField = component.get('v.referenceSubField');
        var action = component.get("c.getRecordById");
        action.setParams({
            sObjectName: component.get('v.sObjectName'),
            lookupField: component.get('v.lookupField'),
            referenceField: referenceField,
            referenceSubField: referenceSubField,
            fieldNamesToSearch: component.get('v.fieldNamesToSearch'),
            recordId: component.get('v.value')
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let record = response.getReturnValue();
                if(record) {
                    component.set('v.selectedValue', {
                        Id: record['Id'],
                        referenceField: this.getRecordValue(record, referenceField, false),
                        referenceSubField: this.getRecordValue(record, referenceSubField, false),
                        data: record
                    });
                }
                component.set('v.isLoading', false);
            } else if (state === "ERROR") {
                this.processErrors(component, response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    hashString: function(s) {
        if (s == null || typeof s == 'undefined' || s == '') {
            return 0;
        }
        return JSON.stringify(s).split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    },
    processErrors: function (component, errors) {
        var currentErrors = component.get('v.errors');
        if (currentErrors == null) {
            currentErrors = [];
        }
        errors = [].concat(errors);
        errors.forEach(function (err) {
            currentErrors.push(err);
        });
        component.set('v.errors', currentErrors);
    }
})