from keybert import KeyBERT

model = KeyBERT()

# Sample Text
# text = [
#             "The trend towards risk-based artificial intelligence legislation seems to have turned on its head. Instead of, or in addition to, focusing on managing risks to consumers, policymakers are trending to embrace AI as an economic engine of growth. This shift is evident in the EU, Japan and the U.S. where governments have reprioritized policies, proposed and rescinded legislation and increased AI-focused innovation funds.",
#             "The changing tides of policies globally, however, has a profound impact on how organizations consider their internal AI governance, especially for the higher risk AI systems. Consumer protection- and rights-focused approaches to policy, like those in some of the EU\u2019s applicable laws, may lead to more uniform governance measures. Co-regulatory approaches, such as those implemented in Singapore, arguably leave more room for organizations to decide how they can best govern AI use and AI systems.",
#             "Various jurisdictions have or are contemplating national AI legislation. Brazil\u2019s senate has approved legislation that will now be deliberated in the lower chamber. South Korea passed and signed the AI Basic Act into law and will provide greater regulatory guidance in 2025. Both the South Korean and Brazilian laws will regulate AI based on risk, meaning that certain use cases will be banned and others will have stricter regulatory requirements, much like the EU AI Act. Read the IAPP's full analysis of the South Korean AI Basic Act and commentary around the future of AI legislation in Latin America.",
#             "Japan recently passed the Act on the Promotion of Research and Development and the Utilization of AI-Related Technologies, which strikes a departure from previous iterations of wide-reaching AI legislation. Unlike previous bills, such as those in Colorado, the EU, or South Korea, it focuses more on spurring innovation through government support rather than consumer protections, marking a shift in global AI policy.",
#             "The U.S. has also changed course with the new Republican administration and control of Congress. Overall, the new administration appears to be prioritizing innovation in its new AI policy. This shift can be seen in the name change of the AI Safety Institute to Center for AI Standards and Innovation as well as the new U.S. Office of Management and Budget memoranda that places a greater emphasis on innovation.",
#             "A moratorium on the enforcement of state and local AI regulations has been debated as part of the One Big Beautiful Bill Act. One of the stated goals of the proposed moratorium is to increase innovation by simplifying the regulatory burden organizations are facing by only allowing enforcement of federal AI laws or, for example, technology-neutral consumer protection laws. The AI Diffusion Rule, which restricted the flow of the most powerful microchips under the Biden administration, has been scrapped in the name of boosting innovation. The government will instead include access to the same chips as part of their negotiated trade bills. Both examples indicate that U.S. policy is moving towards more relaxed regulations on AI use and development.",
#             "Given the changing tides in AI policy in the U.S. and around the world, how are other countries responding? The Brussels Effect, or the influence the EU has outside of its borders through its internal policies, seems to have been challenged by growing geopolitical competition among aspiring leaders in AI development who desire to reap the economic rewards of succeeding in the AI development and deployment race. While there still is EU-inspired risk-based legislation popping up in U.S. states and South Korea, policies are shifting towards a greater emphasis on innovation and less on guardrails and consumer protection. Japan\u2019s new law is a good example of this shift.",
#             "There have been instances of the EU itself forgoing legislation that might be harmful to AI developers, such as the AI Liability Directive, and focusing on finding ways to increase innovation in AI development in the bloc. The European Commission's AI Continent Action Plan is at the heart of their efforts to do so; it invests 200 billion euros in AI efforts, with 20 billion euros earmarked for AI gigafactories.",
#             "The first wave of factories was designated in December 2024 and the second wave in March 2025. While the goal of this initiative is to strengthen their competitiveness, they also are providing organizations with services, such as the AI Act Service Desk, to help navigate the EU AI Act\u2019s requirements. Overall, it seems that Brussels is also shifting its policies to try to capture the economic benefits of AI, including by possibly delaying or watering down the AI Act.",
#             "Behind the push to innovate is the expectation of economic gains. AI is broadly expected to boost global between USD7 trillion over 10 years up to USD25 trillion annually by some estimates. Japan sees AI as a path out of its economic slump, a goal reflected in its domestic actions like new light-touch regulations and exemptions that allow AI developers to use copyrighted material in their training datasets.",
#             "The U.S. Congressional Budget Office recently released a report on AI and its potential effects on the economy and the federal budget. With only 5% of businesses and 9% of employees utilizing AI, the report shows the adoption by businesses remains limited. It highlights that AI's impact on the economy is generally positive.",
#             "While a majority of employers have not seen AI as a factor for decreasing employment counts, almost all employees will see some level of automation in their work when AI is sufficiently integrated. AI will increase the productivity of workers and free up time for higher level tasks as it becomes more integrated. This effect will likely be felt over the next decade as the adoption figures rise.",
#             "Even without factoring potential impacts to the economy through productivity gains or effects to the labor market, investors are already heavily funding AI and its supporting infrastructure, which will, by itself, make a huge mark on economic growth. To power further adoption and advancement in AI, more AI-powering chips will need to be produced, additional data centers built to house them and greater electric supply secured to power them.",
#             "In 2023, it was predicted that AI investment could reach USD200 billion by 2025. In 2024, the U.S. saw more than USD109 billion invested in AI \u2013 with a wide gap in investment between the U.S. and the EU, which saw less than USD20 billion in AI investment overall. This disparity in investment might be driving the EU\u2019s fear of missing out on an economic growth engine and its rethinking of constraining AI development and deployment.",
#             "Countries seem to be looking for ways to address AI's negative impacts while simultaneously trying not to discourage investment or development. Keeping an eye on the developments and trends is important because each country will have its own approach in an ever-changing environment. This tension between economic growth and individual rights or consumer protections is seen across the globe. A poll recently found that 77% of Americans \"want companies to create AI slowly and get it right the first time, even if that delays breakthroughs.\" For policymakers, the difficulty is to set up the conditions to ensure companies are making breakthroughs while insuring they get it right the first time.",
#             "It is likely organizations will pursue AI governance, regardless of the official AI policies and threat of increasing regulation. Organizations will still need to internally align the use and development of AI with their stakeholders and pursue risk-minimizing strategies \u2014 all of which an effective AI governance program will do. Even more so, non-AI-specific laws will still apply to AI systems, such as those concerning non-discrimination, data privacy and rules around non-consensual sexual imagery; organizations would have to comply with these targeted areas of AI legislation.",
#             "Despite the change of emphasis from AI risk in global AI policy in favor of innovation, AI governance inside organizations will likely see more relevance in the next few years.",
#             "Richard Sentinella is the AI governance research fellow at the IAPP."
#         ]



# text_to_extract = " ".join(text)

# keywords = model.extract_keywords(text_to_extract)
# Keywords:
# ('ai', 0.4606)
# ('policymakers', 0.4057)
# ('policies', 0.3976)
# ('regulation', 0.3956)
# ('regulatory', 0.3922)

# keywords = model.extract_keywords(text_to_extract, keyphrase_ngram_range=(1, 1), stop_words='english',
#                           use_mmr=True, diversity=0.25)
# Keywords:
# ('ai', 0.4606)
# ('policymakers', 0.4057)
# ('regulation', 0.3956)
# ('governance', 0.3882)
# ('innovation', 0.3115)

def extract_keywords(text):
    keywords = model.extract_keywords(text, keyphrase_ngram_range=(1, 1), stop_words='english', use_mmr=True, diversity=0.25)
    return keywords