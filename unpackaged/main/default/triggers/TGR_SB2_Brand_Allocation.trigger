/**
    @company : Copyright © 2019, BeamSuntory
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
    @date 16/04/2020
    @description This trigger is for Brand Allocation
*/
trigger TGR_SB2_Brand_Allocation on Brand_Allocation__c (before insert, after update) {
/**    list<String> listOfBrand = new List<String>();
    map<String, list<String>> mapOfQuarterMonth = new map<String, list<String>>{'Quarter 1' => new List<String>{'January','February','March'},
        'Quarter 2' => new List<String>{'April','May','June'},'Quarter 3' => new List<String>{'July','August','September'},
        'Quarter 4' => new List<String>{'October','November','December'}};
    map<String, String> mapOfMonthQuarter = new Map<String, String>{'January' => 'Quarter 1', 'February' => 'Quarter 1', 'March' => 'Quarter 1',
        'April' => 'Quarter 2', 'May' => 'Quarter 2', 'June' => 'Quarter 2', 'July' => 'Quarter 3', 'August' => 'Quarter 3', 'September' => 'Quarter 3',
        'October' => 'Quarter 4', 'November' => 'Quarter 4', 'December' => 'Quarter 4'};
    for(Brand_Allocation__c brandAllocation : Trigger.new) {
         listOfBrand.add(brandAllocation.Brand__c);
    }
    
    List<Brand_Allocation__c> lstExistingBrandAllocation = [SELECT Id, Time_Period__c, Time_Interval__c, Year_Of_Allocation__c,
                                                            Brand__c, is_Active__c, Program_Type__C
                                                            FROM Brand_Allocation__c 
                                                            WHERE Brand__c IN: listOfBrand AND is_Active__c = true];
    Map<String,List<Brand_Allocation__c>> mapOfYearAndBrandAllocation = new Map<String, List<Brand_Allocation__c>>();
    List<String> combinationOfAll = new List<String>();
    System.debug('lstExistingBrandAllocation--'+lstExistingBrandAllocation);
    for(Brand_Allocation__c brandAllocation : lstExistingBrandAllocation){
        List<String> lstOfProgram = brandAllocation.Program_Type__c.split(';');
        lstOfProgram.sort();
        String programType = '';
        for(String nameOfProgramType : lstOfProgram){
            programType = programType+nameOfProgramType +'-';
        }
        programType = programType.substring(0,programType.length()-1);
        combinationOfAll.add(programType+'-'+brandAllocation.Time_Interval__c+'-'+
                             brandAllocation.Time_Period__c+'-'+brandAllocation.Year_Of_Allocation__c);
        String key = programType+'-'+brandAllocation.Year_Of_Allocation__c+'-'+brandAllocation.Time_Period__c;
        if(mapOfYearAndBrandAllocation.containsKey(key)){
            List<Brand_Allocation__c> lstBA = mapOfYearAndBrandAllocation.get(key);
            lstBA.add(brandAllocation);
            mapOfYearAndBrandAllocation.put(key,lstBA);
        } else {
            mapOfYearAndBrandAllocation.put(key,new List<Brand_Allocation__c>{brandAllocation});
        }
    }
    for(Brand_Allocation__c brandAllocation : Trigger.new) {
        List<String> lstOfProgram1 = brandAllocation.Program_Type__c.split(';');
        lstOfProgram1.sort();
        String programType1 = '';
        for(String nameOfProgramType : lstOfProgram1){
            programType1 = programType1+nameOfProgramType +'-';
        }
        programType1 = programType1.substring(0,programType1.length()-1);
        String combinationforNew = programType1+'-'+brandAllocation.Time_Interval__c+'-'+
            brandAllocation.Time_Period__c+'-'+brandAllocation.Year_Of_Allocation__c;
        if(combinationOfAll.contains(combinationforNew)){
            brandAllocation.addError('This allocation and time interval is already existing');
        } else {
            String key;
            String key2;
            Boolean isAlreadyActive = false;
            if(brandAllocation.Time_Period__c == 'yearly'){
                key = programType1+'-'+brandAllocation.Year_Of_Allocation__c+'-Monthly';
                key2 = programType1+'-'+brandAllocation.Year_Of_Allocation__c+'-Quarterly';
                if(mapOfYearAndBrandAllocation.containsKey(key) || mapOfYearAndBrandAllocation.containsKey(key2)) {
					brandAllocation.addError('already active allocation for this Brand for this time period please deactivate all');
                }
            } else if(brandAllocation.Time_Period__c == 'Quarterly') {
                key = programType1+'-'+brandAllocation.Year_Of_Allocation__c+'-Yearly';
                key2 = programType1+'-'+brandAllocation.Year_Of_Allocation__c+'-Monthly';
                if(mapOfYearAndBrandAllocation.containsKey(key)) {
                    brandAllocation.addError('already active allocation for this Brand for this time period please deactivate all');
                }
                if(mapOfYearAndBrandAllocation.containsKey(key2)){
                    for(Brand_Allocation__c bA : mapOfYearAndBrandAllocation.get(key2)) {
                        if(mapOfQuarterMonth.containsKey(brandAllocation.Time_Interval__c)) {
                            List<String> lstOfMonth = mapOfQuarterMonth.get(brandAllocation.Time_Interval__c);
                            if(lstOfMonth.contains(bA.Time_Interval__c)) {
                                isAlreadyActive = true;
                                break;                                
                            }
                        }
                    }
                }
            } else if(brandAllocation.Time_Period__c == 'Monthly') {
                key = programType1+'-'+brandAllocation.Year_Of_Allocation__c+'-Yearly';
                key2 = programType1+'-'+brandAllocation.Year_Of_Allocation__c+'-Quarterly';
                if(mapOfYearAndBrandAllocation.containsKey(key)) {
                    brandAllocation.addError('already active allocation for this Brand for this time period please deactivate all');
                }
                if(mapOfYearAndBrandAllocation.containsKey(key2)){
                    for(Brand_Allocation__c bA : mapOfYearAndBrandAllocation.get(key2)) {
                        if(mapOfMonthQuarter.containsKey(brandAllocation.Time_Interval__c)) {
                            if(mapOfMonthQuarter.get(brandAllocation.Time_Interval__c) == bA.Time_Interval__c) {
                                isAlreadyActive = true;
                                break;                                
                            }
                        }
                    }
                }
            }
            if(isAlreadyActive) {
                brandAllocation.addError('already active allocation for this Brand for this time period please deactivate all');
            }
        }
    }**/
        if(Trigger.isBefore) {
        if(Trigger.isInsert) {
            TGRH_SB2_BrandAllocation.handleBeforeInsert(Trigger.New);
        } 
    }
    if(Trigger.isAfter){
        if(Trigger.IsUpdate){
            TGRH_SB2_BrandAllocation.handleAfterUpdate(Trigger.New);
        }
    }
}