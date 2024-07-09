export default function logoutUser(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("error in logout controller");
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
}