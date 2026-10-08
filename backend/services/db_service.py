from typing import List, Optional
from bson import ObjectId
from database.database import get_database

import uuid

class BaseService:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self._memory_store = {} # Fallback in-memory store

    @property
    def collection(self):
        db = get_database()
        if db is not None:
            return db[self.collection_name]
        return None

    def create(self, data: dict) -> dict:
        col = self.collection
        if col is not None:
            result = col.insert_one(data)
            created_doc = col.find_one({"_id": result.inserted_id})
            # Also store stringified version for easy JSON serialization
            if created_doc and "_id" in created_doc:
                created_doc["_id"] = str(created_doc["_id"])
            return created_doc
        else:
            # Fallback to in-memory store
            doc_id = str(uuid.uuid4())
            doc = data.copy()
            doc["_id"] = doc_id
            self._memory_store[doc_id] = doc
            return doc

    def get_all(self) -> List[dict]:
        col = self.collection
        if col is not None:
            return list(col.find({}))
        return list(self._memory_store.values())

    def get_by_id(self, item_id: str) -> Optional[dict]:
        col = self.collection
        if col is not None:
            try:
                return col.find_one({"_id": ObjectId(item_id)})
            except Exception:
                return None
        return self._memory_store.get(item_id)

    def get_by_field(self, field: str, value: str) -> List[dict]:
        col = self.collection
        if col is not None:
            return list(col.find({field: value}))
        return [doc for doc in self._memory_store.values() if doc.get(field) == value]

    def delete_by_field(self, field: str, value: str) -> int:
        """Delete all documents where field == value. Returns deleted count."""
        col = self.collection
        if col is not None:
            result = col.delete_many({field: value})
            return result.deleted_count
        before = len(self._memory_store)
        self._memory_store = {
            k: v for k, v in self._memory_store.items() if v.get(field) != value
        }
        return before - len(self._memory_store)

    def delete_by_id(self, item_id: str) -> bool:
        """Delete a single document by its _id. Returns True if deleted."""
        from bson import ObjectId
        col = self.collection
        if col is not None:
            try:
                result = col.delete_one({"_id": ObjectId(item_id)})
                return result.deleted_count == 1
            except Exception:
                return False
        if item_id in self._memory_store:
            del self._memory_store[item_id]
            return True
        return False

student_service = BaseService("students")
parent_service = BaseService("parents")
assessment_service = BaseService("assessments")
career_service = BaseService("careers")
scholarship_service = BaseService("scholarships")
recommendation_service = BaseService("recommendations")
roadmap_service = BaseService("roadmap")
