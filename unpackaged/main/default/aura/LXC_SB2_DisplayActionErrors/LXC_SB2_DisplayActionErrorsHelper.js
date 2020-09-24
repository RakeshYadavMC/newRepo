({
    processErrors: function(component) {
        var passedInErrors = component.get('v.passedInErrors');
        if (passedInErrors == null) {
            return;
        }
        passedInErrors.forEach(function(errors) {
            if (errors) {
                var errorWritten = false;
                if (errors.message) {
                    if (errors.message.length > 600) {
                        errors.message = errors.message.substring(0, 600) + '...';
                    }
                    errorWritten = true;
                    this.buildErrorMessage(component, errors.message);
                }

                if (errors.pageErrors) {
                    errors.pageErrors.forEach(function(pageError) {
                        errorWritten = true;
                        this.buildErrorMessage(component, pageError.message);
                    }, this);
                }

                if (errors.fieldErrors) {
                    for (var field in errors.fieldErrors) {
                        if (!errors.fieldErrors.hasOwnProperty(field)) {
                            continue;
                        }
                        errors.fieldErrors[field].forEach(function (fieldError) {
                            this.buildErrorMessage(component, '[' + fieldError.statusCode + '] ' + fieldError.message);
                            errorWritten = true;
                        }, this);
                    }
                }

                if (!errorWritten) {
                    this.buildErrorMessage(component, 'Unknown Error');
                }
            } else {
                this.buildErrorMessage(component, 'Unknown Error');
            }
        }, this);
        component.set('v.passedInErrors', null);
    },
    buildErrorMessage: function(component, message) {
        $A.createComponents([
            ["ui:message", {
                "title": $A.get('$Label.c.Error'),
                "severity": "error",
                "closable": true
            }],
            ["ui:outputText", {
                "value": message
            }]],
            function(components, status, errorMessage) {
                if (status === "SUCCESS") {
                    var message = components[0];
                    var outputText = components[1];
                    message.set("v.body", outputText);
                    var body = component.get("v.errors");
                    body.push(message);
                    component.set("v.errors", body);
                }
            }
        );
    }
})