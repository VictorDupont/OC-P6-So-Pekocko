const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("../middleware/crypt");
const user = require("../models/User");
const User = require("../models/User");
require("dotenv").config();

exports.signup = (req, res, next) => {
	let validateEmail = function (email) {
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return re.test(email);
	};

	if (validateEmail(req.body.email)) {
		let encryptedEmail = encrypt(req.body.email, process.env.SECRET_KEY);
		bcrypt
			.hash(req.body.password, 12)
			.then((hashPassword) => {
				const user = new User({
					email: encryptedEmail,
					password: hashPassword,
				});
				user.save()
					.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
					.catch((error) => {
						res.status(500).json({ error });
					});
			})
			.catch((error) => res.status(500).json({ error }));
	} else {
		res.writeHead(400, '{"message":"L\'adresse email renseignée n\'est pas valide !"}', {
			"content-type": "application/json",
		});
		res.end("L'adresse email renseignée n'est pas valide !");
	}
};

exports.login = (req, res, next) => {
	User.findOne({ email: encrypt(req.body.email, process.env.SECRET_KEY) })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
							expiresIn: "24h",
						}),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
