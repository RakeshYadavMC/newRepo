/**
    @company : Copyright © 2020, BeamSuntory
    All rights reserved.
    Redistribution and use in source form, with or without modification, are prohibited without the express written consent of BeamSuntory,Inc.
    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
    INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
    IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    @website : https://www.beamsuntory.com/
    @author BeamSuntory
    @version V_1.0
    @date 17/02/2020
    @description This selector class is created to fetch case details.
*/
public class SLT_Case {
	
    /**
    *  @description : This method is use to fetch cases by list of id.
    *  @args        : List<ID> listOfIDs
    *  @return      : List<Case>
    **/
    public static List<Case> getCaseByIDs(List<ID> listOfIDs){
        List<Case> listOfCases = [SELECT Subject, CaseNumber,CreatedDate, Brand__c, Type, Single_Barrel_State__c,
                				      Single_Barrel_Region__c, Single_Barrel_Country__c,Product_Type__c, National_Account_Flag__c,
                                  	  Retail_Account__r.Name, Retail_Account__r.PremiseType__c, Retail_Account__r.BillingCountry, 
                                  	  Account.BillingCountry, Plant_Event__C
                                  FROM Case 
                                  WHERE Id IN : listOfIDs];
        return listOfCases;
    }
    
    /**
    *  @description : This method is use to fetch cases that were created by user in specific duration which is 90 days or 365 days.
    *  @args        : Integer numberOfDays, Id caseId, String email, String country, String state, String city, String postalCode, String street, Datetime createdDate, Integer limitOfData
    *  @return      : List<Case>
    **/
    public static List<Case> getCasesInLastDaysForParticularUser(Integer numberOfDays, Id caseId, String email, String country, String state, String city, String postalCode, String street, Datetime createdDate, Integer limitOfData){
        List<Case> lstCaseInfoInDays = [SELECT Id 
                                         FROM Case 
                                         WHERE Id != :caseId 
                                         AND RecordType.Id = :CSConstants.QC_RT_ID 
                                         AND CreatedDate <= :createdDate 
                                         AND CreatedDate >= :createdDate - numberOfDays
                                         AND (Contact.Email = :email
                                              OR (Contact.MailingCountry = :country 
                                                  AND Contact.MailingStreet = :street 
                                                  AND Contact.MailingPostalCode = :postalCode 
                                                  AND Contact.MailingCity = :city AND Contact.MailingState = :state)) 
                                         LIMIT :limitOfData];
        return lstCaseInfoInDays;
    }
    
    /**
    *  @description : This method is use to fetch cases based on current case's contact email address or mailing address.
    *  @args        : Id caseId, String email, String country, String state, String city, String postalCode, String street
    *  @return      : List<Case>
    **/
    public static List<Case> getCaseByEmailOrAddress(Id caseId, String email, String country, String state, String city, String postalCode, String street){
        return [SELECT CaseNumber, Status, Brand__c 
                FROM Case 
                Where Id != :caseId 
                AND RecordType.Id =: CSConstants.QC_RT_ID 
                AND (Contact.Email = :email OR 
                     (Contact.MailingCountry = :country 
                      AND Contact.MailingStreet = :street 
                      AND Contact.MailingPostalCode = :postalCode 
                      AND Contact.MailingCity = :city AND Contact.MailingState = :state)) 
                ORDER BY CaseNumber DESC];
    }
       
}