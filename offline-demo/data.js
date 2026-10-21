// ResearchOS Offline Demo - Preloaded Benchmark Datasets
// NOTE: All data is embedded locally to allow direct file:// protocol execution without network access or CORS fetch restrictions.

const DEMO_PROJECTS = [
  {
    id: "proj-ai-india-2035",
    title: "Impact of Artificial Intelligence on Employment in India by 2035",
    research_question: "What will be the impact of artificial intelligence on employment in India by 2035?",
    depth: "Comprehensive",
    status: "completed",
    quality_score: 8.7,
    created_at: "2024-10-10T10:30:00Z",
    summary: "AI adoption across India's IT, services, and manufacturing sectors is projected to displace 12-16% of routine entry-level roles while creating 20M+ technology-enabled specialist jobs, generating a net workforce transition challenge centered on tier-2 and tier-3 reskilling.",
    
    // Key quantitative statistics for charts and metrics cards
    statistics: [
      {
        id: "stat-1",
        metric: "Projected Tech Workforce Addition",
        short_name: "Tech Workforce Additions",
        value: 20.0,
        value_display: "+20.0 Million",
        unit: "million jobs",
        year: 2035,
        geography: "India (National)",
        category: "Employment Growth",
        confidence: 0.90,
        illustrative_note: "Scenario projection based on NASSCOM & BCG future-of-work baseline models."
      },
      {
        id: "stat-2",
        metric: "Routine Back-Office & BPO Automation",
        short_name: "BPO / Clerical Automation",
        value: 15.5,
        value_display: "15.5%",
        unit: "percent of roles",
        year: 2030,
        geography: "Tier-1 Metro Hubs",
        category: "Displacement",
        confidence: 0.88,
        illustrative_note: "Estimated vulnerability index across customer care and repetitive coding operations."
      },
      {
        id: "stat-3",
        metric: "Agricultural Productivity Increase",
        short_name: "Agritech Productivity Uplift",
        value: 21.0,
        value_display: "+21.0%",
        unit: "percent yield/efficiency",
        year: 2035,
        geography: "Rural / Semi-Arid India",
        category: "Productivity",
        confidence: 0.92,
        illustrative_note: "NITI Aayog National AI Strategy projection from AI-assisted soil, water, and crop analytics."
      },
      {
        id: "stat-4",
        metric: "Mandatory Annual Reskilling Cohort",
        short_name: "Annual Reskilling Target",
        value: 10.0,
        value_display: "10.0 Million",
        unit: "workers / year",
        year: 2028,
        geography: "Pan-India",
        category: "Education & Skilling",
        confidence: 0.95,
        illustrative_note: "Minimum vocational qualification capacity required to avert structural unemployment."
      },
      {
        id: "stat-5",
        metric: "IT Services Revenue Share from AI Solutions",
        short_name: "IT Revenue from AI Native",
        value: 38.5,
        value_display: "38.5%",
        unit: "percent revenue",
        year: 2032,
        geography: "Global Delivery Centers",
        category: "Industry Transition",
        confidence: 0.84,
        illustrative_note: "Gartner & NASSCOM joint advisory forecast for tier-1 Indian systems integrators."
      },
      {
        id: "stat-6",
        metric: "Female Workforce Participation Risk in Clerical Roles",
        short_name: "Clerical Gender Risk Exposure",
        value: 18.2,
        value_display: "18.2%",
        unit: "percent displacement risk",
        year: 2030,
        geography: "Urban Centers",
        category: "Demographic Risk",
        confidence: 0.82,
        illustrative_note: "ILO South Asia econometric review assessing female administrative employment vulnerability."
      },
      {
        id: "stat-7",
        metric: "Manufacturing Smart Automation Adoption Rate",
        short_name: "Smart Factory Penetration",
        value: 42.0,
        value_display: "42.0%",
        unit: "percent of plants",
        year: 2035,
        geography: "Industrial Corridors (DMIC)",
        category: "Manufacturing",
        confidence: 0.79,
        illustrative_note: "FICCI & Ministry of Heavy Industries Industry 4.0 roadmap estimate."
      },
      {
        id: "stat-8",
        metric: "Wage Premium for AI-Native Engineers",
        short_name: "AI Skill Wage Premium",
        value: 45.0,
        value_display: "+45.0%",
        unit: "percent salary premium",
        year: 2026,
        geography: "Bengaluru / Hyderabad / NCR",
        category: "Compensation",
        confidence: 0.91,
        illustrative_note: "Observed compensation disparity between conventional and LLM-specialized talent."
      }
    ],

    // Claims and supporting evidence
    claims: [
      {
        id: "claim-1",
        claim_text: "Net job expansion in technology-enabled engineering, operations, and services will exceed routine BPO displacement in India by 2035.",
        topic: "Macro Employment Impact",
        confidence: 0.86,
        is_disputed: true,
        source_count: 5,
        supporting_evidence_ids: ["ev-1", "ev-3"]
      },
      {
        id: "claim-2",
        claim_text: "Upskilling and certifying 10 million workers annually across digital toolchains is mandatory to avert acute youth underemployment.",
        topic: "Education & National Skilling",
        confidence: 0.94,
        is_disputed: false,
        source_count: 6,
        supporting_evidence_ids: ["ev-2", "ev-4"]
      },
      {
        id: "claim-3",
        claim_text: "Generative AI tools will automate up to 15.5% of rule-based clerical, documentation, and tier-1 helpdesk duties by 2030.",
        topic: "BPO & Task Automation",
        confidence: 0.89,
        is_disputed: false,
        source_count: 4,
        supporting_evidence_ids: ["ev-1", "ev-5"]
      },
      {
        id: "claim-4",
        claim_text: "Agricultural yields in semi-arid Indian zones can improve by ~21% through low-bandwidth edge AI weather and pest monitoring.",
        topic: "Agritech & Rural Economy",
        confidence: 0.91,
        is_disputed: false,
        source_count: 3,
        supporting_evidence_ids: ["ev-6"]
      },
      {
        id: "claim-5",
        claim_text: "Traditional 'time-and-materials' IT export contracts will be replaced by productivity-indexed software delivery arrangements.",
        topic: "IT Services Business Model",
        confidence: 0.87,
        is_disputed: true,
        source_count: 4,
        supporting_evidence_ids: ["ev-7"]
      },
      {
        id: "claim-6",
        claim_text: "Disproportionate automation risk exists for early-career female employees in metropolitan corporate back-offices without active transition programs.",
        topic: "Gender & Demographic Equity",
        confidence: 0.83,
        is_disputed: true,
        source_count: 3,
        supporting_evidence_ids: ["ev-5", "ev-8"]
      }
    ],

    // Evidence units
    evidence: [
      {
        id: "ev-1",
        text: "NASSCOM strategic forecasts indicate 20M+ tech-adjacent positions created versus 3.5M routine clerical and L1 testing positions automated through 2035.",
        evidence_type: "institutional_forecast",
        relevance: 0.95,
        confidence: 0.90,
        source_title: "NASSCOM Strategic Review: AI Transformation of India Tech Workforce",
        date: "March 2024"
      },
      {
        id: "ev-2",
        text: "NITI Aayog National AI Roadmap emphasizes that skilling initiatives must scale beyond IIT/NIT hubs into tier-2/3 technical colleges to prevent regional wage disparities.",
        evidence_type: "policy_directive",
        relevance: 0.96,
        confidence: 0.93,
        source_title: "NITI Aayog National Strategy for Artificial Intelligence & Skilling Roadmap",
        date: "November 2023"
      },
      {
        id: "ev-3",
        text: "World Bank Development Report estimates that emerging market economies with youthful demographics can capture 1.2% additional annual GDP growth via early AI adoption.",
        evidence_type: "macroeconomic_model",
        relevance: 0.89,
        confidence: 0.87,
        source_title: "World Bank Policy Research: Technology, Jobs and Structural Change in South Asia",
        date: "January 2024"
      },
      {
        id: "ev-4",
        text: "National Skill Development Corporation (NSDC) census shows 68% of vocational curricula currently lack hands-on exposure to autonomous prompt engineering or automated data verification.",
        evidence_type: "empirical_census",
        relevance: 0.92,
        confidence: 0.91,
        source_title: "NSDC Technical Report on AI Curriculum Gap Analysis",
        date: "August 2023"
      },
      {
        id: "ev-5",
        text: "ILO econometric analysis projects an 18.2% displacement exposure for urban clerical tasks, where women currently represent 42% of the organized workforce in metro call centers.",
        evidence_type: "econometric_projection",
        relevance: 0.91,
        confidence: 0.85,
        source_title: "ILO Global Labour Organization: Automation and Labour Markets in South Asia",
        date: "January 2024"
      },
      {
        id: "ev-6",
        text: "ICAR pilot across 12,000 farmer producer organizations (FPOs) demonstrated 21% resource input savings and 14% crop yield improvements using voice-enabled vernacular AI assistants.",
        evidence_type: "field_trial",
        relevance: 0.94,
        confidence: 0.92,
        source_title: "ICAR & MeitY Agritech AI Pilot Synthesis Report",
        date: "February 2024"
      },
      {
        id: "ev-7",
        text: "Indian IT majors report client mandates shifting to output-based contracts with 30-40% software code generated via internal enterprise LLM assistants.",
        evidence_type: "industry_filing",
        relevance: 0.88,
        confidence: 0.86,
        source_title: "Reserve Bank of India Working Paper: Services Sector Export Competitiveness",
        date: "May 2024"
      },
      {
        id: "ev-8",
        text: "Stanford AI Index 2024 ranks India #1 globally in relative AI skill penetration and developer code commits, but notes domestic research and patents lag commercial deployment.",
        evidence_type: "index_benchmark",
        relevance: 0.87,
        confidence: 0.94,
        source_title: "Stanford Institute for Human-Centered AI (HAI) Global AI Index 2024",
        date: "April 2024"
      }
    ],

    // Discovered web sources
    sources: [
      {
        id: "src-1",
        title: "NASSCOM Strategic Review: AI Transformation of India Tech Workforce",
        domain: "nasscom.in",
        url: "https://www.nasscom.in/insights/ai-india-employment-2035",
        snippet: "Projections estimate generative AI will compress 15.5% of business process outsourcing roles while fueling a 28% demand surge for prompt architects, cloud orchestration engineers, and enterprise data specialists by 2030-2035.",
        source_type: "industry",
        relevance_score: 0.97,
        quality_score: 0.94,
        published_date: "2024-03-15",
        author_or_org: "NASSCOM Research & Intelligence"
      },
      {
        id: "src-2",
        title: "NITI Aayog National Strategy for Artificial Intelligence & Skilling Roadmap",
        domain: "niti.gov.in",
        url: "https://www.niti.gov.in/reports/national-strategy-ai-jobs",
        snippet: "Emphasizes that agriculture, health, and logistics will experience productivity gains exceeding 20%, with net job addition if national vocational skilling programs scale to 10 million workers per year.",
        source_type: "government",
        relevance_score: 0.98,
        quality_score: 0.96,
        published_date: "2023-11-20",
        author_or_org: "NITI Aayog, Government of India"
      },
      {
        id: "src-3",
        title: "ILO Global Labour Organization: Automation and Labour Markets in South Asia",
        domain: "ilo.org",
        url: "https://www.ilo.org/global/publications/india-ai-labour-impact-2035",
        snippet: "Econometric modeling indicates gender disparity risks in clerical automation across Indian urban hubs, warning of wage stagnation for non-technical graduates without strong digital safety nets.",
        source_type: "academic",
        relevance_score: 0.93,
        quality_score: 0.95,
        published_date: "2024-01-10",
        author_or_org: "International Labour Organization"
      },
      {
        id: "src-4",
        title: "World Bank Policy Research: Technology, Jobs and Structural Change in South Asia",
        domain: "worldbank.org",
        url: "https://openknowledge.worldbank.org/handle/10986/40125",
        snippet: "Analyzes labor transition elasticities in India, highlighting that service-led development requires aggressive integration of high-bandwidth connectivity and computer hardware access in semi-rural schools.",
        source_type: "academic",
        relevance_score: 0.91,
        quality_score: 0.93,
        published_date: "2024-01-25",
        author_or_org: "World Bank Group"
      },
      {
        id: "src-5",
        title: "Reserve Bank of India Working Paper: Services Sector Export Competitiveness",
        domain: "rbi.org.in",
        url: "https://rbi.org.in/scripts/BS_ViewBulletin.aspx?Id=22401",
        snippet: "Quantifies the transition of Indian IT exports from linear billing headcounts to IP-driven and AI-native service modules, projecting resilient foreign exchange earnings alongside shifting domestic job profiles.",
        source_type: "government",
        relevance_score: 0.90,
        quality_score: 0.92,
        published_date: "2024-05-18",
        author_or_org: "Reserve Bank of India, Department of Economic Policy"
      },
      {
        id: "src-6",
        title: "Stanford HAI Global AI Index: India Country Profile & Talent Benchmarks",
        domain: "hai.stanford.edu",
        url: "https://aiindex.stanford.edu/report/india-talent-2024",
        snippet: "Evaluates India's developer demographic dividend, finding world-leading AI skill penetration rates among young programmers, alongside an urgent demand for domestic computing clusters.",
        source_type: "academic",
        relevance_score: 0.89,
        quality_score: 0.94,
        published_date: "2024-04-12",
        author_or_org: "Stanford Institute for Human-Centered AI"
      },
      {
        id: "src-7",
        title: "Ministry of Electronics & Information Technology (MeitY) IndiaAI Mission Directive",
        domain: "meity.gov.in",
        url: "https://indiaai.gov.in/article/cabinet-approves-indiaai-mission",
        snippet: "Details the INR 10,372 crore national initiative allocating 10,000+ GPUs to startups and research institutes to build indigenous multilingual LLMs and sovereign foundation models.",
        source_type: "government",
        relevance_score: 0.92,
        quality_score: 0.96,
        published_date: "2024-03-07",
        author_or_org: "Ministry of Electronics & IT, Government of India"
      },
      {
        id: "src-8",
        title: "FICCI & McKinsey Future of Manufacturing in India: Industry 4.0 Deployment",
        domain: "ficci.in",
        url: "https://ficci.in/publication/industry-4-manufacturing-india-2035",
        snippet: "Case studies across automotive and pharmaceutical manufacturing demonstrate that predictive robotics augment technician productivity by 35% without broad shop-floor worker reductions.",
        source_type: "industry",
        relevance_score: 0.86,
        quality_score: 0.89,
        published_date: "2023-12-14",
        author_or_org: "Federation of Indian Chambers of Commerce & Industry"
      }
    ],

    // Academic papers from literature discovery
    academic_papers: [
      {
        id: "paper-1",
        title: "Macroeconomic Simulations of Generative AI on Indian Service Exports (2025-2035)",
        authors: "Dr. R. Sharma, Dr. A. Sen, Prof. V. Narayanan",
        year: 2024,
        venue: "Journal of Development Economics & Technology",
        citation_count: 54,
        abstract: "We evaluate the equilibrium wage and job substitution effects across 45 Indian economic sectors through 2035 under three automation scenarios. Our dynamic general equilibrium model reveals a net 4.8% employment expansion in value-added services, conditioned on rapid vocational retraining.",
        url: "https://www.semanticscholar.org/paper/sem_ai_in_01"
      },
      {
        id: "paper-2",
        title: "Automation Vulnerability in India's Business Process Management: A Task-Level Analysis",
        authors: "Dr. K. Iyer, P. Swaminathan",
        year: 2023,
        venue: "Indian Journal of Labour Economics",
        citation_count: 38,
        abstract: "Decomposing 120 standard job classifications within Bangalore and Pune BPO centers reveals that 62% of repetitive data-entry and 45% of basic customer care tasks are technically automatable with current frontier multimodal models.",
        url: "https://www.semanticscholar.org/paper/sem_ai_in_02"
      },
      {
        id: "paper-3",
        title: "Generative AI in Vernacular Languages: Empowering India's Informal Workforce",
        authors: "Prof. S. Mukherjee, Dr. T. Banerjee",
        year: 2024,
        venue: "ACM Conference on Human Factors in Computing Systems (CHI)",
        citation_count: 29,
        abstract: "Field study examining voice-first LLM interfaces across Hindi, Tamil, and Bengali micro-merchants in UP and Tamil Nadu. Demonstrates a 31% reduction in bookkeeping errors and improved access to formal micro-credit.",
        url: "https://www.semanticscholar.org/paper/sem_ai_in_03"
      },
      {
        id: "paper-4",
        title: "Skill Biased Technical Change in the Global South: Evidence from Indian IT Clusters",
        authors: "Dr. M. Chidambaram, Dr. E. Duflo",
        year: 2023,
        venue: "Review of Economics and Statistics",
        citation_count: 81,
        abstract: "Empirical investigation of wage premiums across 250,000 Indian software developers. Documents an escalating wage premium for machine learning and systems architecture skills against flattening wages for routine maintenance coders.",
        url: "https://www.semanticscholar.org/paper/sem_ai_in_04"
      }
    ],

    // Contradictions and empirical discrepancies
    contradictions: [
      {
        id: "con-1",
        topic: "Net Job Creation vs. Urban Clerical Reduction",
        position_a: "Industry bodies (NASSCOM, BCG) forecast substantial net job expansion (+20M tech-adjacent positions) driven by global AI solutions export dominance.",
        sources_a: ["NASSCOM Strategic Review 2024", "McKinsey Digital India Report"],
        position_b: "International labour organizations (ILO, South Asia Labour Watch) project net job contractions in urban centers due to rapid LLM customer-service and documentation automation.",
        sources_b: ["ILO Automation & Labour Report 2024", "Indian Journal of Labour Economics"],
        likely_explanation: "Methodological difference: NASSCOM models long-run dynamic equilibrium incorporating export market growth, whereas ILO focuses on short-to-medium run frictional displacement among routine clerical cohorts.",
        contradiction_type: "methodological_divergence",
        confidence: 0.88
      },
      {
        id: "con-2",
        topic: "Speed of Edge AI Adoption in Agriculture",
        position_a: "Government policy targets (NITI Aayog) project 21% productivity gains across rural agriculture by 2035 via widespread automated advisory deployment.",
        sources_a: ["NITI Aayog National AI Strategy", "MeitY IndiaAI Directive"],
        position_b: "Academic field studies (CHI 2024, ICAR rural audits) cite rural bandwidth constraints, intermittent electrification, and fragmented landholdings as structural inhibitors limiting adoption to <8% of smallholders.",
        sources_b: ["ACM CHI Vernacular Study", "ICAR Rural Survey"],
        likely_explanation: "Policy forecasts assume aggressive completion of BharatNet fiber optic rollout and subsidized rural smartphone hardware, which currently lags official schedule in eastern states.",
        contradiction_type: "infrastructure_assumption",
        confidence: 0.84
      },
      {
        id: "con-3",
        topic: "Domestic Tier-2/3 University Reskilling Capacity",
        position_a: "Skill development councils project India can achieve 10M annual digital worker certifications by 2028 through MOOCs and public-private industry partnerships.",
        sources_a: ["NSDC Vision 2030", "Digital India Framework"],
        position_b: "Labour economists point to severe shortages of qualified AI faculty and lack of modern lab computing in 80% of non-tier-1 engineering colleges.",
        sources_b: ["Review of Economics and Statistics 2023", "AICTE Annual Survey"],
        likely_explanation: "Certificates awarded via online modules often fail to guarantee project-level competency without supervised computational laboratories.",
        contradiction_type: "quality_vs_scale_dilemma",
        confidence: 0.91
      }
    ],

    // Research gaps identified during investigation
    research_gaps: [
      {
        id: "gap-1",
        gap_description: "Absence of empirical longitudinal data measuring AI penetration rates in tier-3 informal manufacturing and micro-enterprises.",
        category: "geographic_data_deficit",
        suggested_query: "AI adoption micro enterprise informal economy India statistics 2024",
        resolved: false
      },
      {
        id: "gap-2",
        gap_description: "Longitudinal tracking of female labor force participation shifts in remote BPO roles during generative voice assistant deployment.",
        category: "demographic_evidence_gap",
        suggested_query: "gender impact AI workforce India customer care automation longitudinal",
        resolved: false
      },
      {
        id: "gap-3",
        gap_description: "Reliable cost-benefit models for on-premise sovereign AI infrastructure versus global cloud API dependency for Indian banks.",
        category: "economic_cost_gap",
        suggested_query: "sovereign AI compute cost benefit Indian financial sector on premise",
        resolved: false
      },
      {
        id: "gap-4",
        gap_description: "Standardized benchmarking frameworks for assessing actual workplace productivity uplift from LLM code copilots among Indian junior developers.",
        category: "measurement_standard_gap",
        suggested_query: "developer productivity benchmark generative AI code assist Indian IT firms",
        resolved: false
      }
    ],

    // Knowledge graph entities and relationships
    entities: [
      { id: "ent-1", name: "Generative AI", entity_type: "technology", description: "Large language models and multimodal foundation models automating enterprise processes.", mention_count: 24, related_claims_count: 6 },
      { id: "ent-2", name: "India Workforce", entity_type: "demographic", description: "550M+ national labor pool characterized by rapid young workforce expansion.", mention_count: 32, related_claims_count: 8 },
      { id: "ent-3", name: "IT-BPM Sector", entity_type: "industry", description: "$250B+ software and business process management export engine.", mention_count: 18, related_claims_count: 5 },
      { id: "ent-4", name: "NASSCOM", entity_type: "organization", description: "Premier apex body for the technology and software industry in India.", mention_count: 14, related_claims_count: 4 },
      { id: "ent-5", name: "NITI Aayog", entity_type: "government", description: "National institution for transforming India and strategic policy think-tank.", mention_count: 12, related_claims_count: 3 },
      { id: "ent-6", name: "ILO", entity_type: "organization", description: "UN agency focused on international labour standards and worker protections.", mention_count: 10, related_claims_count: 3 },
      { id: "ent-7", name: "Agricultural Sector", entity_type: "industry", description: "Employs ~44% of India's labor force with high potential for predictive yield gains.", mention_count: 9, related_claims_count: 2 },
      { id: "ent-8", name: "Tier-2/3 Colleges", entity_type: "education", description: "Undergraduate engineering and vocational institutions outside major metros.", mention_count: 8, related_claims_count: 3 },
      { id: "ent-9", name: "IndiaAI Mission", entity_type: "policy", description: "Cabinet-approved sovereign computing and vernacular dataset development mandate.", mention_count: 11, related_claims_count: 3 },
      { id: "ent-10", name: "MeitY", entity_type: "government", description: "Ministry of Electronics and Information Technology responsible for digital policy.", mention_count: 7, related_claims_count: 2 }
    ],

    relationships: [
      { source_entity: "Generative AI", target_entity: "IT-BPM Sector", relation_type: "transforms", description: "Automates routine coding while requiring specialized prompt engineers." },
      { source_entity: "IT-BPM Sector", target_entity: "India Workforce", relation_type: "employs", description: "Provides high-wage formal urban employment for 5.4M professionals." },
      { source_entity: "NASSCOM", target_entity: "IT-BPM Sector", relation_type: "guides", description: "Publishes future skill matrices and industry growth targets." },
      { source_entity: "NITI Aayog", target_entity: "India Workforce", relation_type: "plans_for", description: "Develops national AI strategy and vocational transition policies." },
      { source_entity: "ILO", target_entity: "India Workforce", relation_type: "monitors", description: "Tracks wage equity and vulnerability among low-skilled clerical workers." },
      { source_entity: "IndiaAI Mission", target_entity: "Tier-2/3 Colleges", relation_type: "funds", description: "Provides subsidized GPU access and foundational research grants." },
      { source_entity: "Generative AI", target_entity: "Agricultural Sector", relation_type: "enhances", description: "Delivers vernacular crop analytics and pest detection via voice agents." },
      { source_entity: "MeitY", target_entity: "IndiaAI Mission", relation_type: "administers", description: "Coordinates national GPU cluster allocations and data exchanges." },
      { source_entity: "Tier-2/3 Colleges", target_entity: "India Workforce", relation_type: "graduates", description: "Produces >70% of annual technical degree holders." }
    ],

    // Timeline projection
    timeline: [
      { id: "tl-1", date: "2024 - 2025", year: 2024, title: "Enterprise Foundation Model Pilot Phase", description: "Top Indian IT firms deploy AI copilot tools across 60%+ of corporate client contracts; early routine BPO call-center tasks start automated triage.", confidence: 0.95 },
      { id: "tl-2", date: "2027 - 2028", year: 2028, title: "National 10M Annual Skilling Benchmark", description: "Target year for India's 10M annual digital certifications under Digital India framework, bridging tier-2 technical college skill gaps.", confidence: 0.88 },
      { id: "tl-3", date: "2030 - 2031", year: 2030, title: "Tier-1 Metro Clerical Shift Milestone", description: "Projected peak automation of rule-based back-office roles (15.5%); net job creation transitions toward systems integration and edge AI ops.", confidence: 0.85 },
      { id: "tl-4", date: "2032 - 2033", year: 2032, title: "Agritech and Vernacular Voice Maturity", description: "Vernacular multimodal AI voice assistants reach >65% rural mobile penetration, formalizing informal agricultural logistics and micro-credit.", confidence: 0.81 },
      { id: "tl-5", date: "2035", year: 2035, title: "Long-Range Horizon: Transformed Service Economy", description: "AI-native services contribute >15% of national GDP; Indian IT industry completes migration from head-count billing to IP-led cognitive architectures.", confidence: 0.80 }
    ],

    // Complete synthesized executive report
    report: {
      title: "Executive Intelligence Report: Impact of Artificial Intelligence on Employment in India by 2035",
      subtitle: "Autonomous Multilateral Synthesis across Industry Benchmarks, National Policy Directives, and Labour Economics",
      date_generated: "October 2024 (Benchmark Simulation)",
      executive_summary: "Between 2024 and 2035, artificial intelligence will fundamentally restructure India's labor market rather than precipitating aggregate structural unemployment. Multilateral evidence from NASSCOM, NITI Aayog, the International Labour Organization, and empirical econometric models reveals a pronounced reallocation: an estimated 12% to 16% of routine transactional, clerical, and level-1 software testing roles face obsolescence, while more than 20 million technology-adjacent positions are projected to emerge. The defining macroeconomic challenge is not net job destruction, but an unprecedented transition velocity requiring the annual reskilling of approximately 10 million workers, particularly across tier-2 and tier-3 educational ecosystems.",
      methodology: "Multilateral triangulation comparing econometric models (World Bank, Journal of Development Economics), institutional roadmaps (NASSCOM, FICCI), sovereign policy frameworks (NITI Aayog National Strategy for AI, MeitY IndiaAI Mission), and multilateral labour assessments (ILO). Figures reflect normalized scenario projections and are clearly labeled as illustrative benchmarks.",
      scope: "Indian formal IT/BPO services, urban clerical administration, agritech logistics, and vocational manufacturing through the 2035 economic horizon.",
      key_findings: [
        "Net Positive Long-Term Trajectory: The technology sector and adjacent modern industries will create an estimated 20 million new specialist and tech-enabled roles by 2035.",
        "Acute Short-Term Routine Displacement: 15.5% of rule-based back-office, data-entry, and entry-level call center tasks face technical substitution by 2030.",
        "The Tier-2/3 Education Bottleneck: Over 70% of engineering and polytechnic graduates emerge from regional non-metro colleges that currently lack computing hardware and faculty trained in frontier AI systems.",
        "Agritech Leapfrogging Potential: Edge AI and vernacular voice models are projected to boost agricultural productivity by ~21% without triggering forced rural-to-urban displacement.",
        "Gender Disparity Vulnerability: Urban women in clerical, customer service, and administrative positions face higher relative displacement risks (18.2%) absent targeted transition programs.",
        "IT Business Model Overhaul: Indian software vendors are transitioning from headcount-based 'time-and-materials' contracts to outcome-indexed cognitive software deliverables."
      ],
      detailed_analysis: `1. The Structural Shift in IT & Services Exports
India's IT-BPM sector accounts for over $250 billion in annual revenue and employs 5.4 million professionals directly. Frontier code-generation models and autonomous QA tools are disrupting traditional entry-level recruitment pyramids. Where IT services previously scaled headcounts linearly with revenue, revenue per employee is projected to rise sharply while entry-level bench hiring contracts. Growth is concentrating in machine learning engineering, enterprise AI security, data curation pipelines, and sovereign model fine-tuning.

2. Domestic Rural and Agricultural Transformation
Contrary to industrial automation in Western economies which primarily impacted factory labor, AI in India possesses strong non-disruptive upside in agriculture and informal commerce. Voice-first vernacular LLMs operating on consumer smartphones allow smallholder farmers to access real-time localized soil diagnostic data, weather predictions, and pest countermeasures. Government field trials demonstrate input cost reductions of up to 21%, increasing net agricultural margins without displacing agrarian livelihoods.

3. The Regional Skilling Bottleneck
The central friction point identified across all evidence bodies is the geographic disparity in educational readiness. While metro institutions (IITs, IIITs, BITS) are rapidly launching specialized AI research curricula and GPU clusters, tier-2 and tier-3 colleges—which produce over 800,000 engineering and polytechnic graduates annually—remain bound to legacy syllabi. Without a sustained national initiative training 10 million workers per year, this gap risks creating structural youth underemployment alongside acute corporate talent shortages.

4. Resolving Empirical Contradictions
Our analysis identified a salient divergence between industry projections (forecasting +20M net jobs) and international labour assessments (warning of urban job contractions). The resolution lies in the time-horizon and workforce cohort analyzed: industry models incorporate expanding global market share captured by Indian firms over a decade, while labour economists highlight short-run wage depression among non-technical administrative workers whose roles are compressed before replacement opportunities mature.`,
      conclusion: "The 2035 economic horizon offers India an extraordinary opportunity to harness its demographic dividend as the premier global engineering workshop of the cognitive era. Achieving this dividend, however, requires treating workforce reskilling as critical national infrastructure. Priority must be directed toward democratizing high-performance compute in tier-2/3 universities, establishing transition safety nets for clerical workers, and accelerating vernacular AI deployment across the rural economy.",
      report_markdown: `# Executive Intelligence Report: Impact of Artificial Intelligence on Employment in India by 2035\n\n## Executive Summary\nBetween 2024 and 2035, artificial intelligence will fundamentally restructure India's labor market rather than precipitating aggregate structural unemployment. Multilateral evidence from NASSCOM, NITI Aayog, the International Labour Organization, and empirical econometric models reveals a pronounced reallocation: an estimated 12% to 16% of routine transactional, clerical, and level-1 software testing roles face obsolescence, while more than 20 million technology-adjacent positions are projected to emerge. The defining macroeconomic challenge is an unprecedented transition velocity requiring the annual reskilling of approximately 10 million workers.\n\n## Methodology & Scope\nMultilateral triangulation across econometric models (World Bank, Journal of Development Economics), institutional roadmaps (NASSCOM, FICCI), sovereign policy frameworks (NITI Aayog National Strategy for AI, MeitY IndiaAI Mission), and labour audits (ILO). Figures represent illustrative scenario projections for research intelligence demonstration.\n\n## Key Findings\n- **Workforce Transition**: Over 20 million technology-adjacent specialist roles created by 2035.\n- **Clerical Automation**: 15.5% of rule-based back-office, BPO, and QA positions vulnerable by 2030.\n- **Agritech Impact**: 21% agricultural productivity enhancement via edge AI and vernacular voice advisors.\n- **National Skilling Target**: 10 million workers per year require digital toolchain certifications to avert structural unemployment.\n- **Demographic Vulnerability**: Female clerical staff in metropolitan centers face elevated transition friction (18.2% displacement risk).\n\n## Detailed Analysis\n1. **IT-BPM Evolution**: Transition from linear headcount billing to productivity-indexed software contracts.\n2. **Agritech Leapfrogging**: Voice-first interfaces formalizing rural credit and optimizing crop protection.\n3. **Educational Friction**: Critical resource divide between tier-1 research institutions and tier-2/3 vocational colleges.\n\n## Conclusion & Recommendations\nIndia's demographic advantage can be multiplied by AI if government, academia, and industry jointly scale high-performance computing clusters and vocational retraining beyond metropolitan centers.`
    },

    // Realistic Activity Stream Events for Simulation
    simulation_events: [
      { stage: "Planning", message: "Deconstructing research question: 'What will be the impact of artificial intelligence on employment in India by 2035?' into 6 core investigative dimensions.", delayMs: 400 },
      { stage: "Planning", message: "Formulated search queries: [NASSCOM future of work 2035, NITI Aayog AI employment strategy, ILO South Asia automation displacement, India IT-BPM workforce transition].", delayMs: 700 },
      { stage: "Web Discovery", message: "Querying web indices across government archives, industry associations, and multilateral think-tanks (8 verified sources identified).", delayMs: 800 },
      { stage: "Academic Discovery", message: "Querying Semantic Scholar literature graph for empirical econometrics and task-level automation studies (4 peer-reviewed papers retrieved).", delayMs: 900 },
      { stage: "Reading", message: "Ingesting and chunking full-text reports from NASSCOM, NITI Aayog, ILO, and World Bank Policy Research.", delayMs: 1000 },
      { stage: "Evidence Extraction", message: "Extracted 6 verified claims and 8 empirical evidence units covering IT services, agriculture, and skilling requirements.", delayMs: 900 },
      { stage: "Statistics Extraction", message: "Parsed 8 structured quantitative metrics (Workforce Growth: +20M, BPO Automation: 15.5%, Agritech Yields: +21%).", delayMs: 800 },
      { stage: "Knowledge Graph", message: "Triangulating causal relationships among 10 key entities (Generative AI, IT-BPM Sector, NASSCOM, IndiaAI Mission, Tier-2/3 Colleges).", delayMs: 900 },
      { stage: "Contradictions", message: "Detected 3 empirical divergences (Industry net expansion models vs. Multilateral short-term clerical displacement audits).", delayMs: 800 },
      { stage: "Synthesis", message: "Synthesizing cross-sector findings, resolving methodological variances, and isolating 4 critical research gaps.", delayMs: 1000 },
      { stage: "Report", message: "Assembling executive intelligence report, key takeaways, and chronological timeline milestones (2024-2035).", delayMs: 700 },
      { stage: "Complete", message: "Investigation complete. Quality score evaluated at 8.7/10. Research dashboard compiled successfully.", delayMs: 400 }
    ]
  },

  // Second preloaded sample project to demonstrate switching between research projects
  {
    id: "proj-smr-nuclear-storage",
    title: "Small Modular Nuclear Reactors (SMRs) vs. Grid-Scale Battery Storage: 2025-2040 Techno-Economic Viability",
    research_question: "Small Modular Nuclear Reactors (SMRs) vs. Grid-Scale Battery Storage: 2025-2040 Techno-Economic Viability",
    depth: "Deep",
    status: "completed",
    quality_score: 8.9,
    created_at: "2024-09-18T14:15:00Z",
    summary: "Comparative analysis of levelized cost of storage (LCOS) vs. levelized cost of electricity (LCOE) indicates battery chemistries dominate 4-8 hour peaking windows, while SMRs provide unmatched firm baseline decarbonization for industrial clusters.",
    statistics: [
      { id: "s-smr-1", metric: "Grid Battery LCOS (4-hr discharge)", short_name: "Battery LCOS 4hr", value: 68.0, value_display: "$68 / MWh", unit: "$/MWh", year: 2030, geography: "Global", category: "Cost Benchmark", confidence: 0.92, illustrative_note: "NREL Annual Technology Baseline projection." },
      { id: "s-smr-2", metric: "SMR First-of-a-Kind LCOE", short_name: "SMR FOAK LCOE", value: 125.0, value_display: "$125 / MWh", unit: "$/MWh", year: 2030, geography: "OECD Nations", category: "Cost Benchmark", confidence: 0.85, illustrative_note: "IEA Nuclear Power in Clean Energy Systems review." },
      { id: "s-smr-3", metric: "SMR Nth-of-a-Kind LCOE", short_name: "SMR NOAK LCOE", value: 78.0, value_display: "$78 / MWh", unit: "$/MWh", year: 2038, geography: "OECD Nations", category: "Cost Benchmark", confidence: 0.81, illustrative_note: "Projected standardized modular factory build learning curves." }
    ],
    claims: [
      { id: "c-smr-1", claim_text: "Lithium iron phosphate (LFP) and sodium-ion systems offer lower capital risk for diurnal intra-day balancing than early SMR deployments.", topic: "Diurnal Storage", confidence: 0.92, is_disputed: false, source_count: 5 },
      { id: "c-smr-2", claim_text: "SMRs provide firm baseload heat and power critical for heavy industrial decarbonization where multi-day storage remains cost prohibitive.", topic: "Industrial Baseload", confidence: 0.89, is_disputed: true, source_count: 4 }
    ],
    evidence: [
      { id: "e-smr-1", text: "NREL ATB indicates battery capital costs continue 6% annual learning curve improvements through 2030.", evidence_type: "forecast", relevance: 0.92, confidence: 0.91, source_title: "NREL Annual Technology Baseline", date: "2024" },
      { id: "e-smr-2", text: "NuScale and Westinghouse AP300 design certifications show commercial deployments delayed by licensing and supply chains until late 2020s.", evidence_type: "regulatory_filing", relevance: 0.94, confidence: 0.95, source_title: "US Nuclear Regulatory Commission Status", date: "2024" }
    ],
    sources: [
      { id: "src-smr-1", title: "IEA World Energy Outlook: Nuclear Power & Clean Energy Systems", domain: "iea.org", url: "https://www.iea.org/reports/world-energy-outlook", snippet: "Evaluates role of small modular reactors in providing high-temperature industrial heat alongside clean electricity.", source_type: "academic", quality_score: 0.95, published_date: "2023-10-24" },
      { id: "src-smr-2", title: "NREL Electricity Annual Technology Baseline: Utility-Scale Battery Storage", domain: "nrel.gov", url: "https://atb.nrel.gov/electricity/2024/commercial_battery_storage", snippet: "Projects capital expenditure and round-trip efficiency trajectories for 4-hour and 8-hour battery facilities.", source_type: "government", quality_score: 0.96, published_date: "2024-06-11" }
    ],
    academic_papers: [
      { id: "p-smr-1", title: "Comparative System Levelized Costs of SMRs vs Long-Duration Energy Storage in High-Renewable Grids", authors: "Dr. H. Larson, Dr. J. Jenkins", year: 2024, venue: "Nature Energy", citation_count: 47, abstract: "We model 100% clean grid scenarios across 12 climatic zones, evaluating the economic break-even points of nuclear baseload versus 24-100 hour storage.", url: "https://semanticscholar.org/paper/smr_nature_01" }
    ],
    contradictions: [
      { id: "con-smr-1", topic: "Cost Competitiveness of Modular Nuclear Manufacturing", position_a: "Reactor vendors claim factory modularity will compress capital costs by 40% relative to gigawatt-scale plants.", sources_a: ["Nuclear Energy Institute"], position_b: "Independent energy economists argue FOAK licensing hurdles and supply chain bottlenecks prevent realized savings before 2035.", sources_b: ["Energy Policy Journal"], likely_explanation: "Early projects incur custom non-recurring engineering costs prior to standardized mass production assembly.", contradiction_type: "learning_rate_dispute", confidence: 0.86 }
    ],
    research_gaps: [
      { id: "gap-smr-1", gap_description: "Lack of commercial operating data on high-temperature gas-cooled reactor fuel burn-up rates under high cycle load-following operations.", category: "operational_data", suggested_query: "HTGR SMR fuel burnup load following operating metrics", resolved: false }
    ],
    entities: [
      { id: "ent-smr-1", name: "Small Modular Reactor", entity_type: "technology", description: "Nuclear fission reactors with electrical output under 300 MWe per module.", mention_count: 22, related_claims_count: 4 },
      { id: "ent-smr-2", name: "Grid-Scale Battery Storage", entity_type: "technology", description: "Utility interconnected stationary electrochemical storage systems.", mention_count: 20, related_claims_count: 4 }
    ],
    relationships: [
      { source_entity: "Small Modular Reactor", target_entity: "Grid-Scale Battery Storage", relation_type: "complements", description: "SMRs provide seasonal baseload while batteries handle intra-day frequency regulation and ramp peaks." }
    ],
    timeline: [
      { id: "tl-smr-1", date: "2025 - 2027", year: 2026, title: "LFP / Sodium-ion Grid Domination", description: "Battery storage achieves >85% of newly installed ancillary grid capacity in North America and Europe.", confidence: 0.94 },
      { id: "tl-smr-2", date: "2030 - 2032", year: 2031, title: "First Commercial SMR Grid Synchronizations", description: "Leading SMR designs achieve commercial operational status in US, UK, and Canada.", confidence: 0.85 }
    ],
    report: {
      title: "Executive Report: Small Modular Nuclear Reactors vs. Grid-Scale Battery Storage",
      subtitle: "Techno-Economic Decarbonization Horizon (2025-2040)",
      date_generated: "September 2024 (Benchmark Simulation)",
      executive_summary: "Grid decarbonization is not a winner-take-all contest between nuclear fission and battery chemistry. Electrochemical batteries provide superior capital efficiency for diurnal demand shifts (under 8 hours), whereas small modular reactors provide unmatched firm clean heat and continuous baseload for steel, chemical, and district heating applications.",
      methodology: "Triangulation of NREL Annual Technology Baseline, IEA Net Zero modeling, and Nature Energy system LCOE simulations.",
      scope: "OECD power grids and industrial clusters evaluating deep decarbonization pathways through 2040.",
      key_findings: [
        "Battery storage remains the dominant economic solution for intra-day peaking (4 to 8 hours) through 2035.",
        "SMRs become economically critical where weather-dependent wind/solar drought exceeds 48 consecutive hours.",
        "FOAK SMR capital costs remain elevated ($120-140/MWh) until serial factory production achieves economies of scale after 2032."
      ],
      detailed_analysis: "System optimization demonstrates that clean grids combining 70% renewable generation with 15% SMR baseload and 15% flexible storage incur 24% lower overall capital expenditure than 100% renewable grids relying exclusively on long-duration chemical storage.",
      conclusion: "Policy frameworks must treat SMRs and grid storage as complementary clean technologies rather than competing alternatives.",
      report_markdown: "# Executive Report: SMRs vs. Grid-Scale Battery Storage (2025-2040)\n\n## Executive Summary\nAnalysis demonstrates that electrochemical storage dominates short-duration grid balancing, while small modular nuclear reactors provide essential zero-emission baseload for energy-intensive manufacturing clusters.\n\n## Key Takeaways\n- Batteries lead 4-8 hour peaking economics.\n- SMRs eliminate long-duration seasonal storage penalties.\n- Factory learning curves will govern SMR cost viability post-2032."
    },
    simulation_events: [
      { stage: "Planning", message: "Deconstructing techno-economic trade-offs: SMR levelized costs versus electrochemical battery degradation curves.", delayMs: 400 },
      { stage: "Web Discovery", message: "Retrieving official filings from NRC, IEA, and NREL.", delayMs: 600 },
      { stage: "Synthesis", message: "Harmonizing diurnal storage costs against multiday baseload requirements.", delayMs: 800 },
      { stage: "Complete", message: "SMR vs Storage benchmark dataset compiled.", delayMs: 400 }
    ]
  }
];

// Helper: Get project by id
function getDemoProject(id) {
  return DEMO_PROJECTS.find(p => p.id === id) || DEMO_PROJECTS[0];
}
