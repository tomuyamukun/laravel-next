import React, { useEffect, useState } from 'react'
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
    Modal,
    Button,
    TextareaAutosize,
    Fab,
    ButtonGroup,
} from '@mui/material'
import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'
import StarIcon from '@mui/icons-material/Star'
import { useAuth } from '@/hooks/auth'

// フロント表示
const Detail = ({ detail, media_type, media_id }) => {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    // レビューを登録したあとレビュー一覧二追加するため
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(null)
    const { user } = useAuth({ middleware: 'auth' })

    // 編集用のState
    const [editMode, setEditMode] = useState(null)
    const [editedRating, setEditedRating] = useState(null)
    const [editedContent, setEditedContent] = useState('')

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleReviewChange = e => {
        setReview(e.target.value)
    }
    const handleRatingChange = (e, newValue) => {
        setRating(newValue)
    }

    const isButtonDisabled = (rating, content) => {
        return !rating || !content.trim()
    }

    const isReviewButtonDisabled = isButtonDisabled(rating, review)
    const isEditButtonDisabled = isButtonDisabled(editedRating, editedContent)

    // レビュー追加時の挙動
    const handleReviewAdd = async () => {
        // 送信したタイミングでモーダルを閉じる
        handleClose()
        try {
            const response = await laravelAxios.post(`api/reviews`, {
                content: review,
                rating: rating,
                media_type: media_type,
                media_id: media_id,
            })
            console.log(response.data)
            const newReview = response.data
            setReviews([...reviews, newReview])

            // 初期値に戻す
            setReview('')
            setRating(0)

            const updateReviews = [...reviews, newReview]
            updateAverageRating(updateReviews)
        } catch (err) {
            console.log(err)
        }
    }

    // 星の平均値の更新
    const updateAverageRating = updateReviews => {
        if (updateReviews.length > 0) {
            // レビューの星の合計値を計算
            const totalRating = updateReviews.reduce(
                (acc, review) => acc + review.rating,
                0,
            )

            const averageRating = (totalRating / updateReviews.length).toFixed(
                1,
            )
            setAverageRating(averageRating)
        } else {
            // レビューが空の場合星をなくす
            setAverageRating(null)
        }
    }

    // レビュー削除ボタン押下時の挙動
    const handleDelete = async id => {
        if (window.confirm('レビューを削除してもよろしいですか？')) {
            try {
                const response = await laravelAxios.delete(`api/reviews/${id}`)
                const filterdReviews = reviews.filter(
                    review => review.id !== id,
                )
                setReviews(filterdReviews)
                updateAverageRating(filterdReviews)
            } catch (err) {
                console.log(err)
            }
        }
    }

    // 編集ボタンを押されたときの処理
    const handleEdit = review => {
        setEditMode(review.id)
        setEditedRating(review.rating)
        setEditedContent(review.content)
    }

    // 編集確定ボタンを押したときの処理
    const handleConfirmEdit = async reviewId => {
        try {
            const response = await laravelAxios.put(`api/review/${reviewId}`, {
                content: editedContent,
                rating: editedRating,
            })
            const updatedReview = response.data

            const updatedReviews = reviews.map(review => {
                if (review.id === reviewId) {
                    return {
                        ...review,
                        content: updatedReview.content,
                        rating: updatedReview.rating,
                    }
                }
                return reviews
            })

            // レビューを更新
            setReviews(updatedReviews)
            // 編集モードを終了
            setEditMode(null)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await laravelAxios.get(
                    `/api/reviews/${media_type}/${media_id}`,
                )
                const fetchReviews = response.data
                setReviews(fetchReviews)
                updateAverageRating(fetchReviews)
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
                            <Box
                                gap={2}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}>
                                <Rating
                                    readOnly
                                    precision={0.5}
                                    value={parseFloat(averageRating)}
                                    emptyIcon={
                                        <StarIcon style={{ color: 'white' }} />
                                    }
                                />
                                <Typography
                                    sx={{
                                        ml: 1,
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                    }}>
                                    {averageRating}
                                </Typography>
                            </Box>
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
                                    {/* ユーザー名 */}
                                    <Typography
                                        variant="h6"
                                        component={'div'}
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>
                                    {editMode === review.id ? (
                                        <>
                                            {/* 編集ボタンを押されたときの見た目 */}
                                            <Rating
                                                value={editedRating}
                                                onChange={(e, newValue) =>
                                                    setEditedRating(newValue)
                                                }
                                            />
                                            <TextareaAutosize
                                                minRows={3}
                                                style={{ width: '100%' }}
                                                value={editedContent}
                                                onChange={e => {
                                                    setEditedContent(
                                                        e.target.value,
                                                    )
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {/* 星 */}
                                            <Rating
                                                value={review.rating}
                                                readOnly
                                            />
                                            {/* レビュー内容 */}
                                            <Typography
                                                valiant="body2"
                                                color="textSecondary"
                                                paragraph>
                                                {review.content}
                                            </Typography>
                                        </>
                                    )}

                                    {user?.id === review.user.id && (
                                        <Grid
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                            {editMode === review.id ? (
                                                // 編集中の表示
                                                <Button
                                                    disabled={
                                                        isEditButtonDisabled
                                                    }
                                                    onClick={() =>
                                                        handleConfirmEdit(
                                                            review.id,
                                                        )
                                                    }>
                                                    編集確定
                                                </Button>
                                            ) : (
                                                <ButtonGroup>
                                                    <Button
                                                        onClick={() =>
                                                            handleEdit(review)
                                                        }>
                                                        編集
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                review.id,
                                                            )
                                                        }>
                                                        削除
                                                    </Button>
                                                </ButtonGroup>
                                            )}
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* レビュー情報ここまで */}

            {/* レビュー追加ボタン */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 5,
                }}>
                <Tooltip title="レビュー追加">
                    <Fab
                        style={{ background: 'blue', color: 'white' }}
                        onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>
            {/* レビュー追加ボタンここまで */}

            {/* モーダルウィンドウ */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid, #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <Typography variant="h6" component="h2">
                        レビューを書く
                    </Typography>

                    <Rating
                        required
                        onChange={handleRatingChange}
                        value={rating}
                    />
                    <TextareaAutosize
                        required
                        minRows={5}
                        placeholder="レビュー内容"
                        style={{ width: '100%', marginTop: '10px' }}
                        onChange={handleReviewChange}
                        value={review}
                    />

                    <Button
                        variant="outlined"
                        disabled={isButtonDisabled}
                        onClick={handleReviewAdd}>
                        送信
                    </Button>
                </Box>
            </Modal>
            {/* モーダルウィンドウここまで */}
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
