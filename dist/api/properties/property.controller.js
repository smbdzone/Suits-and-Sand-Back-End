"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = void 0;
const property_model_1 = __importDefault(require("../../models/property.model"));
const supabaseClient_1 = __importDefault(require("../../services/supabaseClient"));
const useSupabase = process.env.USE_SUPABASE === 'true';
const uploadFileToSupabase = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = file.buffer;
    const fileName = `${Date.now()}-${file.originalname}`;
    const { error } = yield supabaseClient_1.default.storage
        .from('uploads')
        .upload(fileName, buffer, {
        contentType: file.mimetype,
        upsert: true,
    });
    if (error)
        throw error;
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
});
// Utility parsers
const safeParseArray = (input, fallback = []) => {
    try {
        if (!input || input === 'undefined')
            return fallback;
        return JSON.parse(input);
    }
    catch (err) {
        return fallback;
    }
};
const safeParseObject = (input, fallback = {}) => {
    try {
        if (!input || input === 'undefined')
            return fallback;
        return JSON.parse(input);
    }
    catch (err) {
        return fallback;
    }
};
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const files = req.files;
        const { title, area, price, mainVideoUrl, developer, type, quarter, year, paymentPlans, faqs, amenities, access, views, description, longitude, latitude, numFloors, } = req.body;
        const propertyImages = files['propertyImages'] || [];
        const brochureFile = (_a = files['brochureFile']) === null || _a === void 0 ? void 0 : _a[0];
        let imageUrls = [];
        if (propertyImages.length > 0) {
            imageUrls = useSupabase
                ? yield Promise.all(propertyImages.map(img => uploadFileToSupabase(img)))
                : propertyImages.map(img => img.path);
        }
        let brochureUrl = '';
        if (brochureFile) {
            brochureUrl = useSupabase
                ? yield uploadFileToSupabase(brochureFile)
                : brochureFile.path;
        }
        // Create floors Map
        const floorsMap = new Map();
        for (let i = 0; i < parseInt(numFloors); i++) {
            const defaultLayoutFile = (_b = files[`floor_${i}_defaultLayout`]) === null || _b === void 0 ? void 0 : _b[0];
            const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
            let defaultLayoutUrl = '';
            if (defaultLayoutFile) {
                defaultLayoutUrl = useSupabase
                    ? yield uploadFileToSupabase(defaultLayoutFile)
                    : defaultLayoutFile.path;
            }
            else if (req.body[`floor_${i}_defaultLayout_existing`]) {
                defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
            }
            // Create unitImages Map for this floor
            const unitImagesMap = new Map();
            for (const unitType of selectedUnitTypes) {
                const unitImageFile = (_c = files[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}`]) === null || _c === void 0 ? void 0 : _c[0];
                if (unitImageFile) {
                    const unitImageUrl = useSupabase
                        ? yield uploadFileToSupabase(unitImageFile)
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
                        if (!(nameKey in req.body))
                            break;
                        const variantName = req.body[nameKey];
                        const variantImageFile = (_d = files[imageKey]) === null || _d === void 0 ? void 0 : _d[0];
                        if (variantImageFile) {
                            const variantImageUrl = useSupabase
                                ? yield uploadFileToSupabase(variantImageFile)
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
        const newProperty = new property_model_1.default({
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
        yield newProperty.save();
        res.status(201).json(newProperty);
    }
    catch (error) {
        console.error('Create Property Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createProperty = createProperty;
const getProperties = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield property_model_1.default.find();
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProperties = getProperties;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield property_model_1.default.findById(req.params.id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPropertyById = getPropertyById;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const files = req.files;
        const { title, area, price, mainVideoUrl, developer, type, quarter, year, paymentPlans, faqs, amenities, access, views, description, longitude, latitude, numFloors, } = req.body;
        const property = yield property_model_1.default.findById(req.params.id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        const propertyImages = files['propertyImages'] || [];
        const brochureFile = (_a = files['brochureFile']) === null || _a === void 0 ? void 0 : _a[0];
        let imageUrls = property.images || [];
        if (propertyImages.length > 0) {
            const uploadedImages = useSupabase
                ? yield Promise.all(propertyImages.map(img => uploadFileToSupabase(img)))
                : propertyImages.map(img => img.path);
            imageUrls = imageUrls.concat(uploadedImages);
        }
        let brochureUrl = property.brochureFile || '';
        if (brochureFile) {
            brochureUrl = useSupabase
                ? yield uploadFileToSupabase(brochureFile)
                : brochureFile.path;
        }
        // Update floors Map
        const floorsMap = new Map();
        for (let i = 0; i < parseInt(numFloors); i++) {
            const defaultLayoutFile = (_b = files[`floor_${i}_defaultLayout`]) === null || _b === void 0 ? void 0 : _b[0];
            const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
            // Get existing floor data if it exists
            const existingFloor = property.floors.get(i);
            let defaultLayoutUrl = (existingFloor === null || existingFloor === void 0 ? void 0 : existingFloor.defaultLayout) || '';
            if (defaultLayoutFile) {
                defaultLayoutUrl = useSupabase
                    ? yield uploadFileToSupabase(defaultLayoutFile)
                    : defaultLayoutFile.path;
            }
            else if (req.body[`floor_${i}_defaultLayout_existing`]) {
                defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
            }
            // Create unitImages Map for this floor
            const unitImagesMap = new Map();
            // Preserve existing unit images if they exist
            if (existingFloor === null || existingFloor === void 0 ? void 0 : existingFloor.unitImages) {
                for (const [unitType, unitImageData] of existingFloor.unitImages) {
                    unitImagesMap.set(unitType, unitImageData);
                }
            }
            for (const unitType of selectedUnitTypes) {
                const unitKey = unitType.replace(/\s/g, '_');
                const unitImageFile = (_c = files[`floor_${i}_unit_${unitKey}`]) === null || _c === void 0 ? void 0 : _c[0];
                const existingUnitData = unitImagesMap.get(unitType) || {};
                let unitImageUrl = existingUnitData.image || '';
                if (unitImageFile) {
                    unitImageUrl = useSupabase
                        ? yield uploadFileToSupabase(unitImageFile)
                        : unitImageFile.path;
                }
                else if (req.body[`floor_${i}_unit_${unitKey}_existing`]) {
                    unitImageUrl = req.body[`floor_${i}_unit_${unitKey}_existing`];
                }
                // Process variants
                const unitVariants = safeParseArray(req.body[`floor_${i}_unit_${unitKey}_variants`]);
                const processedVariants = [];
                let variantIndex = 0;
                while (true) {
                    const nameKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_name`;
                    const imageKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_image`;
                    if (!(nameKey in req.body))
                        break;
                    const variantName = req.body[nameKey];
                    const variantImageFile = (_d = files[imageKey]) === null || _d === void 0 ? void 0 : _d[0];
                    if (variantImageFile) {
                        const variantImageUrl = useSupabase
                            ? yield uploadFileToSupabase(variantImageFile)
                            : variantImageFile.path;
                        processedVariants.push({
                            variantName: variantName,
                            image: variantImageUrl,
                        });
                    }
                    else if (req.body[`${imageKey}_existing`]) {
                        processedVariants.push({
                            variantName: variantName,
                            image: req.body[`${imageKey}_existing`],
                        });
                    }
                    else {
                        const previousVariants = (existingUnitData === null || existingUnitData === void 0 ? void 0 : existingUnitData.variants) || [];
                        const previousVariant = previousVariants.find((v) => v.variantName === variantName);
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
        yield property.save();
        res.status(200).json(property);
    }
    catch (error) {
        console.error('Update Property Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProperty = updateProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield property_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Property deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteProperty = deleteProperty;
