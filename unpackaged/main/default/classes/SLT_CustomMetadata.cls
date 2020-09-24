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
    @description This selector class is created to fetch custom metadata.
*/
public class SLT_CustomMetadata { 
    
    /**
    *  @description : This method is use to fetch Brand Category Help Mapping based on Brand.
    *  @args        : String Brand
    *  @return      : List<Brand_Category_Help_Mapping__mdt>
    **/
    public static List<Brand_Category_Help_Mapping__mdt> getBrandCategoryHelpListByBrand(String Brand){
        List<Brand_Category_Help_Mapping__mdt> brandCategoryList = new List<Brand_Category_Help_Mapping__mdt>();
        if(String.isNotBlank(Brand)) {
            brandCategoryList = [SELECT
                                 How_Can_We_Help_You__c, 
                                 How_Can_We_Help_You_Order__c,
                                 AdditionalInformation__c,
                                 Additional_Information_Order__c, 
                                 Is_Product_Visible__c 
                                 FROM 
                                 Brand_Category_Help_Mapping__mdt 
                                 WHERE 
                                 Brand__c = :brand 
                                 ORDER BY 
                                 How_Can_We_Help_You_Order__c, Additional_Information_Order__c];
        }
        return brandCategoryList;
    }
    
    /**
    *  @description : This method is use to fetch Brand to Product Mapping based on Brand.
    *  @args        : String Brand
    *  @return      : List<Brand_Product_Mapping__mdt>
    **/
    public static List<Brand_Product_Mapping__mdt> getBrandProductMappingByBrand(String Brand){
        List<Brand_Product_Mapping__mdt> brandProductsMDT = new List<Brand_Product_Mapping__mdt>();
        if(String.isNotBlank(Brand)){
            brandProductsMDT = [SELECT Product__c, Value__c, Sorting_Order__c 
                                FROM 
                                Brand_Product_Mapping__mdt 
                                Where
                                Brand__c = :brand 
                                AND 
                                Is_Active__c = TRUE 
                                ORDER BY 
                                Sorting_Order__c];
        }
        return brandProductsMDT;
    }
    
    /**
    *  @description : This method is use to fetch Issue Type Metadata.
    *  @return      : List<Issue_Type__mdt>
    **/
    public static List<Issue_Type__mdt> getIssuetypeList(){
        List<Issue_Type__mdt> issueLstMDT = [SELECT Name__c, Label__c, Sorting_Order__c 
                                             FROM 
                                             Issue_Type__mdt 
                                             WHERE 
                                             Is_Active__c = TRUE 
                                             ORDER BY 
                                             Sorting_Order__c];
        return issueLstMDT;
    }
    
    /**
    *  @description : This method is use to fetch lot codes resource based on Brand.
    *  @args        : String Brand
    *  @return      : List<Brand_Lot_Code_Setting__mdt>
    **/
    public static List<Brand_Lot_Code_Setting__mdt> getLotCodeResourceByBrand(String brand){
        List<Brand_Lot_Code_Setting__mdt> lotCodeResourceMDT = new List<Brand_Lot_Code_Setting__mdt>();
        if(String.isNotBlank(brand)){
            lotCodeResourceMDT = [SELECT Static_Resource_Name__c, Brand__c 
                                  FROM 
                                  	Brand_Lot_Code_Setting__mdt 
                                  WHERE
                                  	Brand__c = :brand LIMIT 1];
        }
        return lotCodeResourceMDT;
    }
    
    /**
    *  @description : This method is use to fetch Email Signature Information based on Brand.
    *  @args        : String Brand
    *  @return      : List<Email_Signature_Information__mdt>
    **/
    public static List<Email_Signature_Information__mdt> getEmailSignatureInformationByBrand(String brand){
        List<Email_Signature_Information__mdt> emailSignatureInformation = new List<Email_Signature_Information__mdt>();
        if(String.isNotBlank(brand)){
            emailSignatureInformation = [SELECT URL__c, URL_Type__c, Brand_Image_URL__c, Image_URL__c, Legal_Statements1__c, Legal_Statements2__c
                                         FROM Email_Signature_Information__mdt 
                                         WHERE Brand__c = :brand 
                                         ORDER BY URL_Type__c DESC LIMIT 10];
        }
        return emailSignatureInformation;
    }
    
    /**
    *  @description : This method is use to fetch Brand to Product Mapping with priority based on Brand.
    *  @args        : String Brand
    *  @return      : Map<String, String>
    **/
    public static Map<String, String> getBrandCategoryMappingByBrand(Set<String> brands){
        Map<String, String> helpOptionsPriorityMap = new Map<String, String>();
        List<Brand_Category_Help_Mapping__mdt> lstBrandCategoryHelp = [SELECT
                                                                       		How_Can_We_Help_You__c, AdditionalInformation__c, Priority__c, Brand__c 
                                                                       FROM 
                                                                       		Brand_Category_Help_Mapping__mdt 
                                                                       WHERE 
                                                                       		Brand__c IN :brands];
        
        for(Brand_Category_Help_Mapping__mdt brandCategoryHelp : lstBrandCategoryHelp) {
            //creating key so that a combination can be uniquely identified
            String key = String.isNotEmpty(brandCategoryHelp.AdditionalInformation__c) ? 
                brandCategoryHelp.How_Can_We_Help_You__c + ' - ' + brandCategoryHelp.AdditionalInformation__c + ' - ' + brandCategoryHelp.Brand__c: 
            	brandCategoryHelp.How_Can_We_Help_You__c + ' - ' + brandCategoryHelp.Brand__c;
            helpOptionsPriorityMap.put(key, brandCategoryHelp.Priority__c);
        }
        
        return helpOptionsPriorityMap;
    }
    
}