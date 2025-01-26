class User(object):
    def __init__(self, user_id, username, password, email, phone, bill):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.email = email
        self.phone = phone
        self.bill = bill
    
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "password": self.password,
            "email": self.email,
            "phone": self.phone,
            "bill": self.bill
        }