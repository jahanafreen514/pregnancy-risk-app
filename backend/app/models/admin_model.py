from beanie import Document


class AdminSettings(Document):

    key: str

    value: str


    class Settings:
        name = "admin_settings"