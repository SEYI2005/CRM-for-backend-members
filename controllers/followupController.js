import FollowUp from "../model/FollowUp.js";
import Customer from "../model/Customer.js";

export const createFollowUp = async (req, res) => {
  try {
    const { customer, date, note, status } = req.body;

    // FollowUp has no `user` field of its own — confirm this customer belongs
    // to the logged-in user before attaching a follow-up to it
    const ownsCustomer = await Customer.findOne({
      _id: customer,
      user: req.user.id,
    });
    if (!ownsCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const followUp = await FollowUp.create({ customer, date, note, status });

    res.status(201).json({ status: "success", data: { followUp } });
  } catch (error) {
    console.error("Error creating follow-up:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllFollowUps = async (req, res) => {
  try {
    const customerIds = await Customer.find({ user: req.user.id }).distinct(
      "_id",
    );

    const filter = { customer: { $in: customerIds } };
    // ?status=pending / done / missed matches the Pending/Completed/All tabs
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const followUps = await FollowUp.find(filter)
      .populate("customer", "name phone tags")
      .sort("date");

    res.status(200).json({
      status: "success",
      results: followUps.length,
      data: { followUps },
    });
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id).populate(
      "customer",
      "name phone tags user",
    );
    if (!followUp || followUp.customer.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Follow-up not found" });
    }
    res.status(200).json({ status: "success", data: { followUp } });
  } catch (error) {
    console.error("Error fetching follow-up:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFollowUp = async (req, res) => {
  try {
    const { date, note, status } = req.body;

    const followUp = await FollowUp.findById(req.params.id).populate(
      "customer",
      "user",
    );
    if (!followUp || followUp.customer.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    followUp.date = date ?? followUp.date;
    followUp.note = note ?? followUp.note;
    followUp.status = status ?? followUp.status;
    await followUp.save();

    res.status(200).json({ status: "success", data: { followUp } });
  } catch (error) {
    console.error("Error updating follow-up:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id).populate(
      "customer",
      "user",
    );
    if (!followUp || followUp.customer.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    await FollowUp.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Follow-up deleted successfully" });
  } catch (error) {
    console.error("Error deleting follow-up:", error);
    res.status(500).json({ message: "Server error" });
  }
};
