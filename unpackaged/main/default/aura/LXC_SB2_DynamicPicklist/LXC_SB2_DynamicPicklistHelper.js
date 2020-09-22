({
    setPicklistValues: function (component)
    {
        let showDefaultOption = component.get("v.showDefaultOption");
        let currentPicklistValue = component.get("v.picklistValue");
        let showNoneOption = component.get("v.showNoneOption");
        let action = component.get("c.getPicklistOptions");
        action.setParams(
        {
            objectName: component.get("v.objectApiName"),
            field: component.get("v.fieldApiName"),
        });
        var opts = [];
        action.setCallback(this, function (response)
        {
            let state = response.getState();
            if(state === "SUCCESS")
            {
                var allValues = response.getReturnValue();
                for (var i = 0; i < allValues.length; i++) {
                    if(allValues[i].includes('-')){
                        opts.push({
                        class: "optionClass",
                        label: allValues[i].split('-')[1],
                        value: allValues[i].split('-')[0]
                    });
                    } else{
                        opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                    }
                }
                component.set("v.picklistValues", opts);
            }
            else if(state === "ERROR")
            {
                let errors = response.getError();
                if(errors)
                {
                    if(errors[0] && errors[0].message)
                    {
                        alert("Error message: " +
                            errors[0].message);
                    }
                }
                else
                {
                    alert("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
});