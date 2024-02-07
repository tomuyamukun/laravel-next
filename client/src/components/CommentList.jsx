import { Grid } from '@mui/material'
import React from 'react'
import Comment from '@/components/Comment'
import laravelAxios from '@/lib/laravelAxios'
import { useState } from 'react'

const CommentList = ({ comments, setComments }) => {
    const handleDelete = async commentId => {
        try {
            const response = await laravelAxios.delete(
                `api/comments/${commentId}`,
            )
            const filterdComments = comments.filter(
                comment => comment.id !== commentId,
            )
            setComments(filterdComments)
        } catch (err) {
            console.log(err)
        }
    }

    // 編集用のState
    const [editMode, setEditMode] = useState(null)
    const [editedContent, setEditedContent] = useState('')

    // 編集ボタンを押されたときの処理
    const handleEdit = comment => {
        setEditMode(comment.id)
        setEditedContent(comment.content)
    }

    const handleConfirmEdit = async commentId => {
        try {
            const response = await laravelAxios.put(
                `api/comments/${commentId}`,
                {
                    content: editedContent,
                },
            )
            const updateComment = response.data

            const updateComments = comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        content: updateComment.content,
                    }
                }
                return comment
            })
            setComments(updateComments)
            setEditMode(null)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Grid container spacing={3} sx={{ mt: 2 }}>
            {comments.map(comment => (
                <Grid item xs={12} key={comment.id}>
                    <Comment
                        comment={comment}
                        onDelete={handleDelete}
                        handleEdit={handleEdit}
                        editMode={editMode}
                        editedContent={editedContent}
                        setEditedContent={setEditedContent}
                        handleConfirmEdit={handleConfirmEdit}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default CommentList
