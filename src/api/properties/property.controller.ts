import { Request, Response } from 'express';
import Property from '../../models/property.model';
import { IProperty } from '../../models/property.model';
import supabase from '../../services/supabaseClient';

const useSupabase = process.env.USE_SUPABASE === 'true';

const uploadFileToSupabase = async (file: Express.Multer.File): Promise<string> => {
  const buffer = file.buffer;
  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(fileName, buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  return `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
};

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

    const propertyImages = files['propertyImages'] || [];
    const brochureFile = files['brochureFile']?.[0];

    // Handle property images
    let imageUrls: string[] = [];
    if (propertyImages.length > 0) {
      if (useSupabase) {
        imageUrls = await Promise.all(propertyImages.map(img => uploadFileToSupabase(img)));
      } else {
        imageUrls = propertyImages.map(img => img.path);
      }
    }

    // Handle brochure file
    let brochureUrl = '';
    if (brochureFile) {
      if (useSupabase) {
        brochureUrl = await uploadFileToSupabase(brochureFile);
      } else {
        brochureUrl = brochureFile.path;
      }
    }

    // Handle floor data
    const floorData: any = {};
    for (let i = 0; i < parseInt(numFloors); i++) {
      const defaultLayoutFile = files[`floor_${i}_defaultLayout`]?.[0];
      const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
      const unitImages: any = {};

      // Handle default layout
      let defaultLayoutUrl = '';
      if (defaultLayoutFile) {
        if (useSupabase) {
          defaultLayoutUrl = await uploadFileToSupabase(defaultLayoutFile);
        } else {
          defaultLayoutUrl = defaultLayoutFile.path;
        }
      }

      // Handle unit images
      for (const unitType of selectedUnitTypes) {
        const unitImageFile = files[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}`]?.[0];
        if (unitImageFile) {
          if (useSupabase) {
            unitImages[unitType] = await uploadFileToSupabase(unitImageFile);
          } else {
            unitImages[unitType] = unitImageFile.path;
          }
        }
      }

      floorData[i] = {
        defaultLayout: defaultLayoutUrl,
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
      images: imageUrls,
      brochureFile: brochureUrl,
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