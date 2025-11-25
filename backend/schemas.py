from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class UserProfile(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: Literal["homeowner", "contractor", "architect", "enterprise"] = "homeowner"
    subscription: Literal["free", "basic", "pro", "enterprise"] = "free"
    credits_remaining: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectMetadata(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[dict] = None # { "lat": float, "lng": float, "address": str, "city": str, "country": str }
    status: Literal["draft", "budgeted", "approved", "in_progress", "completed"] = "draft"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BudgetItem(BaseModel):
    elemento: str
    descripcion: str
    cantidad: float
    unidad: str
    precio_unitario: float
    subtotal: float
    apu_origen: str

class Budget(BaseModel):
    items: List[BudgetItem] = []
    total_materials: float = 0
    total_labor: float = 0
    total_contingency: float = 0
    total_final: float = 0
    currency: Literal["CLP", "USD", "EUR"] = "CLP"

class Collaborator(BaseModel):
    role: Literal["owner", "editor", "viewer"] = "viewer"
    invited_at: datetime = Field(default_factory=datetime.utcnow)

class Project(BaseModel):
    metadata: ProjectMetadata
    budget: Budget = Field(default_factory=Budget)
    images: Optional[dict] = None # { "original_image_url": str, "dream_renders": List[str], "progress_photos": List[dict] }
    collaborators: Optional[dict[str, Collaborator]] = None # key is userId
    timeline: Optional[dict] = None # { "milestones": List[dict], "actual_costs": List[dict] }
