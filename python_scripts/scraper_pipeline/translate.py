from googletrans import Translator

async def translate_text(content):
    async with Translator() as translator:
        translated_content = []
        for paragraph in content:
            result = await translator.translate(paragraph)
            translated_content.append(result.text)
    
    return translated_content

async def translate_title(title):
    async with Translator() as translator:
        result = await translator.translate(title)
        translated_title = result.text
        return translated_title

async def is_english(title):
    async with Translator() as translator:
        result = await translator.detect(title)
        if result.lang != "en":
            return False
    return True