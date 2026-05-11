from uuid import uuid4
from app.models.schemas import ToolCallTrace

def make_tool_call(agent, tool_name, input_summary, output_summary, evidence=None, duration_ms=300, metadata=None):
    return ToolCallTrace(id=f'tool_{uuid4().hex[:8]}',agent=agent,tool_name=tool_name,input_summary=input_summary,output_summary=output_summary,evidence=evidence or [],duration_ms=duration_ms,metadata=metadata or {})
