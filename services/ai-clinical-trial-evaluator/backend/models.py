from pydantic import BaseModel, Field
from typing import Optional, List


# ------------------------------------------------------------
#  Patient Model
# ------------------------------------------------------------
class Patient(BaseModel):
    """Schema representing a patient record."""

    name: str = Field(..., example="John Smith")
    gender: Optional[str] = Field(None, example="Male")
    age: Optional[int] = Field(None, example=45)
    diagnosis: Optional[str] = Field(None, example="Type 2 Diabetes Mellitus")
    eligibility_decision: Optional[str] = Field(
        None, example="Suitable", description="Eligibility status decided by AI or human reviewer"
    )
    eligibility_reasoning: Optional[str] = Field(
        None, example="Meets inclusion criteria, no exclusions found"
    )


# ------------------------------------------------------------
#  Protocol Model
# ------------------------------------------------------------
class Protocol(BaseModel):
    """Represents a clinical trial protocol for eligibility assessment."""

    id: Optional[str] = Field(None, example="Glycerex-T2D-001")
    title: Optional[str] = Field(None, example="Glycerex for Type 2 Diabetes")
    inclusion_criteria: Optional[List[str]] = Field(
        None, example=["Age 30–70", "Diagnosed with Type 2 Diabetes Mellitus"]
    )
    exclusion_criteria: Optional[List[str]] = Field(
        None, example=["Active infection", "History of cardiac disease"]
    )
    summary: Optional[str] = Field(
        None, example="A Phase II trial evaluating the efficacy of Glycerex for T2DM patients."
    )


# ------------------------------------------------------------
#  Response Models (for consistent API design)
# ------------------------------------------------------------
class AddPatientResponse(BaseModel):
    status: str = Field(..., example="Added John Smith and started re-evaluation.")


class ClearCacheResponse(BaseModel):
    status: str = Field(..., example="Cache cleared")


class PatientsResponse(BaseModel):
    patients: List[Patient]
