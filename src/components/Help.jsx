import { useState } from 'react';
import Header from './header';
import demoVideo from '../assets/demo.mp4';
import glossaryVideo from '../assets/glossary.mp4';

const faqData = [
  {
    section: '1. General Overview',
    questions: [
      {
        question: 'What is the ALTA?',
        answer:
          'The ALTA is a powerful tool designed for accurate translations using Azure AI and DeepL models. It supports text and document translation, glossary usage for specialized terms, and offers feedback options to improve translation quality.',
      },
      {
        question: 'Which translation models can I use in ALTA?',
        answer:
          'Currently, ALTA supports Azure AI for translations. DeepL is planned for future updates.',
      },
    ],
  },
  {
    section: '2. Interface and Features',
    questions: [
      {
        question: 'How do I navigate the interface?',
        answer: `
          The main features include:
          - Translation Service Toggle: Choose between Azure AI and DeepL (when available).
          - Input Box: Type or paste text, or attach documents for translation.
          - Glossary Feature: Ensures specific terminology is consistently used across documents.
          - Language Selection: Choose source and target languages.
          - Controls: Clear all inputs or start the translation.
        `,
      },
      {
        question: 'How can I switch between Azure AI and DeepL?',
        answer:
          'Toggle the Translation Service switch at the top to select your preferred model.',
      },
    ],
  },
  {
    section: '3. Translation Process',
    questions: [
      {
        question: 'How do I translate text in ALTA?',
        answer: `
          - Select your translation model (Azure AI or DeepL).
          - Enter text in the Input Box or upload a document.
          - Choose source and target languages.
          - Click Translate. The translated content will display shortly.
        `,
      },
      {
        question: 'What are the supported document types for each model?',
        answer: `
          - Azure AI supports: .docx, .doc, .xlsx, .xls, .pptx, .ppt, .msg, .pdf, .txt, .html, .csv, .xlf, .md, .mht, and .odt
          - DeepL supports: .docx, .doc, .xlsx, .xls, .pptx, .ppt, .pdf, .html, .txt, .xlf, and .srt
        `,
      },
      {
        question: 'What happens to the formatting of my document?',
        answer:
          'ALTA retains the original formatting, layout, and elements (like tables and images) as much as possible during translation. Some font differences may occur if the target language lacks the original font.',
      },
    ],
  },
  {
    section: '4. Glossary Feature',
    questions: [
      {
        question: 'What is the glossary feature, and when should I use it?',
        answer:
          'The glossary ensures specific terms are consistently translated, especially useful for technical, medical, or branded terms. Use it for industry-specific accuracy, consistent terminology across multiple documents, or brand identity preservation.',
      },
      {
        question: 'How do I create and upload a glossary?',
        answer: `
          - Create a CSV (Comma-Separated Values) file with each source term in the first column and the corresponding target term in the second.
          - Click the glossary icon next to the paperclip to upload it for document translation.
        `,
      },
      {
        question: 'How DeepL glossary works?',
        answer:
          'The Glossary feature in DeepL helps you achieve consistent and accurate translations by enforcing specific word choices that match your preferences. However, it doesn’t simply replace words; it uses AI to evaluate whether the glossary terms make sense in the context of the sentence and adjusts the grammar accordingly.',
      },
      {
        question: 'What are the unique features of DeepL glossary?',
        answer: `
        1. Not a Simple "Find and Replace"
            The glossary doesn’t blindly replace words in the source text. Instead, it ensures that:
                  - The meaning of the sentence is preserved.
                  - Context and grammar rules are followed.
        2. Grammar and Context Awareness
                  - If a glossary term impacts grammar (e.g., gender or conjugation), DeepL will adjust surrounding words to maintain grammatical correctness. 
                  - It won’t replace a word if doing so would create an incorrect or awkward translation.
        3. Regional and Idiomatic Sensitivity
                  - For languages with regional differences (e.g., Spanish or German), the glossary respects the nuances of local usage while following the glossary preferences.`,
      },
      {
        question: 'Can you provide some examples of DeepL glossary?',
        answer: `
        Example 1: English to German
          - Glossary Entry:
              to run → rennen
          - Source Text:
              When it is dark outside, I prefer to run. Yesterday, when the clouds came out, it was very dark, so I ran home as fast as I could. But the time was running out while I was running.
          - Translation Without Glossary:
              Wenn es draußen dunkel ist, laufe ich am liebsten. Gestern, als die Wolken aufzogen, war es sehr dunkel, also lief ich so schnell ich konnte nach Hause. Aber die Zeit lief mir davon, während ich rannte.
          - Translation With Glossary:
              Wenn es draußen dunkel ist, renne ich am liebsten. Gestern, als die Wolken aufzogen, war es sehr dunkel, also rannte ich so schnell ich konnte nach Hause. Aber die Zeit lief mir davon, während ich rannte.
        
        DeepL replaced laufen with rennen as per the glossary, but retained lief in the idiomatic phrase "die Zeit lief mir davon" because replacing it would distort the meaning.
          
        Example 2: English to Spanish
          - Glossary Entry:
              computer → computadora
          - Source Text:
              Don’t worry, the space is big enough that everybody can also bring their own computers to work on their projects.
          - Translation Without Glossary:
              No se preocupe, el espacio es lo suficientemente grande como para que todo el mundo pueda traer también sus propios ordenadores para trabajar en sus proyectos.
          - Translation With Glossary:
              No se preocupe, el espacio es lo suficientemente grande como para que todo el mundo pueda traer también sus propias computadoraspara trabajar en sus proyectos.
    
        The glossary replaced ordenador with computadora (used in Latin America). 
        Adjectives like sus propios were changed to sus propias to match the feminine gender of computadoras.
        
        `,
      },
      {
        question: 'Is there a sample glossary file available?',
        answer: (
          <span>
            Download a sample glossary file (English to Canadian French){' '}
            <a
              href='https://devaitranslationstorage.blob.core.windows.net/source/glossary.csv?sp=r&st=2024-11-14T08:52:35Z&se=2030-11-14T16:52:35Z&spr=https&sv=2022-11-02&sr=b&sig=NrAVBFD3dfY%2BFvHOBtX5rS3bIWA4Nm%2FjO2deKvMoTAk%3D' // Replace with your absolute URL
              download='sample_glossary.csv'
              className='text-blue-600 hover:underline'
            >
              here
            </a>
            .
          </span>
        ),
      },
      {
        question: 'Common Glossary Files',
        answer: (
          <span>
            Find common glossary files{' '}
            <a
              target='_blank'
              href='https://allegiscloud.sharepoint.com/teams/ALTAGlossaries/Shared%20Documents/Forms/AllItems.aspx?csf=1&web=1&e=ISAJ4r&OR=Teams-HL&CT=1738205453107&CID=b3747ca1-4040-7000-e181-0f562fa4ad7d&cidOR=SPO&FolderCTID=0x012000ADC577FD2F46654EB3DF1F3F1C0436D0&id=%2fteams%2fALTAGlossaries%2fShared+Documents%2fGlossary+Announcements+and+Questions'
              className='text-blue-600 hover:underline'
            >
              here
            </a>
            .
          </span>
        ),
      },
    ],
    demo: glossaryVideo,
  },
  {
    section: '5. Language Selection and Formality Setting',
    questions: [
      {
        question: 'Can I choose the formality level for translations?',
        answer:
          'Yes, DeepL offers a formality setting for specific languages (German, French, Italian, Spanish, Dutch, Polish, Brazilian Portuguese, Portuguese, Japanese, and Russian). This setting helps tailor translations to formal or informal tones.',
      },
      {
        question: 'How do I set formality preferences?',
        answer:
          'Select the formality preference when choosing target languages for supported languages. This is especially useful for professional or casual language tone adjustments.',
      },
    ],
  },
  {
    section: '6. Results and Actions',
    questions: [
      {
        question: 'Where can I see the translated text?',
        answer:
          'Text translations appear in the Results Box with options to rate and copy them.',
      },
      {
        question: 'How can I download translated documents?',
        answer:
          'After translation, the document results appear in a table with a download icon beside each file. Use Download All to download multiple files at once.',
      },
      {
        question: 'Can I give feedback on translation quality?',
        answer:
          'Yes, you can rate translations using the thumbs-up (👍) or thumbs-down (👎) icons in the Results section, helping to improve translation quality over time.',
      },
    ],
  },
  {
    section: '7. Document Size and File Limitations',
    questions: [
      {
        question: 'What are the file size and document limits?',
        answer: `
          - Azure AI:
            - Max file size: 40 MB
            - Max files: 1000
            - Max total content size in batch: 250 MB
            - Max glossary file size: 10 MB
          - DeepL: Specific size limits vary by format; e.g., PDFs can be up to 30 MB, text files up to 1 MB, and HTML files up to 5 MB.
        `,
      },
    ],
  },
  {
    section: '8. Troubleshooting and Tips',
    questions: [
      {
        question:
          'I encountered an error uploading my document. What could be the issue?',
        answer:
          'Check if the document meets the size, file type, or character limits. Ensure you’ve selected a supported format and that it’s within the file size limit for your chosen translation model.',
      },
      {
        question: 'Why is the translated document missing some formatting?',
        answer:
          'Some font and layout adjustments may occur if the target language lacks certain elements. ALTA aims to retain formatting as closely as possible, but minor changes may happen.',
      },
    ],
  },
  {
    section: '9. Guiding Principles for Machine Translations',
    questions: [
      {
        question:
          'What are the guiding principles and best practices before using ALTA?',
        answer: `1. Use machine translation with optional native speaker verification for low-risk, internal content. Always involve a human translator(1) for sensitive or compliance-related documents to ensure accuracy and legal adherence.
         2. Establish a comprehensive glossary to provide context-specific translations, prevent translation of certain terms, and define translations for ambiguous words to ensure clarity and consistency.
         3. Use common, widely supported fonts in multilingual documents to avoid display issues.
         4. Ensure data confidentiality when using AI tools by following company and industry data protection policies.
         5. Regularly update translation models to reflect current language usage and terminology.
         6. Clearly mark machine-generated translations to avoid misrepresentation as professional human translation.
         7. Implement feedback loops to improve future translations based on user or translator input.
 
        (1) Consult with your opco communications and/or marketing teams translation experts. For teams without translation experts, please consult with ACS HR-Chastin Faith / IS-Wellysane Nseke for human verification on a case-by-case basis.`,
      },
    ],
  },
];

const Help = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
  return (
    <div>
      <Header />

      <div className='w-full max-w-[1300px] mx-auto p-6'>
        <section className='block my-4'>
          <h1 className='text-3xl mb-6 font-bold text-center'>Quick Tour</h1>
          <video
            className='w-full h-auto max-w-[768px] mx-auto rounded-md'
            controls
          >
            <source src={demoVideo} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </section>
        <h2 className='text-3xl font-bold my-8 mt-24 text-center'>
          Frequently Asked Questions
        </h2>

        <section className='max-w-[960px] mx-auto w-full'>
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className='text-xl font-semibold mb-4'>{section.section}</h3>

              {section?.demo ? (
                <video
                  className='w-full h-auto max-w-[560px] ml-4 my-4 rounded-md'
                  controls
                >
                  <source src={section?.demo} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              ) : null}

              <section className='px-4 mb-8'>
                {section.questions.map((item, index) => (
                  <div key={index} className='border-b border-gray-300 py-2'>
                    <button
                      onClick={() => toggleQuestion(`${sectionIndex}-${index}`)}
                      className={`w-full text-left flex justify-between items-center font-medium focus:outline-none transition-colors duration-300 ${
                        openQuestion === `${sectionIndex}-${index}`
                          ? 'text-blue-600'
                          : ''
                      }`}
                    >
                      {item.question}
                      <span className='transition-transform duration-300'>
                        {openQuestion === `${sectionIndex}-${index}`
                          ? '−'
                          : '+'}
                      </span>
                    </button>

                    <div
                      className={`mt-2 overflow-hidden transition-all duration-500 ease-in-out ${
                        openQuestion === `${sectionIndex}-${index}`
                          ? 'max-h-screen opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className='text-gray-700 whitespace-pre-line'>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Help;
