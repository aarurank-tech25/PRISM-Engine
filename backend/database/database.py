import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
import logging

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "prism_engine")

logger = logging.getLogger(__name__)

class Database:
    client: MongoClient = None

    @classmethod
    def connect_db(cls):
        try:
            cls.client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            # Verify connection
            cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB.")
        except ConnectionFailure as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            cls.client = None

    @classmethod
    def close_db(cls):
        if cls.client:
            cls.client.close()
            logger.info("Closed MongoDB connection.")

    @classmethod
    def get_db(cls):
        if cls.client is None:
            # Try connecting if not already connected (useful if app doesn't call connect_db)
            cls.connect_db()
        if cls.client:
            return cls.client[DATABASE_NAME]
        return None

db_instance = Database()

def get_database():
    return db_instance.get_db()
