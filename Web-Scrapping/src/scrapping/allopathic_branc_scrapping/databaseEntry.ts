//internal imports
import log from "../../utils/logger";
import dbService from "../../database/services/service";
import { BrandOverview } from "./extractOverviews_ofAllBrands_FromAllBrandsPage";

// import models
import Generic from "../../database/models/Generic.model";
import Brand from "../../database/models/Brand.model";
import DosageForm from "../../database/models/DosageForm.model";
import Manufacturer from "../../database/models/Manufacturer.model";
import { BrandDetails } from "./extracDetails_ofCurrentBrand";

const _dbService = new dbService();

export const entryToDB_BrandOverviews = async (
  brandOverviews: BrandOverview[]
) => {
  brandOverviews.forEach(async (brandOverview) => {
    let DosageForm = await _dbService.dosageService.getDosageFormByName(
      brandOverview.dosageForm.name
    );

    if (!DosageForm) {
      log.info(`Creating DosageForm: ${brandOverview.dosageForm}`);
      DosageForm = await _dbService.dosageService.createDosageForm({
        name: brandOverview.dosageForm.name,
        img_url: brandOverview.dosageForm.img_url || "",
      });

      log.info(`Created DosageForm: ${DosageForm.toJSON()}`);
    } else log.info(`DosageForm already exists: ${DosageForm.toJSON()}`);

    let Manufacturer =
      await _dbService.manufacturerService.getManufacturerByName(
        brandOverview.manufacturer
      );

    if (!Manufacturer) {
      log.info(`Creating Manufacturer: ${brandOverview.manufacturer}`);
      Manufacturer = await _dbService.manufacturerService.createManufacturer({
        name: brandOverview.manufacturer,
      });
      log.info(`Created Manufacturer: ${Manufacturer.toJSON()}`);
    } else log.info(`Manufacturer already exists: ${Manufacturer.toJSON()}`);

    let Generic = await _dbService.genericService.getGenericByName(
      brandOverview.genericName
    );

    if (!Generic) {
      log.info(`Creating Generic: ${brandOverview.genericName}`);
      Generic = await _dbService.genericService.createGeneric({
        name: brandOverview.genericName,
        type: "Allopathic",
      });
      log.info(`Created Generic: ${Generic.toJSON()}`);
    } else log.info(`Generic already exists: ${Generic.toJSON()}`);

    let Brand = await _dbService.brandService.getBrandByName(
      brandOverview.brandName
    );

    if (!Brand) {
      log.info(`Creating Brand: ${brandOverview.brandName}`);
      Brand = await _dbService.brandService.createBrand({
        name: brandOverview.brandName,
        strength: brandOverview.strength,
        description_url: brandOverview.brandLink,
        genericID: Generic.id,
        dosageFormID: DosageForm.id,
        manufacturerID: Manufacturer.id,
      });

      Brand.setGeneric(Generic);
      Brand.setDosageForm(DosageForm);
      Brand.setManufacturer(Manufacturer);

      Generic.addBrand(Brand);
      DosageForm.addBrand(Brand);
      Manufacturer.addBrand(Brand);
    
      log.info(`Created Brand: ${Brand.toJSON()}`);
    } else log.info(`Brand already exists: ${Brand}`);
  });

  log.info(
    "All Brand Overviews of current page are inserted into the database"
  );
};

export const entryToDB_BrandDetails = async (
  brandName: string,
  brandDetails: BrandDetails
) => {
  const brand = await _dbService.brandService.getBrandByName(brandName);
  log.info(`Creating Description for Brand: ${brand.toJSON()}`);

  if (brand.descriptionID) { 
    log.info(`Description already exists for Brand: ${brand.toJSON()}`);
    return;
  }

  const Description = await _dbService.descriptionService.createDescription({
    ...brandDetails,
  });
  log.info(
    `Created Description: ${Description.toJSON()} ---- for Brand: ${brand.toJSON()}`
  );

  brand.descriptionID = Description.id;
  brand.setDescription(Description);

  await brand.save();
  log.info(`Description_ID Updated in Brand: ${brand.toJSON()}`);
};