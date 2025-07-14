
# Normalize text

# Stop words taken from https://gist.github.com/sebleier/554280
stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

def remove_stop_words(documents):
    results = []
    for text in documents:
        # Text is an array of paragraphs
        for paragraph in text:
            words = paragraph.split(" ")
            for word in words:
                if word not in stop_words:
                    results.append(word)

    return results

documents = [[
    "Editor's note: The IAPP is policy neutral. We publish contributed opinion and analysis pieces to enable our members to hear a broad spectrum of views in our domains.",
    "It seems like every company is racing to become \"artificial intelligence-first,\" a phrase heard in every board and product roadmap meeting. It's the new gold standard, a sign of modernity, agility and efficiency. But an AI-first company can't be built while governing data with spreadsheet-first tools.",
    "Companies managing records of processing activities with interviews, shared drives and best-guess data mappings are not just lagging, but compromising their ability to innovate, scale and protect their brand.",
    "The AI-era demands a fundamental shift that starts with letting go of the old ROPA and embracing a new, AI-powered framework for data governance.",
    "In 2018, the EU General Data Protection Regulation had just come into force. Organizations were struggling to demonstrate accountability and the ROPA was the first step on the compliance journey. There were interviews with department heads, documentation of data flows and a master spreadsheet built to capture it all. The process was human and retrospective.",
    "At the time, it worked. However, manual ROPAs are woefully limited, incomplete and inaccurate. They rely on information collected from interviewees and their understanding of the questions. Worst of all, by the time it is ready, the document is out of date as there was a change in processing activity, the underlying supporting vendor, or another detail. The same can be said for semi-automated ROPA solutions that automate the interview process rather than utilize actual data discovery.",
    "The world has changed since 2018. In 2025, data doesn't sit still, machine learning models consume petabytes of data, application programming interfaces and microservices exchange personal data at speed.",
    "For many organizations, compliance has become a process of guesswork. The information technology team told you data is hosted in Europe. Vendors claim no personal data is retained. An engineer believes the training dataset has been \"anonymized,\" but doesn't know with which technique or the difference between \"pseudonymization\" and \"anonymization.\"",
    "This is not verifiable, certainly not scalable, and will definitely not stand up to any scrutiny. As data flows become more complex and AI systems become more obscure, the risk of misunderstanding what's really happening multiplies. AI cannot be governed by gut feeling. It must be governed by fact with smart and accountable systems.",
    "That's where the next chapter for ROPAs comes in, transforming compliance from a reactive cost center to a real-time, strategic function that drives trust and enables scale.",
    "We cannot possibly keep pace with a digital environment shaped by distributed systems, AI models and hyperscale cloud infrastructure.",
    "The question is no longer how do we improve ROPA 1.0, but what replaces it entirely?",
    "In 2025, ROPA is no longer about regulatory checkboxes. It has become the source of truth that ties together legal, data movement, vendor access and privacy expectations. This isn't a matter of better tooling; it's a complete rethinking of what data governance is.",
    "At its core, the new model must do three things.",
    "First, it must map the organization's contractual obligations to actual processing activities. Every customer contract contains a set of privacy-related commitments, like data retention, international data transfers and reuse of data for other purposes. These obligations can only be mapped with the support of a contract lifecycle management platform capable of monitoring key data processing terms. What used to take hours of time can now be interpreted by machines.",
    "Second, a dynamic vendor intelligence layer integrated into the ROPA system is no longer optional. It takes account of all third-party vendors processing data and must account for their own vendor ecosystem and environments. Manually managing this is not just inefficient, it's unsafe.",
    "Last, the new model must reflect reality on the ground. A data discovery layer is needed that scans infrastructure and/or codebases at scale in real time and compares that reality to the contractual obligations entered into with customers and vendors. That's the Achilles' heel — access to the heart of an organization's infrastructure requires deep trust and a design grounded ithe security mindset of vulnerability scanning.",
    "This new ROPA isn't a dusty compliance file. It's a real-time map of how the organization handles data, the foundation of trust architecture, and proves operations are not just fast, but safe.",
    "We are moving toward a new layer of infrastructure — an integrated governance fabric that touches every aspect of the data lifecycle — from contract lifecycle management to vendor management platforms to data discovery tools. It creates a single source of truth that reflects not just where data should be, but where it is and how that aligns with internal policies and contractual commitments.",
    "What makes this possible? AI as infrastructure. AI that parses contracts and flags retention gaps. AI that monitors data movement and correlates access logs with privacy settings. AI that detects anomalies in where data is being processed and automatically notifies compliance teams.",
    "This type of AI will empower and elevate the compliance team from gatekeepers to strategic enablers — teams that not only prevent risk but actively support the safe, trusted scaling of data and AI innovation.",
    "Customers and regulators are expecting that data is handled responsibly, that models are trained ethically and that contractual promises are being met.",
    "A static, outdated ROPA cannot deliver that promise. A living, AI-powered governance system can.",
    "The pieces are already here. CLM platforms are using natural language processing to analyze contract terms. Data discovery tools can detect policy violations in training data and flag cross-border transfers. Vendor intelligence tools are mapping risk exposure based on third-party access.",
    "What's missing is trust, access and integration. And that's where the next chapter begins.",
    "Here's a bold prediction: the next breakthrough in AI compliance won't come from privacy tech. It will come from security. Think about it. Who already has access to enterprise infrastructure? Who already scans source code and cloud environments at scale? Who has the trust of the board?",
    "Only security scanner companies are uniquely positioned to extend their platforms into the data governance and AI compliance space. They already have the trust and access required to scan environments and immediately flag gaps. All it would take is a layer of data discovery and an application programming interface to CLMs and vendors' platforms.",
    "This is where the future is headed. A convergence of privacy, AI ethics and cybersecurity into a single, unified governance layer that runs on AI and operates in real time.",
    "Even if the tools aren't fully mature, the path forward is clear.",
    "Don't wait for a perfect end-to-end solution. Build open, interoperable tools that integrate across the organization's control framework now.",
    "Manual ROPAs are obsolete. The future is smart, scalable governance. Because you can't do AI without AI.",
    "Roy Kamp, AIGP, CIPP/E, CIPP/US, CIPM, FIP, is legal director and Noemie Weinbaum, AIGP, CIPP/E, CIPP/US, CIPP/C, CIPM, CDPO/FR, FIP, is privacy lead at UKG and managing director at PS Expertise."
]
]

print(remove_stop_words(documents))