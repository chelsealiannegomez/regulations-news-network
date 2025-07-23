import json
import tensorflow as tf
import numpy as np
from nltk.corpus import stopwords

from create_model import ReduceMeanLayer

stop_words = set(stopwords.words('english'))

def remove_stop_words(content):
    # content: str[] (array of paragraphs)

    results = []
    for text in content:
        words = text.split(" ")
        
        for word in words:
            if word not in stop_words:
                word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","").replace("'s","")
                if word.isalpha():
                    results.append(word)
    
    return results

def get_word2int():
    with open('word2int.json', 'r') as f:
        word2int = json.load(f)

    return word2int

def get_doc_ids():
    with open('doc_ids.json', 'r') as f:
        doc_ids = json.load(f)

    return doc_ids

def contents_to_word_indices(content, word2int):
    cleaned_content = remove_stop_words(content)

    data = []

    for i in cleaned_content:
        word_index = word2int.get(i, 1)
        data.append(word_index)

    return data

def generate_context(content, doc_id, context_size):
    # Iterate through each word in each document and return testing sample of:
    # ([context_words], doc_id, target_word)
    for index, word in enumerate(content):
        pre_context_words = content[max(0, index - context_size) : index]
        post_context_words = content[index + 1 : min(len(content), index + context_size + 1)]
        context_words = pre_context_words + post_context_words
        while len(context_words) < context_size * 2:
            context_words.append(0)
        yield context_words, doc_id, word


def infer_article(article):
    # Article is a dictionary with article.content, article.id
    word2int = get_word2int()
    doc_ids = get_doc_ids()

    # process_article: str[] (array of words)
    process_article = contents_to_word_indices(article['content'], word2int)

    new_doc_index = len(doc_ids)

    doc_ids[new_doc_index] = article['id']

    # Update doc_ids with new doc index
    with open('doc_ids.json', "w") as json_file:
        json.dump(doc_ids, json_file, indent=4)

    testing_samples = generate_context(process_article, new_doc_index, context_size=3)
    contexts, _, _ = zip(*testing_samples)
    contexts = np.array(contexts)


    model = tf.keras.models.load_model('doc2vec_model.keras', custom_objects={'ReduceMeanLayer': ReduceMeanLayer})

    context_encoder = tf.keras.Model(
        inputs=model.input[0],
        outputs=model.get_layer("reduce_mean_context").output
    )

    word_input_batch = contexts
    context_embeddings = context_encoder.predict(word_input_batch)
    new_doc_embedding = np.mean(context_embeddings, axis=0)
    print(new_doc_embedding)
    return new_doc_embedding

        
# Test Sample Article
article = {
    "content" :
        ["State policymakers continue to express a strong interest in regulating AI with dozens of relevant AI-targeted bills of all shapes and flavors introduced in 2025. This increase in complexity encompasses cross-sectoral legislation such as bills the IAPP tracks, as well as legislation targeting health care, price fixing, intimate deepfakes and AI used in the employment context. Although state AI legislation is continuing apace with Texas enacting a major AI law and New York sending one to the governor's desk, state AI governance rules face headwinds in Colorado and, briefly, at the federal level.  ",
        "Within this ever-increasing complexity, there are plenty of themes and takeaways for organizations looking to adapt an AI governance program to keep up with policy activity.",
        "Through the U.S. State AI Governance Legislation Tracker, the IAPP focuses on cross-sectoral state AI governance bills, providing a snapshot for organizations to understand possible upcoming regulatory obligations. Even without including the many impactful sectoral bills, such as those governing state government uses of AI or decision-making systems in the employment context, the number of bills tracked has steadily increased year-over-year.",
        "Our reflection on the 2024 legislative cycle included an initial explanation of this resource. Over the course of the 2025 cycle, we have noticed new patterns to keep in mind.",
        "Increasingly, proposed AI legislation seeks to add separate guardrails for multiple AI technologies in different provisions of a single bill rather than providing a uniform set of requirements across AI systems. For such bills, in displaying their proposed governance mechanisms, the tracker does not delineate which technology, i.e., generative AI or automated decision-making, would be covered by which regulatory requirements.",
        "The most recently enacted law on the tracker, Texas HB 149 or the Texas Responsible Artificial Intelligence Governance Act, is an example of this type of grab-bag AI governance legislation. Overall, the Texas law imposes fewer burdens on covered entities when compared to many recent bills, but it encompasses a wider array of covered entities than many bills, including automated decision-making bills such as Connecticut's SB 2. It provides baseline prohibitions against developing or deploying AI systems that incite someone to self-harm or commit a crime, generate intimate deepfakes of minors, enable government social scoring or violate existing anti-discrimination laws.",
        "Importantly, the Texas Responsible Artificial Intelligence Governance Act also assumes the existence of robust internal governance processes as it mandates a response to an enforcement inquiry from the Texas attorney general that includes documentation of governance elements such as data inputs, outputs, evaluations, post-deployment monitoring and safeguards. The law includes a 60-day cure period and takes effect 1 Jan. 2026.",
        "Another quirk of many AI governance bills that is not clearly captured in the tracker is the fact that many bills with provisions for AI risk management programs, AI risk or impact assessments offer a safe harbor — or a presumption against liability — for organizations that voluntarily adopt these measures. The tracker treats voluntary requirements the same as mandatory requirements.",
        "The Texas Responsible Artificial Intelligence Governance Act, too, includes a safe harbor. A covered entity will not be prosecuted if it discovers a violation of the law based on an internal review process, but only if the entity demonstrates a risk management program that \"substantially complies\" with the U.S. National Institute of Standards and Technology’s Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile or another nationally or internationally recognized AI risk management framework.",
        "Additionally, Texas will join Utah to set up the second AI regulatory sandbox in the U.S., though the two programs have significant structural differences.",
        "Last year, Colorado passed the first major cross-sectoral commercial AI law. Yet in the final days of Colorado's 2025 normal legislative session, the legislature introduced a last-minute amendment to this law, which was not voted on before the session ended. Many similar automated decision-making bills were seen across multiple states, including notable examples in Virginia and Connecticut. So far, Colorado's bill remains the most prominent example of cross-sectoral legislation to be enacted.",
        "Gov. Jared Polis, D-Colo., expressed his hesitancy when signing the bill, but nevertheless enacted it. After a panel of AI policy, governance and ethics experts convened to provide recommendations, Colorado senators, including the sponsor of the original bill, introduced their amendments. These amendments would have softened the requirements of the bill and extended the compliance dates for all organizations, with even longer timelines for smaller organizations. In the end, Colorado's regular session ended before the legislature could vote on the bill. This has led to speculation that there might be a special session called for AI before the 2026 regular session.",
        "Meanwhile, Virginia's HB 2094 passed both chambers only to be vetoed by the governor. It was similar to the Colorado law — although with fewer requirements. The 2025 version of Connecticut's SB 2, carrying over the name and much of the content from 2024, was much more expansive than Colorado's bill with which it was widely compared. The Connecticut bill passed the senate but did not make it to a house vote before the end of the session. The bill partially embraced the grab-bag approach, aiming to prevent discrimination and increase transparency around the use of AI while still specifically targeting automated decision-making.",
        "State policymakers have also spent a lot of time thinking about guardrails for generative AI, resulting in two distinct categories of bills — both generally concerned with increasing transparency. The first, such as Maryland's HB 0823, would ensure that those who develop generative AI are transparent about the data they use to train the model, often by requiring the developer to post this information publicly on their website. The second, like New York's AB 6540, ensures that those interacting with a generative AI system or its outputs are aware that they are interacting with an AI system or its outputs.",
        "New York's Responsible AI Safety and Education Act, or SB 6953, has been sent to the governor. The law takes a different approach to regulating AI. It would set rules around the development of frontier models, also known as foundation or general-purpose models. In this sense, the bill attempts to legislate the same area as California's SB 1047, or the Safe and Secure Innovation for Frontier Artificial Intelligence Models Act, before the bill was vetoed in the state's last session. The New York bill would require frontier model developers to have transparency measures in place about training and deployment as well as disclose safety plans and any safety incidents.",
        "Outside of what is captured in the tracker, states are tackling issues at a sectoral level or based on a specific issue. The issue of deepfakes and digitally altered, or synthetic media, has been prioritized by the federal government. Most recently, the TAKE IT DOWN Act obligates covered social media platforms to remove synthetic nonconsensual explicit images when requested by the depicted person. States have long been active in addressing issues around deepfakes, with previous bills being passed that address nonconsensual explicit images or political deepfakes. Two examples of this type of law at the state level are Tennessee's HB 0769 or Arkansas's HB 1877, which would create a criminal offense for the possession of computer-generated explicit images of minors or children.",
        "States, which traditionally have broad powers over regulating elections, have also been tackling the issue of generative AI and deepfakes in elections. Several states have banned the use of generative AI, which can be used to create realistic visual or audio depictions of candidates, during the election season. Other states allow political deepfakes but require a disclosure that the image or audio has been digitally altered or produced. North Carolina's HB 934 would create a civil offense to create or distribute a deepfake with the intent to harm a depicted individual, to harm a politician, or influence an election. Connecticut's HB 6846 would prohibit the distribution of certain synthetic media within a 90-day period before or after an election.",
        "While most of the cross-sectoral AI bills would cover the use of AI in employment, several states and cities have targeted sectoral legislation for this use case. New York's Local Law 144 requires employers to conduct regular audits to ensure that algorithms used in employment decisions are unbiased. Illinois passed HB 3773 in 2024, which would require employers to provide notice to current and potential employees when an AI system is used in the employment context. California was widely expected to follow suit and its legislature introduced SB 7, which would regulate and restrict the use of ADM systems in the employment context, requiring pre-use and post-use notice and the right to appeal employment-related decisions.",
        "Health care, as a traditionally highly regulated industry, has seen a proliferation of a specific group of bills targeting the use of AI and automated decision-making when those tools are used to decide health insurance claims. Maine's SB 1301, Illinois' HB 0035 and Florida's SB 794 would all restrict or prohibit the use of AI to deny health insurance claims, forcing insurance companies to use qualified humans to take an active role in reviewing health insurance claims, especially denials. New York's SB 7896 and Texas' SB 1822 take a similar stance on AI's use in health insurance claims by regulating the use of AI in utilization reviews for health insurance. These laws would look to place a larger burden on health insurers that look to automate health insurance decisions, especially when they negatively impact patients.",
        "Although several state attorneys general have filed lawsuits under existing antitrust laws, the role of pricing algorithms, often in the context of the housing sector, has been criticized and targeted for regulation by state legislatures. Maine's SB 1552 explicitly prohibits landlords from setting rents with AI; Minnesota's SB 3098 would prohibit using AI to dynamically set product prices. Similar to Minnesota's bill, California has two bills, SB 295 and SB 384, which would both restrict or prevent the use of algorithms that incorporate competitor's data or otherwise using a price-fixing algorithm to set the price of supply level of goods or services, including rental units. New York's AB A3125A would regulate housing decisions made by ADM tools broadly.",
        "In May 2025, the U.S. House Energy and Commerce Committee introduced a measure as part of the One Big Beautiful Bill Act that proposed a moratorium on state enforcement of all targeted AI regulations, specifically including automated decision-making.",
        "After a significant amount of debate in the Senate and many changes to the proposal, the moratorium was eventually dropped from the budget resolution. But the idea remains — some policymakers in Washington hope to focus more on fostering the spread of AI tools than on requiring guardrails. The potential emergence of a state patchwork is top-of-mind for them.",
        "Nevertheless, states continue to innovate with new AI governance proposals. There is no sign of a slowdown any time soon.",
        "Richard Sentinella is the AI governance research fellow and Cobun Zweifel-Keegan, CIPP/US, CIPM, is the managing director, Washington, D.C., for the IAPP."],
    "id": 2
}
infer_article(article)