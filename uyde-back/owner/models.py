from django.db import models

class HousePost(models.Model):
    title=models.CharField(max_length=100)
    description=models.TextField()
    location=models.CharField(max_length=200)
    price=models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    photo=models.ImageField(upload_to="images/",null=True,blank=True)

    def __str__(self):
        return self.title

