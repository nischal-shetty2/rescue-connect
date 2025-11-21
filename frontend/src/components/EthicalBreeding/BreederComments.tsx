import React, { useState, useEffect } from 'react'
import { Star, User } from 'lucide-react'
import { getBreederComments, addBreederComment } from '../../services/breedingService'

interface BreederComment {
    _id: string
    breederId: string
    userId: string
    userName: string
    comment: string
    rating: number
    timestamp: string
}

interface BreederCommentsProps {
    breederId: string
    breederName: string
}

const BreederComments: React.FC<BreederCommentsProps> = ({ breederId, breederName }) => {
    const [comments, setComments] = useState<BreederComment[]>([])
    const [newComment, setNewComment] = useState('')
    const [rating, setRating] = useState(5)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchComments()
    }, [breederId])

    const fetchComments = async () => {
        try {
            const data = await getBreederComments(breederId)
            setComments(data)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}')

        if (!user.email) {
            alert('You must be logged in to comment.')
            return
        }

        try {
            await addBreederComment({
                breederId,
                userId: user.id || user.email, // Fallback to email if id not present
                userName: user.name || user.email.split('@')[0],
                comment: newComment,
                rating,
            })
            setNewComment('')
            fetchComments()
        } catch (error) {
            console.error('Error adding comment:', error)
            alert('Failed to add comment')
        }
    }

    if (loading) return <div>Loading comments...</div>

    return (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reviews for {breederName}</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                <Star className="w-6 h-6 fill-current" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        required
                        placeholder="Share your experience with this breeder..."
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    Post Review
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-indigo-100 p-1 rounded-full">
                                        <User className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">{comment.userName}</span>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < comment.rating ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">{comment.comment}</p>
                            <span className="text-xs text-gray-400 mt-2 block">
                                {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default BreederComments
