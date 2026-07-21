import Customer from "../model/Customer.js";

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, tags } = req.body;

    const customer = await Customer.create({
      name,
      phone,
      email,
      tags,
      user: req.user.id,
    });

    res.status(201).json({ status: "success", data: { customer } });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    // ?tag=vip matches the All/Enterprise/Pro/Starter filter buttons on the frontend
    if (req.query.tag && req.query.tag !== "all") {
      filter.tags = req.query.tag.toLowerCase();
    }

    // ?search=... matches the search bar (name, phone, or email)
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ name: regex }, { phone: regex }, { email: regex }];
    }

    const customers = await Customer.find(filter).sort("-createdAt");

    res
      .status(200)
      .json({
        status: "success",
        results: customers.length,
        data: { customers },
      });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ status: "success", data: { customer } });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { name, phone, email, tags } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, phone, email, tags },
      { new: true, runValidators: true },
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ status: "success", data: { customer } });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
