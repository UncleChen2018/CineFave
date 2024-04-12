import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import pkg from '@prisma/client';
import morgan from 'morgan';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER,
	tokenSigningAlg: 'RS256',
});

const app = express();

// Then, use these options with the cors middleware in your Express app
//app.use(cors(corsOptions));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get('/ping', (req, res) => {
	res.send('pong');
});

// add your endpoints below this line
// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post('/verify-user', requireAuth, async (req, res) => {
	try {
		const auth0Id = req.auth.payload.sub;
		const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
		const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

		const user = await prisma.user.findUnique({
			where: {
				auth0Id,
			},
		});

		if (user) {
			res.json(user);
		} else {
			const newUser = await prisma.user.create({
				data: {
					email,
					auth0Id,
					name,
				},
			});

			res.json(newUser);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// get Profile information of authenticated user
app.get('/userProfile', requireAuth, async (req, res) => {
	const auth0Id = req.auth.payload.sub;

	const user = await prisma.user.findUnique({
		where: {
			auth0Id,
		},
	});

	res.json(user);
});

// update Profile information of authenticated user
app.put('/userProfile', requireAuth, async (req, res) => {
	const auth0Id = req.auth.payload.sub;
	const { nickname, bio } = req.body;

	// Initialize an empty object to hold fields to update
	let updateData = {};

	// Add nickname to the update data if it's provided and not empty
	if (nickname && nickname.trim() !== '') {
		updateData.nickname = nickname;
	}

	// Add bio to the update data if it's provided and not empty
	if (bio && bio.trim() !== '') {
		updateData.bio = bio;
	}

	// Check if there's anything to update
	if (Object.keys(updateData).length === 0) {
		return res
			.status(200)
			.json({
				message: 'No updates performed as no valid fields were provided.',
			});
	}

	try {
		const user = await prisma.user.update({
			where: {
				auth0Id,
			},
			data: updateData,
		});

		res.json(user);
	} catch (error) {
		console.error('Failed to update user profile:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(8000, () => {
	console.log('Server running on http://localhost:8000 🎉 🚀');
});
