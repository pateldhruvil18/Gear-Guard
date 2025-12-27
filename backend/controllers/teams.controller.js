import Team from '../models/Team.model.js';

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('members', 'name email avatar role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email avatar role');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    const populatedTeam = await Team.findById(team._id).populate('members', 'name email avatar role');

    res.status(201).json({ success: true, data: populatedTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('members', 'name email avatar role');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    const populatedTeam = await Team.findById(team._id).populate('members', 'name email avatar role');

    res.json({ success: true, data: populatedTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.members = team.members.filter((memberId) => memberId.toString() !== req.params.userId);
    await team.save();

    const populatedTeam = await Team.findById(team._id).populate('members', 'name email avatar role');

    res.json({ success: true, data: populatedTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


