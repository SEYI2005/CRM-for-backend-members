import Customer from "../model/Customer.js";
import FollowUp from "../model/FollowUp.js";
import Campaign from "../model/Campaign.js";

export const getDashboardStats = async (req, res) => {
  try {
    const customerIds = await Customer.find({ user: req.user.id }).distinct(
      "_id",
    );

    const [
      totalCustomers,
      customersByTag,
      pendingFollowUps,
      campaignsByStatus,
    ] = await Promise.all([
      Customer.countDocuments({ user: req.user.id }),
      Customer.aggregate([
        { $match: { user: req.user._id } },
        { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
      ]),
      FollowUp.countDocuments({
        customer: { $in: customerIds },
        status: "pending",
      }),
      Campaign.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalCustomers,
        customersByTag,
        pendingFollowUps,
        campaignsByStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
