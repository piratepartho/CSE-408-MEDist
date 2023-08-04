import { Request, Response } from "express";
import {
  Get_Generic_Info_Params_Input,
  Get_Manufacturer_Info_Params_Input,
  Get_Medicine_Info_Params_Input,
  Search_All_Medicine_Params_Input,
  Search_All_Medicine_Queries_Input,
} from "schema/medicine.schema";

// internal imports
import dbService from "../database/services/service";
import log from "../utils/logger";
import {
  BrandInfo,
  BrandDescription,
} from "../database/services/brand.service";
import {
  SingleGenericInfo,
  AllGenericInfo,
} from "../database/services/generic.service";
import { AllManufacturerInfo, SingleManufacturerInfo } from "database/services/manufacturer.service";

interface Medicine_Controller_Interface {
  search_all_medicines(
    req: Request<{}, {}, {}, Search_All_Medicine_Queries_Input>,
    res: Response
  );

  get_medicine_info(
    req: Request<Get_Medicine_Info_Params_Input>,
    res: Response
  );

  get_generic_info(req: Request<Get_Generic_Info_Params_Input>, res: Response);

  get_manufacturer_info(
    req: Request<Get_Manufacturer_Info_Params_Input>,
    res: Response
  );
}

class Medicine_Controller implements Medicine_Controller_Interface {
  // ------------------------------ search_all_medicines ------------------------------
  async search_all_medicines(
    req: Request<
      Search_All_Medicine_Params_Input,
      {},
      {},
      Search_All_Medicine_Queries_Input
    >,
    res: Response
  ) {
    const filterBy = req.query.filterBy
      ? (req.query.filterBy as string)
      : "brands";
    const searchBy = req.query.searchBy as string;
    const pagination = req.query.pagination
      ? (req.query.pagination as number)
      : 5;
    const currentPage = req.params.currentPage
      ? (req.params.currentPage as number)
      : 1;

    log.info(
      `search_all_medicines called with filterBy: ${filterBy} and searchBy: ${searchBy} and pagination: ${pagination} and currentPage: ${currentPage}`
    );

    let results: BrandInfo[] | AllGenericInfo[] | AllManufacturerInfo[];

    if (filterBy === "brands") {
      const _results: BrandInfo[] = await dbService.brandService.getAllBrands(
        searchBy,
        pagination,
        currentPage
      );

      results = _results;
    } else if (filterBy === "generics") {
      const _results: AllGenericInfo[] =
        await dbService.genericService.getAllGenericInfos(
          searchBy,
          pagination,
          currentPage
        );

      results = _results;
    } else if (filterBy === "manufacturer") {
      const _results: AllManufacturerInfo[] =
        await dbService.manufacturerService.getAllManufacturers(
          searchBy,
          pagination,
          currentPage
        );

      results = _results;
    }
    log.info(results, "results: ");

    res.status(200).json({
      resultsFor: "filterby " + filterBy,
      results,
    });
  }

  // ------------------------------ get_medicine_info ------------------------------
  async get_medicine_info(
    req: Request<Get_Medicine_Info_Params_Input>,
    res: Response
  ) {
    const medicineId = req.params.medicineId as number;

    log.info(`get_medicine_info called with medicineID: ${medicineId}`);

    const result: BrandDescription = await dbService.brandService.getBrandById(
      medicineId
    );

    log.info(result, "result: ");

    res.status(200).json({
      resultsFor: "Brand Description",
      result,
    });
  }

  // ------------------------------ get_generic_info ------------------------------
  async get_generic_info(
    req: Request<Get_Generic_Info_Params_Input>,
    res: Response
  ) {
    const genericId = req.params.genericId as number;

    log.info(`get_generic_info called with genericId: ${genericId}`);

    const result: SingleGenericInfo =
      await dbService.genericService.getSingleGenericInfo(genericId);

    log.info(result, "result: ");

    res.status(200).json({
      resultsFor: "Signle Generic Info",
      result,
    });
  }

  // ------------------------------ get_manufacturer_info ------------------------------
  async get_manufacturer_info(
    req: Request<Get_Manufacturer_Info_Params_Input>,
    res: Response
  ) {

    const manufacturerId = req.params.manufacturerId as number;

    log.info(`get_manufacturer_info called with manufacturerId: ${manufacturerId}`);

    const result: SingleManufacturerInfo =
      await dbService.manufacturerService.getSingleManufacturerInfo(manufacturerId);

    log.info(result, "result: ");

    res.status(200).json({
      resultsFor: "Signle Manufacturer Info",
      result,
    });
  }

}

export default new Medicine_Controller();