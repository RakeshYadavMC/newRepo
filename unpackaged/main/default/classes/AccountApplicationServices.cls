public class AccountApplicationServices {

    /**************************************************************************************************************
    Author:        Craig Austgen
    Company:       Slalom, LLC
    Description:   Once an application for the Single Barrel Program has been approved a case will be
                    created and attached to the Application, this will allow the end user to continue their
                    barrel order from the Salesforce community
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/2018      Craig Austgen       Initial Creation

    ***************************************************************************************************************/
    public static void createCaseOnApplicationApproval(List<Account_Application__c> applications, Map<Id, Account_Application__c> oldApps ) {
        List<Case> casesToInsert = new List<Case>();
        Map<Id, Case> applicationToCase = new Map<Id, Case>();
        //List<Account_Application__c> approvedApplications = new List<Account_Application__c>();
        List<Barrel_Order_Group__c> groupsToInsert = new List<Barrel_Order_Group__c>();
        List<Barrel__c> barrelsToInsert = new List<Barrel__c>();

        for (Account_Application__c app : applications) {
            Account_Application__c oldApp = oldApps.get(app.Id);

            if (oldApp.Status__c != 'Approved' && app.Status__c == 'Approved') {
                if (app.Case__c == null) {
                    Case c = new Case();
                    c.Retail_Account_Name__c = app.Account_Name__c;
                    c.Account_Missing__c = app.Account_Missing__c;
                    c.Premise__c = app.Premise_Type__c;
                    c.State__c = app.State__c;
                    c.Brand__c = app.Brand__c;
                    c.RecordTypeId = SBP_Constants.caseBrandsRTIdMap.get(app.Brand__c);
                    c.Retail_Account__c = app.Account__c;
                    c.Submitter__c = app.Submitter__c;
                    c.AccountId = app.Distributor_Account__c;
                    c.National_Account_Flag__c = app.National_Account_Flag__c;
                    c.ContactId = app.Distributor_Contact__c;
                    c.Origin = 'Customer Portal';
                    casesToInsert.add(c);
                    applicationToCase.put(app.Id, c);

                    Barrel_Order_Group__c bg = new Barrel_Order_Group__c();
                    groupsToInsert.add(bg);
                }
            }
        }

        // create the barrel order group for the new cases
        if (!groupsToInsert.isEmpty()) {
            insert groupsToInsert;
        }

        // assign the barrel order group to the cases
        for (Integer i = 0; i < groupsToInsert.size(); i++) {
            casesToInsert[i].Barrel_Order_Group__c = groupsToInsert[i].Id;
        }

        if (!casesToInsert.isEmpty()) {
            insert casesToInsert;
            
        }

        // create one barrel per case created
        for (Case c : casesToInsert) {
            Barrel__c barrel = new Barrel__c();
            barrel.Case__c = c.Id;
            barrel.Brand__c = c.Brand__c; // Added by Sripal 04/22/2020
            barrel.RecordTypeId = SBP_Constants.fullBarrelBrandRTIdMap.get(c.Brand__c);
            barrelsToInsert.add(barrel);
        }

        if (!barrelsToInsert.isEmpty()) {
            insert barrelsToInsert;
        }


        for (Account_Application__c app : applications) {
            if (applicationToCase.containsKey(app.Id)) {
                app.Case__c = applicationToCase.get(app.Id).Id;
                //approvedApplications.add(app);
            }
        }
        //accountApplicationApprovedEmail(approvedApplications);
    }

    /**************************************************************************************************************
    Author:        Craig Austgen
    Company:       Slalom, LLC
    Description:    For Makers Mark if a regional diplomat exists for the applications state then that regional diplomat will
                    be assigned to the application and receive an email to approve the application

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/2018      Craig Austgen       Initial Creation

    ***************************************************************************************************************/
    public static void updateRegionalDiplomat(List<Account_Application__c> applications) {
        System.debug('---Apex Class Called---'+applications);
        Set<Id> accountIds = new Set<Id>();
        List<String> accountStates = new List<String>();
        Map<Id, Account> accountMap = new Map<Id, Account>();
        Map<String, User> stateToUserMap = new Map<String, User>();
        Map<String, User> stateToRegionalDiplomat = new Map<String, User>();
        String accountStatesString;

        for (Account_Application__c app : applications) {
            if (app.Regional_Diplomat__c == null && ((app.Brand__c == 'Makers Mark')||(app.Brand__c == 'El Tesoro'))){ //Added condition for El Tesoro
                // if there is no account found in salesforce then the Account Name field will be populated
                // will need to add missing account's state to list
                if (app.Account__c != null && String.isBlank(app.Account_Name__c)) {
                    accountIds.add(app.Account__c);
                } else if (String.isNotBlank(app.Account_Name__c) && String.isNotBlank(app.State__c)) {
                    accountStates.add(app.State__c);
                }
            }
        }
        System.debug('---1.accountIds---'+accountIds); //Priyankar
        System.debug('---1.accountStates---'+accountStates); //Priyankar
        for (Account acc : [select id, BillingState, State__c from Account where Id IN :accountIds]) {
            if (String.isNotBlank(acc.BillingState)) {
                accountMap.put(acc.Id, acc);
                accountStates.add(SBP_Constants.stateMap.get(acc.BillingState));
            }
        }
        System.debug('---2.accountIds---'+accountIds); //Priyankar
        System.debug('---2.accountStates---'+accountStates); //Priyankar
        // get all regional diplomats that manage the states for the current list of applications
        accountStatesString = String.join(accountStates, ',');
        System.debug('---accountStatesString---'+accountStatesString );
        if (!accountStates.isEmpty()) {
            for (User u : [select id, Regional_Diplomat_Regions__c from User where Regional_Diplomat_Regions__c includes ( :accountStatesString)]) {
                if (u.Regional_Diplomat_Regions__c != null && String.isNotBlank(u.Regional_Diplomat_Regions__c)) {
                    List<String> userStates = u.Regional_Diplomat_Regions__c.Split(';');
                    for (String s : userStates) {
                        stateToUserMap.put(s, u);
                    }
                }
            }
        }

        // loop back through applications an assign the reginal diplomats
        for (Account_Application__c app : applications) {
            String state;

            if (app.Account__c != null && String.isBlank(app.Account_Name__c)) {
                String fullStateName = accountMap.get(app.Account__c).BillingState;
                state = SBP_Constants.stateMap.get(fullStateName);
            } else if (String.isNotBlank(app.Account_Name__c) && String.isNotBlank(app.State__c)) {
                state = app.State__c;
            }
            if (stateToUserMap.containsKey(state)) {
                app.Regional_Diplomat__c = stateToUserMap.get(state).Id;
            }

        }
    }


    /**************************************************************************************************************
    Author:        Indumathi Veluchamy
    Company:       TCS
    Description:    Once the Account Application has been approved, a case is created in the Salesforce and 
                    the email is sent to the submitter notifying the same. Since, the case is created after the 
                    Application is approved, the case details do not come when we send this email from the Approval Process.
                    Thus, we have to send the email from the code.
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/2018      Indumathi           Sending the email to Submitter after the Account Application is Approved with Case details
    To be un-commented on Next Week's Release
    ***************************************************************************************************************/
    public static void accountApplicationApprovedEmail(List<Account_Application__c> applications, Map<Id, Account_Application__c> oldApps) {
        EmailTemplate template = [SELECT Id, Subject, HtmlValue, DeveloperName, Body FROM EmailTemplate WHERE DeveloperName = :SBP_Constants.ACCOUNT_APPLICATION_APPROVED_EMAIL_TEMPLATE_NAME limit 1];
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        
        for (Account_Application__c app : applications) {
            Account_Application__c oldApp = oldApps.get(app.Id);
            if (oldApp.Status__c != 'Approved' && app.Status__c == 'Approved') {            
                List<String> emailsToSendTo = new List<String>();
                // add submitter email(Sales Rep)
                if (String.isNotBlank(app.Submitter__r.Email)) {
                    emailsToSendTo.add(app.Submitter__r.Email);
                }
                Messaging.SingleEmailMessage singleMail = new Messaging.SingleEmailMessage();
                singleMail.setToAddresses(emailsToSendTo);
                singleMail.setTargetObjectId(app.Submitter__c);
                singleMail.setTemplateId(template.Id);
                singleMail.setWhatId(app.Id);
                singleMail.setSaveAsActivity(false);
                singleMail.setReplyTo('cs@beamsuntory.com');
                singleMail.setSenderDisplayName('Beam Suntory Customer Service');
                emails.add(singleMail);
            }
        }
        List<Messaging.SendEmailResult> emailResults = Messaging.sendEmail(emails);
    }

}