import { Request, Response } from 'express';
import Property from '../../models/property.model';
import { IProperty } from '../../models/property.model';

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      title,
      area,
      price,
      mainVideoUrl,
      developer,
      type,
      paymentPlans,
      faqs,
      amenities,
      access,
      views,
      description,
      longitude,
      latitude,
      numFloors,
    } = req.body;

    const images = files['propertyImages'] || [];
    const brochureFile = files['brochureFile']?.[0];

    const floorData: any = {};
    for (let i = 0; i < parseInt(numFloors); i++) {
      const defaultLayout = files[`floor_${i}_defaultLayout`]?.[0]?.path;
      const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
      const unitImages: any = {};

      for (const unitType of selectedUnitTypes) {
        const unitImage = files[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}`]?.[0];
        if (unitImage) {
          unitImages[unitType] = unitImage.path;
        }
      }

      floorData[i] = {
        defaultLayout,
        selectedUnitTypes,
        unitImages
      };
    }

const safeParse = (input: any, fallback: any = []) => {
  try {
    if (!input || input === 'undefined') return fallback;
    return JSON.parse(input);
  } catch (err) {
    return fallback;
  }
};

    const newProperty: IProperty = new Property({
      title,
      area,
      price,
      mainVideoUrl,
      developer,
      type,
      images: images.map(img => img.path),
      brochureFile: brochureFile?.path,
      paymentPlans: safeParse(paymentPlans),
faqs: safeParse(faqs),
amenities: safeParse(amenities),
access: safeParse(access),
views: safeParse(views),
      description,
      longitude,
      latitude,
      numFloors,
      floors: floorData
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Create Property Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProperties = async (_req: Request, res: Response): Promise<void> => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
