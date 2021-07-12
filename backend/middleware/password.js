const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
	if (!passwordSchema.validate(req.body.password)) {
		res.writeHead(
			400,
			'{"message":"Mot de passe requis : 12 à 30 caractères, 1 majuscule, 1 minuscule, 2 chiffres et sans espaces"}',
			{
				"content-type": "application/json",
			}
		);
		res.end("Le mot de passe renseigné est incorrect");
	} else {
		next();
	}
};
