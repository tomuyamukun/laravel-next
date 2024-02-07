import React, { useEffect, useState } from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import laravelAxios from '@/lib/laravelAxios'
import {
    Container,
    Typography,
    Rating,
    Card,
    CardContent,
    Box,
    TextField,
    Button,
} from '@mui/material'
import CommentList from '@/components/CommentList'
const ReviewDetail = () => {
    const router = useRouter()
    const { reviewId } = router.query

    // コメントとレビューはstate管理
    const [review, setReview] = useState(null)
    const [comments, setComments] = useState([])
    const [content, setContent] = useState('')

    // コメントの中身をを反映させる
    const handleChange = e => {
        setContent(e.target.value)
    }

    const handleCommentAdd = async e => {
        e.preventDefault()
        // 中身が空のときは送信しない
        const trimmedContent = content.trim()
        if (!trimmedContent) {
            return
        }

        try {
            const response = await laravelAxios.post(`api/comments`, {
                content: trimmedContent,
                review_id: reviewId,
            })
            // DBに登録後画面二反映
            const newComment = response.data
            setComments([...comments, newComment])
            setContent('')
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!reviewId) return
        const fetchReviewDetail = async () => {
            try {
                const response = await laravelAxios.get(
                    `api/review/${reviewId}`,
                )
                setReview(response.data)
                setComments(response.data.comments)
            } catch (err) {
                console.log(err)
            }
        }
        fetchReviewDetail()
    }, [reviewId])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    ReviewDetail
                </h2>
            }>
            <Head>
                <title>Laravel - ReviewDetail</title>
            </Head>

            <Container sx={{ py: 2 }}>
                {review ? (
                    <>
                        {/* レビュー内容 */}
                        <Card sx={{ minHeight: '200px' }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom>
                                    {review.user.name}
                                </Typography>

                                <Rating
                                    name="read-only"
                                    value={review.rating}
                                    readOnly
                                />

                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p">
                                    {review.content}
                                </Typography>
                            </CardContent>
                        </Card>
                        {/* レビュー内容ここまで */}

                        {/* 返信用のフォーム */}
                        <Box
                            component="form"
                            onSubmit={handleCommentAdd}
                            noValidate
                            autoComplete="off"
                            p={2}
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'flex-start',
                                bgcolor: 'background.paper',
                            }}>
                            <TextField
                                inputProps={{ maxLength: 200 }}
                                error={content.length > 200}
                                helperText={
                                    content.length > 200
                                        ? '200文字を超えています'
                                        : ''
                                }
                                fullWidth
                                label="comment"
                                variant="outlined"
                                value={content}
                                onChange={handleChange}
                                sx={{ mr: 1, flexGrow: 1 }}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                style={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                }}>
                                送信
                            </Button>
                        </Box>
                        {/* 返信用のフォームここまで */}

                        {/* コメント */}
                        <CommentList
                            comments={comments}
                            setComments={setComments}
                        />
                    </>
                ) : (
                    <div>loading...</div>
                )}
            </Container>
        </AppLayout>
    )
}

export default ReviewDetail
