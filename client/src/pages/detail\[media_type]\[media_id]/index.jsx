import { React, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import {
    Box,
    Container,
    Grid,
    Typography,
    Rating,
    Card,
    CardContent,
} from '@mui/material'
import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'

// フロント表示
const Detail = ({ detail, media_type, media_id }) => {
    const reviews = [
        {
            id: '1',
            content: '面白かった',
            rating: 3,
            user: {
                name: '山田',
            },
        },
        {
            id: '2',
            content: '微妙',
            rating: 2,
            user: {
                name: '棚k',
            },
        },
        {
            id: '3',
            content: '面白かった',
            rating: 5,
            user: {
                name: '治郎',
            },
        },
    ]

    // const [reviews, setReviews] = useState([])
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await laravelAxios.get(
                    `/api/reviews/${media_type}/${media_id}`,
                )
                // setReviews(response.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchReviews()
    }, [media_type, media_id])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail
                </h2>
            }>
            <Head>
                <title>Laravel - Detail</title>
            </Head>

            {/* 映画情報ここから */}
            <Box
                sx={{
                    height: { xs: 'auto', md: '70vh' },
                    bgcolor: 'red',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original/${detail.backdrop_path})`,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                />
                <Container sx={{ zIndex: 1 }}>
                    <Grid
                        container
                        alignItems={'center'}
                        sx={{ color: 'white' }}>
                        <Grid
                            item
                            md={4}
                            sx={{ display: 'flex', justifyContent: 'center' }}>
                            <img
                                width={'70%'}
                                src={`https://image.tmdb.org/t/p/original/${detail.poster_path}`}
                                alt=""
                            />
                        </Grid>
                        <Grid item md={8}>
                            <Typography variant="h4" paragraph>
                                {detail.title || detail.name}
                            </Typography>
                            <Typography paragraph>{detail.overview}</Typography>
                            <Typography variant="h6">
                                {media_type == 'movie'
                                    ? `公開日：${detail.release_date}`
                                    : `初回放送日：${detail.first_air_date}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* 映画情報ここまで */}

            {/*  レビュー情報 */}
            <Container sx={{ py: 4 }}>
                <Typography
                    component={'h1'}
                    variant="h4"
                    align="center"
                    gutterBottom>
                    レビュー一覧
                </Typography>

                <Grid container spacing={3}>
                    {reviews.map(review => (
                        <Grid item xs={12} key={review.id}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component={'div'}
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>
                                    <Rating value={review.rating} readOnly />
                                    <Typography
                                        valiant="body2"
                                        color="textSecondary"
                                        paragraph>
                                        {review.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </AppLayout>
    )
}

// サーバー側API通信
export async function getServerSideProps(context) {
    const { media_type, media_id } = context.params

    try {
        const jpResponse = await axios.get(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-jp`,
        )

        let combinedData = { ...jpResponse.data }
        if (!jpResponse.data.overview) {
            const enResponse = await axios.get(
                `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
            )
            combinedData.overview = enResponse.data.overview
        }

        return {
            props: { detail: combinedData, media_type, media_id },
        }
    } catch {
        return { notFound: true }
    }
}
export default Detail
