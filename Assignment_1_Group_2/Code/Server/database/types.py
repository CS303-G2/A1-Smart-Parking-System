class User(object):
    def __init__(self, user_id, username, password, email, phone, bill):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.email = email
        self.phone = phone
        self.bill = bill

    def __str__(self):
        return f"Username: {self.username}, Email: {self.email}, Phone: {self.phone}"