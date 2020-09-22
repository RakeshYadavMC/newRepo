/**************************************************************************************
Apex Class Name     : caseTrigger
Created Date        : 1/2016
Function            : calls method in caseTriggerHandler
*************************************************************************************/

trigger caseTrigger on Case(before insert, after insert, before update, after update) {
    System.debug('TRIGGER OPERATION TYPE >>>>>>>>> ' + Trigger.operationType);
    /*Below for loop added to avoid or not execute the trigger for Dummy case creation*/
    List<Case> newCases = new List<Case>();
    for(Case caseObj : Trigger.New) {
        if(caseObj.RecordTypeId != CSConstants.DUMMY_CASE_RT_ID) {
            newCases.add(caseObj);
        }
    }
    if (Trigger.isBefore) {
        if (Trigger.isInsert) { 
            caseTriggerHandler.handleBeforeInsert(newCases);
        } else if (Trigger.isUpdate) {
            caseTriggerHandler.handleBeforeUpdate(newCases, Trigger.oldMap);
        }  
    } else if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            /*Below line is commented due to stop to creating the sub case when parent case created*/
            //caseTriggerHandler.handleAfterInsert(Trigger.New, Trigger.newMap);
             caseTriggerHandler.handleAfterInsert(newCases,Trigger.NewMap);
            List <Case> cases = new List <Case> ();
            for (Case c: newCases) {
                cases.add(new Case(id = c.id));
            }
            Database.DMLOptions dmo = new Database.DMLOptions();
            dmo.assignmentRuleHeader.useDefaultRule = true;
            Database.update(cases, dmo);
        } else if (Trigger.isUpdate) {
            caseTriggerHandler.handleAfterUpdate(newCases, Trigger.oldMap);
        }       
    }
}