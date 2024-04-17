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

	updateData.bio = bio;

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

		

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
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

// API for favorite movies
// get the list of favorite movies for the authenticated user
app.get('/favorites', requireAuth, requireAuthUser, async (req, res) => {
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

app.post(
	'/toggleFavorite/:movieId',
	requireAuth,
	requireAuthUser,
	async (req, res) => {
		const userId = req.userId; // Assuming requireAuthUser sets req.userId
		const { movieId } = req.params;
		const movieDetails = req.body.movie; // Assuming movie details are sent in the request body
		

		try {
			// Check if the movie is already in FavMovie table
			let favMovie = await prisma.favMovie.upsert({
				where: {
					id: parseInt(movieId),
				},
				update: {
					title: movieDetails.title,
					releaseDate: movieDetails.releaseDate
						? new Date(movieDetails.releaseDate)
						: undefined,
					rating: movieDetails.rating
						? parseFloat(movieDetails.rating)
						: undefined,
					imageUrl: movieDetails.imageUrl,
				},
				create: {
					id: parseInt(movieId),
					title: movieDetails.title,
					releaseDate: new Date(movieDetails.releaseDate),
					rating: parseFloat(movieDetails.rating),
					imageUrl: movieDetails.imageUrl,
				},
			});

			const favorite = await prisma.favorite.findUnique({
				where: {
					userId_movieId: {
						userId: userId,
						movieId: parseInt(movieId),
					},
				},
			});

			let response;
			// If it's a favorite, remove it, else add it
			if (favorite) {
				await prisma.favorite.delete({
					where: {
						userId_movieId: {
							userId: userId,
							movieId: parseInt(movieId),
						},
					},
				});
				response = { message: 'Favorite removed', movieId, favorited: false };
			} else {
				await prisma.favorite.create({
					data: {
						userId: userId,
						movieId: favMovie.id, // Use the id from FavMovie
					},
				});
				response = { message: 'Favorite added', movieId, favorited: true };
			}

			res.json(response);
		} catch (error) {
			console.error('Failed to toggle favorite:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
);

app.get(
	'/favorites/details',
	requireAuth,
	requireAuthUser,
	async (req, res) => {

		try {
			// Fetch favorite records and include related FavMovie details
			const favorites = await prisma.favorite.findMany({
				where: {
					userId: req.userId,
				},
				select: {
					movieId: true, // Selecting movieId directly
					createTime: true, // Optionally include other fields as needed
					favMovie: {
						// Include the related FavMovie details
						select: {
							id: true,
							title: true,
							releaseDate: true,
							rating: true,
							imageUrl: true,
						},
					},
				},
				orderBy: {
					createTime: 'desc', // Order by createTime in ascending order
				},
			});

			res.json(favorites);
		} catch (error) {
			console.error('Failed to fetch favorites:', error);
			res.status(500).json({ error: 'Failed to fetch favorites' });
		}
	}
);

// might not need this endpoint
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

// API of movies' reviews
// post a review for a movie
app.post(
	'/movies/:movieId/reviews',
	requireAuth,
	requireAuthUser,
	async (req, res) => {
		const userId = req.userId; // Assuming requireAuthUser sets req.userId
		const { movieId } = req.params;
		const reviewData = req.body;
	
		if (
			!reviewData ||
			!reviewData.content ||
			reviewData.content.trim() === ''
		) {
			return res.status(400).json({ error: 'Review content is required' });
		}

		try {
			const review = await prisma.review.create({
				data: {
					title: reviewData.title?.trim(),
					content: reviewData.content,
					rating: reviewData.rating,
					userId,
					movieId: parseInt(movieId),
				},
			});

			res.json(review);
		} catch (error) {
			console.error('Failed to post review:', error);
			res.status(500).json({ error: 'Failed to post review' });
		}
	}
);

// get the list of reviews for a movie
// no need to authenticate to get the reviews
app.get('/movies/:movieId/reviews', async (req, res) => {
	const { movieId } = req.params;

	try {
		const reviews = await prisma.review.findMany({
			where: {
				movieId: parseInt(movieId),
				status: 0, // assuming we only want to fetch reviews with status 'valid'
			},
			include: {
				user: {
					select: {
						name: true,
						nickname: true,
						picture: true,
					},
				},
			},
			orderBy: {
				createTime: 'desc',
			},
		});

		res.json(reviews);
	} catch (error) {
		console.error('Failed to fetch reviews:', error);
		res.status(500).json({ error: 'Failed to fetch reviews' });
	}
});

// Get all reviews published by the authenticated user
app.get('/user/reviews', requireAuth, requireAuthUser, async (req, res) => {
	const userId = req.userId; // Set by requireAuthUser middleware

	try {
		const reviews = await prisma.review.findMany({
			where: {
				userId: userId,
				status: 0, // Only fetch reviews that are not deleted
			},
			include: {
				user: {
					select: {
						name: true,
						nickname: true,
						picture: true,
					},
				},
			},
			orderBy: {
				createTime: 'desc',
			},
		});
		res.json(reviews);
	} catch (error) {
		console.error('Failed to get reviews:', error);
		res.status(500).json({ error: 'Failed to get reviews' });
	}
});

// API of reviews
// Update a review by review ID
app.put(
	'/reviews/:reviewId',
	requireAuth,
	requireAuthUser,
	async (req, res) => {
		const { reviewId } = req.params;
		const userId = req.userId; // Set by requireAuthUser middleware
		const { title, content, rating } = req.body;
		

		try {
			const review = await prisma.review.findUnique({
				where: {
					id: parseInt(reviewId),
					status: 0, // assuming we only want to fetch reviews with status 'valid'
				},
			});

			if (!review || review.userId !== userId) {
				return res
					.status(403)
					.json({ error: 'You do not have permission to update this review.' });
			}

			const updatedReview = await prisma.review.update({
				where: {
					id: parseInt(reviewId),
				},
				data: {
					title: title?.trim(),
					content,
					rating: parseFloat(rating),
				},
			});
			res.json(updatedReview);
		} catch (error) {
			console.error('Failed to update review:', error);
			res.status(500).json({ error: 'Failed to update review' });
		}
	}
);

// Delete a review by review ID
app.delete(
	'/reviews/:reviewId',
	requireAuth,
	requireAuthUser,
	async (req, res) => {
		const { reviewId } = req.params;
		const userId = req.userId; // Set by requireAuthUser middleware

		try {
			const review = await prisma.review.findUnique({
				where: { id: parseInt(reviewId) },
			});

			if (!review || review.userId !== userId) {
				return res
					.status(403)
					.json({ error: 'You do not have permission to delete this review.' });
			}

			const deletedReview = await prisma.review.update({
				where: {
					id: parseInt(reviewId),
				},
				data: {
					status: 1, // Soft delete by updating the status to deleted by user
				},
			});
			res.json(deletedReview);
		} catch (error) {
			console.error('Failed to delete review:', error);
			res.status(500).json({ error: 'Failed to delete review' });
		}
	}
);

app.listen(8000, () => {
	console.log('Server running on http://localhost:8000 🎉 🚀');
});
