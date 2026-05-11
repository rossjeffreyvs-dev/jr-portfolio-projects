from app.services.llm_reasoning import get_reasoning_provider
class InvestorSummaryTool:
    provider='investor_summary_tool'
    def generate_summary(self, scenario_id, question, findings, recommendations):
        return get_reasoning_provider().enrich(scenario_id, question, findings, recommendations)
