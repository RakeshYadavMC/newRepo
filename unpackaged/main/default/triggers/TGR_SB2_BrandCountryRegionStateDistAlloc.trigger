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
    @date 27/04/2020
    @description This Class is Trigger for Brand Country Region state Dist Alloc 
*/
trigger TGR_SB2_BrandCountryRegionStateDistAlloc on Brand_Country_Region_State_Dist_Alloc__c (before insert, after update, after insert, before update) {
        
    // if(Trigger.isUpdate) {
    //         TGRH_SB2_BrandCountRegionStateDistAlloc.handleBeforeUpdate(Trigger.New, Trigger.oldMap);
    // }

    if(Trigger.isBefore) {
        if(Trigger.isInsert) {
            TGRH_SB2_BrandCountRegionStateDistAlloc.handleBeforeInsert(Trigger.new);
        } else if(Trigger.isUpdate) {
            //TGRH_SB2_BrandCountRegionStateDistAlloc.handleBeforeUpdate(Trigger.new, Trigger.oldMap);
        } 
    } else if(Trigger.isAfter) {
        if(Trigger.isInsert) {
            TGRH_SB2_BrandCountRegionStateDistAlloc.handleAfterInsert(Trigger.new, Trigger.newMap, Trigger.oldMap);
        } else if(Trigger.isUpdate) {
            TGRH_SB2_BrandCountRegionStateDistAlloc.handleAfterUpdate(Trigger.new, Trigger.newMap, Trigger.oldMap);
        }  
    }
}