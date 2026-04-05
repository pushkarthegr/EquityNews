const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static("public"));

// Section → search query mapping (Equity-centric & Long-term Resilient Keywords)
const SECTION_QUERIES = {
  IND: {
    Headlines: [
      "Nifty 50", "Sensex", "BSE", "NSE", "India Stock Market", "Equities", "Share Market",
      "Bank Nifty", "Midcap 100", "Smallcap 100", "Nifty IT", "Nifty Auto", "Nifty Bank",
      "Nifty Pharma", "Nifty FMCG", "India VIX", "Nifty Metal", "Indian Equities", "Stock Exchange",
      "Nifty Next 50", "BSE 500", "BSE Midcap", "India Market Close", "Indian Stocks Rally", "Dalal Street",
      "TCS", "Reliance Industries", "HDFC Bank", "Infosys", "ICICI Bank", "SBI", "L&T",
      "Bharti Airtel", "ITC", "Asian Paints", "Tata Motors",
      "Nifty Energy", "Nifty Infra", "Stock Market Opening", "Indian Share Bazar", "Market Correction India",
      "BSE Sensex Fall", "Markets Today", "FII Outflow India", "DII Inflow India", "Retail Investors India",
      "SEBI Regulations", "Sebi Margin Rules", "Initial Public Offering India", "IPO GMP India",
      "Nifty 500", "F&O Ban List", "Option Chain", "SGX Nifty", "Gift Nifty", "India Block Deal",
      "Large Cap Stocks India", "Stock Split India", "Bonus Issue India", "Dividend Yield Stocks India"
    ],
    Geopolitics: [
      "India Trade Policies", "Economic Sanctions Impact", "Border Trade Economics", "Oil Price Geopolitics",
      "US-India Trade Relations", "G20 Summit Resolutions", "IMF India Forecast", "World Bank India Data", "WTO India rulings", "Export Subsidies",
      "Import Tariff Changes", "Customs Duty Revisions", "Bilateral Trade Agreements", "India Foreign Economic Policy",
      "Asian Trade Dynamics", "Western Trade Alliances", "Emerging Markets Trade", "BRICS Economic Agenda",
      "Defense Exports Revenue", "Diplomatic Trade Ties", "Cross Border Tariffs", "FDI Policy Revisions",
      "Protectionism Market Impact", "Global Trade Wars", "Global South Economic Blocks", "Energy Settlement Currency", "Rupee Trade Settlement",
      "India Trade Deals", "Foreign Policy India", "Modi US visit", "S. Jaishankar", "border news",
      "International Vostro Accounts", "Free Trade Agreements Impact", "Strategic Economic Partnerships", "Macro Geopolitical Risk",
      "Trade Embargoes", "Trade Deficit Metrics", "Inward Remittances India", "Global Supply Chain Disruptions",
      "National Security Spending", "Geopolitical Stress Index Markets", "Maritime Shipping Choke Points", "Ocean Freight Geopolitics"
    ],
    Banking: [
      "Reserve Bank of India Policy", "Private Sector Banks India", "Public Sector Banks India", "Monetary Policy Committee",
      "Repo Rate Decisions", "Reverse Repo Operations", "Cash Reserve Ratio", "Statutory Liquidity Ratio",
      "Non-Performing Assets Bank", "Asset Quality Review", "Banking Sector Outperformance", "Credit Growth Metrics", "System Deposit Rates",
      "Microfinance Loan Disbursements", "Housing Finance Sector", "Banking Sector Profitability", "Net Interest Margin India",
      "RBI Policy", "Private Banks India", "PSU Banks", "Kotak Mahindra Bank", "Bank of Baroda",
      "MCLR Revisions", "Base Rate Adjustments", "Retail Credit Expansion", "Corporate Loan Book Growth", "Provision Coverage Ratio Trends",
      "Capital Adequacy Ratios", "Liquidity Coverage Ratios", "Tier 1 Capital Requirements",
      "Payment Banks Evolution", "Fintech Regulatory Framework", "Digital Currency CBDC Rollout", "UPI Transaction Volumes",
      "NBFC Sector Liquidty", "Shadow Banking India", "Consumer Finance Demand", "Vehicle Finance Credit",
      "Axis Bank", "PNB", "IndusInd Bank", "Credit Growth India", "Fintech India", "Paytm", "PhonePe", "BharatPe"
    ],
    Technology: [
      "AI Enterprise Adoption India", "Generative AI Market Size", "Cloud Computing Infrastructure", "SaaS Export Revenue", "Cybersecurity Spending", "Semiconductor Manufacturing Subsidies",
      "IT Services Outsourcing", "Fintech Sector Growth", "Digital Public Infrastructure", "Startup Venture Funding", "Software Exports Growth",
      "IT Sector Earnings", "Tech Talent Attrition Rate", "IT Sector Hiring Intent", "FinTech india",
      "Data Center Expansion India", "Data Protection Legislation Impact", "Telecom Sector ARPU", "5G Infrastructure Rollout",
      "Deeptech Investments", "AgriTech Innovation", "EdTech Market Consolidation", "HealthTech Revenue", "E-commerce Gross Merchandise Value",
      "Digital Payments Ecosystem", "Payment Gateway Regulations", "Semiconductor Ecosystem India", "Electronics Manufacturing Base", "IT Consulting Revenues",
      "Wipro", "HCL Tech", "Tech Mahindra", "Mindtree", "Semiconductor India", "AI Integration", "Indian Startups", "SaaS India"
    ],
    Commodities: [
      "Precious Metals Trading", "Bullion Market India", "Commodity Exchange Volumes", "Crude Oil Brent Volatility", "WTI Futures", "Natural Gas Pricing",
      "Base Metals Supply Deficit", "Copper Spot Market", "Aluminum Smelting Margins", "Zinc Inventory Levels", "Lithium Supply Chains", "Steel Pricing Trends", "Iron Ore Export Duty",
      "Coal Auction Premiums", "Agricultural Commodities Trading", "Commodity Supercycle Trends",
      "OPEC Production Policy", "Petroleum Products Pricing", "Aviation Turbine Fuel Costs",
      "Agri Commodity Inflation", "Edible Oil Import Duties", "Mandi Price Indices", "Monsoon Economic Impact Commodities",
      "Fertilizer Subsidy Allocations", "Critical Minerals Exploration", "Rare Earth Elements Supply Security",
      "Gold Price India", "Silver", "Copper", "Steel Industry", "Tata Steel", "JSW Steel", "Hindalco", "Vedanta", "Coal India"
    ],
    "Economic Reports": [
      "India GDP Growth Forecasts", "CPI Inflation Data India", "WPI Inflation Trends", "Index of Industrial Production",
      "Employment Generation Metrics", "Fiscal Deficit Targets", "Current Account Deficit Levels", "GST Collection Growth",
      "FDI Inflow Statistics", "FPI Investment Trends", "Trade Balance Figures",
      "PMI Manufacturing Expansion", "PMI Services Sector Growth", "Retail Inflation Core Metrics",
      "Wholesale Price Variations", "RBI Monthly Bulletin", "Economic Survey Projections", "Union Budget Allocations",
      "Direct Tax Revenue", "Indirect Tax Collections", "Forex Reserves Accretion",
      "Rupee Exchange Volatility", "USD INR Parity", "Export Growth Trajectory", "Import Substitution Metrics",
      "Consumer Confidence Indices", "Business Optimism Indices", "Automobile Sales Volume",
      "Commercial Vehicle Registrations", "Rural Demand Recovery", "Urban Consumption Patterns", "Per Capita Income Growth",
      "India GDP", "IIP Data", "Fiscal Deficit", "Trade Deficit India", "FDI Inflow India", "FII Outflow"
    ],
    "Industry Reports": [
      "PLI Scheme Disbursements", "Manufacturing Policy Shift", "Domestic Manufacturing Competitiveness", "EV Policy Incentives", "Green Hydrogen Economics",
      "Solar Energy Capacity Addition", "Renewable Energy Mix", "Wind Power Installations", "Pharma API Manufacturing", "Textile Export Orders",
      "Power Sector Generation", "Real Estate Regulatory Updates", "Infrastructure Spending Pipeline",
      "Automobile Production Volumes", "FMCG Volume Growth", "Chemical Sector Margins", "Specialty Chemicals Demand",
      "Agrochemicals Export Performance", "Aviation Sector Passenger Traffic", "Healthcare Delivery Networks",
      "Hospitality Sector Occupancy", "Domestic Tourism Revenue", "Logistics Sector Efficiency", "National Logistics Framework",
      "Defense Manufacturing Indigenization", "Capital Goods Order Books", "Cement Industry Utilization Rates", "Construction Sector Capex",
      "Real Estate Inventory Overhang", "Housing Demand Metrics", "Commercial Space Absorption", "Retail Sector Footfalls", "Scrap and Recycling Industry",
      "EV Sales India", "Mahindra & Mahindra", "Maruti Suzuki", "DLF", "Godrej Properties", "Sun Pharma",
      "Dr Reddy", "Aviation Sector", 'Recycling', 'Shipping Sector', 'Metal sector', 'sugar sector', 'defence sector',
      'Cement sector', 'Steel Sector', 'Power Sector'
    ],
    "M/A and CAPEX": [
      "Corporate Mergers and Acquisitions", "Takeover Regulations SEBI", "Corporate Demergers Value Unlocking",
      "Joint Venture Announcements", "Corporate Restructuring Exercises", "Capital Expenditure Cycles", "Private CAPEX Revival",
      "Capacity Expansion Announcements", "Greenfield Project Approvals", "Brownfield Project Scaleups", "Antitrust CCI Approvals",
      "Private Equity Exits", "Venture Capital Deployments", "Leveraged Buyout Activity", "Strategic Stake Divestments",
      "PSU Divestment Targets", "Asset Monetization Pipeline", "Corporate Debt Restructuring",
      "NCLT Resolution Outcomes", "IBC Recovery Rates", "Share Buyback Programs",
      "Open Offer Valuations", "Corporate Fund Raising", "QIP Institutional Demand", "Rights Issue Pricing", "Preferential Allotment Norms",
      "FDI Deal Flow", "Cross Border M&A Volumes", "Industrial Setup Clearances",
      "Corporate Order Book Accumulation", "Tender and Contract Awards", "Letter of Intent Disclosures",
      "Adani Group", "Tata Group M&A", "Reliance Retail", "Startups Funding", "IPO India"
    ],
    Energy: [
      "Renewable Energy Transition", "Solar PV Market", "Wind Energy Economics", "Green Hydrogen Ecosystem",
      "Electric Vehicle Penetration", "EV Charging Infrastructure", "Battery Storage Chemistry", "Lithium Ion Cell Manufacturing",
      "Thermal Power Base Load", "Independent Power Producers", "Power Grid Transmission", "Upstream Oil Exploration",
      "Oil Refining Margins", "Oil Marketing Companies", "City Gas Distribution Networks", "LNG Terminals Capacity",
      "Ethanol Blending Targets", "Biofuels Market Growth", "Nuclear Power Expansion",
      "Peak Power Demand", "Electricity Consumption Growth", "Power DISCOM Financials", "Smart Metering Rollout",
      "Solar Modules Domestic Manufacturing", "Energy Transition Capital", "Carbon Credits Trading Pricing",
      "Tata Power", "Adani Green", "NTPC", "ONGC", "Oil India"
    ],
    "Globalization & Trade": [
      "Global Supply Chain Realignment", "Nearshoring Economics", "China Plus One Beneficiaries", "Export Competitiveness Index",
      "Free Trade Agreements Scope", "Bilateral Trade Negotiations", "Global Shipping Capacity", "Ocean Freight Rate Indices", "Container Shortage Dynamics", "Port Cargo Traffic Metrics",
      "Logistics Cost Optimization", "Cross-Border Digital Trade", "International Business Expansion",
      "Multinational Operations", "Outsourcing Industry Trends", "Business Process Management Revenue",
      "Software Services Exports", "Pharmaceutical Generic Exports", "Engineering Goods Demand",
      "Agri Commodity Export Controls", "Remittances Inflow Data", "Diaspora Direct Investments",
      "Supply Chain Constraints", "Exports India", "Imports India", "Shipping Freight Rates",
      "Adani Ports", "Container Shortage", "Global Outsourcing"
    ],
    "Politics & Global Macro": [
      "Elections Market Volatility", "Political Stability Premium", "Policy Continuity Expectations", "Government Formation Impact",
      "Cabinet Reshuffle Economic Policy", "Global Elections Macro Impact", "Central Bank Rate Decisions", "Monetary Policy Divergence",
      "Global Economic Slowdown Indicators", "Recession Probability Models", "Global Disinflation Trends", "Dollar Index Trajectory",
      "US Treasury Yield Curve", "Sovereign Bond Yields", "Credit Rating Agency Outlooks", "Sovereign Rating Upgrades",
      "Geopolitical Realignment", "Multilateral Trade Blocs", "G7 Macro Policy", "BRICS Expansion Economic Impact",
      "India Elections Market Impact", "Global Market Slowdown", "Union Budget Update"
    ],
    "Policies & Incentives": [
      "Production Linked Incentives", "Subsidies Manufacturing", "EV Subsidy Framework",
      "Semiconductor Subvention", "Tax Holiday Rollbacks", "Corporate Tax Rate Revisions", "Capital Gains Tax Rationalization",
      "Securities Transaction Tax", "Startup Angel Tax Rules", "SEBI Disclosure Norms", "Corporate Governance Regulations",
      "ESG Compliance Requirements", "Carbon Border Tax Impact", "Export Remission Entitlements",
      "SEZ Policy Reforms", "Labor Code Implementations", "Land Acquisition Friction", "Environmental Clearance Delays",
      "Telecom AGR Dues Resolution", "Energy Subsidy Allocations", "Defense Procurement Quotas",
      "PLI Disbursements", "FAME II", "Corporate Tax Rate", "Tax Reforms India"
    ],
    "Earnings Reports": [
      "Quarterly Earnings India", "Q1 Results", "Q2 Results", "Q3 Results", "Q4 Results",
      "Profit After Tax", "EBITDA Margins India", "Revenue Growth India", "Earnings Call Transcript",
      "Management Commentary India", "Guidance Downgrade India", "Guidance Upgrade India",
      "Dividend Announcements", "EPS Growth India", "Corporate Earnings Season", "Financial Results India",
      "Nifty 50 Earnings", "Sensex Q-o-Q Growth", "Midcap Earnings Performance", "Smallcap Profitability",
      "TCS Q3 Results", "Reliance Earnings", "HDFC Bank Results", "Infosys Guidance"
    ]
  },
  INT: {
    Headlines: [
      "Global Equities Performance", "S&P 500 Movements", "Dow Jones Industrial", "Nasdaq Tech Heavy", "Wall Street Sentiment",
      "Euro Stoxx Variations", "Nikkei Index", "FTSE Market Capitalization", "Hang Seng Volatility", "Global Markets Aggregate",
      "Russell 2000 Small Caps", "VIX Volatility Index", "European Equity Markets", "Asian Equity Markets", "Emerging Markets Asset Class",
      "Developed Markets Equity", "MSCI World Rebalancing", "Equity Bull Market", "Bear Market Corrections",
      "Dividend Investing Global", "Mega Cap Tech Valuations", "Value Investing Premiums",
      "Global IPO Market Activity", "SPAC Liquidations", "Stock Split Announcements",
      "Corporate Share Repurchases", "Treasury Yield Curve Inversion", "Hedge Fund Positioning", "Institutional Block Trades",
      "Retail Trading Volumes", "Algorithm Trading Impact", "Cryptocurrency Asset Class Correlations", "AI Sector Equities",
      "Apple", "Microsoft", "Nvidia", "Tesla", "Amazon", "Alphabet", "Meta", "TSMC"
    ],
    Geopolitics: [
      "Global Geopolitical Risk", "International Trade Wars", "Economic Sanctions", "Macro Conflict Impact", "Middle East Energy Security",
      "Oil Supply Vulnerabilities", "US-China Trade Relations", "WTO Multilateral Rulings", "G7 Economic Agendas", "Global Trade Architecture",
      "South China Sea Shipping Routes", "NATO Military Expenditure", "Global Security Alignments", "OPEC Plus Quota Decisions", "Global Defense Budgets",
      "Cyber Warfare Economic Costs", "Diplomatic Crises", "Trade Embargoes", "Foreign Aid Distributions", "Immigration Labor Market Impact",
      "Global Tariff Escalations", "European Union Trade Policy", "Brexit Macro Effects", "Energy Security Policies",
      "US China Tech War", "Ukraine War Impact", "Taiwan Semiconductor Risk"
    ],
    Banking: [
      "Federal Reserve Rate Trajectory", "Global Interest Rates", "Investment Banking Revenues", "ECB Governing Council", "Bank of England MPC", "BoJ Yield Curve Control",
      "Systemic Banking Liquidity", "Quantitative Easing Cycles", "Quantitative Tightening Balance Sheets", "Basel Capital Requirements",
      "Banking Sector Stress Tests", "Systemically Important Financial Institutions", "Global Wealth Management AUM",
      "Central Bank Digital Currencies Implementation", "Global Cryptocurrency Regulations", "SEC Enforcement Actions", "Fintech Disruption Traditional Banking",
      "Shadow Banking Credit Risks", "Private Credit Market Expansion", "Commercial Real Estate Debt Exposure", "Global Mortgage Rates",
      "Consumer Default Probabilities", "Corporate Bankruptcy Filings", "M&A Advisory Fee Pools",
      "JPMorgan", "Goldman Sachs", "Morgan Stanley", "Bank of America", "Citigroup", "Banking Stress", "Crypto Regulations"
    ],
    Technology: [
      "Artificial General Intelligence Timelines", "Semiconductor Foundry Capacity", "Mega Cap Earnings Quality",
      "Global Enterprise Cybersecurity", "Foundational AI Models", "Cloud Infrastructure Spending", "SaaS Revenue Multipliers", "Global Data Center CAPEX",
      "Tech Sector Headcount Reductions", "Global Antitrust Enforcement", "Digital Services Taxes",
      "5G Network Monetization", "Quantum Computing Breakthroughs", "Low Earth Orbit Satellites Commercialization", "Autonomous Driving Regulatory Hurdles",
      "Industrial Robotics Automation", "AR VR Market Adoption", "Enterprise Blockchain Utility", "Technology Sector Consolidation",
      "OpenAI", "Microsoft AI", "Apple Vision Pro", "Google Gemini", "AWS Cloud", "Tesla Autopilot", "Semiconductor Wafer", "ASML"
    ],
    Commodities: [
      "Global Commodity Markets", "Crude Oil Inventory Levels", "Brent Crude Futures", "Gold Spot Safe Haven", "Copper Electrification Demand", "Lithium Battery Demand",
      "LME Warehousing", "Commodity Trading Advisors", "Iron Ore Global Demand", "Agricultural Commodity Yields",
      "Silver Industrial Demand", "Platinum Auto Demand", "Uranium Enrichment Demand", "European Natural Gas Storage",
      "Global LNG Shipping", "Soybean Crusher Margins", "Weather Disruptions Agri Markets", "Global Steel Output",
      "Aluminum Smelting Energy Costs", "Nickel Battery Supply Chain", "Critical Minerals Deficit",
      "Rare Earth Element Processing", "Commodity Supercycle Drivers", "Inflation Hedging Commodities"
    ],
    "Economic Reports": [
      "Global GDP Output", "US CPI Inflation Trajectory", "Federal Reserve Beige Book", "Eurozone Economic Confidence", "China Macro Data",
      "World Bank Economic Projections", "Global Disinflation", "US Job Market Reports", "Global Trade Volumes",
      "US PCE Price Index", "Nonfarm Payrolls Print", "Initial Jobless Claims Trajectory", "ISM Manufacturing Data",
      "ISM Services Activity", "US Retail Sales Resilience", "US Consumer Confidence", "US Housing Starts Indicators",
      "Eurozone Inflation Print", "UK output Data", "Japan Wage Inflation", "China Industrial Output", "China Retail Consumption",
      "Global Sovereign Debt Levels", "IMF World Economic Outlook", "OECD Composite Leading Indicators",
      "Stagflation Risk Matrix", "Recession Probability Curves", "US Trade Deficit Adjustments", "Global Recession Risk"
    ],
    "Industry Reports": [
      "Global Manufacturing PMIs", "Global Industry Sector Outlooks", "Supply Chain Resilience Interventions",
      "Renewable Energy Investments", "Global Automobile Sales Forecast", "Pharmaceutical Patent Cliffs",
      "Electric Vehicle Adoption Rates", "Aviation Equipment Manufacturing", "Global Maritime Freight", "E-commerce Penetration Rates", "Brick and Mortar Retail Deflation",
      "Luxury Goods Demand Elasticity", "FMCG Pricing Power", "Global Healthcare Expenditures",
      "Biotech Clinical Trial Milestones", "Corporate Real Estate Contraction", "Global Construction Output", "Semiconductor Lithography Equipment",
      "EV Adoption Rate", "BYD", "Eli Lilly", "Novo Nordisk", "Global Tourism", "Cruise Lines"
    ],
    "M/A and CAPEX": [
      "Global Mergers and Acquisitions Volume", "Corporate CAPEX Supercycle", "Inorganic Corporate Growth Strategy", "Cross-border Deal Approvals",
      "Hostile Takeover Bids", "Leveraged Buyout Financing", "Private Equity Dry Powder", "Venture Capital Valuation Resets", "Corporate Spin-offs Valuation",
      "Conglomerate Divestitures", "Antitrust Blocked Mergers", "FTC Premerger Notifications", "European Commission M&A Scrutiny",
      "Corporate Capital Allocation Strategies", "Foreign Direct Investments Greenfield", "Global Infrastructure Deficit Spending",
      "Big Tech Bolt-on Acquisitions", "Pharma Licensing Deals", "Energy Industry Consolidation", "Tech Sector Buyouts", "Broadcom VMware"
    ],
    Energy: [
      "Utility Scale Renewable Energy", "Global Solar Capacity", "Offshore Wind Profitability",
      "Green Hydrogen Production Costs", "Global EV Transition", "Solid State Battery Commercialization",
      "Peak Fossil Fuel Demand Scenarios", "Global Oil Majors Capex", "OPEC Production Compliance", "US Shale Output Responsiveness", "Small Modular Nuclear Reactors",
      "Uranium Enrichment Capacity", "Carbon Capture Viability",
      "Global Climate Change Commitments", "Net Zero Emissions Mandates", "Carbon Border Adjustment Mechanisms",
      "European Energy Independence", "Grid Modernization Capital", "Smart Grid Implementations",
      "ExxonMobil", "Chevron", "BP", "Shell", "Nuclear Energy Global"
    ],
    "Globalization & Trade": [
      "Supply Chain Friendshoring", "Production Nearshoring trends", "US Reshoring Initiatives", "China Plus One Global Capital Flows",
      "Global Export Contraction", "Multilateral Trade Agreements", "Global Tariffs Imposition",
      "Protectionist Economic Policies", "WTO Trade Arbitration", "Global Logistics Capacity", "Air Freight Yields",
      "Ocean Freight Reliability", "Global Canal Transit Congestion", "Port Automation Infrastructure",
      "Cross-Border E-commerce Regulations", "Global IT Outsourcing", "Foreign Direct Investment Outflows",
      "Multinational Subsidary Operations", "Competitive Currency Devaluations", "Global De-dollarization Trends",
      "Remote Work Productivity Trends", "Structural Labor Shortages", "Maersk", "Panama Canal Congestion", "Suez Canal Shipping"
    ],
    "Politics & Global Macro": [
      "US Presidential Election Economic Impact", "Congressional Gridlock Markets", "European Parliament Directives",
      "Emerging Markets Elections Risk", "Global Fiscal Stimulus Withdrawal", "Austerity Measures Impact",
      "Sovereign Debt Distress Risk", "Emerging Market Default Probabilities", "Economic Populism",
      "US Tax Code Expirations", "Global Minimum Corporate Tax Implementation", "Wealth Tax Capital Flight",
      "Strategic Export Controls Trade", "Semiconductor Sovereignty", "Green Tech Subsidy Arms Race", "Global Security Bloc Realignments",
      "UN Climate Summit Policy Adoptions", "Bilateral Geoeconomic Agreements", "US Debt Ceiling", "Emerging Markets Debt"
    ],
    "Policies & Incentives": [
      "US Inflation Reduction Act Disbursements", "CHIPS Act Capital Allocation", "European Green Deal Financing",
      "China EV Subsidy Phase-out", "Global Semiconductor Manufacturing Subsidies", "Global Carbon Pricing Mechanisms",
      "ESG Regulatory Compliance Mandates", "SEC Climate Disclosure Rules", "EU Taxonomy Sustainable Finance", "Big Tech Anti-monopoly Legislation",
      "Global AI Safety Regulations", "Data Localization GDPR", "Corporate Tax Incentive Expirations",
      "Research and Development Tax Credits", "US Infrastructure Bill Spending", "Clean Energy Production Tax Credits",
      "Non-Tariff Trade Barriers", "Labor Union Wage Negotiations Impact",
      "Pharmaceutical Pricing Cap US", "Medicare Drug Negotiation", "Financial Deregulation/Regulation", "Global Minimum Tax"
    ],
    "Earnings Reports": [
      "Global Earnings Season", "Wall Street Profits", "S&P 500 Earnings", "Nasdaq Quarterly Results",
      "European Corporate Earnings", "Big Tech Earnings Call", "Forward Guidance Global", "Profit Warnings Global",
      "Earnings per Share Estimates", "Revenue Miss", "Revenue Beat", "Margin Squeeze Corporate",
      "Dividend Payout Ratio Global", "Operating Margins Global", "Annual General Meeting Updates",
      "Apple Earnings", "Nvidia Earnings", "Tesla Delivery Numbers", "Microsoft Cloud Revenue",
      "Meta Guidance", "Alphabet Ad Revenue"
    ]
  }
};

// Build Google News RSS URL
function buildRssUrl(sectionKeywords, mode) {
  let qString = "";
  if (Array.isArray(sectionKeywords)) {
    // Join multiple keywords with OR logic. Relax strict quotes for phrases to massively increase semantic yield.
    qString = sectionKeywords.map(k => k.includes(" ") ? `(${k})` : `"${k}"`).join(" OR ");
  } else {
    // For a manual search, just use the raw query directly
    qString = sectionKeywords;
  }
  const q = encodeURIComponent(qString);

  const hl = mode === "IND" ? "en-IN" : "en-US";
  const gl = mode === "IND" ? "IN" : "US";
  const ceid = mode === "IND" ? "IN:en" : "US:en";

  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

// Parse RSS XML manually
function parseRss(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`));
      return m ? m[1].trim() : "";
    };

    const title = get("title").replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    const link = get("link").trim() || (block.match(/href="([^"]+)"/) || [])[1] || "";
    const pubDateStr = get("pubDate");
    const source = get("source").replace(/<!\[CDATA\[|\]\]>/g, "").trim();

    if (title && link) {
      const pubDate = new Date(pubDateStr);
      items.push({
        title,
        link,
        pubDate,
        source,
        ago: timeAgo(pubDate),
        timestamp: pubDate.getTime()
      });
    }
  }
  return items;
}

function timeAgo(date) {
  if (!date || isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Utility: Chunk array into smaller arrays
function chunkArray(array, size) {
  const chunked = [];
  let index = 0;
  while (index < array.length) {
    chunked.push(array.slice(index, size + index));
    index += size;
  }
  return chunked;
}

// Global rate limiting variables
let globalRequestDelay = 100;

// Main news endpoint
app.get("/api/news", async (req, res) => {
  const { section = "Headlines", mode = "IND", q } = req.query;

  try {
    let items = [];
    let finalQuery = "";

    if (q) {
      // Manual Search remains a single fetch
      const url = buildRssUrl(q, mode);
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 10000 });
      if (response.ok) {
        const xml = await response.text();
        items = parseRss(xml);
      }
    } else {
      // Expanded Section Fetch: Parallel Aggregation with Keyword Chunking
      const keywords = (SECTION_QUERIES[mode] || SECTION_QUERIES["IND"])[section] || ["stock market"];

      // To respect URL length limits and fetch aggressively but efficiently, 
      // chunk the ~50+ keywords into groups of 5 keywords per query.
      const keywordChunks = chunkArray(keywords, 3);
      // Limit to max 20 parallel requests (up to 100 keywords total per fetch)
      const topChunks = keywordChunks.slice(0, 35);

      console.log(`[${mode}] Starting Multi-fetch for ${section} (${topChunks.length} parallel requests, ~${keywords.length} keywords total)`);

      // Map chunks to individual fetch promises
      const fetchPromises = topChunks.map((chunk, i) => {
        const url = buildRssUrl(chunk, mode);
        return new Promise(resolve => {
          setTimeout(() => {
            fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 })
              .then(r => r.ok ? r.text() : null)
              .then(xml => xml ? parseRss(xml) : [])
              .then(resolve)
              .catch(e => {
                console.error(`Fetch failed for chunk ${i}: ${e.message}`);
                resolve([]);
              });
          }, i * globalRequestDelay); // Slight staggered delay
        });
      });

            // Run up to max parallel queries
      const results = await Promise.allSettled(fetchPromises);

      // Round-robin merge for perfect topical diversity
      // Each chunk retrieves different keywords. If we just bulk sort by recency, 
      // high-volume sectors drown out low-volume ones. 
      const chunkArrays = [];
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value && result.value.length > 0) {
          // Sort this specific chunk by recency first
          const sortedChunk = result.value.sort((a, b) => b.timestamp - a.timestamp);
          chunkArrays.push(sortedChunk);
        }
      });

      // Interleave one article from each chunk sequentially
      let itemsLeft = true;
      while (itemsLeft) {
        itemsLeft = false;
        for (let i = 0; i < chunkArrays.length; i++) {
          if (chunkArrays[i].length > 0) {
            items.push(chunkArrays[i].shift()); // take the top most recent item from this topic
            itemsLeft = true; // Still have items to process
          }
        }
      }
    }

    // 1. Deduplication (Strict cross-query dedupe)
    const seenUrls = new Set();
    const seenTitles = new Set();
    const uniqueItems = items.filter(item => {
      const lowTitle = item.title.toLowerCase().trim();
      if (seenUrls.has(item.link)) return false;
      if (seenTitles.has(lowTitle)) return false;
      seenUrls.add(item.link);
      seenTitles.add(lowTitle);
      return true;
    });

    // 2. We use the perfectly interleaved round-robin order to guarantee topical diversity.
    // 3. Limit result set to top 150 items for performance
    const topResults = uniqueItems.slice(0, 150);

    // 4. Final Recency Sort: We sort this guaranteed-diverse batch chronologically
    // so the reader always sees the absolute newest news first within the diverse selection.
    const finalResults = topResults.sort((a, b) => b.timestamp - a.timestamp);

    console.log(`[${mode}] ${section} process complete: ${finalResults.length} unique articles found.`);

    res.json({
      items: finalResults,
      queryCount: q ? 1 : Math.min(20, chunkArray((SECTION_QUERIES[mode] || SECTION_QUERIES["IND"])[section] || [], 5).length),
      mode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});
// Vercel Serverless Export
module.exports = app;

// Listen locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n✅ EquityLens Backend running at http://localhost:${PORT}`);
  });
}


// At bottom of server.js
module.exports = app;

// Change listen to:
if (require.main === module) {
  app.listen(5000, () => console.log('Server running'))
}
