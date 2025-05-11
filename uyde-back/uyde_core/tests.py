from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from uyde_core.models import Post, Favorite, Review,Photo
from django.core.files.uploadedfile import SimpleUploadedFile
import tempfile


User = get_user_model()


class PostTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.post_data = {
            "title": "Test Apt", "description": "desc", "city": "A", "address": "B",
            "price": 1000, "rooms": 2, "type": "rent_out", "is_active": True
        }

    def test_create_post(self):
        response = self.client.post(reverse('post-list'), self.post_data)
        self.assertEqual(response.status_code, 201)

    def test_list_posts(self):
        Post.objects.create(owner=self.user, **self.post_data)
        response = self.client.get(reverse('post-list'))
        self.assertEqual(response.status_code, 200)

    def test_post_detail(self):
        post = Post.objects.create(owner=self.user, **self.post_data)
        response = self.client.get(reverse('post-detail', args=[post.id]))
        self.assertEqual(response.status_code, 200)

    def test_update_post(self):
        post = Post.objects.create(owner=self.user, **self.post_data)
        data = self.post_data.copy(); data["title"] = "Updated"
        response = self.client.put(reverse('post-detail', args=[post.id]), data)
        self.assertEqual(response.status_code, 200)

    def test_delete_post(self):
        post = Post.objects.create(owner=self.user, **self.post_data)
        response = self.client.delete(reverse('post-detail', args=[post.id]))
        self.assertEqual(response.status_code, 204)

    def test_rent_list(self):
        Post.objects.create(owner=self.user, **self.post_data)
        response = self.client.get(reverse('post-rent-list'))
        self.assertEqual(response.status_code, 200)

    def test_sale_list(self):
        data = self.post_data.copy()
        data["type"] = "sell"
        Post.objects.create(owner=self.user, **data)
        response = self.client.get(reverse('post-sale-list'))
        self.assertEqual(response.status_code, 200)


# 🔹 Reviews
class ReviewTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='pass')
        self.user = User.objects.create_user(username='user', password='pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.post = Post.objects.create(owner=self.owner, title='x', description='x', city='x', address='x', price=1, rooms=1, type='rent_out', is_active=True)
        self.review = Review.objects.create(author=self.user, post=self.post, text='ok', rating=4)

    def test_create_review(self):
        response = self.client.post(reverse('post-reviews-list', args=[self.post.id]), {"text": "great", "rating": 5})
        self.assertEqual(response.status_code, 201)

    def test_list_reviews(self):
        response = self.client.get(reverse('post-reviews-list', args=[self.post.id]))
        self.assertEqual(response.status_code, 200)

    def test_review_detail(self):
        response = self.client.get(reverse('post-reviews-detail', args=[self.post.id, self.review.id]))
        self.assertEqual(response.status_code, 200)

    def test_update_review(self):
        response = self.client.put(reverse('post-reviews-detail', args=[self.post.id, self.review.id]), {"text": "updated", "rating": 3})
        self.assertEqual(response.status_code, 200)

    def test_patch_review(self):
        response = self.client.patch(reverse('post-reviews-detail', args=[self.post.id, self.review.id]), {"rating": 2})
        self.assertEqual(response.status_code, 200)

    def test_delete_review(self):
        response = self.client.delete(reverse('post-reviews-detail', args=[self.post.id, self.review.id]))
        self.assertEqual(response.status_code, 204)


# 🔹 Favorites
class FavoriteTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='pass')
        self.user = User.objects.create_user(username='user', password='pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.post = Post.objects.create(owner=self.owner, title='x', description='x', city='x', address='x', price=1, rooms=1, type='rent_out', is_active=True)
        self.favorite = Favorite.objects.create(seeker=self.user, post=self.post)

    def test_add_favorite(self):
        Favorite.objects.all().delete()
        response = self.client.post(reverse('user-favorites-list', args=[self.user.id]), {"post": self.post.id})
        self.assertEqual(response.status_code, 201)

    def test_list_favorites(self):
        response = self.client.get(reverse('user-favorites-list', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)

    def test_favorite_detail(self):
        response = self.client.get(reverse('user-favorites-detail', args=[self.user.id, self.favorite.id]))
        self.assertEqual(response.status_code, 200)

    def test_update_favorite(self):
        response = self.client.put(reverse('user-favorites-detail', args=[self.user.id, self.favorite.id]), {"post": self.post.id})
        self.assertEqual(response.status_code, 200)

    def test_patch_favorite(self):
        response = self.client.patch(reverse('user-favorites-detail', args=[self.user.id, self.favorite.id]), {})
        self.assertEqual(response.status_code, 200)

    def test_delete_favorite(self):
        response = self.client.delete(reverse('user-favorites-detail', args=[self.user.id, self.favorite.id]))
        self.assertEqual(response.status_code, 204)


# 🔹 Users + Auth
class UserAndAuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)

    def test_register(self):
        data = {"username": "u", "password": "123", "email": "a@a.com"}
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, 201)

    def test_login(self):
        data = {"username": "testuser", "password": "testpass"}
        response = self.client.post(reverse('login'), data)
        self.assertEqual(response.status_code, 200)

    def test_user_list(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, 200)

    def test_me(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('current-user'))
        self.assertEqual(response.status_code, 200)


# 🔹 User Posts
class UserPostTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u', password='p')
        self.token = Token.objects.create(user=self.user)
        self.post = Post.objects.create(owner=self.user, title='x', description='x', city='x', address='x', price=1, rooms=1, type='rent_out', is_active=True)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_user_posts_list(self):
        response = self.client.get(reverse('user-posts-list', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)

    def test_user_post_detail(self):
        response = self.client.get(reverse('user-posts-detail', args=[self.user.id, self.post.id]))
        self.assertEqual(response.status_code, 200)



User = get_user_model()

class PhotoTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='photouser', password='pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.post = Post.objects.create(
            owner=self.user,
            title='photo', description='photo',
            city='a', address='b',
            price=100, rooms=1,
            type='rent_out', is_active=True
        )

        self.image_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        self.photo = Photo.objects.create(post=self.post, image=self.image_file)

    def test_list_photos(self):
        url = reverse('post-photos-list', args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_photo_detail(self):
        url = reverse('post-photos-detail', args=[self.post.id, self.photo.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_delete_photo(self):
        url = reverse('post-photos-detail', args=[self.post.id, self.photo.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)


