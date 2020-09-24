({
    setPicklistValues : function(component, event, helper)
    {
        helper.setPicklistValues(component);
    },

    selectedPicklistValue : function(component, event, helper)
    {
        let picklistValues = component.get("v.picklistValues");
        let picklistValue = component.get("v.picklistValue");
        let isValueInOriginalPicklist = false;

        if(picklistValue && picklistValues && (event.getParam("oldValue") == null || event.getParam("oldValue")[component.get("v.fieldApiName")]))
        {
            picklistValues.forEach(function(picklistVal)
            {
                if(picklistVal.value == picklistValue || picklistVal.label == picklistValue)
                {
                    isValueInOriginalPicklist = true;
                }
            });

            if(!isValueInOriginalPicklist)
            {
                picklistValues.push({label: picklistValue, value: picklistValue});
                component.set("v.picklistValues", picklistValues);
            }
        }
    },

    handleSelectedValue : function(component, event, helper)
    {
        let selectedValue = component.get("v.picklistValue");
        let fieldApiName = component.get("v.fieldApiName");
        let setEvent = component.getEvent("sendFieldValue");
        setEvent.setParam("context", fieldApiName + ',' + selectedValue);
        setEvent.fire();
    }
});