from __future__ import annotations
import json, os
from typing import Any, Protocol
from app.models.schemas import AgentFinding, LLMReasoning, Recommendation
class ReasoningProvider(Protocol):
    def enrich(self, scenario_id:str, question:str, findings:list[AgentFinding], recommendations:list[Recommendation]) -> LLMReasoning: ...
def _dump(obj):
    if hasattr(obj,'model_dump'): return obj.model_dump()
    if hasattr(obj,'dict'): return obj.dict()
    return obj if isinstance(obj,dict) else dict(obj)
def _safe_json_loads(text):
    try: return json.loads(text)
    except Exception:
        s=text.find('{'); e=text.rfind('}')
        if s>=0 and e>s:
            try: return json.loads(text[s:e+1])
            except Exception: return {}
        return {}
def _get_response_text(response:Any)->str:
    txt=getattr(response,'output_text',None)
    if txt: return str(txt)
    return ''
class DemoLLMReasoningProvider:
    provider='demo_llm_reasoning'
    def enrich(self, scenario_id, question, findings, recommendations):
        top=recommendations[0].title if recommendations else 'Review operating plan'
        parts=[f"The founder question was routed into a tool-using multi-agent finance workflow: '{question}'."]+[f.finding for f in findings[:3]]+[f'Recommended next action: {top}.']
        return LLMReasoning(enabled=True,provider=self.provider,model='offline-grounded-reasoning',summary=' '.join(parts),recommendation_notes=[f'{r.title}: {r.rationale} Expected impact: {r.impact}.' for r in recommendations])
class OpenAIReasoningProvider:
    provider='openai'
    def enrich(self, scenario_id, question, findings, recommendations):
        api_key=os.getenv('OPENAI_API_KEY'); model=os.getenv('OPENAI_MODEL','gpt-4.1-mini')
        if not api_key:
            fb=DemoLLMReasoningProvider().enrich(scenario_id,question,findings,recommendations); fb.provider='openai_not_configured_fallback'; fb.model=model; return fb
        try:
            from openai import OpenAI
            bundle={'scenario_id':scenario_id,'question':question,'findings':[_dump(f) for f in findings],'recommendations':[_dump(r) for r in recommendations],'guardrails':['Use only supplied evidence and tool outputs. Do not invent metrics.']}
            prompt='Return valid JSON only with keys summary, recommendation_notes, risk_notes, next_actions. Evidence bundle:\n'+json.dumps(bundle,indent=2)
            resp=OpenAI(api_key=api_key).responses.create(model=model,input=[{'role':'system','content':'You are an AI finance and operations reasoning agent. Be grounded and concise.'},{'role':'user','content':prompt}])
            parsed=_safe_json_loads(_get_response_text(resp) or '{}')
            notes=[]
            for sec in (parsed.get('recommendation_notes'),parsed.get('risk_notes'),parsed.get('next_actions')):
                if isinstance(sec,list): notes.extend(map(str,sec[:4]))
                elif sec: notes.append(str(sec))
            return LLMReasoning(enabled=True,provider=self.provider,model=model,summary=str(parsed.get('summary','OpenAI reasoning completed over grounded agent findings.')),recommendation_notes=notes[:8] or ['OpenAI reasoning completed.'])
        except Exception as exc:
            fb=DemoLLMReasoningProvider().enrich(scenario_id,question,findings,recommendations); fb.provider='openai_error_fallback'; fb.model=model; fb.recommendation_notes.append(f'Live OpenAI call failed safely: {type(exc).__name__}: {str(exc)[:200]}'); return fb
def get_reasoning_provider():
    return OpenAIReasoningProvider() if os.getenv('AI_REASONING_PROVIDER','demo').lower().strip()=='openai' else DemoLLMReasoningProvider()
