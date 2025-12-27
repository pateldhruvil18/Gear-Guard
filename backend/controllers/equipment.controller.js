import Equipment from '../models/Equipment.model.js';

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('assignedEmployee', 'name email avatar')
      .populate('defaultMaintenanceTeam', 'name description')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('assignedEmployee', 'name email avatar')
      .populate('defaultMaintenanceTeam', 'name description members');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEquipment = async (req, res) => {
  try {
    // Only managers can create equipment
    if (req.user.role !== 'manager') {
      return res.status(403).json({ 
        message: 'Only managers can create equipment' 
      });
    }

    // Handle assignedEmployee - convert empty string to null
    const equipmentData = { ...req.body };
    if (equipmentData.assignedEmployee === '' || !equipmentData.assignedEmployee) {
      equipmentData.assignedEmployee = null;
    }

    const equipment = await Equipment.create(equipmentData);
    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('assignedEmployee', 'name email avatar')
      .populate('defaultMaintenanceTeam', 'name description');

    res.status(201).json({ success: true, data: populatedEquipment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ${error.path} format` });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    // Only managers can update equipment
    if (req.user.role !== 'manager') {
      return res.status(403).json({ 
        message: 'Only managers can update equipment' 
      });
    }

    // Handle assignedEmployee - convert empty string to null
    const equipmentData = { ...req.body };
    if (equipmentData.assignedEmployee === '' || !equipmentData.assignedEmployee) {
      equipmentData.assignedEmployee = null;
    }

    const equipment = await Equipment.findByIdAndUpdate(req.params.id, equipmentData, {
      new: true,
      runValidators: true,
    })
      .populate('assignedEmployee', 'name email avatar')
      .populate('defaultMaintenanceTeam', 'name description');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ success: true, data: equipment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ${error.path} format` });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    // Only managers can delete equipment
    if (req.user.role !== 'manager') {
      return res.status(403).json({ 
        message: 'Only managers can delete equipment' 
      });
    }

    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEquipmentRequestsCount = async (req, res) => {
  try {
    const Request = (await import('../models/Request.model.js')).default;
    const count = await Request.countDocuments({
      equipment: req.params.id,
      status: { $in: ['new', 'in-progress'] },
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


