import { Request, Response } from 'express';
import Property from '../../models/property.model';

// Get all properties
export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single property by ID
export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new property
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      area,
      price,
      developer,
      type,
      description,
      googleMapsEmbedLink,
      paymentPlans,
      faqs,
      features,
      mainVideoUrl,
      floors
    } = req.body;

    // Check for missing required fields
    const requiredFields = {
      title,
      area,
      price,
      developer,
      type,
      description,
      googleMapsEmbedLink,
      mainVideoUrl
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      res.status(400).json({
        message: 'Please provide all required fields',
        missingFields
      });
      return;
    }

    // Validate Google Maps embed link
    if (!googleMapsEmbedLink.startsWith('https://www.google.com/maps/embed')) {
      res.status(400).json({ message: 'Please provide a valid Google Maps embed link.' });
      return;
    }

    // Parse JSON fields safely
    let paymentPlansParsed = [];
    let faqsParsed = [];
    let featuresParsed = [];
    let floorsParsed = {};

    try {
      paymentPlansParsed = JSON.parse(paymentPlans || '[]');
    } catch (err) {
      console.error('Invalid paymentPlans JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for paymentPlans' });
      return;
    }

    try {
      faqsParsed = JSON.parse(faqs || '[]');
    } catch (err) {
      console.error('Invalid faqs JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for faqs' });
      return;
    }

    try {
      featuresParsed = JSON.parse(features || '[]');
    } catch (err) {
      console.error('Invalid features JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for features' });
      return;
    }

    try {
      floorsParsed = JSON.parse(floors || '{}');
    } catch (err) {
      console.error('Invalid floors JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for floors' });
      return;
    }

    // Create new property document
    const newProperty = new Property({
      title,
      area,
      mainVideoUrl,
      price,
      images: [],
      developer,
      type,
      description,
      googleMapsEmbedLink,
      paymentPlans: paymentPlansParsed,
      faqs: faqsParsed,
      features: featuresParsed,
      floors: floorsParsed
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update property
export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      area,
      price,
      developer,
      type,
      description,
      googleMapsEmbedLink,
      paymentPlans,
      faqs,
      features,
      mainVideoUrl,
      floors
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFiles = files?.images || [];
    const brochureFile = files?.brochure?.[0];

    const updateData: any = {
      title,
      area,
      price,
      developer,
      type,
      description,
      googleMapsEmbedLink,
    };

    if (imageFiles.length > 0) {
      updateData.images = imageFiles.map(file => `/uploads/${file.filename}`);
    }

    if (brochureFile) {
      updateData.brochure = `/uploads/${brochureFile.filename}`;
    }

    if (mainVideoUrl) {
      updateData.mainVideoUrl = mainVideoUrl;
    }

    // Parse JSON fields safely
    try {
      if (paymentPlans) updateData.paymentPlans = JSON.parse(paymentPlans);
    } catch (err) {
      console.error('Invalid paymentPlans JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for paymentPlans' });
      return;
    }

    try {
      if (faqs) updateData.faqs = JSON.parse(faqs);
    } catch (err) {
      console.error('Invalid faqs JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for faqs' });
      return;
    }

    try {
      if (features) updateData.features = JSON.parse(features);
    } catch (err) {
      console.error('Invalid features JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for features' });
      return;
    }

    try {
      if (floors) updateData.floors = JSON.parse(floors);
    } catch (err) {
      console.error('Invalid floors JSON:', err);
      res.status(400).json({ message: 'Invalid JSON for floors' });
      return;
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProperty) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    res.json(updatedProperty);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete property
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Additional floor-specific controllers

// Get floors for a specific property
export const getPropertyFloors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    res.json(property.floors);
  } catch (error) {
    console.error('Get property floors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update specific floor data
export const updatePropertyFloor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, floorNumber } = req.params;
    const { defaultLayout, unitImages, selectedUnitTypes } = req.body;

    const property = await Property.findById(id);
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Parse unitImages if it's a string
    let unitImagesParsed = unitImages;
    if (typeof unitImages === 'string') {
      try {
        unitImagesParsed = JSON.parse(unitImages);
      } catch (err) {
        console.error('Invalid unitImages JSON:', err);
        res.status(400).json({ message: 'Invalid JSON for unitImages' });
        return;
      }
    }

    // Parse selectedUnitTypes if it's a string
    let selectedUnitTypesParsed = selectedUnitTypes;
    if (typeof selectedUnitTypes === 'string') {
      try {
        selectedUnitTypesParsed = JSON.parse(selectedUnitTypes);
      } catch (err) {
        console.error('Invalid selectedUnitTypes JSON:', err);
        res.status(400).json({ message: 'Invalid JSON for selectedUnitTypes' });
        return;
      }
    }

    // Update floor data
    const floorData = {
      defaultLayout: defaultLayout || '',
      unitImages: unitImagesParsed || {},
      selectedUnitTypes: selectedUnitTypesParsed || []
    };

    // Cast to Map to use Map methods
    (property.floors as unknown as Map<string, any>).set(floorNumber, floorData);
    await property.save();

    res.json({ message: 'Floor updated successfully', floor: floorData });
  } catch (error) {
    console.error('Update property floor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete specific floor
export const deletePropertyFloor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, floorNumber } = req.params;

    const property = await Property.findById(id);
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Cast to Map to use Map methods
    (property.floors as unknown as Map<string, any>).delete(floorNumber);
    await property.save();

    res.json({ message: 'Floor deleted successfully' });
  } catch (error) {
    console.error('Delete property floor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};