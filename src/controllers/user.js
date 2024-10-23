import { users } from "../appwrite/config.js";

export const addLabel = async (req, res) => {
  try {
    // user id from the accounts and not the database(database id)
    const { userId, label } = req.body;
    if (!userId || !label) {
      return res.status(400).json({ message: "Label or userId is required" });
    }

    const result = await users.updateLabels(userId, [label]);

    if (!result) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to add label" });
    }

    return res.status(200).json({ status: true, message: "Label added" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
