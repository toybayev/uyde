// import React, { useState, useEffect } from 'react';
//
// const FavoriteButton = ({ userPk, postPk, token }) => {
//     const [isFavorite, setIsFavorite] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//
//     useEffect(() => {
//         const checkFavorite = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8000/api/users/${userPk}/favorites/`, {
//                     headers: {
//                         'Authorization': `Token ${token}`,
//                     },
//                 });
//                 const data = await response.json();
//                 setIsFavorite(data.some(fav => fav.post.id === postPk));  // Проверка, есть ли этот пост в избранном
//             } catch (error) {
//                 setError(error.message);
//             }
//         };
//
//         checkFavorite();
//     }, [userPk, postPk, token]);
//
//     const handleToggleFavorite = async () => {
//         setLoading(true);
//         try {
//             const method = isFavorite ? 'DELETE' : 'POST';
//             const response = await fetch(`http://localhost:8000/api/users/${userPk}/favorites/`, {
//                 method,
//                 headers: {
//                     'Authorization': `Token ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     post: postPk,  // ID поста
//                 }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Failed to toggle favorite');
//             }
//
//             setIsFavorite(!isFavorite);
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <button onClick={handleToggleFavorite} disabled={loading}>
//             {loading ? 'Saving...' : isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
//         </button>
//     );
// };
//
// export default FavoriteButton;
