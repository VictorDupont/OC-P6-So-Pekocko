const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	console.log(sauceObject);
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Objet enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
	let sauceObject = {};

	req.file
		? (Sauce.findOne({ _id: req.params.id }).then((sauce) => {
				const filename = sauce.imageUrl.split("/images/")[1];
				fs.unlinkSync(`images/${filename}`);
		  }),
		  (sauceObject = {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }))
		: (sauceObject = { ...req.body });

	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Objet modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Objet supprimé !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.likeOrDislikeSauce = (req, res, next) => {
	let rating = req.body.like;

	if (rating === 1) {
		Sauce.updateOne(
			{ _id: req.params.id },
			{ $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
		)
			.then(() =>
				res.status(200).json({
					message: `${req.body.userId} a ajouté un j'aime à la sauce ${req.params.id}`,
				})
			)
			.catch((error) => res.status(400).json({ error }));
	}

	if (rating === -1) {
		Sauce.updateOne(
			{ _id: req.params.id },
			{ $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
		)
			.then(() =>
				res.status(200).json({
					message: `${req.body.userId} a ajouté un dislike à la sauce ${req.params.id}`,
				})
			)
			.catch((error) => res.status(400).json({ error }));
	}

	if (rating === 0) {
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				if (sauce.usersLiked.includes(req.body.userId)) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
					)
						.then(() =>
							res.status(200).json({
								message: `${req.body.userId} a enlevé son j'aime de la sauce ${req.params.id}`,
							})
						)
						.catch((error) => res.status(400).json({ error }));
				} else if (sauce.usersDisliked.includes(req.body.userId)) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }
					)
						.then(() =>
							res.status(200).json({
								message: `${req.body.userId} a enlevé son dislike de la sauce ${req.params.id}`,
							})
						)
						.catch((error) => res.status(400).json({ error }));
				}
			})
			.catch((error) => res.status(404).json({ error }));
	}
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};
