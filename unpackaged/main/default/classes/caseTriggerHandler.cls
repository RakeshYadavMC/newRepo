/**************************************************************************************
Apex Class Name     : caseTriggerHandler
Created Date        : 1/2016
Function            : Handles events from the caseTrigger trigger
*************************************************************************************/

public class caseTriggerHandler {
    
    /**************************************************************************************************************
    Method name:    handleAfterInsert
    Object:         Case
    Event:          after insert
    Date:           1/2016
    Details and Notes: Handles all after insert triggers
    ***************************************************************************************************************/
    public static void handleBeforeInsert(List<Case> cases) {
        CaseComplianceUtility.doBrandRegistrationBeforeInsert(cases);
        CaseComplianceUtility.setComplianceSubCaseStateType(cases);
        CaseComplianceUtility.setStateManagerEmailOnInsert(cases);
        caseServices.setCaseValues(cases);
        caseServices.setDefaultAccountForCSClaims(cases);
        /* Start of Below method call for setup the account and contact id for new created case for email/phone to case by saurabh */
        caseServices.setDefaultAccountForCSConsumer(cases);
        /* End of Below method call for setup the account and contact id for new created case for email/phone to case by Saurabh */
        /* Method call for adding address on CSConsumer created via console by Chirag START */
        caseServices.setDefaultAccountAddressForCSConsumer(cases);
        /* Method call for adding address on CSConsumer created via console by Chirag END */
        caseServices.calculateBusinessHoursAgesOnInsert(cases);
        caseServices.assignBusinessHoursToCase(cases);
        caseServices.addEntitlementToCase(cases);
        caseServices.addEntitlementToSingleBarrelCase(cases);
        caseServices.updateCaseSubmitterForSingleBarrelCases(cases);
        caseServices.updateRegionalDiplomat(cases);
        caseServices.updateTimeStampsForSingleBarrelTracker(cases, null);
        // caseServices.assignAccountToGbsCase(cases);
        caseServices.addEntitlementToGBSCase(cases);
        caseServices.assignGBSBusinessHoursToCase(cases, null);
        caseServices.addEntitlementToQualityClaimCase(cases);
        caseServices.addEntitlementToLogisticsCase(cases);
        caseServices.assignBusinessHoursToQualityClaimCase(cases);
        caseServices.AddingLotCode(cases);
        /*Below function calling added by Metacube on date 5 Jan 2020*/
        caseServices.setCasePriority(cases);
    }
    
    public static void handleBeforeUpdate(List<Case> cases, Map<Id, Case> oldCases) {
        if (caseServices.runTrigger) {
            caseServices.updateClonedCaseMilestoneOnCaseClosed(cases, oldCases);
            caseServices.updateGBSStatusOnOwnerChange(cases, oldCases);
            caseServices.completeGBSMilestones(cases, oldCases);
            /* Method call for adding address on CSConsumer created via console by Chirag START */
            caseServices.setDefaultAccountAddressForCSConsumer(cases);
            /* Method call for adding address on CSConsumer created via console by Chirag END */
            caseServices.updateBrandAllocationForSingleBarrel(cases, oldCases);
            caseServices.calculateBusinessHoursAgesOnUpdate(cases, oldCases);
            caseServices.updateNumTimesIn3rdParty(cases, oldCases);
            caseServices.syncSelfRegistrationOwnership(cases, oldCases);
            caseServices.addEntitlementToCase(cases);
            caseServices.assignBusinessHoursToCase(cases);
            caseServices.addEntitlementToSingleBarrelCase(cases);
            caseServices.moveSingleBarrelCaseStatus(cases);
            caseServices.markSingleBarrelMilestonesAsComplete(cases, oldCases);
            caseServices.updateRegionalDiplomat(cases);
            caseServices.updateBarrelExpectedShipDate(cases, oldCases);
            caseServices.tripHasBeenScheduled(cases, oldCases);
            caseServices.singleBarrelPurchaseOrderUploaded(cases, oldCases);
            //caseServices.emailInitialSAPNumberEntered(cases, oldCases); commented by ajeeta to test for barrel ready to enter
            caseServices.updateTimeStampsForSingleBarrelTracker(cases, oldCases);
            //caseServices.emailEskerPDFs(cases);
            caseServices.assignAccountToGbsCase(cases);
            caseServices.addEntitlementToGBSCase(cases);
            caseServices.checkForReOpenedGBSCase(cases, oldCases);
            caseServices.assignGBSBusinessHoursToCase(cases, oldCases);
            caseServices.caseSetStatusChangeWithSLA(cases, oldCases);  //SAL-135 Code added by Priyankar Saha

            caseServices.emailNonTechnicalResponseToParentCaseOwner(cases, oldCases);
            caseServices.emailQualityRecommendationToParentCaseOwner(cases, oldCases);
            caseServices.addEntitlementToQualityClaimCase(cases);
            caseServices.addEntitlementToLogisticsCase(cases);
            caseServices.setQualityClaimTimeStamp(cases, oldCases);
            caseServices.updateFlagsOnStatusChange(cases, oldCases);
            
        }
        if (CaseComplianceUtility.runCaseComplianceTriggerLogic) {
            CaseComplianceUtility.setFlagOnBrandRegistrationBeforeUpdate(cases, oldCases);
            CaseComplianceUtility.calculateNumberOfRegistrationsOnSubmission(cases, oldCases);
            CaseComplianceUtility.sendEmailsOnQuoteRequestApproval(cases, oldCases);
            CaseComplianceUtility.evaluateDiscountApprovalNeeded(cases, oldCases);
            CaseComplianceUtility.closePostingStateWithPostingDate(cases, oldCases);
            CaseComplianceUtility.moveStatustoWaitingForPosting(cases, oldCases);
        }
    }
    
    
    public static void handleAfterInsert(List<Case> cases, Map<Id, Case> newMap) { 
        caseServices.updateSingleBarrelParentCaseWithSubcase(cases);
    }
    
    public static void handleAfterUpdate(List<Case> cases, Map<Id, Case> oldCases) {
        if (caseServices.runTrigger) {
            caseServices.runTrigger = false;
            
            caseServices.emailInitialSAPNumberEntered(cases, oldCases);
            //below code added by ajeeta
            caseServices.updateSingleBarrelParentCaseWithSubcase(cases);
            //end
            //Start : below code added by Metacube to create & update quality claim subcase
            caseServices.createQualityClaimSubCase(cases, oldCases);
            caseServices.updateQualityClaimSubCase(cases, oldCases);
            //obsolete code, removed on 07/23/2020 by Arun Sharma 
            
            //End : above code added by Metacube to create & update quality claim subcase
            //caseServices.updateBrandAllocationForSingleBarrel(cases, oldCases);
            caseServices.checkRequiredFieldsOnChildForClosingParentCase(cases, oldCases);
            caseServices.setChildCasesToBePickedUpByAssignmentRules(cases, oldCases);
            caseServices.setChildCaseToExpeditedOrderClaim(cases, oldCases);
            caseServices.updateParentCase(cases, oldCases);
            caseServices.updateCaseTypeAndReassign(cases, oldCases);
            caseServices.removeAbandonedCases(cases, oldCases);
            caseServices.checkIfCaseWasReopened(cases, oldCases);
            caseServices.markPreparePlantMilestoneAsCompleted(cases, oldCases);
            caseServices.removeSLAFromCase(cases, oldCases);
            caseServices.updateReOpenedMilestones(cases, oldCases);
        }
      
        if (CaseComplianceUtility.runCaseComplianceTriggerLogic) {
            CaseComplianceUtility.runCaseComplianceTriggerLogic = false;
            
            //CaseComplianceUtility.sendEmailsOnQuoteRequestSubmission(cases, oldCases);
            CaseComplianceUtility.doComplianceKickoff(cases, oldCases);
            CaseComplianceUtility.kickoffCustomerdata(cases, oldCases);
            CaseComplianceUtility.doAllChildCasesClosed(cases, oldCases);
            CaseComplianceUtility.sendEmailOnInFieldDateChanged(cases, oldCases);
            CaseComplianceUtility.sendEmailOnDueDateChanged(cases, oldCases);
        }
        
        GBS_CaseAssignedSendEmail.parseEmails(cases, oldCases);
        
        EntitlementsServices.completeMilestoneOnCaseClose(cases, oldCases);
    }
}