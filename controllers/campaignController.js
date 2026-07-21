import Campaign from "../model/Campaign.js";

export const createCampaign = async (req, res) => {
  try {
    const { title, message, audience, status } = req.body;

    const campaign = await Campaign.create({
      title,
      message,
      audience,
      status,
      user: req.user.id,
    });

    res.status(201).json({ status: "success", data: { campaign } });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id })
      .populate("audience", "name phone")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: campaigns.length,
      data: { campaigns },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("audience", "name phone");
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ status: "success", data: { campaign } });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { title, message, audience, status } = req.body;

    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, message, audience, status },
      { new: true, runValidators: true },
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({ status: "success", data: { campaign } });
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};
