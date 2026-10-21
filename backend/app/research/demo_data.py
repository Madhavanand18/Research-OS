"""
LOCAL DEMO DATA — NOT LIVE RESEARCH
This minimal dataset is strictly used as an emergency fallback for UI testing
when external APIs (OpenAI / Tavily) are completely unconfigured.
"""

DEMO_PROJECT = {
    "title": "Impact of Artificial Intelligence on Employment in India by 2035",
    "research_question": "What will be the impact of artificial intelligence on employment in India by 2035?",
    "summary": "AI adoption across India's IT, services, and manufacturing sectors is projected to displace 12-16% of routine entry-level roles while creating 20M+ technology-enabled specialist jobs, generating a net workforce transition challenge centered on tier-2 and tier-3 reskilling.",
    "quality_score": 8.7,
    "sources": [
        {
            "url": "https://www.nasscom.in/insights/ai-india-employment-2035",
            "title": "NASSCOM Strategic Review: AI Transformation of India Tech Workforce",
            "domain": "nasscom.in",
            "snippet": "NASSCOM projections estimate that generative AI will impact 15% of business process outsourcing roles while fueling a 28% demand surge for prompt engineers, cloud architects, and data scientists by 2030-2035.",
            "source_type": "industry",
            "relevance_score": 0.95,
            "quality_score": 0.92,
            "published_date": "2024-03-15"
        },
        {
            "url": "https://www.niti.gov.in/reports/national-strategy-ai-jobs",
            "title": "NITI Aayog National Strategy for Artificial Intelligence & Skilling Roadmap",
            "domain": "niti.gov.in",
            "snippet": "Government analysis emphasizes that agricultural and logistics sectors will experience productivity gains of 18-22%, with net job addition if vocational skilling programs reach 10 million workers annually.",
            "source_type": "government",
            "relevance_score": 0.98,
            "quality_score": 0.96,
            "published_date": "2023-11-20"
        },
        {
            "url": "https://www.ilo.org/global/publications/india-ai-labour-impact-2035",
            "title": "ILO Global Labour Organization: Automation and Labour Markets in South Asia",
            "domain": "ilo.org",
            "snippet": "ILO econometric modeling suggests gender disparity risks in clerical automation in Indian urban centers, warning of potential wage stagnation for non-technical graduates unless digital safety nets are institutionalized.",
            "source_type": "web",
            "relevance_score": 0.91,
            "quality_score": 0.94,
            "published_date": "2024-01-10"
        }
    ],
    "academic_papers": [
        {
            "paper_id": "sem_ai_in_01",
            "title": "Macroeconomic Simulations of Generative AI on Indian Service Exports",
            "abstract": "We evaluate the equilibrium wage and job substitution effects across 45 Indian economic sectors through 2035 under three automation scenarios.",
            "authors": [{"name": "Dr. R. Sharma"}, {"name": "Dr. A. Sen"}],
            "year": 2024,
            "venue": "Journal of Development Economics & Technology",
            "citation_count": 42,
            "url": "https://semanticscholar.org/paper/sem_ai_in_01",
            "fields_of_study": ["Economics", "Computer Science"]
        }
    ],
    "claims": [
        {
            "claim_text": "Net job expansion in technology and advanced manufacturing will exceed routine BPO displacement in India by 2035.",
            "topic": "Net Employment",
            "confidence": 0.86,
            "is_disputed": True
        },
        {
            "claim_text": "Reskilling 10 million workers per year is mandatory to avoid structural unemployment among young graduates.",
            "topic": "Skilling & Education",
            "confidence": 0.92,
            "is_disputed": False
        }
    ],
    "evidence": [
        {
            "text": "NASSCOM forecast indicates 20 million tech-adjacent jobs created versus 3.5 million routine clerical positions automated by 2035.",
            "evidence_type": "forecast",
            "relevance": 0.94,
            "confidence": 0.89,
            "date": "2024"
        },
        {
            "text": "ILO study notes that 14% of early-career back-office analytical tasks have already begun automated ingestion.",
            "evidence_type": "finding",
            "relevance": 0.88,
            "confidence": 0.85,
            "date": "2023"
        }
    ],
    "statistics": [
        {
            "metric": "Projected Tech Workforce Growth",
            "value": 20.0,
            "value_display": "20 Million",
            "unit": "million jobs",
            "year": 2035,
            "geography": "India",
            "category": "Employment Growth",
            "confidence": 0.9
        },
        {
            "metric": "Routine Back-Office Automation Rate",
            "value": 15.5,
            "value_display": "15.5%",
            "unit": "percent",
            "year": 2030,
            "geography": "India Tier 1",
            "category": "Displacement",
            "confidence": 0.88
        },
        {
            "metric": "Agricultural Productivity Gain",
            "value": 21.0,
            "value_display": "21%",
            "unit": "percent",
            "year": 2035,
            "geography": "Rural India",
            "category": "Productivity",
            "confidence": 0.92
        },
        {
            "metric": "Annual Reskilling Target",
            "value": 10.0,
            "value_display": "10 Million",
            "unit": "workers / yr",
            "year": 2028,
            "geography": "India",
            "category": "Education",
            "confidence": 0.95
        }
    ],
    "entities": [
        {"name": "NASSCOM", "entity_type": "organization", "description": "National Association of Software and Service Companies in India", "mention_count": 5, "related_claims_count": 3},
        {"name": "NITI Aayog", "entity_type": "organization", "description": "National Institution for Transforming India, government policy think-tank", "mention_count": 4, "related_claims_count": 2},
        {"name": "Generative AI", "entity_type": "technology", "description": "Foundation models automating code, text, and customer workflows", "mention_count": 12, "related_claims_count": 6},
        {"name": "India", "entity_type": "country", "description": "Focus nation with massive youthful demographic dividend", "mention_count": 18, "related_claims_count": 8},
        {"name": "IT-BPM Industry", "entity_type": "industry", "description": "Information Technology and Business Process Management sector", "mention_count": 7, "related_claims_count": 4}
    ],
    "relationships": [
        {"source_entity": "Generative AI", "target_entity": "IT-BPM Industry", "relation_type": "affects", "description": "Automates routine tasks while requiring specialized prompt engineers"},
        {"source_entity": "NITI Aayog", "target_entity": "India", "relation_type": "influences", "description": "Sets national strategic agenda for skilling and AI deployment"},
        {"source_entity": "NASSCOM", "target_entity": "IT-BPM Industry", "relation_type": "studied_by", "description": "Publishes benchmark labor trends and future skill indexes"}
    ],
    "contradictions": [
        {
            "topic": "Net Job Losses vs. Net Job Growth in IT Services",
            "position_a": "Industry bodies project net job expansion (+20M jobs) due to AI export market dominance.",
            "sources_a": ["NASSCOM Strategic Review"],
            "position_b": "International labor organizations warn of net job reduction in urban centers due to rapid LLM code generation.",
            "sources_b": ["ILO Automation Report"],
            "likely_explanation": "Different methodologies: NASSCOM models domestic and international enterprise integration, whereas ILO examines historical worker absorption rates.",
            "contradiction_type": "methodology",
            "confidence": 0.85
        }
    ],
    "research_gaps": [
        {
            "gap_description": "Limited empirical data on AI penetration rates in tier-3 non-formal manufacturing and micro-enterprises.",
            "category": "missing_geography",
            "suggested_query": "AI adoption micro enterprise informal economy India statistics 2024"
        },
        {
            "gap_description": "Longitudinal studies on female labor force participation changes resulting from automated remote customer service.",
            "category": "weak_evidence",
            "suggested_query": "gender impact AI workforce India customer care automation"
        }
    ],
    "timeline": [
        {"date": "2024", "year": 2024, "title": "Foundation Model Pilots", "description": "Top Indian IT firms begin integrating AI copilot tools across 60% of enterprise client engagements.", "confidence": 0.95},
        {"date": "2028", "year": 2028, "title": "National Skilling Milestone", "description": "Target year for India's 10M annual AI vocational certifications under Digital India framework.", "confidence": 0.88},
        {"date": "2032", "year": 2032, "title": "Autonomous Supply Chain Shift", "description": "Domestic logistics and e-commerce automated routing projected to reach 75% market penetration.", "confidence": 0.82},
        {"date": "2035", "year": 2035, "title": "Maturity Horizon", "description": "Stabilization of transformed services sector with AI-native workflows generating 15%+ GDP contribution.", "confidence": 0.80}
    ],
    "report": {
        "title": "Executive Report: Artificial Intelligence & Indian Employment 2035",
        "executive_summary": "Between 2024 and 2035, artificial intelligence will fundamentally reshape India's workforce. Rather than catastrophic aggregate unemployment, evidence indicates an intense structural reallocation: routine transactional jobs will decline by 15%, while domain-specialized, tech-adjacent employment will expand, yielding a net positive if reskilling programs match demographic scale.",
        "methodology": "Triangulated econometric findings across government policy directives (NITI Aayog), industry censuses (NASSCOM), and multilateral labour assessments (ILO).",
        "scope": "Indian workforce across formal IT/BPO, agriculture, urban services, and vocational manufacturing through the year 2035.",
        "key_findings": [
            "Net job creation is anticipated (+20M jobs) provided vocational transition infrastructure scales.",
            "12-16% of routine entry-level BPO and coding jobs face automation obsolescence.",
            "Agricultural productivity will increase by up to 21% through precision AI systems.",
            "Critical geographic reskilling disparity exists between Tier-1 hubs and Tier-2/3 college graduates."
        ],
        "detailed_analysis": "India's competitive advantage in global software exports faces a dual-edged disruption. As code synthesis models achieve high reliability, traditional linear headcount billing models will yield to outcome-based contracts. This forces a rapid transition towards systems engineering, AI orchestration, and cybersecurity. In domestic sectors, AI-driven credit scoring and multilingual voice agents are projected to formalize informal credit markets.",
        "conclusion": "The 2035 horizon presents India with an unprecedented opportunity to leverage its young workforce, but success is contingent on government-industry partnership in aggressive reskilling, digital infrastructure, and labor safeguards against transition friction.",
        "report_markdown": "# Executive Report: Artificial Intelligence & Indian Employment 2035\n\n## Executive Summary\nBetween 2024 and 2035, artificial intelligence will fundamentally reshape India's workforce. Rather than catastrophic aggregate unemployment, evidence indicates an intense structural reallocation: routine transactional jobs will decline by 15%, while domain-specialized, tech-adjacent employment will expand, yielding a net positive if reskilling programs match demographic scale.\n\n## Methodology & Scope\nTriangulated econometric findings across government policy directives (NITI Aayog), industry censuses (NASSCOM), and multilateral labour assessments (ILO) examining formal IT/BPO, agriculture, and urban services.\n\n## Key Findings\n- **Workforce Transition**: 20M+ tech-adjacent roles created by 2035.\n- **Automation Risk**: 15.5% of routine entry-level roles vulnerable.\n- **Sector Dynamics**: Agricultural productivity uplift of ~21%.\n- **Imperative**: 10 million workers must be certified annually in digital competencies.\n\n## Conclusion\nStrategic proactive investment in workforce enablement will determine whether AI yields an expanded demographic dividend or acute frictional unemployment."
    }
}
