@isTest
private class SBP_POSItemCmpCtrlTest {
    @testSetup static void setup() {
        Profile p = [SELECT Id FROM Profile WHERE Name = 'System Administrator'];
        User u = new User(Alias = 'beamtu', Email = 'standarduser@testorg.com', Regional_Diplomat_Regions__c = 'Illinois;Indiana',
                          EmailEncodingKey = 'UTF-8', LastName = 'Testing', LanguageLocaleKey = 'en_US',
                          LocaleSidKey = 'en_US', ProfileId = p.Id,
                          TimeZoneSidKey = 'America/Chicago', UserName = 'beamsuntorytestuser@test-user-system.com.test-only');
        insert u;

        Account testAccount = new Account();
        testAccount.Name = 'Test Account';
        testAccount.BillingState = 'IL';
        testAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('OffPremise').getRecordTypeId();

        Account intAccount = new Account();
        intAccount.Name = 'Single Barrel International Account';
        intAccount.BillingState = 'IL';
        intAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('OffPremise').getRecordTypeId();

        Account retailAccount = new Account();
        retailAccount.Name = 'Retail Account';
        retailAccount.BillingState = 'IL';
        retailAccount.PremiseType__c = 'On Premise';
        retailAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('OffPremise').getRecordTypeId();

        insert new List<Account> {testAccount, retailAccount, intAccount};

        Barrel_Order_Group__c bg = new Barrel_Order_Group__c();
        bg.Type__c = 'Trip and Tour';

        Barrel_Order_Group__c bg2 = new Barrel_Order_Group__c();
        bg2.Type__c = 'Trip and Tour';

        Barrel_Order_Group__c bg3 = new Barrel_Order_Group__c();
        bg3.Type__c = 'Split Barrel';

        Barrel_Order_Group__c bg4 = new Barrel_Order_Group__c();
        bg4.Type__c = 'Split Barrel';

        insert new List<Barrel_Order_Group__c> {bg, bg2, bg3, bg4};


        Case c = new Case();
        c.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Standard').getRecordTypeId();
        c.Type = 'Trip and Tour';
        c.Barrel_Order_Group__c = bg.Id;
        c.Brand__c = 'Knob Creek';
        c.Barrel_Selected__c = false;
        c.Retail_Account__c = retailAccount.Id;
        c.Product_Type__c = 'Bourbon';
        c.ccEmail__c = 'test@test.com';
        c.AccountId = testAccount.Id;
        
        /** changes start here on 8-Sep-20
        *	@description: new Case object with field Account_Missing__c: true is created
        **/
        Case c6 = new Case();
        c6.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Standard').getRecordTypeId();
        c6.Type = 'Trip and Tour';
        c6.Barrel_Order_Group__c = bg.Id;
        c6.Brand__c = 'Knob Creek';
        c6.Barrel_Selected__c = false;
        c6.Retail_Account__c = retailAccount.Id;
        c6.Product_Type__c = 'Bourbon';
        c6.ccEmail__c = 'test@test.com';
        c6.AccountId = testAccount.Id;
        c6.Account_Missing__c= true;
        /*
        *changes end here on 8-Sep-20
        */

        Case c2 = new Case();
        c2.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Proof_Specific').getRecordTypeId();
        c2.Type = 'Trip and Tour';
        c2.Barrel_Order_Group__c = bg2.Id;
        c2.Account_Missing__c = true;
        c2.Retail_Account_Name__c = 'Missing Account Name';
        c2.Retail_Account__c = intAccount.Id;
        c2.Brand__c = 'Makers Mark';
        c2.AccountId = testAccount.Id;

        Case c3 = new Case();
        c3.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Standard').getRecordTypeId();
        c3.Type = 'Split Barrel';
        c3.Barrel_Order_Group__c = bg3.Id;
        c3.Brand__c = 'Knob Creek';
        c3.Barrel_Selected__c = false;
        c3.Retail_Account__c = retailAccount.Id;
        c3.Product_Type__c = 'Bourbon';
        c3.ccEmail__c = 'test@test.com';
        c3.AccountId = testAccount.Id;

        Case c4 = new Case();
        c4.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Standard').getRecordTypeId();
        c4.Type = 'Split Barrel';
        c4.Barrel_Order_Group__c = bg4.Id;
        c4.Brand__c = 'Knob Creek';
        c4.Barrel_Selected__c = false;
        c4.Account_Missing__c = true;
        c4.Retail_Account_Name__c = 'Missing Account Name 2';
        c4.Retail_Account__c = intAccount.Id;
        c4.Product_Type__c = 'Bourbon';
        c4.ccEmail__c = 'test@test.com';
        c4.AccountId = testAccount.Id;
        
        Case c5 = new Case();
        c5.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Proof_Specific').getRecordTypeId();
        c5.Type = 'Split Barrel';
        c5.Barrel_Order_Group__c = bg2.Id;
        c5.Account_Missing__c = true;
        c5.Retail_Account_Name__c = 'Missing Account Name';
        c5.Retail_Account__c = intAccount.Id;
        c5.Brand__c = 'Makers Mark';
        c5.AccountId = testAccount.Id;

        insert new List<Case> {c, c2, c3, c4, c5, c6};


        Barrel__c knobCreek = new Barrel__c();
        knobCreek.Brand__c = 'Knob Creek';
        knobCreek.Case__c = c.Id;
        knobCreek.SKU__c = 'Test Barrel';
        knobCreek.RecordTypeId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Knob_Creek_Full_Barrel').getRecordTypeId();
        knobCreek.Product_Type__c = 'Bourbon';
        
        /** changes start here on 8-Sep-20
        *	@description: new Barrel object is created with SKU__c: 'Test Barrel'
        **/
        Barrel__c knobCreek1 = new Barrel__c();
        knobCreek1.Brand__c = 'Knob Creek';
        knobCreek1.Case__c = c6.Id;
        knobCreek1.SKU__c = 'Test Barrel';
        knobCreek1.RecordTypeId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Knob_Creek_Full_Barrel').getRecordTypeId();
        knobCreek1.Product_Type__c = 'Bourbon';
        
        /** changes end here on 8-Sep-20
        *
        **/

        Barrel__c makersMark = new Barrel__c();
        makersMark.Brand__c = 'Makers Mark';
        makersMark.Ship_Date__c = null;
        makersMark.Case__c = c2.Id;
        makersMark.SKU__c = 'Test Barrel 2';
        makersMark.RecordTypeId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Makers_Mark_Full_Barrel').getRecordTypeId();

        Barrel__c knobCreekSplit = new Barrel__c();
        knobCreekSplit.Brand__c = 'Knob Creek';
        knobCreekSplit.Case__c = c3.Id;
        knobCreekSplit.SKU__c = 'Knob Creek Split';
        knobCreekSplit.RecordTypeId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Knob_Creek_Split_Barrel').getRecordTypeId();
        knobCreekSplit.Product_Type__c = 'Bourbon';

        Barrel__c knobCreekSplitNoAccount = new Barrel__c();
        knobCreekSplitNoAccount.Brand__c = 'Knob Creek';
        knobCreekSplitNoAccount.Case__c = c4.Id;
        knobCreekSplitNoAccount.SKU__c = 'Knob Creek Split No Account';
        knobCreekSplitNoAccount.RecordTypeId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Knob_Creek_Split_Barrel').getRecordTypeId();
        knobCreekSplitNoAccount.Product_Type__c = 'Bourbon';
		
        insert new List<Barrel__c> {knobCreek,knobCreek1, makersMark, knobCreekSplit, knobCreekSplitNoAccount };
       
        Case splitCase = new Case();
        splitCase.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Split_Barrel').getRecordTypeId();
        splitCase.Type = 'Split Barrel';
        splitCase.Barrel__c = knobCreekSplit.Id;
        splitCase.Brand__c = 'Knob Creek';
        splitCase.Barrel_Selected__c = false;
        splitCase.Account_Missing__c = false;
        splitCase.Retail_Account__c = retailAccount.Id;
        splitCase.Product_Type__c = 'Bourbon';
        splitCase.ccEmail__c = 'test@test.com';
        splitCase.AccountId = testAccount.Id;

        Case splitCaseNoAccount = new Case();
        splitCaseNoAccount.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Single_Barrel_Split_Barrel').getRecordTypeId();
        splitCaseNoAccount.Type = 'Split Barrel';
        splitCaseNoAccount.Barrel__c = knobCreekSplitNoAccount.Id;
        splitCaseNoAccount.Brand__c = 'Knob Creek';
        splitCaseNoAccount.Barrel_Selected__c = false;
        splitCase.Account_Missing__c = true;
        splitCaseNoAccount.Retail_Account__c = intAccount.Id;
        splitCaseNoAccount.Product_Type__c = 'Bourbon';
        splitCaseNoAccount.ccEmail__c = 'test@test.com';
        splitCaseNoAccount.AccountId = testAccount.Id;

        insert new List<Case> {splitCase, splitCaseNoAccount};
        
        String posItemsJson = '[{'
                              + '    "Type__c": "Barrel Plaque",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Hang Tag",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Pour Spout",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Menu Insert Card",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Bottle Cradle",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Barrel",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}]';
        
        /** changes start here on 8-Sep-20
		* @description: data created for POS_Customization__c
		**/
        POS_Customization__c pos1= new POS_Customization__c();
        pos1.Type__c= 'Bottle Plate Text';
        pos1.Insert_Text__c='test'; 
        pos1.Barrel__c= makersMark.Id;
        
        POS_Customization__c pos2= new POS_Customization__c();
        pos1.Type__c= 'Bottle Plate Text';
        pos1.Insert_Text__c='test'; 
        pos1.Case__c= c5.Id;


        insert new List<POS_Customization__c> {pos1, pos2};
		/** changes end here on 8-Sep-20
        *
        **/
    }
    
    public static String getPosItemsJson(){
        String posItemJson= '[{'
                              + '    "Type__c": "Bottle Plate Text",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Hang Tag",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Pour Spout",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Menu Insert Card",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Bottle Cradle",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}, {'
                              + '    "Type__c": "Barrel",'
                              + '    "Attention__c": "Ramon Perez",'
                              + '    "Company__c": "Southern Glazer\'s Wine & Spirits",'
                              + '    "Street__c": "300 East Crossroads Parkway",'
                              + '    "City__c": "Bollingbrook",'
                              + '    "Country__c": "US",'
                              + '    "State__c": "NY",'
                              + '    "Zip__c": "60440",'
                              + '    "Phone__c": "(312) 659-9373"'
                              + '}]';
        return posItemJson;
    }

    public static Case getCaseById(Id caseId) {
        return [select id, POS_Items_Selected__c, Bottle_Text_Entered__c,Status  from Case where Id = :caseId limit 1];
    }

    public static Account_Barrel_Recipe__c getBarrelRecipeByAccountName(String accountName) {
        return [select id, Barrel_Recipe__c from Account_Barrel_Recipe__c where Account__r.Name = :accountName limit 1];
    }

    public static Case getCaseByBrand(String brand) {
        return [select id, Barrel_Selected__c, AccountId, Retail_Account__c, Status, Remote_Selection_Date__c from Case where Brand__c = :brand limit 1];
    }
    
    /** changes start here on 8-Sep-20
    * @description: This method is used to get case by brand and type
    **/
    public static Case getCaseByBrandAndType(String brand, String type) {
        return [select id, Barrel_Selected__c, AccountId, Retail_Account__c, Status, Remote_Selection_Date__c from Case where Brand__c = :brand AND Type = :type limit 1];
    }
    /** changes end here on 8-Sep-20
    *
    **/
    public static List<Case> getCurrentNumberOfCases() {
        return [select Id from Case];
    }

    public static List<Barrel__c> getCurrentNumberOfBarrels() {
        return [select Id from Barrel__c];
    }

    public static Barrel__c getBarrelByBrand(String brand) {
        return [select Id, Case__c from Barrel__c where Brand__c = :brand limit 1];
    }

    public static Barrel__c getBarrelBySku(String sku) {
        return [select Id, Case__c,Case__r.Status from Barrel__c where SKU__c = :sku limit 1];
    }
    
    /**changes start here on 8-Sep-20
    *	@description: This method is used where Account_Missing__c is set true
    **/
    public static Barrel__c getBarrelBySkuAccountMissing(String sku) {
        return [select Id, Case__c,Case__r.Status from Barrel__c where SKU__c = :sku AND Case__r.Account_Missing__c= true limit 1];
    }
    
    /**
    * changes end here on 8-Sep-20
    **/

    public static Account getTestAccount() {
        return [select id from Account where Name = 'Test Account'];
    }

    public static List<POS_Customization__c> getPOSCustomizationsByBarrel(Id barrelId) {
        return [select id, Insert_Text__c from POS_Customization__c where Barrel__c = :barrelId];
    }

    public static List<POS_Customization__c> getPOSCustomizationsByCase(Id caseId) {
        return [select id, Insert_Text__c from POS_Customization__c where Case__c = :caseId];
    }


    public static testMethod void getSingleBarrelCustomMetaDataSettingsTest() {
        Barrel__c barrel = getBarrelByBrand('Knob Creek');
        Test.startTest();

        List<POS_Customization__c> posItems = new List<POS_Customization__c>();
        posItems.add(new POS_Customization__c(Get_Insert_Text_From__c = 'Account Name', Type__c = 'Barrel Plaque', Barrel__c = barrel.Id, RecordTypeId = SBP_Constants.POS_FULL_BARREL_RT_ID));
        posItems.add(new POS_Customization__c(Get_Insert_Text_From__c = 'Account Name', Type__c = 'Floor Display', Barrel__c = barrel.Id, RecordTypeId = SBP_Constants.POS_FULL_BARREL_RT_ID));
        posItems.add(new POS_Customization__c(Get_Insert_Text_From__c = 'Account Name', Type__c = 'Barrel', Barrel__c = barrel.Id, RecordTypeId = SBP_Constants.POS_FULL_BARREL_RT_ID));

        insert posItems;

        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getSingleBarrelCustomMetaDataSettings('Indiana', 'Knob Creek', 'On Premise');
        Test.stopTest();

        System.assertNotEquals(NULL, response.responseMap.get('brandToPOSItemMap'), 'Custom metadata should be returned');

    }

    public static testMethod void insertPOSItemsBarrelTest() {
        Barrel__c barrel = getBarrelByBrand('Makers Mark');

        Test.startTest();

        List<POS_Customization__c> posItems = [select id from POS_Customization__c];
        //System.assertEquals(0, posItems.size(), 'There should not be any POS Items created');
		
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.insertPOSItems(getPosItemsJson(), String.valueOf(barrel.Id));

        Test.stopTest();

        System.assertEquals(6, response.responseMap.get('numberOfPosItems'), '6 POS Items should have been added');
    }
    /** changes start here on 8-Sep-20
    *	@description: This testMethod is used when objectType = 'Case__c' 
    **/ 
    public static testMethod void insertPOSItemsCaseTest() {
        Barrel__c barrel = getBarrelByBrand('Makers Mark');

        Test.startTest();

        List<POS_Customization__c> posItems = [select id from POS_Customization__c];
        //System.assertEquals(0, posItems.size(), 'There should not be any POS Items created');

        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.insertPOSItems(getPosItemsJson(), getCaseByBrand('Makers Mark').Id);
		
        Test.stopTest();

        System.assertEquals(6, response.responseMap.get('numberOfPosItems'), '6 POS Items should have been added');
    }
    
    /** changes start here on 8-Sep-20
    *	@description: This testMethod is used when objectType = 'Case__c' && Type__c = 'Bottle Plate Text' 
    **/
    public static testMethod void insertPOSItemsCaseByTypeTest() {
        Barrel__c barrel = getBarrelByBrand('Makers Mark');

        Test.startTest();

        List<POS_Customization__c> posItems = [select id from POS_Customization__c];
        //System.assertEquals(0, posItems.size(), 'There should not be any POS Items created');

		LightningComponentUtility.RequestStatus response1 = SBP_POSItemCmpCtrl.insertPOSItems(getPosItemsJson(), getCaseByBrandAndType('Makers Mark', 'Split Barrel').Id);
        Test.stopTest();

        System.assertEquals(null, response1.responseMap.get('numberOfPosItems'), 'No POS Items should have been added');
    }
    /** changes end here on 8-Sep-20
    *
    **/
    

    public static testMethod void getDistributorRecordTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');

        Test.startTest();

        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getDistributorRecord(String.valueOf(barrel.Id));

        Test.stopTest();

        System.assertNotEquals(NULL, response.responseMap.get('account'), 'account should be returned');
    }
    
    /** changes start here on 8-Sep-20
    *	@description: This method is used to test DistributorRecord by Brand on Case__c
    **/
    public static testMethod void getDistributorRecordByBrandTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');

        Test.startTest();

        LightningComponentUtility.RequestStatus response1 = SBP_POSItemCmpCtrl.getDistributorRecord(getCaseByBrand('Makers Mark').Id);

        Test.stopTest();
        System.assertNotEquals(NULL, response1.responseMap.get('account'), 'account should be returned');
    }

    public static testMethod void getDistributorRecordErrorTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');

        Test.startTest();

        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getDistributorRecord('');

        Test.stopTest();

        System.assertEquals(false, response.success, 'Operation should not return successfully');
    }

    public static testMethod void updateStepsAsCompletedTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);

        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);

        Test.startTest();

        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.updateStepsAsCompleted(String.valueOf(barrel.Id), true, true);
        
        Case updatedCase = getCaseById(barrel.Case__c);

        Test.stopTest();

        System.assertEquals(updatedCase.POS_Items_Selected__c, true);
        System.assertEquals(updatedCase.Bottle_Text_Entered__c, true);

        System.assertNotEquals(NULL, response.responseMap.get('updatedRecord'), 'updatedRecord should be returned');
    }
    
    /** changes start here on 8-Sep-20
    *	@description: This method is used to get Case__c by Brand
    **/
    public static testMethod void updateStepsAsCompletedByBrandTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);
        Test.startTest();
        LightningComponentUtility.RequestStatus response1 = SBP_POSItemCmpCtrl.updateStepsAsCompleted(getCaseByBrand('Makers Mark').Id, true, true);
        Case updatedCase = getCaseById(barrel.Case__c);
        Test.stopTest();
        System.assertEquals(updatedCase.POS_Items_Selected__c, false);
        System.assertEquals(updatedCase.Bottle_Text_Entered__c, false);
        System.assertNotEquals(NULL, response1.responseMap.get('updatedRecord'), 'updatedRecord should be returned');

    }
    
    /** changes end here on 8-Sep-20
    *
    **/
    public static testMethod void updateStepsAsCompletedErrorTest() {
        Case c = getCaseByBrand('Knob Creek');
        Test.startTest();
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.updateStepsAsCompleted('', false, false);
        Test.stopTest();
        System.assertEquals(false, response.success, 'Operation should not return successfully');
    }

    public static testMethod void getBottleLabelImagesTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);
        Test.startTest();
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getBottleLabelImages('Indiana');
        Test.stopTest();
        System.assertNotEquals(NULL, response.responseMap.get('bottleLabelMap'), 'Bottle plate labels should be uploaded');
    }

    public static testMethod void getBottleLabelImagesNewYorkTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);
        Test.startTest();
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getBottleLabelImages('New York');
        Test.stopTest();
        System.assertNotEquals(NULL, response.responseMap.get('bottleLabelMap'), 'Bottle plate labels should be uploaded');
    }

    public static testMethod void getRecordDetailsCaseTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);
        Test.startTest();
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getRecordDetails(String.ValueOf(c.Id));
        Test.stopTest();
        System.assertEquals('On Premise', response.responseMap.get('premiseType'), 'Should be On Premise type');
    }
    
    /** changes start here on 8-Sep-20
    * @descripition: This method is used to get record details by Brand and Type
    **/
    public static testMethod void getRecordDetailsCaseByBrandAndTypeTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);
        Test.startTest();
        LightningComponentUtility.RequestStatus response1 = SBP_POSItemCmpCtrl.getRecordDetails(getCaseByBrandAndType('Makers Mark', 'Split Barrel').Id);
        Test.stopTest();
        System.assertEquals(NULL, response1.responseMap.get('premiseType'), 'Should be NULL');
    }

    public static testMethod void getRecordDetailsBarrelTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);
        Test.startTest();
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getRecordDetails(String.ValueOf(barrel.Id));
        Test.stopTest();
        System.assertEquals('On Premise', response.responseMap.get('premiseType'), 'Should be On Premise type');
    }
    
    /** changes start here on 8-Sep-20
    *@description: This method is used to test record details with Account_Missing on Case__c set to true;
    **/
    public static testMethod void getRecordDetailsBarrelAccountMissingTest() {
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        System.assertEquals(c.POS_Items_Selected__c, false);
        System.assertEquals(c.Bottle_Text_Entered__c, false);
        Test.startTest();
        LightningComponentUtility.RequestStatus response1 = SBP_POSItemCmpCtrl.getRecordDetails(getBarrelBySkuAccountMissing('Test Barrel').Id);
        Test.stopTest();

        System.assertEquals(NULL, response1.responseMap.get('premiseType'), 'Should be NULL');

    }

    public static testMethod void getRecordDetailsBarrelErrorTest() {
        Test.startTest();
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getRecordDetails('');
        Test.stopTest();
        System.assertEquals(false, response.success, 'Operation should not return successfully');
    }

    public static testMethod void getPosItemsTest() {
        Barrel__c barrel = getBarrelByBrand('Knob Creek');
        Test.startTest();
        List<POS_Customization__c> posItems = new List<POS_Customization__c>();
        posItems.add(new POS_Customization__c(Get_Insert_Text_From__c = 'Account Name', Type__c = 'Barrel Plaque', Barrel__c = barrel.Id, RecordTypeId = SBP_Constants.POS_FULL_BARREL_RT_ID));
        posItems.add(new POS_Customization__c(Get_Insert_Text_From__c = 'Account Name', Type__c = 'Floor Display', Barrel__c = barrel.Id, RecordTypeId = SBP_Constants.POS_FULL_BARREL_RT_ID));
        posItems.add(new POS_Customization__c(Get_Insert_Text_From__c = 'Account Name', Type__c = 'Barrel', Barrel__c = barrel.Id, RecordTypeId = SBP_Constants.POS_FULL_BARREL_RT_ID));
        insert posItems;
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getPOSRecords(String.valueOf(barrel.Case__c));
        Test.stopTest();
        System.assertEquals(3, response.responseMap.get('numOfPOSItems'), '3 POS Items should exist');
    }

    public static testMethod void getPosItemsErrorTest() {
        Barrel__c barrel = getBarrelByBrand('Knob Creek');
        Test.startTest();
        LightningComponentUtility.RequestStatus response = SBP_POSItemCmpCtrl.getPOSRecords('');
        Test.stopTest();
        System.assertEquals(false, response.success, 'Operation should not return successfully');
    }
    
    public static testMethod void getAccountTest(){
        Barrel__c barrel = getBarrelBySku('Test Barrel');
        Case c = getCaseById(barrel.Case__c);
        string test = SBP_POSItemCmpCtrl.getAccountNamefromCase(c.Id);
    }
    
    public static testMethod void getCaseStatusTest(){
        Barrel__c barrel = getBarrelBySku('Test Barrel');
	    // Barrel__c barrelrec = new Barrel__c();
        Case c = getCaseById(barrel.Case__c);
        string test = SBP_POSItemCmpCtrl.getRecordStatusDetails(barrel.Id);   
    }

}