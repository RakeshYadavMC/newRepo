({
    init: function(component, event, helper) {
        //helper.init(component, event, helper);
        //alert('hello');
        component.set('v.bottleLabelImage', $A.get('$Resource.makersMarkBottleLabel'));
        
    },
    handleRemoveLabel: function(component, event, helper) {
        var splitLabelCount = component.get('v.splitLabelCount');
        component.set('v.splitLabelCount', splitLabelCount - 1);
        
        var numberOfLabels = component.get('v.numberOfLabels');
        var labelId = component.get('v.labelId');
        
        helper.firePassValueFieldEvent(component, event, helper, 'quantity', numberOfLabels, labelId, 'delete');
        
        component.destroy();
    },
    addQuantityToMap: function(component, event, helper) {
        var numberOfLabels = component.get('v.numberOfLabels');
        var labelId = component.get('v.labelId');
        
        helper.firePassValueFieldEvent(component, event, helper, 'quantity', numberOfLabels, labelId, 'update');
    },
    addTextToMap: function(component, event, helper) {
        //alert('=====addTextToMap');
        var labelText = component.get('v.labelText');
        var labelId = component.get('v.labelId');
        
        helper.firePassValueFieldEvent(component, event, helper, 'text', labelText, labelId, 'update');
    },
    addCityStatetoMap: function(component, event, helper){
                //alert('=====addCityStatetoMap');

        var CityStatelabelText = component.get('v.citystateText');
        var labelId = component.get('v.labelId');
        helper.firePassValueFieldEvent(component, event, helper, 'citystatetext', CityStatelabelText, labelId, 'INSERT');
    },
    handleInputChange: function(component, event, helper) {
        var brandLabel;
        var outputLabel;
        var brand = component.get('v.currentBrand');
        if (brand == 'Knob Creek') {
            outputLabel = component.find('knob_creek_label');
        } else if (brand == 'Makers Mark') {
            outputLabel = component.find('makers_mark_label');
        }
        var bottleLabel = component.find('bottle-plate-label');
        var bottlecitystateLabel = component.find('bottle-plate-citystate-label');
        var bottleLabelVal = bottleLabel.get('v.value');
        var bottlecitystateLabelVal = bottlecitystateLabel.get('v.value');
        var labelText = component.get('v.labelText');
        var CityStatelabelText = component.get('v.citystateText');
        var characterLimit = component.get('v.characterLimit');
        var remainingCharacters = characterLimit - bottleLabelVal.length;
        var remainingcharacterscitystate = characterLimit = bottlecitystateLabelVal.length;
        
        var outputLabelText = outputLabel.getElement().clientWidth;
        var currentHeight = outputLabel.getElement().clientHeight;
        var previousHeight = component.get('v.previousHeight');
        var mediumFont = component.get('v.mediumFont');
        var textBeforeHeightChange = component.get('v.textBeforeHeightChange');
        var textBeforeHeightChangeLength = component.get('v.textBeforeHeightChangeLength');
        console.log('===================='+remainingCharacters);
        console.log('=================ctyy==='+remainingcharacterscitystate);
        component.set('v.remainingCharacters', remainingCharacters);
        component.set('v.remainingCharacterscitystate',remainingcharacterscitystate);
        console.log('currentHeight ', currentHeight);
        console.log('previousHeight ', previousHeight);
        console.log('textBeforeHeightChange ', textBeforeHeightChange);
        console.log('textBeforeHeightChangeLength ', textBeforeHeightChangeLength);
        console.log('labelText.length ', labelText.length);
        console.log('-------------');
        
        // if height changes then store that value until that value is reached again
        if ((textBeforeHeightChange == undefined || textBeforeHeightChange == null) && labelText.length > 1) {
            if (previousHeight < currentHeight && previousHeight != 0) {
                component.set('v.textBeforeHeightChange', labelText);
                component.set('v.textBeforeHeightChangeLength', labelText.length);
                $A.util.addClass(outputLabel, 'medium-font');
                $A.util.removeClass(outputLabel, 'standard-font');
            }
        } else if (textBeforeHeightChange != undefined && textBeforeHeightChange != null && textBeforeHeightChange != '' && labelText.length > 1) {
            if (labelText.length == textBeforeHeightChangeLength - 1) {
                component.set('v.textBeforeHeightChange', null);
                component.set('v.textBeforeHeightChangeLength', 0);
            } else if (labelText.length == textBeforeHeightChangeLength) {
                $A.util.removeClass(outputLabel, 'medium-font');
                $A.util.addClass(outputLabel, 'standard-font');
            }
        }
        component.set('v.previousHeight', currentHeight);
    },
    //Added for City and State Functionality
    includeCityandStateToggLabels: function(component, event, helper) {
        
        var includeCityandState = component.get('v.includeCityandState');
        if (includeCityandState == 'No') {
            component.set('v.ToggleCityState',true);
            component.set('v.citystateText','');
        }
        else{
            component.set('v.ToggleCityState',false);
        }
        
    },
})