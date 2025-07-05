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

// Utility parsers
const safeParseArray = (input: any, fallback: any = []) => {
  try {
    if (!input || input === 'undefined') return fallback;
    return JSON.parse(input);
  } catch (err) {
    return fallback;
  }
};

const safeParseObject = (input: any, fallback: any = {}) => {
  try {
    if (!input || input === 'undefined') return fallback;
    return JSON.parse(input);
  } catch (err) {
    return fallback;
  }
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
      quarter,
      year,
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

    let imageUrls: string[] = [];
    if (propertyImages.length > 0) {
      imageUrls = useSupabase
        ? await Promise.all(propertyImages.map(img => uploadFileToSupabase(img)))
        : propertyImages.map(img => img.path);
    }

    let brochureUrl = '';
    if (brochureFile) {
      brochureUrl = useSupabase
        ? await uploadFileToSupabase(brochureFile)
        : brochureFile.path;
    }

    // Create floors Map
    const floorsMap = new Map();
    for (let i = 0; i < parseInt(numFloors); i++) {
      const defaultLayoutFile = files[`floor_${i}_defaultLayout`]?.[0];
      const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
      
      let defaultLayoutUrl = '';
      if (defaultLayoutFile) {
  defaultLayoutUrl = useSupabase
    ? await uploadFileToSupabase(defaultLayoutFile)
    : defaultLayoutFile.path;
} else if (req.body[`floor_${i}_defaultLayout_existing`]) {
  defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
}


      // Create unitImages Map for this floor
      const unitImagesMap = new Map();
      
      for (const unitType of selectedUnitTypes) {
        const unitImageFile = files[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}`]?.[0];
        
        if (unitImageFile) {
          const unitImageUrl = useSupabase
            ? await uploadFileToSupabase(unitImageFile)
            : unitImageFile.path;

          // Handle unit variants if they exist
          const unitVariants = safeParseArray(req.body[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variants`]);
          
          // Process variant images if they exist
// Initialize processedVariants
const processedVariants = [];

let variantIndex = 0;
while (true) {
  const nameKey = `floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variant_${variantIndex}_name`;
  const imageKey = `floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variant_${variantIndex}_image`;

  if (!(nameKey in req.body)) break;

  const variantName = req.body[nameKey];
  const variantImageFile = files[imageKey]?.[0];

  if (variantImageFile) {
    const variantImageUrl = useSupabase
      ? await uploadFileToSupabase(variantImageFile)
      : variantImageFile.path;

    processedVariants.push({
      variantName: variantName,
      image: variantImageUrl,
    });
  }

  variantIndex++;
}

unitImagesMap.set(unitType, {
  image: unitImageUrl,
  variants: processedVariants.length > 0 ? processedVariants : undefined,
});

        }
      }

      floorsMap.set(String(i), {
        defaultLayout: defaultLayoutUrl,
        selectedUnitTypes,
        unitImages: unitImagesMap,
      });
    }

    const newProperty: IProperty = new Property({
      title,
      area,
      price,
      mainVideoUrl,
      developer,
      type,
      images: imageUrls,
      brochureFile: brochureUrl,
      quarter,
      year,
      paymentPlans: safeParseObject(paymentPlans),
      faqs: safeParseArray(faqs),
      amenities: safeParseArray(amenities),
      access: safeParseArray(access),
      views: safeParseArray(views),
      description,
      longitude,
      latitude,
      numFloors,
      floors: floorsMap,
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

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      title,
      area,
      price,
      mainVideoUrl,
      developer,
      type,
      quarter,
      year,
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

    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    const propertyImages = files['propertyImages'] || [];
    const brochureFile = files['brochureFile']?.[0];

    let imageUrls = property.images || [];
    if (propertyImages.length > 0) {
      const uploadedImages = useSupabase
        ? await Promise.all(propertyImages.map(img => uploadFileToSupabase(img)))
        : propertyImages.map(img => img.path);
      imageUrls = imageUrls.concat(uploadedImages);
    }

    let brochureUrl = property.brochureFile || '';
    if (brochureFile) {
      brochureUrl = useSupabase
        ? await uploadFileToSupabase(brochureFile)
        : brochureFile.path;
    }

    // Update floors Map
    const floorsMap = new Map();
    for (let i = 0; i < parseInt(numFloors); i++) {
      const defaultLayoutFile = files[`floor_${i}_defaultLayout`]?.[0];
      const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
      
      // Get existing floor data if it exists
      const existingFloor = property.floors.get(i);
      
      let defaultLayoutUrl = existingFloor?.defaultLayout || '';
      if (defaultLayoutFile) {
        defaultLayoutUrl = useSupabase
          ? await uploadFileToSupabase(defaultLayoutFile)
          : defaultLayoutFile.path;
      } else if (req.body[`floor_${i}_defaultLayout_existing`]) {
        defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
      }

      // Create unitImages Map for this floor
      const unitImagesMap = new Map();
      
      // Preserve existing unit images if they exist
      if (existingFloor?.unitImages) {
        for (const [unitType, unitImageData] of existingFloor.unitImages) {
          unitImagesMap.set(unitType, unitImageData);
        }
      }
      
for (const unitType of selectedUnitTypes) {
  const unitKey = unitType.replace(/\s/g, '_');
  const unitImageFile = files[`floor_${i}_unit_${unitKey}`]?.[0];

  const existingUnitData = unitImagesMap.get(unitType) || {};

  let unitImageUrl = existingUnitData.image || '';
  if (unitImageFile) {
    unitImageUrl = useSupabase
      ? await uploadFileToSupabase(unitImageFile)
      : unitImageFile.path;
  }else if (req.body[`floor_${i}_unit_${unitKey}_existing`]) {
  unitImageUrl = req.body[`floor_${i}_unit_${unitKey}_existing`];
}


  // Process variants
  const unitVariants = safeParseArray(req.body[`floor_${i}_unit_${unitKey}_variants`]);
  const processedVariants = [];

  let variantIndex = 0;
  while (true) {
    const nameKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_name`;
    const imageKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_image`;

    if (!(nameKey in req.body)) break;

    const variantName = req.body[nameKey];
    const variantImageFile = files[imageKey]?.[0];

    if (variantImageFile) {
  const variantImageUrl = useSupabase
    ? await uploadFileToSupabase(variantImageFile)
    : variantImageFile.path;

  processedVariants.push({
    variantName: variantName,
    image: variantImageUrl,
  });
} else if (req.body[`${imageKey}_existing`]) {
  processedVariants.push({
    variantName: variantName,
    image: req.body[`${imageKey}_existing`],
  });
} else {
  const previousVariants = existingUnitData?.variants || [];
  const previousVariant = previousVariants.find((v: { variantName: string }) => v.variantName === variantName)
  if (previousVariant) {
    processedVariants.push(previousVariant);
  }
}


    variantIndex++;
  }

  unitImagesMap.set(unitType, {
    image: unitImageUrl,
    variants: processedVariants.length > 0 ? processedVariants : undefined,
  });
}


      floorsMap.set(String(i), {
        defaultLayout: defaultLayoutUrl,
        selectedUnitTypes,
        unitImages: unitImagesMap,
      });
    }

    // Update fields
    property.title = title;
    property.area = area;
    property.price = price;
    property.mainVideoUrl = mainVideoUrl;
    property.developer = developer;
    property.type = type;
    property.images = imageUrls;
    property.brochureFile = brochureUrl;
    property.quarter = quarter;
    property.year = year;
    property.paymentPlans = safeParseObject(paymentPlans);
    property.faqs = safeParseArray(faqs);
    property.amenities = safeParseArray(amenities);
    property.access = safeParseArray(access);
    property.views = safeParseArray(views);
    property.description = description;
    property.longitude = longitude;
    property.latitude = latitude;
    property.numFloors = numFloors;
    // Merge floors: retain untouched floors
const mergedFloors = new Map(property.floors); // clone existing floors

for (const [floorIndex, floorData] of floorsMap.entries()) {
  mergedFloors.set(floorIndex, floorData);
}

property.floors = mergedFloors;


    await property.save();
    res.status(200).json(property);
  } catch (error) {
    console.error('Update Property Error:', error);
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