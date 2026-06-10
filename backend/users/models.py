from django.contrib.auth.models import AbstractUser
from django.db import models

#AbstractUser Biul in model มี user,pass

class User(AbstractUser):
    ROLE_CHOICES = (
        ('seller', 'Seller'),
        ('buyer', 'Buyer'),
    )
    
    email = models.EmailField(unique=True)
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    REQUIRED_FIELDS = ['email', 'role']

    def __str__(self):
        return f"{self.username} ({self.role})"