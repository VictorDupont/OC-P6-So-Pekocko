const jwt = require("jsonwebtoken");
const Sauce = require("../models/Sauce");
require("dotenv").config();

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
		const userId = decodedToken.userId;

		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				let sauceOwner = sauce.userId;
				if (sauceOwner !== userId) {
					throw "Vous n'êtes pas le propriétaire de la sauce !";
				} else {
					next();
				}
			})
			.catch((error) => res.status(403).json({ error }));
	} catch (error) {
		res.status(401).json({ error: error | "Requête non authentifiée !" });
	}
};
