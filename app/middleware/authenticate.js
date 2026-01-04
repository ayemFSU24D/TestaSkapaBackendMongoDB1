import admin from "firebase-admin";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Ingen token");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // lägger UID och info i request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("Ogiltig token");
  }
};
