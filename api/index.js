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

// Table user
// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post('/verify-user', requireAuth, async (req, res) => {
	try {
		const auth0Id = req.auth.payload.sub;
		const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
		const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];
		const nickname = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/nickname`];
		const picture = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/picture`];

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
					nickname,
					picture,
				},
			});

			res.json(newUser);
			console.log(newUser);
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
		return res.status(200).json({
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

// Middleware to authenticate and authorize user
async function requireAuthUser(req, res, next) {
	const auth0Id = req.auth.payload.sub; // From authenticated token payload

	try {
		const user = await prisma.user.findUnique({
			where: { auth0Id },
			select: { id: true },
		});

		console.log('from requireAuthUser get user:', user);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Validate query userId against the authenticated userId
		const queryUserId = parseInt(req.query.userId);

		if (!queryUserId || queryUserId !== user.id) {
			return res.status(403).json({ error: 'Unmatched user id' });
		}
		// Attach userId to the request for downstream use
		req.userId = user.id;
		next();
	} catch (error) {
		console.error('Authentication or Authorization failed:', error);
		return res
			.status(500)
			.json({ error: 'Server error during authentication or authorization' });
	}
}

// Table favorite
// get the list of favorite movies for the authenticated user
app.get('/favorites', requireAuth, requireAuthUser, async (req, res) => {
	console.log('from favorites:', req.userId);
	try {
		// Fetch only the favorite records with their movieId fields
		const favorites = await prisma.favorite.findMany({
			where: {
				userId: req.userId,
			},
			select: {
				movieId: true, // Selecting movieId directly since no relational data needs to be included
				createTime: true, // Optionally include other fields as needed
			},
		});

		res.json(favorites);
	} catch (error) {
		console.error('Failed to fetch favorites:', error);
		res.status(500).json({ error: 'Failed to fetch favorites' });
	}
});

//get the status for a list of movies if they are in the user's favorite list
app.post('/favoritesStatus', requireAuth, async (req, res) => {
	const auth0Id = req.auth.payload.sub;
	const { movieIds } = req.body;

	const favorites = await prisma.favorite.findMany({
		where: {
			userId: auth0Id,
			movieId: {
				in: movieIds,
			},
		},
		select: {
			movieId: true,
		},
	});

	const favoriteMovieIds = favorites.map((favorite) => favorite.movieId);

	res.json(favoriteMovieIds);
});

// add the movie id to the user's favorite list
app.post('/addFavorite', requireAuth, async (req, res) => {
	const auth0Id = req.auth.payload.sub;
	const { movieId } = req.body;

	try {
		const favorite = await prisma.favorite.create({
			data: {
				userId: auth0Id,
				movieId,
			},
		});

		res.json(favorite);
	} catch (error) {
		console.error('Failed to add favorite:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// remove the movie id from the user's favorite list
app.delete('/removeFavorite', requireAuth, async (req, res) => {
	const auth0Id = req.auth.payload.sub;
	const { movieId } = req.body;

	try {
		await prisma.favorite.deleteMany({
			where: {
				userId: auth0Id,
				movieId,
			},
		});

		res.json({ message: 'Favorite removed' });
	} catch (error) {
		console.error('Failed to remove favorite:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Table review

app.listen(8000, () => {
	console.log('Server running on http://localhost:8000 🎉 🚀');
});
