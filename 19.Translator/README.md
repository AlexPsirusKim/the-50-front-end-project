# Language Translator App 🌐

A simple yet powerful web-based language translator application that supports 100+ languages with text-to-speech functionality.

## Features

✨ **Multi-Language Support**
- Translate between 100+ languages instantly
- Supports languages from around the world (English, Spanish, French, Chinese, Japanese, Korean, Arabic, Hindi, and many more)

🔊 **Text-to-Speech**
- Listen to translations in the selected language
- Native Web Speech API integration
- Natural pronunciation for multiple languages

📋 **Copy & Paste**
- Easy one-click copy to clipboard
- Copy original text or translated text

🔄 **Language Exchange**
- Swap source and target languages with one click
- Exchange both text and language selections

📱 **Responsive Design**
- Works seamlessly on desktop, tablet, and mobile devices
- Optimized UI for smaller screens

## How to Use

1. **Enter Text**: Type or paste text in the left textarea
2. **Select Languages**: Choose source language (left dropdown) and target language (right dropdown)
3. **Translate**: Click the "Translate Text" button
4. **Listen**: Click the speaker icon to hear the text in the selected language
5. **Copy**: Click the copy icon to copy text to clipboard
6. **Exchange**: Click the exchange icon to swap languages and texts

## Technology Stack

- **Frontend**: Vanilla JavaScript (HTML, CSS, JavaScript)
- **Translation API**: [MyMemory Translated API](https://mymemory.translated.net/)
- **Text-to-Speech**: Web Speech API
- **Icons**: Font Awesome 5
- **Font**: Google Fonts (Poppins)

## File Structure

```
19.Translator/
├── index.html      # HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Main functionality and event handling
├── countries.js    # Language codes and names
└── README.md       # Documentation
```

## API Reference

### MyMemory Translated API
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Parameters**:
  - `q`: Text to translate
  - `langpair`: Language pair (e.g., "en-GB|hi-IN")
- **Response**: JSON with translated text

Example:
```javascript
const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`;
fetch(apiUrl).then(res => res.json()).then(data => {
    console.log(data.responseData.translatedText);
});
```

## Supported Languages

The app supports 100+ language codes including:
- English (en-GB)
- Spanish (es-ES)
- French (fr-FR)
- German (de-DE)
- Chinese (zh-CN)
- Japanese (ja-JP)
- Korean (ko-KR)
- Hindi (hi-IN)
- Arabic (ar-SA)
- Russian (ru-RU)
- Portuguese (pt-PT)
- And many more!

See `countries.js` for the complete list of supported languages.

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| IE 11   | ❌ No  |

**Required APIs**:
- Fetch API
- Web Speech API
- Clipboard API

## Features in Detail

### Translation
- Real-time translation using MyMemory API
- No authentication required
- Fast and reliable translations

### Speech Synthesis
- Native browser Web Speech API
- Multiple language voices
- Play/pause speech output

### User Interface
- Clean and intuitive design
- Golden background with white content area
- Blue translate button
- Responsive layout for all devices
- Icon-based controls for better UX

## Limitations

- Requires internet connection for translation
- Translation quality depends on MyMemory API
- Speech synthesis voices depend on browser/OS availability
- Some languages may not have voice support in all browsers

## Future Enhancements

- [ ] Add language detection for source text
- [ ] Add favorite translations history
- [ ] Add multiple API support (Google Translate, DeepL, etc.)
- [ ] Add download/export functionality
- [ ] Add dark mode
- [ ] Add offline translation support
- [ ] Improve UI with more animations

## Credits

Created by [CodingNepal](https://youtube.com/codingnepal)

## License

This project is open source and available under the MIT License.

## Contact & Support

For issues, suggestions, or questions, please create an issue in the project repository.

---

**Enjoy translating! 🚀**
