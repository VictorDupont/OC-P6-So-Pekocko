const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");

const userSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: [true, "Veuillez entrer votre adresse email."],
	},
	password: {
		type: String,
		required: [true, "Veuillez entrer votre mot de passe."],
	},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
