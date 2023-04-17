import Bookmark from "../Models/Bookmark_model.js";
export const createBookmark = async (req, res) => {
  const { userId, partyId } = req.body;
  try {
    const bookmark = await Bookmark.create({
      user_id: userId,
      party_id: partyId,
    });
    res.status(201).json({ msg: "Register Successful!", bookmark });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Bookmark already exists" });
  }
};

export const getBookmarks = async (req, res) => {
  console.log(req.params);
  const { userId } = req.params;
  try {
    const bookmarks = await Bookmark.findAll({ where: { user_id: userId } });
    res.status(200).json({ bookmarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await bookmark.destroy();

    return res.status(204).json({ message: "Bookmark deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
