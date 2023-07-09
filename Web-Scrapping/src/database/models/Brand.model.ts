// external import
import {
  Association,
  BelongsToGetAssociationMixin,
  DataTypes,
  Model,
} from "sequelize";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";

// import models
import Generic from "./Generic.model";
import DosageForm from "./DosageForm.model";
import Manufacturer from "./Manufacturer.model";
import Description from "./Description.model";

interface BrandAttributes {
  id: number;
  name: string;
  strength: string;
  manufacturer: string;
  description_url: string;
  unit_price: string;

  genericID: number;
  dosageFormID: number;
  manufacturerID: number;
  descriptionID: number;
}

class Brand extends Model implements BrandAttributes {
  public id!: number;
  public name!: string;
  public strength!: string;
  public manufacturer!: string;
  public description_url!: string;
  public unit_price!: string;
  public genericID!: number;
  public dosageFormID!: number;
  public manufacturerID!: number;
  public descriptionID!: number;

  // Define associations
  public getGeneric!: BelongsToGetAssociationMixin<Generic>;
  public getDosageForm!: BelongsToGetAssociationMixin<DosageForm>;
  public getManufacturer!: BelongsToGetAssociationMixin<Manufacturer>;
  public getDescription!: BelongsToGetAssociationMixin<Description>;

  public static associations: {
    generic: Association<Brand, Generic>;
    // It specifies that the Brand model belongs to the Generic model,
    // indicating a many-to-one relationship.

    dosageForm: Association<Brand, DosageForm>;
    manufacturer: Association<Brand, Manufacturer>;
    description: Association<Brand, Description>;
  };
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    strength: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    description_url: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "brands",
    timestamps: true,
  }
);

/* ................ Define associations ................. */

// between Brand and Generic
Brand.belongsTo(Generic, {
  foreignKey: "genericID",
  as: "_generic",
});
Generic.hasMany(Brand, {
  foreignKey: "genericID",
  as: "_brands",
});

// between Brand and DosageForm
Brand.belongsTo(DosageForm, {
  foreignKey: "dosageFormID",
  as: "_dosage_form",
});
DosageForm.hasMany(Brand, {
  foreignKey: "dosageFormID",
  as: "_brands",
});

// between Brand and Manufacturer
Brand.belongsTo(Manufacturer, {
  foreignKey: "manufacturerID",
  as: "_manufacturer",
});
Manufacturer.hasMany(Brand, {
  foreignKey: "manufacturerID",
  as: "_brands",
});

// between Brand and Description
Brand.belongsTo(Description, {
  foreignKey: {
    name: "descriptionID",
    allowNull: true,
  },
  as: "_description",
});
Description.hasOne(Brand, {
  foreignKey: {
    name: "descriptionID",
    allowNull: true,
  },
  as: "_brand",
});

// pre processing before saving
Brand.afterSave(async (brand) => {
  const manufacturer = await brand.getManufacturer;
  if (manufacturer) {
    brand.manufacturer = manufacturer.name;
  }
});

export default Brand;
