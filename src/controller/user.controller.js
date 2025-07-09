import { User } from "../database/DAO/index.js";

const userController = {
	/*register: async (req, res) => {
		console.log(req.body);
		const { firstName, lastName, email, phone } = req.body;
		try {
			let dbUser = await User.findByEmail(email);
			if (dbUser) {
				throw new Error("User already exists");
			}
			const newUser = await User.createUser({
				firstName,
				lastName,
				email,
				phone,
				enabled: 0,
				uuid: crypto.randomUUID(),
			});
			
			const secureCode = codeGenerator();
			await User.createSecurity({
				userID: newUser.id,
				secureCode,
				secureCodeDate: new Date(),
			});
			sendMail(
				email,
				"Confirmación de registro",
				"Por favor, confirma tu registro",
				`<html>
					<h1>Tu codigo es ${secureCode}</h1>
					<h1>Por favor, confirma tu registro</h1>
					<a href="http://localhost:3000/confirm/${newUser.uuid}/${secureCode}">Confirmar</a>
				</html>`
			);
			res.status(201).json(newUser);
		} catch (error) {
			console.log(error);
			res.status(500).json({error: error.message});
		}

	},
	getCart: (req, res) => {
		res.status(500).json({ error: "Internal server error" });
	},
	addProductToCart: (req, res) => {
		res.status(500).json({ error: "Internal server error" });
	},
	generateToken: async (req, res) => {
		let prueba = await generateToken({ id: 1, name: "CoioteSN" })
		res.json({ prueba });
	},*/
};

export default userController;
